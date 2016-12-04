import λ from 'apex.js';
const phantom = require('phantom');

export default λ(async (e) => {
  console.log(e);
  console.log(λ);
  return true;
  // console.log(phantom);
  // return await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
});
