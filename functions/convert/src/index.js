import 'source-map-support/register';
import λ from 'apex.js';
import phantom from 'phantom';

export default λ(async (e) => {
  console.log('e', e);
  console.log('phantom', phantom);
  return await phantom
    .create(['--ignore-ssl-errors=yes', '--load-images=no']);
});
