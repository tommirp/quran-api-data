const juzData = require('../lib/juz.js');

class JuzHandler {
  static getJuz(req, res) {
    const { juz } = req.params;
    const data = juzData(parseInt(juz));

    if (!data) {
      return res.status(404).send({
        message: `Juz "${juz}" is not found.`,
      });
    }

    return res.status(200).send(data);
  }

  static getAyahFromJuz(req, res) {
    const { juz } = req.params;
    const data = juzData(parseInt(juz));

    if (!data) {
      return res.status(404).send({
        message: `Juz "${juz}" is not found.`,
      });
    }

    return res.status(200).send(data.verses);
  }
}

module.exports = JuzHandler;
