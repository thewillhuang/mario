import λ from 'apex.js';
import phantom from 'phantom';

export default λ(async (e) => {
  return await phantom
    .create(['--ignore-ssl-errors=yes', '--load-images=no']);
});
