import { EventTopics } from './eventTopics';
import {appConfig} from './config';

class ArticleService {
  contentIndex = {};
  subscribers = [];
  baseURL = '';
  _articles = [
    { header: '1', articleId: 1 },
    { header: '2', articleId: 2 },
    { header: '3', articleId: 3 },
    { header: '4', articleId: 4 },
    { header: '5', articleId: 5 },
  ];
  activeHeadersRequest = null;
  activeArticleRequests = [];

  constructor(baseURL) {
    this.baseURL = baseURL || this.baseURL;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    return () => this.subscribers = this.subscribers.filter(i => i !== fn);
  }

  notify(topic) {
    this.subscribers.forEach(i => i(topic));
  }

  get articles() {
    return this._articles;
  }

  downloadHeaders(force) {
    if (this.activeHeadersRequest){
      return this.activeHeadersRequest;
    }

    if (this.articles.length>0 && !force){
      return Promise.resolve(this.articles);
      // return new Promise(resolve => setTimeout(() => resolve(this.articles), 2000));
    }

    this.activeHeadersRequest = fetch(`${this.baseURL}/headers`)
      .then(response => response.json())
      .then(headers => this.articles = headers)
      .then(() => this.notify(EventTopics.NEW_HEADERS))
      .catch(() => { console.error('smth went wrong on articles download') })
      .then(()=>{
        this.activeHeadersRequest = null;
        return this.articles
      });
    return this.activeHeadersRequest;  
  }

  downloadArticle(articleId, force) {
    if (!articleId) return Promise.resolve('');
    const activeRequest = this.activeArticleRequests.find(i=>i.articleId === articleId);
    if (activeRequest){
      return activeRequest.promise;
    }

    if (this.contentIndex[articleId] && !force){
      return Promise.resolve(this.contentIndex[articleId]);
    }

    const promise = fetch(`${this.baseURL}/article/${articleId}`)
      .then(response => response.json())
      .then(content => this.contentIndex[articleId] = content)
      .then(() => this.notify(EventTopics.NEW_ARTICLE))
      .catch(() => { console.error('smth went wrong on download article content') })
      .then(()=>{
        this.activeArticleRequests = this.activeArticleRequests.filter(i=>i.promise !== promise);
        return this.contentIndex[articleId]
      });
    this.activeArticleRequests = [...this.activeArticleRequests, {articleId, promise}];
    return promise;  
  }
}

export class ArticleServiceFactory {
  static articleService = null;

  static getArticleService(){
    if (ArticleServiceFactory.articleService) return ArticleServiceFactory.articleService;
    ArticleServiceFactory.articleService = new ArticleService(appConfig.baseUrl);
    return ArticleServiceFactory.articleService;
  }
}