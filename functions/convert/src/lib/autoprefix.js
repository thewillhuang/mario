import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

export default async (css) => {
  const result = await postcss([autoprefixer]).process(css);
  result.warnings().forEach((warn) => {
    console.warn(warn.toString());
  });
  return result.css;
};
