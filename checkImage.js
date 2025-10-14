const https = require('https');
const url = 'https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png';
https.get(url, res => {
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    const sig = buf.slice(0,8).toString('hex');
    const isPng = sig === '89504e470d0a1a0a';
    let width = null, height = null;
    try {
      width = buf.readUInt32BE(16);
      height = buf.readUInt32BE(20);
    } catch (e) {}
    console.log('isPng:', isPng);
    console.log('width:', width);
    console.log('height:', height);
    console.log('bytes:', buf.length);
  });
}).on('error', e => { console.error(e); process.exit(2); });
