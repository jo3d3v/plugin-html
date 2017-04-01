System.registerDynamic("npm:htmlclean@3.0.2/lib/phrasing-elements.json!github:systemjs/plugin-json@0.1.2.js", [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = { "a": {}, "abbr": {}, "acronym": {}, "applet": { "altBlock": true, "embed": true }, "b": {}, "bdo": {}, "big": {}, "br": { "empty": true }, "button": { "altBlock": true }, "cite": {}, "code": {}, "del": {}, "dfn": {}, "em": {}, "font": {}, "i": {}, "iframe": { "altBlock": true, "embed": true }, "img": { "empty": true }, "input": { "empty": true }, "ins": {}, "isindex": { "empty": true }, "kbd": {}, "label": {}, "object": { "altBlock": true, "embed": true }, "q": {}, "s": {}, "samp": {}, "select": { "altBlock": true }, "small": {}, "span": {}, "strike": {}, "strong": {}, "sub": {}, "sup": {}, "textarea": {}, "tt": {}, "u": {}, "var": {}, "ruby": { "altBlock": true }, "audio": { "altBlock": true, "embed": true }, "bdi": {}, "canvas": { "altBlock": true, "embed": true }, "data": {}, "embed": { "empty": true, "embed": true }, "keygen": { "empty": true, "embed": true }, "mark": {}, "meter": {}, "output": {}, "progress": {}, "time": {}, "video": { "altBlock": true, "embed": true }, "wbr": { "empty": true }, "math": { "embed": true }, "svg": { "altBlock": true, "embed": true }, "tspan": {}, "tref": {}, "altglyph": {} };
});
System.registerDynamic("npm:htmlclean@3.0.2/lib/pathdata.json!github:systemjs/plugin-json@0.1.2.js", [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = { "path": { "d": true }, "animateMotion": { "path": true }, "glyph": { "d": true } };
});
System.registerDynamic('npm:htmlclean@3.0.2/lib/htmlclean.js', ['npm:htmlclean@3.0.2/lib/phrasing-elements.json!github:systemjs/plugin-json@0.1.2.js', 'npm:htmlclean@3.0.2/lib/pathdata.json!github:systemjs/plugin-json@0.1.2.js'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var global = this || self,
      GLOBAL = global;
  var PHRASING_ELEMENTS = $__require('npm:htmlclean@3.0.2/lib/phrasing-elements.json!github:systemjs/plugin-json@0.1.2.js'),
      PATHDATA = $__require('npm:htmlclean@3.0.2/lib/pathdata.json!github:systemjs/plugin-json@0.1.2.js'),
      PTN_EXPONENT = '[eE][\\+\\-]?\\d+',
      PTN_ARG = '[\\+\\-]?(?:\\d*\\.\\d+|\\d+\\.?)(?:' + PTN_EXPONENT + ')?',
      RE_CMD_LINE = new RegExp('[a-z](?:(?:[^\\S\\f]|,)*' + PTN_ARG + ')*', 'gi'),
      RE_ARGS = new RegExp(PTN_ARG, 'g'),
      RE_EXPONENT = new RegExp('(' + PTN_EXPONENT + ')$');
  module.exports = function (html, options) {
    var protectedText = [],
        unprotectedText = [],
        embedElms,
        htmlWk = '',
        lastLeadSpace = '',
        lastTrailSpace = '',
        lastPhTags = '',
        lastIsEnd = true;
    function addProtectedText(text) {
      if (typeof text !== 'string' || text === '') {
        return '';
      }
      protectedText.push(text);
      return '\f' + (protectedText.length - 1) + '\x07';
    }
    function addUnprotectedText(text) {
      if (typeof text !== 'string' || text === '') {
        return '';
      }
      unprotectedText.push(text);
      return '\f!' + (unprotectedText.length - 1) + '\x07';
    }
    function replaceComplete(text, re, fnc) {
      var doNext = true,
          reg = new RegExp(re);
      function fncWrap() {
        doNext = true;
        return fnc.apply(null, arguments);
      }
      while (doNext) {
        doNext = false;
        text = text.replace(reg, fncWrap);
      }
      return text;
    }
    if (typeof html !== 'string') {
      return '';
    }
    if (/\f|\x07/.test(html)) {
      throw new Error('\\f or \\x07 that is used as marker is included.');
    }
    if (options && options.unprotect) {
      (Array.isArray(options.unprotect) ? options.unprotect : [options.unprotect]).forEach(function (re) {
        if (re instanceof RegExp) {
          html = html.replace(re, function (str) {
            return addUnprotectedText(str);
          });
        }
      });
    }
    html = html.replace(/<[^\S\f]*\![^\S\f]*--[^\S\f]*\[[^\S\f]*htmlclean-protect[^\S\f]*\][^\S\f]*--[^\S\f]*>([^]*?)<[^\S\f]*\![^\S\f]*--[^\S\f]*\[[^\S\f]*\/[^\S\f]*htmlclean-protect[^\S\f]*\][^\S\f]*--[^\S\f]*>/ig, function (str, p1) {
      return addProtectedText(p1);
    });
    html = html.replace(/(<[^\S\f]*\?[^\S\f]*xml\b[^>]*?\?[^\S\f]*>)/ig, function (str, p1) {
      return addUnprotectedText(p1);
    }).replace(/(<[^\S\f]*(\%|\?)[^]*?\2[^\S\f]*>)/g, function (str, p1) {
      return addProtectedText(p1);
    }).replace(/(<[^\S\f]*\?[^\S\f]*php\b[^]*)/ig, function (str, p1) {
      return addProtectedText(p1);
    }).replace(/(<[^\S\f]*jsp[^\S\f]*:[^>]*?>)/ig, function (str, p1) {
      return addProtectedText(p1);
    }).replace(/(<[^\S\f]*\![^\S\f]*--[^\S\f]*\#[^]*?--[^\S\f]*>)/g, function (str, p1) {
      return addProtectedText(p1);
    });
    ;
    html = html.replace(/(?:[\t ]*[\n\r][^\S\f]*)?(<[^\S\f]*\![^\S\f]*(?:--)?[^\S\f]*\[[^\S\f]*if\b[^>]*>(?:(?:<[^\S\f]*\!)?[^\S\f]*--[^\S\f]*>)?)(?:[\t ]*[\n\r][^\S\f]*)?/ig, function (str, p1) {
      return addProtectedText(p1);
    }).replace(/(?:[\t ]*[\n\r][^\S\f]*)?((?:<[^\S\f]*\![^\S\f]*--[^\S\f]*)?<[^\S\f]*\![^\S\f]*\[[^\S\f]*endif\b[^>]*>)(?:[\t ]*[\n\r][^\S\f]*)?/ig, function (str, p1) {
      return addProtectedText(p1);
    });
    ;
    html = html.replace(/(<[^\S\f]*(textarea|script|style|pre)\b[^>]*>)([^]*?)(<[^\S\f]*\/[^\S\f]*\2\b[^>]*>)/ig, function (str, startTag, tagName, innerHtml, endTag) {
      var splitHtml;
      if (innerHtml !== '') {
        if (tagName.toLowerCase() === 'pre') {
          splitHtml = '';
          innerHtml = innerHtml.replace(/([^]*?)(<[^>]+>)/g, function (str, text, tag) {
            splitHtml += addProtectedText(text) + tag;
            return '';
          });
          splitHtml += addProtectedText(innerHtml);
          return startTag + splitHtml + endTag;
        } else {
          return startTag + addProtectedText(innerHtml) + endTag;
        }
      } else {
        return startTag + endTag;
      }
    });
    if (options && options.protect) {
      (Array.isArray(options.protect) ? options.protect : [options.protect]).forEach(function (re) {
        if (re instanceof RegExp) {
          html = html.replace(re, function (str) {
            return addProtectedText(str);
          });
        }
      });
    }
    html = replaceComplete(html, /\f\!(\d+)\x07/g, function (str, p1) {
      return unprotectedText[p1] || '';
    });
    html = html.replace(/<[^\S\f]*\![^\S\f]*--[^]*?--[^\S\f]*>/g, '');
    html = html.replace(/<([^>]+)>/g, function (str, tagInner) {
      var tagName = (tagInner.match(/^[^\S\f]*(?:\/[^\S\f]*)?([^\s\/]+)/) || [])[1];
      return '<' + tagInner.replace(/(?:([^\s\/]+)[^\S\f]*=[^\S\f]*)?("|')([^]*?)\2/g, function (str, attrName, quot, innerQuot) {
        return (typeof attrName === 'string' ? attrName + '=' : '') + quot + addProtectedText(PATHDATA[tagName] && PATHDATA[tagName][attrName] ? function (pathData) {
          var lastCmd,
              lastArg = '';
          return (pathData.match(RE_CMD_LINE) || []).reduce(function (cmds, cmdLine) {
            var cmd = cmdLine.substr(0, 1),
                args,
                cmdChr = cmd === lastCmd || lastCmd === 'm' && cmd === 'l' || lastCmd === 'M' && cmd === 'L' ? '' : cmd;
            args = (cmdLine.match(RE_ARGS) || []).reduce(function (args, arg, i) {
              var exponent = '',
                  separator = '';
              arg = arg.replace(RE_EXPONENT, function (s) {
                exponent = s;
                return '';
              }).replace(/^\+/, '').replace(/^(\-)?0+/, '$1').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '').replace(/^\-?$/, '0');
              if ((cmdChr === '' || i > 0) && arg.substr(0, 1) !== '-' && (arg.substr(0, 1) === '.' && !/e|\./i.test(lastArg) || /^\d/.test(arg))) {
                separator = ' ';
              }
              exponent = exponent.replace(/^(e)\+/i, '$1').replace(/^(e\-?)0+/i, '$1').replace(/^e\-?$/i, '');
              return args + separator + (lastArg = arg + exponent);
            }, '');
            lastCmd = cmd;
            return cmds + cmdChr + args;
          }, '');
        }(innerQuot) : innerQuot) + quot;
      }) + '>';
    });
    embedElms = Object.keys(PHRASING_ELEMENTS).filter(function (tagName) {
      return PHRASING_ELEMENTS[tagName].embed;
    }).join('|');
    html = html.replace(new RegExp('(?:[\\t ]*[\\n\\r][^\\S\\f]*)?(<[^\\S\\f]*\\/?[^\\S\\f]*(?:' + embedElms + ')\\b[^>]*>)(?:[\\t ]*[\\n\\r][^\\S\\f]*)?', 'ig'), '$1');
    html = html.replace(/[\n\r\t ]+/g, ' ').replace(/^ +| +$/g, '');
    html = html.replace(/<([^>]+)>/g, function (str, tagInner) {
      tagInner = tagInner.replace(/^ +| +$/g, '').replace(/(?: *\/ +| +\/ *)/g, '/').replace(/ *= */g, '=');
      ;
      return '<' + tagInner + '>';
    });
    html = html.replace(/( *)([^]*?)( *)(< *(\/)? *([^ >\/]+)[^>]*>)/g, function (str, leadSpace, text, trailSpace, tag, isEnd, tagName) {
      tagName = tagName.toLowerCase();
      if (tagName === 'br' || tagName === 'wbr') {
        htmlWk += (text ? lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text : lastPhTags) + tag;
        lastLeadSpace = lastTrailSpace = lastPhTags = '';
        lastIsEnd = true;
      } else if (PHRASING_ELEMENTS[tagName]) {
        if (PHRASING_ELEMENTS[tagName].altBlock) {
          if (isEnd) {
            htmlWk += (text ? lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text : lastPhTags) + tag;
          } else {
            htmlWk += (lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text) + (text ? trailSpace : '') + tag;
          }
          lastLeadSpace = lastTrailSpace = lastPhTags = '';
          lastIsEnd = true;
        } else if (PHRASING_ELEMENTS[tagName].empty) {
          htmlWk += (lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text) + (text ? trailSpace : '') + tag;
          lastLeadSpace = lastTrailSpace = lastPhTags = '';
          lastIsEnd = true;
        } else {
          if (isEnd) {
            if (text) {
              htmlWk += lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text;
              lastLeadSpace = '';
              lastTrailSpace = trailSpace;
              lastPhTags = tag;
            } else {
              if (lastIsEnd) {
                lastTrailSpace = lastTrailSpace || leadSpace;
                lastPhTags += tag;
              } else {
                htmlWk += lastPhTags;
                lastTrailSpace = lastLeadSpace || leadSpace;
                lastLeadSpace = '';
                lastPhTags = tag;
              }
            }
          } else {
            if (text) {
              htmlWk += lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text;
              lastLeadSpace = trailSpace;
              lastTrailSpace = '';
              lastPhTags = tag;
            } else {
              if (lastIsEnd) {
                htmlWk += lastPhTags;
                lastLeadSpace = lastTrailSpace || leadSpace;
                lastTrailSpace = '';
                lastPhTags = tag;
              } else {
                lastLeadSpace = lastLeadSpace || leadSpace;
                lastPhTags += tag;
              }
            }
          }
          lastIsEnd = isEnd;
        }
      } else {
        htmlWk += (text ? lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text : lastPhTags) + tag;
        lastLeadSpace = lastTrailSpace = lastPhTags = '';
        lastIsEnd = true;
      }
      return '';
    }).replace(/^( *)([^]*)$/, function (str, leadSpace, text) {
      htmlWk += text ? lastIsEnd ? lastPhTags + (lastTrailSpace || leadSpace) + text : (lastLeadSpace || leadSpace) + lastPhTags + text : lastPhTags;
      return '';
    });
    html = htmlWk;
    if (options && typeof options.edit === 'function') {
      html = options.edit(html);
      if (typeof html !== 'string') {
        html = '';
      }
    }
    html = replaceComplete(html, /\f(\!)?(\d+)\x07/g, function (str, p1, p2) {
      return (p1 ? unprotectedText[p2] : protectedText[p2]) || '';
    });
    return html;
  };
});
System.registerDynamic("npm:htmlclean@3.0.2.js", ["npm:htmlclean@3.0.2/lib/htmlclean.js"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:htmlclean@3.0.2/lib/htmlclean.js");
});
System.register('htmlclean.js', ['npm:htmlclean@3.0.2.js'], function (_export) {
  'use strict';

  var htmlclean;
  return {
    setters: [function (_npmHtmlclean302Js) {
      htmlclean = _npmHtmlclean302Js['default'];
    }],
    execute: function () {
      _export('htmlclean', htmlclean);
    }
  };
});
