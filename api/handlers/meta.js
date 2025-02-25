const url = require('../data/meta.json');

class MetaHandler {
  static GetYoutubeLink(_, res) {
    return res.status(200).send(url);
  }
}

module.exports = MetaHandler;
