import React, { Component } from 'react';
import { ArticleCard } from '../article-card/article-card';
import { ArticleServiceFactory } from '../../services/article.service';
import { EventTopics } from '../../services/eventTopics';
import './articles-list.css';

export class ArticlesList extends Component {
  constructor() {
    super();
    this.headers = [];
    this.articleService = ArticleServiceFactory.getArticleService();
    this.handleCollectionUpdate = this.handleCollectionUpdate.bind(this);
    this.state = { loading: false }
  }

  async componentDidMount() {
    this.setState({ loading: true });
    this.subscription = this.articleService.subscribe(this.handleCollectionUpdate);
    try {
      await this.articleService.downloadHeaders();
    } finally {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this.subscription();
  }

  handleCollectionUpdate(topic) {
    if (EventTopics.NEW_HEADERS === topic) {
      this.headers = this.articleService.headers;
      this.forceUpdate();
    }
  }

  render() {
    return (
      <section className="articles-list">
        {this.state.loading && <ArticleCard header="empty" loading={true} />}
        {this.headers.map(i => <ArticleCard header={i.header} lastUpdate={i.lastUpdate} articleId={i.articleId} key={i.articleId} />)}
      </section>
    );
  }
}