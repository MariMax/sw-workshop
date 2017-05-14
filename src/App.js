import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Body } from './components/body/body';

import './App.css';

export class App extends Component {

  constructor() {
    super();

    this.state = { online: window.navigator.onLine };
    this.handleOnlineStatusChange = this.handleOnlineStatusChange.bind(this);

    window.addEventListener('offline', this.handleOnlineStatusChange);
    window.addEventListener('online', this.handleOnlineStatusChange);
  }

  handleOnlineStatusChange(event) {
    this.setState({ online: event.type === 'online' });
  }

  render() {
    return (
      <Router>
        <div className={(this.state.online ? 'online' : 'offline') + ' app'}>
          <Route path={'/'} render={({ history }) => (
            <header className="app-header">
              <h2 onClick={() => history.push('/')}>Offline demo app</h2>
              <button className="btn btn--icon" onClick={() => history.push('/content/new')}>
                <svg width="20" height="20" id="icon-add" viewBox="0 0 24 24">
                  <title>add</title>
                  <path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>
                </svg>
              </button>
            </header>
          )} />
          <section className="app-container">
            <Route path={'/:content?/:articleId?'} component={Body} />
          </section>
          <footer className="app-footer">
          </footer>

        </div>
      </Router>
    );
  }
}