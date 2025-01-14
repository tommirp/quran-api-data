const { SOURCE_API_BASEURL_3 } = require('../../config.js');

const sleep = async({ delay = 2000, throwReject = false }) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (throwReject) reject({ timeout: true });
    else resolve();
  }, delay);
});

class SholatHandler {
  static GetAllCities(_, res) {
    let apiUrl = `${SOURCE_API_BASEURL_3}/sholat/kota/semua`;
    Promise.race([
      fetch(apiUrl),
      sleep({ delay: 6000, throwReject: true })
    ]).then(res => res.json()).then(response => {
      const { data } = response;
      if (!data) {
        return res.status(404).send({
          message: `Not found.`,
        });
      }

      return res.status(200).send(data);
    });
  }

  static GetSholatSchedules(req, res) {
    const { citycode, year, month, day } = req.params;
    let apiUrl = day != null ? `${SOURCE_API_BASEURL_3}/sholat/jadwal/${citycode}/${year}/${month}/${day}` : `${SOURCE_API_BASEURL_3}/sholat/jadwal/${citycode}/${year}/${month}`;
    Promise.race([
      fetch(apiUrl),
      sleep({ delay: 6000, throwReject: true })
    ]).then(res => res.json()).then(response => {
      const { data } = response;
      if (!data) {
        return res.status(404).send({
          message: `Not found.`,
        });
      }

      if (day != null) {
        return res.status(200).send({
          lokasi: data.lokasi,
          daerah: data.daerah,
          tanggal: data.jadwal.tanggal,
          imsak: data.jadwal.imsak,
          subuh: data.jadwal.subuh,
          terbit: data.jadwal.terbit,
          dhuha: data.jadwal.dhuha,
          dzuhur: data.jadwal.dzuhur,
          ashar: data.jadwal.ashar,
          maghrib: data.jadwal.maghrib,
          isya: data.jadwal.isya,
          date: data.jadwal.date,
        });
      }

      const all_jadwal = [];
      data.jadwal.forEach(item => {
        all_jadwal.push({
          lokasi: data.lokasi,
          daerah: data.daerah,
          tanggal: item.tanggal,
          imsak: item.imsak,
          subuh: item.subuh,
          terbit: item.terbit,
          dhuha: item.dhuha,
          dzuhur: item.dzuhur,
          ashar: item.ashar,
          maghrib: item.maghrib,
          isya: item.isya,
          date: item.date,
        });
      });

      return res.status(200).send(all_jadwal);

    });
  }

}

module.exports = SholatHandler;
