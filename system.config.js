SystemJS.config({
  baseURL: './',
  map: {
    htmlclean: '.',
  },
  meta: {
    '*.html': { loader: 'html.js' }
  },
  packages: {
    htmlclean: {
      main: {
        default: 'htmlclean.js'
      }
    }
  }
});