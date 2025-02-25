const url = require('../../data/meta.json');

class MetaHandler {
  static GetYoutubeLink(_, res) {
    const meta = [
      {
        "number": 1,
        "metaName": "Youtube Mekah Primary",
        "metaType": "youtube",
        "metaValue": url.youtubeMekahPrimary,
        "metaDescription": "Youtube Mekah Primary"
      },
      {
        "number": 2,
        "metaName": "Youtube Mekah Secondary",
        "metaType": "youtube",
        "metaValue": url.youtubeMekahSecondary,
        "metaDescription": "Youtube Mekah Secondary"
      },
      {
        "number": 3,
        "metaName": "Youtube Madinah Primary",
        "metaType": "youtube",
        "metaValue": url.youtubeMadinahPrimary,
        "metaDescription": "Youtube Madinah Primary"
      },
      {
        "number": 4,
        "metaName": "Youtube Madinah Secondary",
        "metaType": "youtube",
        "metaValue": url.youtubeMadinahSecondary,
        "metaDescription": "Youtube Madinah Secondary"
      }
    ];

    return res.status(200).send(meta);
  }
}

module.exports = MetaHandler;
