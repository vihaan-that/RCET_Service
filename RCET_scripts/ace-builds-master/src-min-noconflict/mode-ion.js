ace.define("ace/mode/ion_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){var e="TRUE|FALSE",t=e,n="NULL.NULL|NULL.BOOL|NULL.INT|NULL.FLOAT|NULL.DECIMAL|NULL.TIMESTAMP|NULL.STRING|NULL.SYMBOL|NULL.BLOB|NULL.CLOB|NULL.STRUCT|NULL.LIST|NULL.SEXP|NULL",r=n,i=this.createKeywordMapper({"constant.language.bool.ion":t,"constant.language.null.ion":r},"constant.other.symbol.identifier.ion",!0),s={token:i,regex:"\\b\\w+(?:\\.\\w+)?\\b"};this.$rules={start:[{include:"value"}],value:[{include:"whitespace"},{include:"comment"},{include:"annotation"},{include:"string"},{include:"number"},{include:"keywords"},{include:"symbol"},{include:"clob"},{include:"blob"},{include:"struct"},{include:"list"},{include:"sexp"}],sexp:[{token:"punctuation.definition.sexp.begin.ion",regex:"\\(",push:[{token:"punctuation.definition.sexp.end.ion",regex:"\\)",next:"pop"},{include:"comment"},{include:"value"},{token:"storage.type.symbol.operator.ion",regex:"[\\!\\#\\%\\&\\*\\+\\-\\./\\;\\<\\=\\>\\?\\@\\^\\`\\|\\~]+"}]}],comment:[{token:"comment.line.ion",regex:"//[^\\n]*"},{token:"comment.block.ion",regex:"/\\*",push:[{token:"comment.block.ion",regex:"[*]/",next:"pop"},{token:"comment.block.ion",regex:"[^*/]+"},{token:"comment.block.ion",regex:"[*/]+"}]}],list:[{token:"punctuation.definition.list.begin.ion",regex:"\\[",push:[{token:"punctuation.definition.list.end.ion",regex:"\\]",next:"pop"},{include:"comment"},{include:"value"},{token:"punctuation.definition.list.separator.ion",regex:","}]}],struct:[{token:"punctuation.definition.struct.begin.ion",regex:"\\{",push:[{token:"punctuation.definition.struct.end.ion",regex:"\\}",next:"pop"},{include:"comment"},{include:"value"},{token:"punctuation.definition.struct.separator.ion",regex:",|:"}]}],blob:[{token:["punctuation.definition.blob.begin.ion","string.other.blob.ion","punctuation.definition.blob.end.ion"],regex:'(\\{\\{)([^"]*)(\\}\\})'}],clob:[{token:["punctuation.definition.clob.begin.ion","string.other.clob.ion","punctuation.definition.clob.end.ion"],regex:'(\\{\\{)("[^"]*")(\\}\\})'}],symbol:[{token:"storage.type.symbol.quoted.ion",regex:"(['])((?:(?:\\\\')|(?:[^']))*?)(['])"},{token:"storage.type.symbol.identifier.ion",regex:"[\\$_a-zA-Z][\\$_a-zA-Z0-9]*"}],number:[{token:"constant.numeric.timestamp.ion",regex:"\\d{4}(?:-\\d{2})?(?:-\\d{2})?T(?:\\d{2}:\\d{2})(?::\\d{2})?(?:\\.\\d+)?(?:Z|[-+]\\d{2}:\\d{2})?"},{token:"constant.numeric.timestamp.ion",regex:"\\d{4}-\\d{2}-\\d{2}T?"},{token:"constant.numeric.integer.binary.ion",regex:"-?0[bB][01](?:_?[01])*"},{token:"constant.numeric.integer.hex.ion",regex:"-?0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*"},{token:"constant.numeric.float.ion",regex:"-?(?:0|[1-9](?:_?\\d)*)(?:\\.(?:\\d(?:_?\\d)*)?)?(?:[eE][+-]?\\d+)"},{token:"constant.numeric.float.ion",regex:"(?:[-+]inf)|(?:nan)"},{token:"constant.numeric.decimal.ion",regex:"-?(?:0|[1-9](?:_?\\d)*)(?:(?:(?:\\.(?:\\d(?:_?\\d)*)?)(?:[dD][+-]?\\d+)|\\.(?:\\d(?:_?\\d)*)?)|(?:[dD][+-]?\\d+))"},{token:"constant.numeric.integer.ion",regex:"-?(?:0|[1-9](?:_?\\d)*)"}],string:[{token:["punctuation.definition.string.begin.ion","string.quoted.double.ion","punctuation.definition.string.end.ion"],regex:'(["])((?:(?:\\\\")|(?:[^"]))*?)(["])'},{token:"punctuation.definition.string.begin.ion",regex:"'{3}",push:[{token:"punctuation.definition.string.end.ion",regex:"'{3}",next:"pop"},{token:"string.quoted.triple.ion",regex:"(?:\\\\'|[^'])+"},{token:"string.quoted.triple.ion",regex:"'"}]}],annotation:[{token:["variable.language.annotation.ion","punctuation.definition.annotation.ion"],regex:/('(?:[^'\\]|\\.)*')\s*(::)/},{token:["variable.language.annotation.ion","punctuation.definition.annotation.ion"],regex:"([\\$_a-zA-Z][\\$_a-zA-Z0-9]*)\\s*(::)"}],whitespace:[{token:"text.ion",regex:"\\s+"}]},this.$rules.keywords=[s],this.normalizeRules()};r.inherits(s,i),t.IonHighlightRules=s}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){"use strict";var r=e("../range").Range,i=function(){};(function(){this.checkOutdent=function(e,t){return/^\s+$/.test(e)?/^\s*\}/.test(t):!1},this.autoOutdent=function(e,t){var n=e.getLine(t),i=n.match(/^(\s*\})/);if(!i)return 0;var s=i[1].length,o=e.findMatchingBracket({row:t,column:s});if(!o||o.row==t)return 0;var u=this.$getIndent(e.getLine(o.row));e.replace(new r(t,0,t,s-1),u)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(i.prototype),t.MatchingBraceOutdent=i}),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){"use strict";var r=e("../../lib/oop"),i=e("../../range").Range,s=e("./fold_mode").FoldMode,o=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};r.inherits(o,s),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);if(this.singleLineBlockCommentRe.test(r)&&!this.startRegionRe.test(r)&&!this.tripleStarBlockCommentRe.test(r))return"";var i=this._getFoldWidgetBase(e,t,n);return!i&&this.startRegionRe.test(r)?"start":i},this.getFoldWidgetRange=function(e,t,n,r){var i=e.getLine(n);if(this.startRegionRe.test(i))return this.getCommentRegionBlock(e,i,n);var s=i.match(this.foldingStartMarker);if(s){var o=s.index;if(s[1])return this.openingBracketBlock(e,s[1],n,o);var u=e.getCommentFoldRange(n,o+s[0].length,1);return u&&!u.isMultiLine()&&(r?u=this.getSectionRange(e,n):t!="all"&&(u=null)),u}if(t==="markbegin")return;var s=i.match(this.foldingStopMarker);if(s){var o=s.index+s[0].length;return s[1]?this.closingBracketBlock(e,s[1],n,o):e.getCommentFoldRange(n,o,-1)}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),s=t,o=n.length;t+=1;var u=t,a=e.getLength();while(++t<a){n=e.getLine(t);var f=n.search(/\S/);if(f===-1)continue;if(r>f)break;var l=this.getFoldWidgetRange(e,"all",t);if(l){if(l.start.row<=s)break;if(l.isMultiLine())t=l.end.row;else if(r==f)break}u=t}return new i(s,o,u,e.getLine(u).length)},this.getCommentRegionBlock=function(e,t,n){var r=t.search(/\s*$/),s=e.getLength(),o=n,u=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,a=1;while(++n<s){t=e.getLine(n);var f=u.exec(t);if(!f)continue;f[1]?a--:a++;if(!a)break}var l=n;if(l>o)return new i(o,r,l,t.length)}}.call(o.prototype)}),ace.define("ace/mode/ion",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/ion_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/folding/cstyle"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text").Mode,s=e("./ion_highlight_rules").IonHighlightRules,o=e("./matching_brace_outdent").MatchingBraceOutdent,u=e("./folding/cstyle").FoldMode,a=function(){this.HighlightRules=s,this.$outdent=new o,this.$behaviour=this.$defaultBehaviour,this.foldingRules=new u};r.inherits(a,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t);if(e=="start"){var i=t.match(/^.*[\{\(\[]\s*$/);i&&(r+=n)}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/ion"}.call(a.prototype),t.Mode=a});                (function() {
                    ace.require(["ace/mode/ion"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            