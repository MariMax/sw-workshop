import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { ArticleServiceFactory } from '../../services/article.service';
import './article-details.css';

const initialState = { touch: false, translateX: 0, content: '', header: '', lastUpdate: '', loadingArticle: false, loading: false };

export class ArticleDetails extends Component {
  static propTypes = {
    articleId: PropTypes.string,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.save = this.save.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.state = { ...initialState };
    this.articleService = ArticleServiceFactory.getArticleService();
  }

  async getArticle(articleId) {
    if (articleId === 'new' || !articleId) {
      return this.setState({ ...initialState });
    }
    try {
      this.setState({loadingArticle: true});
      const articleRequest = this.articleService.downloadArticle(articleId);
      const headersRequest = this.articleService.downloadHeaders();
      const article = await articleRequest;
      const headers = await headersRequest;
      const header = headers.find(i=>i.articleId === articleId);
      return this.setState({ header: header.header, lastUpdate: header.lastUpdate, content: article.body, loadingArticle: false });
    }
    catch (e) {
      this.hide(null, null, true);
    }
  }

  componentDidMount() {
    this.getArticle(this.props.articleId);
  }

  componentWillReceiveProps(nextProps) {
    this.getArticle(nextProps.articleId);
  }

  handleTouchStart(event) {
    event.preventDefault();
    this.startX = this.currentX = event.touches[0].pageX;
    this.setState({ touch: true });
  }

  handleTouchMove(event) {
    this.currentX = event.touches[0].pageX;
    const translateX = Math.max(0, this.currentX - this.startX);
    this.setState({ currentX: this.currentX, translateX });
  }

  handleTouchEnd(event) {
    this.setState({ touch: false });

    const translateX = Math.max(0, this.currentX - this.startX);
    if (translateX > 0) this.hide(event, null, true);
  }

  hide(eventProxy, reactEvent, force) {
    const isItPane = eventProxy && eventProxy.target.nodeName && eventProxy.target.nodeName.toLowerCase() === 'aside';
    const isItCLoseButton = eventProxy && eventProxy.currentTarget.name && eventProxy.currentTarget.name.toLowerCase() === 'close';
    if (isItPane || isItCLoseButton || force) {
      this.setState({ ...initialState });
      eventProxy && eventProxy.preventDefault();
      eventProxy && eventProxy.stopPropagation();
      this.props.history.push('/');
    }
  }

  async save(eventProxy, reactEvent) {
    this.setState({loading:true});
    try {
      const article = await this.articleService.saveArticle(this.props.articleId, this.state.header, this.state.content);
      this.hide(null, null, true);
    } 
    catch(e){
      console.error(e);
    }
    finally{
      this.setState({loading:false});
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  render() {
    return (
      <aside id="side-pane" name="aside" className={`side-pane ${!!this.props.articleId ? 'side-pane--visible' : ''} ${!this.state.touch ? 'side-pane--animatable' : ''}`}
        onClick={this.hide}>
        <div className={`side-pane__container`}
          style={!!this.props.articleId && { transform: `translateX(calc(100vw - 100% + ${this.state.translateX}px))` } || {}}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchStart={this.handleTouchStart}>
          <header className="side-pane__header">
            <button name="close" type="button" className="btn btn--sm btn--icon" onClick={this.hide}>
              <svg width="20" height="20" id="icon-close" viewBox="0 0 24 24">
                <title>close</title>
                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
              </svg>
            </button>
            {!this.state.loadingArticle && <input id="header" type="text" name="header" title={this.state.header} value={this.state.header} onChange={this.handleInputChange} />}
            {this.state.loadingArticle && <div className="side-pane__loading-article"></div>}
          </header>
          <section className="side-pane__body">
            <textarea
              disabled={this.state.loadingArticle}
              name="content"
              value={this.state.content}
              onChange={this.handleInputChange}
            />
          </section>
          <footer className="side-pane__footer">
            <button disabled={this.state.loading} type="button" className="btn btn--sm" onClick={this.save}>Save</button>
            {this.state.lastUpdate && <div className="last-update">Last update: <span>{new Date(this.state.lastUpdate).toLocaleDateString()}</span></div>}
          </footer>
        </div>
      </aside>
    )
  }
}