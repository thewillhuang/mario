import λ from 'apex.js';
import phantom from 'phantom';

export default λ(async (e) => {
  console.log(e);
  console.log(phantom);
  return await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
});
