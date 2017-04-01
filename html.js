/**
 * HTML plugin
 */
exports.translate = function (load) {
    return SystemJS['import']('htmlclean', module.id).then(function (cleaner) {
        if (this.builder && this.transpiler) {
            load.metadata.format = 'esm';
            return 'exp' + 'ort var __useDefault = true; exp' + 'ort default ' + JSON.stringify(cleaner.htmlclean(load.source)) + ';';
        }

        load.metadata.format = 'amd';
        return 'def' + 'ine(function() {\nreturn ' + JSON.stringify(cleaner.htmlclean(load.source)) + ';\n});';
    });
}