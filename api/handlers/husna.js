const { SOURCE_API_BASEURL_3 } = require('../../config.js');

const sleep = async({ delay = 2000, throwReject = false }) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (throwReject) reject({ timeout: true });
    else resolve();
  }, delay);
});

class HusnaHandler {
  static GetAll(_, res) {
    let apiUrl = `${SOURCE_API_BASEURL_3}/husna/semua`;
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

}

module.exports = HusnaHandler;
