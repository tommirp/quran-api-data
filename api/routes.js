const { Router } = require('express');

const { caching } = require('./middlewares');
const SurahHandler = require('./handlers/surah');
const JuzHandler = require('./handlers/juz');
const SholatHandler = require('./handlers/sholat');
const HusnaHandler = require('./handlers/husna');

const router = Router();

router.use((_, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  next();
});

router.get('/', (_, res) => res.status(200).send({
  surah: {
    listSurah: '/surah',
    spesificSurah: {
      pattern: '/surah/{surah}',
      example: '/surah/18'
    },
    spesificAyahInSurah: {
      pattern: '/surah/{surah}/{ayah}',
      example: '/surah/18/60'
    },
    listSurah: '/ayah',
    allAyahInSurah: {
      pattern: '/ayahbysurah/{surah}',
      example: '/ayahbysurah/1'
    },
    spesificJuz: {
      pattern: '/juz/{juz}',
      example: '/juz/30'
    },
    allAyahInJuz: {
      pattern: '/ayahbyjuz/{juz}',
      example: '/ayahbyjuz/1'
    },
    allCities: '/sholat/citycode',
    sholatByCityByMonth: {
      pattern: '/sholat/:citycode/:year/:month',
      example: '/sholat/0421/2025/1'
    },
    sholatByCityByDay: {
      pattern: '/sholat/:citycode/:year/:month/:day',
      example: '/sholat/0421/2025/1/1'
    },
    allAsmaulhusna: '/asmaulhusna',
  },
  maintaner: 'Tommi RP <tanyatommi@gmail.com>',
  source: 'https://github.com/tommirp/mim-quran-api'
}));

// LOCAL DATA
router.get('/surah', caching, SurahHandler.getAllSurah);
router.get('/surah/:surah', caching, SurahHandler.getSurah);
router.get('/surah/:surah/:ayah', caching, SurahHandler.getAyahFromSurah);
router.get('/ayah', caching, SurahHandler.getAllAyah);
router.get('/ayahbysurah/:surah', caching, SurahHandler.getAllAyahFromSurah);
router.get('/juz/:juz', caching, JuzHandler.getJuz);
router.get('/ayahbyjuz/:juz', caching, JuzHandler.getAyahFromJuz);

// Jadwal Sholat - EXTERNAL DATA API
router.get('/sholat/citycode', caching, SholatHandler.GetAllCities);
router.get('/sholat/:citycode/:year/:month', caching, SholatHandler.GetSholatSchedules);
router.get('/sholat/:citycode/:year/:month/:day', caching, SholatHandler.GetSholatSchedules);

// Asmaul Husna - EXTERNAL DATA API
router.get('/asmaulhusna', caching, HusnaHandler.GetAll);

// fallback router
router.all('*', (req, res) => res.status(404).send({
  code: 404,
  status: 'Not Found.',
  message: `Resource "${req.url}" is not found.`
}));

module.exports = router;
