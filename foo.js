const dmarc = require('./');

console.log(dmarc('v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com'));
