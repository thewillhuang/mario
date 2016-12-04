import λ from 'apex.js';
import phantom from 'phantom';

export default λ(async ({ html, css }) =>
  await phantom
    .create(['--ignore-ssl-errors=yes', '--load-images=no']));
