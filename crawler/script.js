/* eslint-disable no-console */
const { writeFile } = require('fs').promises;
const fetch = require('isomorphic-fetch');
const { sleep } = require('./helpers');
const { SOURCE_API_BASEURL, SOURCE_API_BASEURL_2 } = require('../config');

/**
 * @see https://github.com/gadingnst/quran.machine/blob/main/src/app/data/quran-tafsir.json
 */
const temp = require('../data/quran-tafsir.json');

const getSurah = surah => {
  const editions = [
    'quran-simple-enhanced', 'ar.alafasy',
    'en.transliteration', 'en.sahih'
  ];

  const apiUrl = `${SOURCE_API_BASEURL}/surah/${surah}/editions/${editions.join(',')}`;
  console.log(`> Prepare surah: ${surah} (${apiUrl})`);

  const action = async() => {
    try {
      const data = await Promise.race([
        fetch(apiUrl),
        sleep({ delay: 6000, throwReject: true })
      ]);
      return data;
    } catch (err) {
      if (err.timeout) {
        console.log('> Request Timeout, Trying again...');
        return await action();
      }
      console.error(err);
    }
  };

  return action();
};

const preBismillahHandler = ayah => {
  const replacer = {
    '%u0628%u0650%u0633%u0652%u0645%u0650 %u0627%u0644%u0644%u0651%u064e%u0647%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0652%u0645%u064e%u0670%u0646%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0650%u064a%u0645%u0650': /%u0628%u0650%u0633%u0652%u0645%u0650 %u0627%u0644%u0644%u0651%u064e%u0647%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0652%u0645%u064e%u0670%u0646%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0650%u064a%u0645%u0650/gi,
    '%u0628%u0651%u0650%u0633%u0652%u0645%u0650 %u0627%u0644%u0644%u0651%u064e%u0647%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0652%u0645%u064e%u0670%u0646%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0650%u064a%u0645%u0650': /%u0628%u0651%u0650%u0633%u0652%u0645%u0650 %u0627%u0644%u0644%u0651%u064e%u0647%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0652%u0645%u064e%u0670%u0646%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0650%u064a%u0645%u0650/gi
  };
  const [,regEx] = Object.entries(replacer).find(([key]) => ayah.includes(key)) || [];
  return `${regEx ? ayah.replace(regEx, '') : ayah}`.trim();
};

const operate = async(surah, tafsirSurah = {}, tryFlag = false) => {
  const { asma, keterangan, urut } = tafsirSurah;
  try {
    const responseText = await (await getSurah(surah)).text();
    const response = responseText.replace(/\\u/g, '%u');
    const { code, status, data } = JSON.parse(response);
    const [simple, arab, transliteration, english] = data;
    const activeSurah = temp[`${arab.number}.1`].surah;

    if (code !== 200) throw { surah, code, status };
    if (tryFlag) console.log(`\n Retrying at surah: ${surah}`);

    process.stdout.write(`> (${code}:${status}). Operating on surah ${surah}:${arab.englishName}... `);

    const result = {
      number: arab.number,
      sequence: parseInt(urut, 10),
      numberOfVerses: arab.numberOfAyahs,
      nameShort: asma.trim(),
      nameLong: arab.name.trim(),
      nameTransliterationEn: arab.englishName.trim(),
      nameTransliterationId: activeSurah.latin.trim(),
      nameTranslationEn: arab.englishNameTranslation.trim(),
      nameTranslationId: activeSurah.id.trim(),
      // name: {
      //   short: asma.trim(),
      //   long: arab.name.trim(),
      //   transliteration: {
      //     en: arab.englishName.trim(),
      //     id: activeSurah.latin.trim()
      //   },
      //   translation: {
      //     en: arab.englishNameTranslation.trim(),
      //     id: activeSurah.id.trim()
      //   }
      // },
      // revelation: {
      //   arab: arab.revelationType === 'Meccan'
      //     ? '%u0645%u0643%u0629'
      //     : '%u0645%u062F%u064A%u0646%u0629',
      //   en: arab.revelationType,
      //   id: arab.revelationType === 'Meccan'
      //     ? 'Makkiyyah'
      //     : 'Madaniyyah'
      // },
      // preBismillah: arab.number === 1 || arab.number === 9 ? null : {
      //   text: {
      //     arab: '%u0628%u0650%u0633%u0652%u0645%u0650 %u0627%u0644%u0644%u0651%u064e%u0647%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0652%u0645%u064e%u0670%u0646%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0650%u064a%u0645%u0650',
      //     transliteration: {
      //       en: 'Bismillaahir Rahmaanir Raheem'
      //     }
      //   },
      //   translation: {
      //     en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      //     id: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.'
      //   },
      //   audio: {
      //     primary: 'https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1',
      //     secondary: [
      //       'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
      //       'https://cdn.islamic.network/quran/audio/64/ar.alafasy/1.mp3'
      //     ]
      //   }
      // },
      revelationArab: arab.revelationType === 'Meccan' ? '%u0645%u0643%u0629' : '%u0645%u062F%u064A%u0646%u0629',
      revelationEn: arab.revelationType,
      revelationId: arab.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah',
      tafsir: (() => {
          let tafsir = keterangan.replace(/(<([^>]+)>)/gi, '');
          if (surah === 13 || surah === 55) {
            tafsir = tafsir.replace(/Makkiyyah/gi, 'Madaniyyah');
          }
          return tafsir.trim();
        })(),
        preBismillahArab: arab.number === 1 || arab.number === 9 ? null : '%u0628%u0650%u0633%u0652%u0645%u0650 %u0627%u0644%u0644%u0651%u064e%u0647%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0652%u0645%u064e%u0670%u0646%u0650 %u0627%u0644%u0631%u0651%u064e%u062d%u0650%u064a%u0645%u0650',
        preBismillahEn: arab.number === 1 || arab.number === 9 ? null : 'Bismillaahir Rahmaanir Raheem',
        preBismillahTranslationEn: arab.number === 1 || arab.number === 9 ? null : 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        preBismillahTranslationId: arab.number === 1 || arab.number === 9 ? null : 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
        preBismillahAudioPrimary: arab.number === 1 || arab.number === 9 ? null : 'https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1',
        preBismillahAudioSecondary: arab.number === 1 || arab.number === 9 ? null : 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
        preBismillahAudioAlternative: arab.number === 1 || arab.number === 9 ? null : 'https://cdn.islamic.network/quran/audio/64/ar.alafasy/1.mp3',
      verses: arab.ayahs.map((ayah, idx) => {
        const activeAyah = temp[`${arab.number}.${ayah.numberInSurah}`];
        const { tafsir } = activeAyah;
        const arabText = simple.ayahs[idx].text;
        return {
          numberOfSurah: arab.number,
          numberInQuran: ayah.number,
          numberInSurah: ayah.numberInSurah,
          juz: ayah.juz,
          page: ayah.page,
          manzil: ayah.manzil,
          ruku: ayah.ruku,
          hizbQuarter: ayah.hizbQuarter,
          sajdaRecommended: (sajda => typeof sajda === 'object' ? sajda.recommended : sajda)(ayah.sajda),
          sajdaObligatory: (sajda => typeof sajda === 'object' ? sajda.obligatory : sajda)(ayah.sajda),
          textArab: arab.number !== 1 && idx === 0 ? preBismillahHandler(arabText) : arabText.trim(),
          textTransliteration: transliteration.ayahs[idx].text.trim(),
          translationEn: english.ayahs[idx].text.trim(),
          translationId: activeAyah.text.id.trim(),
          audioPrimary: ayah.audio,
          audioSecondary: ayah.audioSecondary.length ? ayah.audioSecondary[0] : null,
          tafsirShort: tafsir.short.trim(),
          tafsirLong: tafsir.long.trim(),
        };
      })
    };

    process.stdout.write('\n> Done!\n\n');
    return result;
  } catch (err) {
    const { surah, code, status } = err;

    if (surah) {
      process.stdout.write(`> (${code}:${status}). Error on surah ${surah}!`);
      console.log('\n> Will retrying at last queue...\n');
      return await operate(surah, tafsirSurah, true);
    }

    console.error(err);
  }
};

async function main() {
  console.log('Fetching all surah...\n');
  console.log(SOURCE_API_BASEURL_2)
  const responseTafsirSurahId = await fetch(SOURCE_API_BASEURL_2);
  const tafsirSurahs = await responseTafsirSurahId.json();
  const response = [];

  for (let i = 1; i <= 114; i++) {
    const surah = await operate(i, tafsirSurahs[i - 1]);
    response.push(surah);
  }

  console.log('\nFetching all surah (DONE).');
  process.stdout.write('\n> Writing Data..');

  // const data = JSON.stringify({
  //   license: '(MIT) Tommi RP <tanyatommi@gmail.com>',
  //   source: 'https://github.com/tommirp/mim-quran-api',
  //   audioEdition: 'Syekh. Mishary Rashid Al-Afasy',
  //   data: response
  // }, null, 2);

  const data = JSON.stringify(response, null, 2);

  await writeFile('./data/quran.json', data.replace(/%u/g, '\\u'));
  console.log(`\n> Writed ${response.length} surah.\n`);
  console.log('Generate Done!');
}

main();
