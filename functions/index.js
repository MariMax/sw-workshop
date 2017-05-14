const functions = require('firebase-functions');

exports.headers = functions.https.onRequest((req, res)=>{
  const {headers} = require('./headers');
  return headers(req, res);
});

exports.article = functions.https.onRequest((req, res) => {
  const { getArticle, postArticle, putArticle, deleteArticle, options } = require('./article');
  switch (req.method) {
    case 'GET': return getArticle(req, res);
    case 'POST': return postArticle(req, res);
    case 'PUT': return putArticle(req, res);
    case 'DELETE': return deleteArticle(req, res);
    case 'OPTIONS': return options(req, res);
  }
});