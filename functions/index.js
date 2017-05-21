const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const registerHeaders = require('./headers').registerHeaders;
const registerArticles = require('./article').registerArticles;

const app = express();
app.use(cors({origin:true}));

registerHeaders(app);
registerArticles(app);



// exports.headers = functions.https.onRequest((req, res)=>{
  // const {headers} = require('./headers');
  // return headers(req, res);
// });

// exports.article = functions.https.onRequest((req, res) => {
  // const { getArticle, postArticle, putArticle, deleteArticle, options } = require('./article');
  // switch (req.method) {
    // case 'GET': return getArticle(req, res);
    // case 'POST': return postArticle(req, res);
    // case 'PUT': return putArticle(req, res);
    // case 'DELETE': return deleteArticle(req, res);
    // case 'OPTIONS': return options(req, res);
  // }
// });
admin.initializeApp(functions.config().firebase);
exports.router = functions.https.onRequest(app);