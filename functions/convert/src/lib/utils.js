export const generateLinkTag = cssUrl => cssUrl.reduce((acc, url) => `${acc}<link href="${url}" rel="stylesheet">`, '');

export const generateScriptTag = jsUrl => jsUrl.reduce((acc, url) => `${acc}<script src="${url}"></script>`, '');

export const isPromise = value => value && typeof value.then === 'function';

export const phantom2LinuxViewportStyle = '<style>body { transform-origin: 0 0; -webkit-transform-origin: 0 0; transform: scale(0.654545); -webkit-transform: scale(0.654545);}</style>';
