export default ({ html, css, content }) =>
  content ? content : `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>${css}</style>
  </head>
  <body>
    ${html}
  </body>
  </html>
  `;
