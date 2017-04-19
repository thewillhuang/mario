import { generateLinkTag, generateScriptTag, phantom2LinuxViewportStyle } from './utils';
import autoprefixed from './autoprefix';

export default ({ html, css, js, cssUrls, jsUrls }) =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    ${phantom2LinuxViewportStyle}
    ${generateLinkTag(cssUrls)}
    <style>${autoprefixed(css)}</style>
  </head>
  <body>
    <script>${js}</script>
    ${generateScriptTag(jsUrls)}
    ${html}
  </body>
  </html>
  `;
