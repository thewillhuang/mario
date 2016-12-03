import λ from 'apex.js';
import phantom from 'phantom';

export default λ((e) => {
  console.log(e);
  return phantom
    .create(['--ignore-ssl-errors=yes', '--load-images=no'])
    .then(res => res);
});
