// const cors = require('cors')({ origin: true });

const admin = require('firebase-admin');
const functions = require('firebase-functions');

const getHeaders = (req, res) => admin.database().ref(`/headers`)
  .once('value')
  .then(snapshot => {
    const tree = snapshot.val();
    const headers = Object.keys(tree)
      .reduce((r, key) => [...r, tree[key]], []);
    return res.status(200).send(headers);
  })
  .catch((e) => res.status(400).send(e));

// exports.headers = (req, res) => {
  // return cors(req, res, () => {
    // switch (req.method) {
      // case 'OPTIONS': return res.send(204);
      // case 'GET': return getHeaders(req, res);
      // default: return res.status(403).send('Forbidden!');
    // }
  // });
// }

exports.registerHeaders = (app) => {
  app.get('/api/headers', getHeaders);
  return app;
}