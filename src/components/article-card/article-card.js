import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ArticleServiceFactory } from '../../services/article.service';
import * as idbKeyVal from 'idb-keyval';
import { EventTopics } from '../../services/eventTopics';
import './article-card.css';

export class ArticleCard extends Component {
  constructor(props) {
    super(props);

    this.saveForOffline = this.saveForOffline.bind(this);
    this.articleService = ArticleServiceFactory.getArticleService();
    this.state = { contentAvailable: false, offlineAvailable: false };
    this.checkOffline = this.checkOffline.bind(this);
    this.subscription = this.articleService.subscribe(this.checkOffline);
  }

  async checkOffline(event){
    if (event && event !== EventTopics.NEW_ARTICLE) return;
    let offlineAvailable = false;
    try{
      const articleIDB = await idbKeyVal.get(this.props.articleId);
      offlineAvailable = !!articleIDB;
    } catch(e) {}
    
    try{
      const contentAvailable = !!this.articleService.getArticle(this.props.articleId);
      this.setState({ offlineAvailable, contentAvailable});
    } catch(e){
      console.error('cannot get item from idb');
    }
  }

  componentDidMount(){
    this.checkOffline();
  }

  componentWillUnmount() {
    this.subscription();
  }

  async saveForOffline(event) {
    event.preventDefault();
    event.stopPropagation()

    try {
      const article = await this.articleService.downloadArticle(this.props.articleId, navigator.onLine);
      const articleToSave = {
        body: article.body,
        header: this.props.header,
        lastUpdate: navigator.onLine?new Date.valueOf():'',
        id: this.props.articleId,
      };
      await idbKeyVal.set(this.props.articleId, JSON.stringify(articleToSave));
      this.setState({offlineAvailable: true});
    } catch (e) {
      console.error(e);
    }

  }

  render() {
    return (
      <Link to={this.props.loading ? '/' : `/content/${this.props.articleId}`}
        className={`article-card-header ${this.state.offlineAvailable ? 'offline-available' : ''}`}>
        <div className={`title ${this.props.loading ? 'loading' : ''}`} >
          {this.props.header}
        </div>
        {this.props.lastUpdate && <div className={`title last-update`}>{this.props.lastUpdate}</div>}
        {!this.props.loading && <button
          className={`btn save-for-offline 
            ${this.state.offlineAvailable ? 'offline-available' : ''}
            ${this.state.contentAvailable ? 'content-available' : ''}`}
          onClick={this.saveForOffline}>save for offline</button>}
      </Link>
    );
  }
}