const generateLinkTag = (cssUrl) => {
  let css = '';
  cssUrl.forEach((url) => {
    css += `<link href="${url}" rel="stylesheet">`;
  });
  return css;
};

const generateScriptTag = (jsUrl) => {
  let js = '';
  jsUrl.forEach((url) => {
    js += `<script src="${url}"></script>`;
  });
  return js;
};

export default ({ html, css, cssUrls, jsUrls }) =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    ${generateLinkTag(cssUrls)}
    <style>${css}</style>
  </head>
  <body>
    ${generateScriptTag(jsUrls)}
    ${html}
  </body>
  </html>
  `;
