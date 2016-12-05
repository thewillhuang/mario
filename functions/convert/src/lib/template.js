const generateLinkTag = cssUrl =>
  (cssUrl ? `<link href="${cssUrl}" rel="stylesheet">` : '');

export default ({ html, css, cssUrl }) =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    ${generateLinkTag(cssUrl)}
    <style>${css}</style>
  </head>
  <body>
    ${html}
  </body>
  </html>
  `;
