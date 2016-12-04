import λ from 'apex.js';
import phantom from 'phantom';

export default λ(async (e) => {
  console.log('e', e);
  return phantom
  // console.log('phantom', phantom);
  // return await phantom
  //   .create(['--ignore-ssl-errors=yes', '--load-images=no']);
});
