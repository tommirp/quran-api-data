const url = require('../../data/meta.json');

class MetaHandler {
  static GetYoutubeLink(_, res) {
    const meta = [
      {
        "number": 1,
        "metaName": "Youtube Mekah",
        "metaType": "youtube",
        "metaValue": url.youtubeMekah,
        "metaDescription": "Youtube Mekah"
      },
      {
        "number": 2,
        "metaName": "Youtube Madinah",
        "metaType": "youtube",
        "metaValue": url.youtubeMadinah,
        "metaDescription": "Youtube Madinah"
      }
    ];

    return res.status(200).send(meta);
  }
}

module.exports = MetaHandler;
