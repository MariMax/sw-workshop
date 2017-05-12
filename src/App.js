import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {Body} from './components/body/body';

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
          <Route path={'/'} render={({history})=>(
            <header className="app-header">
              <h2 onClick={()=>history.push('/')}>Offline demo app</h2>
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