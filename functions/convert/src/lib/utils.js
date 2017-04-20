export const generateLinkTag = (cssUrl) => {
  let css = '';
  cssUrl.forEach((url) => {
    css += `<link href="${url}" rel="stylesheet">`;
  });
  return css;
};

export const generateScriptTag = (jsUrl) => {
  let js = '';
  jsUrl.forEach((url) => {
    js += `<script src="${url}"></script>`;
  });
  return js;
};

export const isPromise = value => value && typeof value.then === 'function';

export const phantom2LinuxViewportStyle = '<style>body { transform-origin: 0 0; -webkit-transform-origin: 0 0; transform: scale(0.654545); -webkit-transform: scale(0.654545); page-break-before: always; }</style>';
