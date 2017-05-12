import React, { Component } from 'react';
import { ArticleServiceFactory } from '../../services/article.service';
import { ArticlesList } from '../articles-list/articles-list';
import { ArticleDetails } from '../article-details/article-details';


export class Body extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <ArticlesList />
        <ArticleDetails articleId={this.props.match.params.articleId} history={this.props.history}/>
      </section>
    )
  }
}