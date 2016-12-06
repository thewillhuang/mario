import { generateLinkTag, generateScriptTag, phantom2LinuxViewportStyle } from './utils';

export default ({ html, css, cssUrls, jsUrls }) =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    ${phantom2LinuxViewportStyle}
    ${generateLinkTag(cssUrls)}
    <style>${css}</style>
  </head>
  <body>
    ${generateScriptTag(jsUrls)}
    ${html}
  </body>
  </html>
  `;
