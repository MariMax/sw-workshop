import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import './article-details.css';

export class ArticleDetails extends Component {
  static propTypes = {
    articleId: PropTypes.string,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.state = { touch: false, translateX: 0 };
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
    if (translateX > 0) this.hide(event, true);
  }

  hide(event, force) {
    const isItPane = event.target.nodeName && event.target.nodeName.toLowerCase() === 'aside';
    const isItCLoseButton = event.currentTarget.name && event.currentTarget.name.toLowerCase() === 'close';
    if (isItPane || isItCLoseButton || force) {
      this.setState({translateX:0, touch:false});
      event.preventDefault();
      event.stopPropagation();
      this.props.history.push('/');
    }
  }

  save() {

  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <aside id="side-pane" name="aside" className={`side-pane ${!!this.props.articleId ? 'side-pane--visible' : ''} ${!this.state.touch ? 'side-pane--animatable' : ''}`}
        onClick={this.hide}>
        <div className={`side-pane__container`}
          style={!!this.props.articleId && {transform: `translateX(calc(100vw - 100% + ${this.state.translateX}px))` }||{}}          
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
            <input id="header" type="text" name="header" title={this.state.header} value={this.state.header} onChange={this.handleChange} />
          </header>
          <section className="side-pane__body">
            <textarea
              name="content"
              value={this.state.content}
              onChange={this.handleChange}
            />
          </section>
          <footer className="side-pane__footer">
            <button type="button" className="btn btn--sm" onClick={this.save}>Save</button>
          </footer>
        </div>
      </aside>
    )
  }
}