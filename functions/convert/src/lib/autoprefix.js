import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

export default css => postcss([autoprefixer]).process(css).then((result) => {
  result.warnings().forEach((warn) => {
    console.warn(warn.toString());
  });
  return result.css;
});
