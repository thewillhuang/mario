import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

export default async (css) => {
  // eslint-disable-next-line
  console.time('autoprefix time');
  const result = await postcss([autoprefixer]).process(css);
  result.warnings().forEach((warn) => {
    // eslint-disable-next-line
    console.warn(warn.toString());
  });
  // eslint-disable-next-line
  console.timeEnd('autoprefix time');
  return result.css;
};
