SystemJS.config({
    baseURL: './',
    map: {
        htmlclean: 'htmlclean.js',
    },
    meta: {
        'htmlclean.js': {
            format: 'cjs'
        },
        '*.html': {
            loader: 'html.js'
        }
    }
});