import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './article-card.css';

export const ArticleCard = ({header, articleId, loading, lastUpdate}) => (
      <Link to={loading?'/':`/content/${articleId}`} className="article-card-header">
        <div className={`title ${loading?'loading':''}`} >
          {header}
        </div>
        {lastUpdate && <div className={`title last-update`}>{lastUpdate}</div>}
        {!loading && <button className="btn save-for-offline">save for offline</button>}
      </Link>
    );