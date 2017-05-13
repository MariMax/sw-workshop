import { EventTopics } from './eventTopics';
import { NetworkServiceFactory } from './network.service';

class ArticleService {
  contentIndex = {};
  subscribers = [];
  baseURL = '';
  _headers = [];
  activeHeadersRequest = null;
  activeArticleRequests = [];

  constructor(networkService) {
    this.networkService = networkService;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    return () => this.subscribers = this.subscribers.filter(i => i !== fn);
  }

  notify(topic) {
    this.subscribers.forEach(i => i(topic));
  }

  get headers() {
    return this._headers;
  }

  get articles() {
    return Object.keys(this.contentIndex).reduce((r, key) => [...r, this.contentIndex[key]], []);
  }

  async saveArticle(id, header, body) {
    id = id === 'new' ? null : id;
    const article = { header, body, id };

    try {
      const newArticle = await this.networkService.post('article', article);
      this.contentIndex = { ...this.contentIndex, [article.id]: { body, createdDate: article.createdDate } };
      this._headers = this._headers
        .filter(i => i.articleId !== article.id)
        .concat({ articleId: article.id, header, createdDate: article.createdDate });

      this.notify(EventTopics.NEW_ARTICLE);
      this.notify(EventTopics.NEW_HEADERS);

    } catch (e) {
      console.error('smth went wrong on save article', e);
    }
  }

  async downloadHeaders(force) {
    if (this.activeHeadersRequest) {
      return this.activeHeadersRequest;
    }

    if (this.headers.length > 0 && !force) {
      return Promise.resolve(this.header);
    }

    this.activeHeadersRequest = this.networkService.get(`headers`);
    try {
      const headers = await this.activeHeadersRequest;
      this._headers = headers;
      this.notify(EventTopics.NEW_HEADERS);
    } catch (e) {
      console.error('smth went wrong on articles download', e);
    } finally {
      this.activeHeadersRequest = null;
      return this.headers;
    }
  }

  async downloadArticle(articleId, force) {
    if (!articleId) return Promise.reject(new Error('please provide article ID'));
    const activeRequest = this.activeArticleRequests.find(i => i.articleId === articleId);
    if (activeRequest) {
      return activeRequest.promise;
    }

    if (this.contentIndex[articleId] && !force) {
      return Promise.resolve(this.contentIndex[articleId]);
    }

    const promise = this.networkService.get(`article/${articleId}`);
    this.activeArticleRequests = [...this.activeArticleRequests, { articleId, promise }];
    try {
      const content = await promise;
      this.contentIndex[articleId] = content;
      this.notify(EventTopics.NEW_ARTICLE);
    } catch (e) {
      console.error('smth went wrong on download article content', e);
    } finally {
      this.activeArticleRequests = this.activeArticleRequests.filter(i => i.promise !== promise);
      return this.contentIndex[articleId];
    }
  }
}

export class ArticleServiceFactory {
  static articleService = null;

  static getArticleService() {
    if (ArticleServiceFactory.articleService) return ArticleServiceFactory.articleService;
    const networkService = NetworkServiceFactory.getNetworkSetvice();
    ArticleServiceFactory.articleService = new ArticleService(networkService);
    return ArticleServiceFactory.articleService;
  }
}