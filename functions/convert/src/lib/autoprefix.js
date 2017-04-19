import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

export default async (css) => {
  console.time('autoprefix time');
  const result = await postcss([autoprefixer]).process(css);
  result.warnings().forEach((warn) => {
    console.warn(warn.toString());
  });
  console.timeEnd('autoprefix time');
  return result.css;
};
