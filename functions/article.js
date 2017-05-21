// const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const uuid = require('uuid');

// const options = (req, res) => cors(req, res, () => res.send(204));

const postArticle = (req, res) => {
  const article = req.body;
  if (!article) return res.status(400).send({ error: 'please provide article' });
  article.id = article.id || uuid.v4();
  article.createdDate = new Date().valueOf();

  const header = {
    header: article.header,
    createdDate: article.createdDate,
    articleId: article.id,
  };
  const articleId = article.id;

  delete article.header;

  return Promise.all([
    admin.database().ref(`/articles/${articleId}`).set(article),
    admin.database().ref(`/headers/${articleId}`).set(header),
  ])
    .then((results) => res.status(200).send(article))
    .catch((e) => res.status(400).send(e));
}

const getArticle = (req, res) => {
  const articleId = req.params.articleId;
  if (!articleId) return res.status(400).send({ error: 'please provide articleId' })
  return admin.database().ref(`/articles/${articleId}`).once('value')
    .then(article => res.status(200).send(article.val()))
    .catch((e) => res.status(400).send(e));
};

const deleteArticle = (req, res) => {
  const articleId = req.params.articleId;
  if (!articleId) return res.status(400).send({ error: 'please provide articleId' })
  return admin.database().ref(`/articles/${articleId}`).remove()
    .then(() => res.send(200))
    .catch((e) => res.status(400).send(e));
};

exports.registerArticles = (app) => {
  app.get('/api/article/:articleId', getArticle);
  app.delete('/api/article/:articleId', deleteArticle);
  app.post('/api/article', postArticle);
  app.put('/api/article', postArticle);
}