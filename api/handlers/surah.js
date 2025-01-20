const quran = require('../../data/quran.json');

class SurahHandler {
  static getAllSurah(req, res) {
    const data = quran.map(item => {
      const surah = { ...item };
      delete surah.verses;
      delete surah.preBismillah;
      return surah;
    });
    return res.status(200).send(data);
  }

  static getAllAyah(_, res) {
    const allAyah = [];
    quran.forEach(surah => {
      surah.verses.forEach(ayah => allAyah.push(ayah));
    });

    return res.status(200).send(allAyah);
  }

  static getAllAyahFromSurah(req, res) {
    const { surah } = req.params;
    const data = quran[surah - 1];
    return res.status(200).send(data.verses);
  }

  static getSurah(req, res) {
    const { surah } = req.params;
    const data = quran[surah - 1];
    if (data) {
      return res.status(200).send(data);
    }
    return res.status(404).send({
      message: `Surah "${surah}" is not found.`,
    });
  }

  static getAyahFromSurah(req, res) {
    const { surah, ayah } = req.params;
    const checkSurah = quran[surah - 1];
    if (!checkSurah) {
      return res.status(404).send({
        message: `Surah "${surah}" is not found.`,
      });
    }
    const checkAyah = checkSurah.verses[ayah - 1];
    if (!checkAyah) {
      return res.status(404).send({
        message: `Ayah "${ayah}" in surah "${surah}" is not found.`,
      });
    }

    const dataSurah = { ...checkSurah };
    delete dataSurah.verses;
    const data = { ...checkAyah, surah: dataSurah };
    return res.status(200).send(data);
  }
}

module.exports = SurahHandler;
