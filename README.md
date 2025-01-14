# Quran - API

### Data Source
- [api.alquran.cloud](https://api.alquran.cloud) = Quran, Meta Verses, Audio.
- [quran.kemenag.go.id](https://quran.kemenag.go.id) = Indonesia translations and tafsir verses (short/long).
- [Al-Quran-ID-API](https://github.com/bachors/Al-Quran-ID-API) = Indonesia tafsir surah [*note: ambiguous revelation type on surah 13 and 55 in this source. So, I changed it to medinan (according to sahih international data)*]

### Endpoint usage
- [x] `/surah` = Returns the list of surahs in Al-Quran.
- [x] `/surah/{surah}` = Returns spesific surah.
- [x] `/ayahbysurah/{surah}` = Returns all ayah from surah number.
- [x] `/surah/{surah}/{ayah}` = Returns spesific ayah with requested surah.
- [x] `/juz/{juz}` = Returns spesific juz with all ayah.
- [x] `/ayahbyjuz/{juz}` = Returns all ayah by juz.

### Recommended fonts for Al-qur'an
- [quran.musil.com](http://quran.mursil.com/Web-Print-Publishing-Quran-Text-Graphics-Fonts-and-Downloads/fonts-optimized-for-quran)
- [Uthmani](https://groups.google.com/forum/#!topic/colteachers/Y6iKganK0tQ)

### Available Commands
- `npm start` = run server.
- `npm run dev` = run develop server.
- `npm run crawl` = collect new data from the data source, then unifying it in one JSON file.

### LICENSE
MIT
