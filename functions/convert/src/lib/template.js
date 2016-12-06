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
    <style>body { transform-origin: 0 0; -webkit-transform-origin: 0 0; transform: scale(0.654545); -webkit-transform: scale(0.654545); }</style>
    ${generateLinkTag(cssUrls)}
    <style>${css}</style>
  </head>
  <body>
    ${generateScriptTag(jsUrls)}
    ${html}
  </body>
  </html>
  `;
