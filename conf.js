const fs = require('fs');

// connessione al DB
module.exports = {
   "host": "mysql-2a82da0d-itis-a3fa.a.aivencloud.com",
   "user": "avnadmin",
   "password": "AVNS_PnR6KUNHbwqpECrBaQR",
   "database": "MoligramDB",//Nome del database
    "port": 15544,
  "ssl": {
    "ca" : fs.readFileSync('ca.pem'),
    "rejectUnauthorized": true
  }
}
