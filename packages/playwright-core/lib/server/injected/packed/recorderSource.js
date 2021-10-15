var pwExport;
(() => {
  'use strict';
  var e = {
      317: (e, t, n) => {
        Object.defineProperty(t, '__esModule', {value: !0}),
          (t.parseCSS = function (e, t) {
            let n;
            try {
              (n = o.tokenize(e)),
                n[n.length - 1] instanceof o.EOFToken ||
                  n.push(new o.EOFToken());
            } catch (t) {
              const n = t.message + ` while parsing selector "${e}"`,
                o = (t.stack || '').indexOf(t.message);
              throw (
                (-1 !== o &&
                  (t.stack =
                    t.stack.substring(0, o) +
                    n +
                    t.stack.substring(o + t.message.length)),
                (t.message = n),
                t)
              );
            }
            const r = n.find(
              (e) =>
                e instanceof o.AtKeywordToken ||
                e instanceof o.BadStringToken ||
                e instanceof o.BadURLToken ||
                e instanceof o.ColumnToken ||
                e instanceof o.CDOToken ||
                e instanceof o.CDCToken ||
                e instanceof o.SemicolonToken ||
                e instanceof o.OpenCurlyToken ||
                e instanceof o.CloseCurlyToken ||
                e instanceof o.URLToken ||
                e instanceof o.PercentageToken,
            );
            if (r)
              throw new Error(
                `Unsupported token "${r.toSource()}" while parsing selector "${e}"`,
              );
            let i = 0;
            const s = new Set();
            function c() {
              return new Error(
                `Unexpected token "${n[
                  i
                ].toSource()}" while parsing selector "${e}"`,
              );
            }
            function l() {
              for (; n[i] instanceof o.WhitespaceToken; ) i++;
            }
            function a(e = i) {
              return n[e] instanceof o.IdentToken;
            }
            function h(e = i) {
              return n[e] instanceof o.CommaToken;
            }
            function u(e = i) {
              return n[e] instanceof o.CloseParenToken;
            }
            function p(e = i) {
              return n[e] instanceof o.DelimToken && '*' === n[e].value;
            }
            function f(e = i) {
              return n[e] instanceof o.EOFToken;
            }
            function d(e = i) {
              return (
                n[e] instanceof o.DelimToken &&
                ['>', '+', '~'].includes(n[e].value)
              );
            }
            function m(e = i) {
              return (
                h(e) ||
                u(e) ||
                f(e) ||
                d(e) ||
                n[e] instanceof o.WhitespaceToken
              );
            }
            function g() {
              const e = [y()];
              for (; l(), h(); ) i++, e.push(y());
              return e;
            }
            function y() {
              return (
                l(),
                (function (e = i) {
                  return n[e] instanceof o.NumberToken;
                })() ||
                (function (e = i) {
                  return n[e] instanceof o.StringToken;
                })()
                  ? n[i++].value
                  : (function () {
                      const e = {simples: []};
                      for (
                        l(),
                          d()
                            ? e.simples.push({
                                selector: {
                                  functions: [{name: 'scope', args: []}],
                                },
                                combinator: '',
                              })
                            : e.simples.push({selector: _(), combinator: ''});
                        ;

                      ) {
                        if ((l(), d()))
                          (e.simples[e.simples.length - 1].combinator =
                            n[i++].value),
                            l();
                        else if (m()) break;
                        e.simples.push({combinator: '', selector: _()});
                      }
                      return e;
                    })()
              );
            }
            function _() {
              let e = '';
              const r = [];
              for (; !m(); )
                if (a() || p()) e += n[i++].toSource();
                else if (n[i] instanceof o.HashToken) e += n[i++].toSource();
                else if (n[i] instanceof o.DelimToken && '.' === n[i].value) {
                  if ((i++, !a())) throw c();
                  e += '.' + n[i++].toSource();
                } else if (n[i] instanceof o.ColonToken)
                  if ((i++, a()))
                    if (t.has(n[i].value.toLowerCase())) {
                      const e = n[i++].value.toLowerCase();
                      r.push({name: e, args: []}), s.add(e);
                    } else e += ':' + n[i++].toSource();
                  else {
                    if (!(n[i] instanceof o.FunctionToken)) throw c();
                    {
                      const o = n[i++].value.toLowerCase();
                      if (
                        (t.has(o)
                          ? (r.push({name: o, args: g()}), s.add(o))
                          : (e += `:${o}(${v()})`),
                        l(),
                        !u())
                      )
                        throw c();
                      i++;
                    }
                  }
                else {
                  if (!(n[i] instanceof o.OpenSquareToken)) throw c();
                  for (
                    e += '[', i++;
                    !(n[i] instanceof o.CloseSquareToken || f());

                  )
                    e += n[i++].toSource();
                  if (!(n[i] instanceof o.CloseSquareToken)) throw c();
                  (e += ']'), i++;
                }
              if (!e && !r.length) throw c();
              return {css: e || void 0, functions: r};
            }
            function v() {
              let e = '';
              for (; !u() && !f(); ) e += n[i++].toSource();
              return e;
            }
            const w = g();
            if (!f()) throw new Error(`Error while parsing selector "${e}"`);
            if (w.some((e) => 'object' != typeof e || !('simples' in e)))
              throw new Error(`Error while parsing selector "${e}"`);
            return {selector: w, names: Array.from(s)};
          }),
          (t.serializeSelector = function e(t) {
            return t
              .map((t) =>
                'string' == typeof t
                  ? `"${t}"`
                  : 'number' == typeof t
                  ? String(t)
                  : t.simples
                      .map(({selector: t, combinator: n}) => {
                        let o = t.css || '';
                        return (
                          (o += t.functions
                            .map((t) => `:${t.name}(${e(t.args)})`)
                            .join('')),
                          n && (o += ' ' + n),
                          o
                        );
                      })
                      .join(' '),
              )
              .join(', ');
          });
        var o = (function (e, t) {
          if (e && e.__esModule) return e;
          if (null === e || ('object' != typeof e && 'function' != typeof e))
            return {default: e};
          var n = r(t);
          if (n && n.has(e)) return n.get(e);
          var o = {},
            i = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var s in e)
            if ('default' !== s && Object.prototype.hasOwnProperty.call(e, s)) {
              var c = i ? Object.getOwnPropertyDescriptor(e, s) : null;
              c && (c.get || c.set)
                ? Object.defineProperty(o, s, c)
                : (o[s] = e[s]);
            }
          return (o.default = e), n && n.set(e, o), o;
        })(n(503));
        function r(e) {
          if ('function' != typeof WeakMap) return null;
          var t = new WeakMap(),
            n = new WeakMap();
          return (r = function (e) {
            return e ? n : t;
          })(e);
        }
      },
      503: (e, t) => {
        var n, o;
        (n = function (e) {
          var t = function (e, t, n) {
            return e >= t && e <= n;
          };
          function n(e) {
            return t(e, 48, 57);
          }
          function o(e) {
            return n(e) || t(e, 65, 70) || t(e, 97, 102);
          }
          function r(e) {
            return (
              (function (e) {
                return t(e, 65, 90);
              })(e) ||
              (function (e) {
                return t(e, 97, 122);
              })(e)
            );
          }
          function i(e) {
            return (
              r(e) ||
              (function (e) {
                return e >= 128;
              })(e) ||
              95 == e
            );
          }
          function s(e) {
            return i(e) || n(e) || 45 == e;
          }
          function c(e) {
            return t(e, 0, 8) || 11 == e || t(e, 14, 31) || 127 == e;
          }
          function l(e) {
            return 10 == e;
          }
          function a(e) {
            return l(e) || 9 == e || 32 == e;
          }
          var h = function (e) {
            this.message = e;
          };
          function u(e) {
            if (e <= 65535) return String.fromCharCode(e);
            e -= Math.pow(2, 16);
            var t = Math.floor(e / Math.pow(2, 10)) + 55296,
              n = (e % Math.pow(2, 10)) + 56320;
            return String.fromCharCode(t) + String.fromCharCode(n);
          }
          function p() {
            throw 'Abstract Base Class';
          }
          function f() {
            return this;
          }
          function d() {
            return this;
          }
          function m() {
            return this;
          }
          function g() {
            return this;
          }
          function y() {
            return this;
          }
          function _() {
            return this;
          }
          function v() {
            return this;
          }
          function w() {
            return this;
          }
          function E() {
            throw 'Abstract Base Class';
          }
          function S() {
            return (this.value = '{'), (this.mirror = '}'), this;
          }
          function T() {
            return (this.value = '}'), (this.mirror = '{'), this;
          }
          function b() {
            return (this.value = '['), (this.mirror = ']'), this;
          }
          function k() {
            return (this.value = ']'), (this.mirror = '['), this;
          }
          function M() {
            return (this.value = '('), (this.mirror = ')'), this;
          }
          function x() {
            return (this.value = ')'), (this.mirror = '('), this;
          }
          function C() {
            return this;
          }
          function P() {
            return this;
          }
          function A() {
            return this;
          }
          function N() {
            return this;
          }
          function O() {
            return this;
          }
          function R() {
            return this;
          }
          function j() {
            return this;
          }
          function I(e) {
            return (this.value = u(e)), this;
          }
          function D() {
            throw 'Abstract Base Class';
          }
          function L(e) {
            this.value = e;
          }
          function $(e) {
            (this.value = e), (this.mirror = ')');
          }
          function U(e) {
            this.value = e;
          }
          function q(e) {
            (this.value = e), (this.type = 'unrestricted');
          }
          function G(e) {
            this.value = e;
          }
          function F(e) {
            this.value = e;
          }
          function H() {
            (this.value = null), (this.type = 'integer'), (this.repr = '');
          }
          function K() {
            (this.value = null), (this.repr = '');
          }
          function B() {
            (this.value = null),
              (this.type = 'integer'),
              (this.repr = ''),
              (this.unit = '');
          }
          function W(e) {
            for (
              var n = '', o = (e = '' + e).charCodeAt(0), r = 0;
              r < e.length;
              r++
            ) {
              var i = e.charCodeAt(r);
              if (0 == i)
                throw new h('Invalid character: the input contains U+0000.');
              t(i, 1, 31) ||
              127 == i ||
              (0 == r && t(i, 48, 57)) ||
              (1 == r && t(i, 48, 57) && 45 == o)
                ? (n += '\\' + i.toString(16) + ' ')
                : i >= 128 ||
                  45 == i ||
                  95 == i ||
                  t(i, 48, 57) ||
                  t(i, 65, 90) ||
                  t(i, 97, 122)
                ? (n += e[r])
                : (n += '\\' + e[r]);
            }
            return n;
          }
          function J(e) {
            e = '' + e;
            for (var n = '', o = 0; o < e.length; o++) {
              var r = e.charCodeAt(o);
              if (0 == r)
                throw new h('Invalid character: the input contains U+0000.');
              t(r, 1, 31) || 127 == r
                ? (n += '\\' + r.toString(16) + ' ')
                : (n += 34 == r || 92 == r ? '\\' + e[o] : e[o]);
            }
            return n;
          }
          ((h.prototype = new Error()).name = 'InvalidCharacterError'),
            (p.prototype.toJSON = function () {
              return {token: this.tokenType};
            }),
            (p.prototype.toString = function () {
              return this.tokenType;
            }),
            (p.prototype.toSource = function () {
              return '' + this;
            }),
            (f.prototype = Object.create(p.prototype)),
            (f.prototype.tokenType = 'BADSTRING'),
            (d.prototype = Object.create(p.prototype)),
            (d.prototype.tokenType = 'BADURL'),
            (m.prototype = Object.create(p.prototype)),
            (m.prototype.tokenType = 'WHITESPACE'),
            (m.prototype.toString = function () {
              return 'WS';
            }),
            (m.prototype.toSource = function () {
              return ' ';
            }),
            (g.prototype = Object.create(p.prototype)),
            (g.prototype.tokenType = 'CDO'),
            (g.prototype.toSource = function () {
              return '\x3c!--';
            }),
            (y.prototype = Object.create(p.prototype)),
            (y.prototype.tokenType = 'CDC'),
            (y.prototype.toSource = function () {
              return '--\x3e';
            }),
            (_.prototype = Object.create(p.prototype)),
            (_.prototype.tokenType = ':'),
            (v.prototype = Object.create(p.prototype)),
            (v.prototype.tokenType = ';'),
            (w.prototype = Object.create(p.prototype)),
            (w.prototype.tokenType = ','),
            (E.prototype = Object.create(p.prototype)),
            (S.prototype = Object.create(E.prototype)),
            (S.prototype.tokenType = '{'),
            (T.prototype = Object.create(E.prototype)),
            (T.prototype.tokenType = '}'),
            (b.prototype = Object.create(E.prototype)),
            (b.prototype.tokenType = '['),
            (k.prototype = Object.create(E.prototype)),
            (k.prototype.tokenType = ']'),
            (M.prototype = Object.create(E.prototype)),
            (M.prototype.tokenType = '('),
            (x.prototype = Object.create(E.prototype)),
            (x.prototype.tokenType = ')'),
            (C.prototype = Object.create(p.prototype)),
            (C.prototype.tokenType = '~='),
            (P.prototype = Object.create(p.prototype)),
            (P.prototype.tokenType = '|='),
            (A.prototype = Object.create(p.prototype)),
            (A.prototype.tokenType = '^='),
            (N.prototype = Object.create(p.prototype)),
            (N.prototype.tokenType = '$='),
            (O.prototype = Object.create(p.prototype)),
            (O.prototype.tokenType = '*='),
            (R.prototype = Object.create(p.prototype)),
            (R.prototype.tokenType = '||'),
            (j.prototype = Object.create(p.prototype)),
            (j.prototype.tokenType = 'EOF'),
            (j.prototype.toSource = function () {
              return '';
            }),
            (I.prototype = Object.create(p.prototype)),
            (I.prototype.tokenType = 'DELIM'),
            (I.prototype.toString = function () {
              return 'DELIM(' + this.value + ')';
            }),
            (I.prototype.toJSON = function () {
              var e =
                this.constructor.prototype.constructor.prototype.toJSON.call(
                  this,
                );
              return (e.value = this.value), e;
            }),
            (I.prototype.toSource = function () {
              return '\\' == this.value ? '\\\n' : this.value;
            }),
            (D.prototype = Object.create(p.prototype)),
            (D.prototype.ASCIIMatch = function (e) {
              return this.value.toLowerCase() == e.toLowerCase();
            }),
            (D.prototype.toJSON = function () {
              var e =
                this.constructor.prototype.constructor.prototype.toJSON.call(
                  this,
                );
              return (e.value = this.value), e;
            }),
            (L.prototype = Object.create(D.prototype)),
            (L.prototype.tokenType = 'IDENT'),
            (L.prototype.toString = function () {
              return 'IDENT(' + this.value + ')';
            }),
            (L.prototype.toSource = function () {
              return W(this.value);
            }),
            ($.prototype = Object.create(D.prototype)),
            ($.prototype.tokenType = 'FUNCTION'),
            ($.prototype.toString = function () {
              return 'FUNCTION(' + this.value + ')';
            }),
            ($.prototype.toSource = function () {
              return W(this.value) + '(';
            }),
            (U.prototype = Object.create(D.prototype)),
            (U.prototype.tokenType = 'AT-KEYWORD'),
            (U.prototype.toString = function () {
              return 'AT(' + this.value + ')';
            }),
            (U.prototype.toSource = function () {
              return '@' + W(this.value);
            }),
            (q.prototype = Object.create(D.prototype)),
            (q.prototype.tokenType = 'HASH'),
            (q.prototype.toString = function () {
              return 'HASH(' + this.value + ')';
            }),
            (q.prototype.toJSON = function () {
              var e =
                this.constructor.prototype.constructor.prototype.toJSON.call(
                  this,
                );
              return (e.value = this.value), (e.type = this.type), e;
            }),
            (q.prototype.toSource = function () {
              return 'id' == this.type
                ? '#' + W(this.value)
                : '#' +
                    (function (e) {
                      for (
                        var n = '', o = ((e = '' + e).charCodeAt(0), 0);
                        o < e.length;
                        o++
                      ) {
                        var r = e.charCodeAt(o);
                        if (0 == r)
                          throw new h(
                            'Invalid character: the input contains U+0000.',
                          );
                        r >= 128 ||
                        45 == r ||
                        95 == r ||
                        t(r, 48, 57) ||
                        t(r, 65, 90) ||
                        t(r, 97, 122)
                          ? (n += e[o])
                          : (n += '\\' + r.toString(16) + ' ');
                      }
                      return n;
                    })(this.value);
            }),
            (G.prototype = Object.create(D.prototype)),
            (G.prototype.tokenType = 'STRING'),
            (G.prototype.toString = function () {
              return '"' + J(this.value) + '"';
            }),
            (F.prototype = Object.create(D.prototype)),
            (F.prototype.tokenType = 'URL'),
            (F.prototype.toString = function () {
              return 'URL(' + this.value + ')';
            }),
            (F.prototype.toSource = function () {
              return 'url("' + J(this.value) + '")';
            }),
            (H.prototype = Object.create(p.prototype)),
            (H.prototype.tokenType = 'NUMBER'),
            (H.prototype.toString = function () {
              return 'integer' == this.type
                ? 'INT(' + this.value + ')'
                : 'NUMBER(' + this.value + ')';
            }),
            (H.prototype.toJSON = function () {
              var e =
                this.constructor.prototype.constructor.prototype.toJSON.call(
                  this,
                );
              return (
                (e.value = this.value),
                (e.type = this.type),
                (e.repr = this.repr),
                e
              );
            }),
            (H.prototype.toSource = function () {
              return this.repr;
            }),
            (K.prototype = Object.create(p.prototype)),
            (K.prototype.tokenType = 'PERCENTAGE'),
            (K.prototype.toString = function () {
              return 'PERCENTAGE(' + this.value + ')';
            }),
            (K.prototype.toJSON = function () {
              var e =
                this.constructor.prototype.constructor.prototype.toJSON.call(
                  this,
                );
              return (e.value = this.value), (e.repr = this.repr), e;
            }),
            (K.prototype.toSource = function () {
              return this.repr + '%';
            }),
            (B.prototype = Object.create(p.prototype)),
            (B.prototype.tokenType = 'DIMENSION'),
            (B.prototype.toString = function () {
              return 'DIM(' + this.value + ',' + this.unit + ')';
            }),
            (B.prototype.toJSON = function () {
              var e =
                this.constructor.prototype.constructor.prototype.toJSON.call(
                  this,
                );
              return (
                (e.value = this.value),
                (e.type = this.type),
                (e.repr = this.repr),
                (e.unit = this.unit),
                e
              );
            }),
            (B.prototype.toSource = function () {
              var e = this.repr,
                n = W(this.unit);
              return (
                'e' != n[0].toLowerCase() ||
                  ('-' != n[1] && !t(n.charCodeAt(1), 48, 57)) ||
                  (n = '\\65 ' + n.slice(1, n.length)),
                e + n
              );
            }),
            (e.tokenize = function (e) {
              e = (function (e) {
                for (var n = [], o = 0; o < e.length; o++) {
                  var r = e.charCodeAt(o);
                  if (
                    (13 == r && 10 == e.charCodeAt(o + 1) && ((r = 10), o++),
                    (13 != r && 12 != r) || (r = 10),
                    0 == r && (r = 65533),
                    t(r, 55296, 56319) && t(e.charCodeAt(o + 1), 56320, 57343))
                  ) {
                    var i = r - 55296,
                      s = e.charCodeAt(o + 1) - 56320;
                    (r = Math.pow(2, 16) + i * Math.pow(2, 10) + s), o++;
                  }
                  n.push(r);
                }
                return n;
              })(e);
              for (
                var r,
                  h = -1,
                  p = [],
                  E = 0,
                  D = 0,
                  W = 0,
                  J = {line: E, column: D},
                  Q = function (t) {
                    return t >= e.length ? -1 : e[t];
                  },
                  z = function (e) {
                    if ((void 0 === e && (e = 1), e > 3))
                      throw 'Spec Error: no more than three codepoints of lookahead.';
                    return Q(h + e);
                  },
                  V = function (e) {
                    return (
                      void 0 === e && (e = 1),
                      l((r = Q((h += e))))
                        ? ((E += 1), (W = D), (D = 0))
                        : (D += e),
                      !0
                    );
                  },
                  X = function () {
                    return (
                      (h -= 1),
                      l(r) ? ((E -= 1), (D = W)) : (D -= 1),
                      (J.line = E),
                      (J.column = D),
                      !0
                    );
                  },
                  Y = function (e) {
                    return void 0 === e && (e = r), -1 == e;
                  },
                  Z = function () {
                    return (
                      console.log(
                        'Parse error at index ' +
                          h +
                          ', processing codepoint 0x' +
                          r.toString(16) +
                          '.',
                      ),
                      !0
                    );
                  },
                  ee = function () {
                    if ((te(), V(), a(r))) {
                      for (; a(z()); ) V();
                      return new m();
                    }
                    if (34 == r) return re();
                    if (35 == r) {
                      if (s(z()) || ce(z(1), z(2))) {
                        var e = new q();
                        return (
                          ae(z(1), z(2), z(3)) && (e.type = 'id'),
                          (e.value = pe()),
                          e
                        );
                      }
                      return new I(r);
                    }
                    return 36 == r
                      ? 61 == z()
                        ? (V(), new N())
                        : new I(r)
                      : 39 == r
                      ? re()
                      : 40 == r
                      ? new M()
                      : 41 == r
                      ? new x()
                      : 42 == r
                      ? 61 == z()
                        ? (V(), new O())
                        : new I(r)
                      : 43 == r
                      ? ue()
                        ? (X(), ne())
                        : new I(r)
                      : 44 == r
                      ? new w()
                      : 45 == r
                      ? ue()
                        ? (X(), ne())
                        : 45 == z(1) && 62 == z(2)
                        ? (V(2), new y())
                        : he()
                        ? (X(), oe())
                        : new I(r)
                      : 46 == r
                      ? ue()
                        ? (X(), ne())
                        : new I(r)
                      : 58 == r
                      ? new _()
                      : 59 == r
                      ? new v()
                      : 60 == r
                      ? 33 == z(1) && 45 == z(2) && 45 == z(3)
                        ? (V(3), new g())
                        : new I(r)
                      : 64 == r
                      ? ae(z(1), z(2), z(3))
                        ? new U(pe())
                        : new I(r)
                      : 91 == r
                      ? new b()
                      : 92 == r
                      ? le()
                        ? (X(), oe())
                        : (Z(), new I(r))
                      : 93 == r
                      ? new k()
                      : 94 == r
                      ? 61 == z()
                        ? (V(), new A())
                        : new I(r)
                      : 123 == r
                      ? new S()
                      : 124 == r
                      ? 61 == z()
                        ? (V(), new P())
                        : 124 == z()
                        ? (V(), new R())
                        : new I(r)
                      : 125 == r
                      ? new T()
                      : 126 == r
                      ? 61 == z()
                        ? (V(), new C())
                        : new I(r)
                      : n(r)
                      ? (X(), ne())
                      : i(r)
                      ? (X(), oe())
                      : Y()
                      ? new j()
                      : new I(r);
                  },
                  te = function () {
                    for (; 47 == z(1) && 42 == z(2); )
                      for (V(2); ; ) {
                        if ((V(), 42 == r && 47 == z())) {
                          V();
                          break;
                        }
                        if (Y()) return void Z();
                      }
                  },
                  ne = function () {
                    var e,
                      t = fe();
                    return ae(z(1), z(2), z(3))
                      ? (((e = new B()).value = t.value),
                        (e.repr = t.repr),
                        (e.type = t.type),
                        (e.unit = pe()),
                        e)
                      : 37 == z()
                      ? (V(),
                        ((e = new K()).value = t.value),
                        (e.repr = t.repr),
                        e)
                      : (((e = new H()).value = t.value),
                        (e.repr = t.repr),
                        (e.type = t.type),
                        e);
                  },
                  oe = function () {
                    var e = pe();
                    if ('url' == e.toLowerCase() && 40 == z()) {
                      for (V(); a(z(1)) && a(z(2)); ) V();
                      return 34 == z() || 39 == z()
                        ? new $(e)
                        : !a(z()) || (34 != z(2) && 39 != z(2))
                        ? ie()
                        : new $(e);
                    }
                    return 40 == z() ? (V(), new $(e)) : new L(e);
                  },
                  re = function (e) {
                    void 0 === e && (e = r);
                    for (var t = ''; V(); ) {
                      if (r == e || Y()) return new G(t);
                      if (l(r)) return Z(), X(), new f();
                      92 == r
                        ? Y(z()) || (l(z()) ? V() : (t += u(se())))
                        : (t += u(r));
                    }
                  },
                  ie = function () {
                    for (var e = new F(''); a(z()); ) V();
                    if (Y(z())) return e;
                    for (; V(); ) {
                      if (41 == r || Y()) return e;
                      if (a(r)) {
                        for (; a(z()); ) V();
                        return 41 == z() || Y(z()) ? (V(), e) : (me(), new d());
                      }
                      if (34 == r || 39 == r || 40 == r || c(r))
                        return Z(), me(), new d();
                      if (92 == r) {
                        if (!le()) return Z(), me(), new d();
                        e.value += u(se());
                      } else e.value += u(r);
                    }
                  },
                  se = function () {
                    if ((V(), o(r))) {
                      for (var e = [r], t = 0; t < 5 && o(z()); t++)
                        V(), e.push(r);
                      a(z()) && V();
                      var n = parseInt(
                        e
                          .map(function (e) {
                            return String.fromCharCode(e);
                          })
                          .join(''),
                        16,
                      );
                      return n > 1114111 && (n = 65533), n;
                    }
                    return Y() ? 65533 : r;
                  },
                  ce = function (e, t) {
                    return 92 == e && !l(t);
                  },
                  le = function () {
                    return ce(r, z());
                  },
                  ae = function (e, t, n) {
                    return 45 == e
                      ? i(t) || 45 == t || ce(t, n)
                      : !!i(e) || (92 == e && ce(e, t));
                  },
                  he = function () {
                    return ae(r, z(1), z(2));
                  },
                  ue = function () {
                    return (
                      (e = r),
                      (t = z(1)),
                      (o = z(2)),
                      43 == e || 45 == e
                        ? !!n(t) || !(46 != t || !n(o))
                        : 46 == e
                        ? !!n(t)
                        : !!n(e)
                    );
                    var e, t, o;
                  },
                  pe = function () {
                    for (var e = ''; V(); )
                      if (s(r)) e += u(r);
                      else {
                        if (!le()) return X(), e;
                        e += u(se());
                      }
                  },
                  fe = function () {
                    var e = [],
                      t = 'integer';
                    for (
                      (43 != z() && 45 != z()) || (V(), (e += u(r)));
                      n(z());

                    )
                      V(), (e += u(r));
                    if (46 == z(1) && n(z(2)))
                      for (
                        V(), e += u(r), V(), e += u(r), t = 'number';
                        n(z());

                      )
                        V(), (e += u(r));
                    var o = z(1),
                      i = z(2),
                      s = z(3);
                    if ((69 != o && 101 != o) || !n(i)) {
                      if ((69 == o || 101 == o) && (43 == i || 45 == i) && n(s))
                        for (
                          V(),
                            e += u(r),
                            V(),
                            e += u(r),
                            V(),
                            e += u(r),
                            t = 'number';
                          n(z());

                        )
                          V(), (e += u(r));
                    } else
                      for (
                        V(), e += u(r), V(), e += u(r), t = 'number';
                        n(z());

                      )
                        V(), (e += u(r));
                    return {type: t, value: de(e), repr: e};
                  },
                  de = function (e) {
                    return +e;
                  },
                  me = function () {
                    for (; V(); ) {
                      if (41 == r || Y()) return;
                      le() && se();
                    }
                  },
                  ge = 0;
                !Y(z());

              )
                if ((p.push(ee()), ++ge > 2 * e.length))
                  return "I'm infinite-looping!";
              return p;
            }),
            (e.IdentToken = L),
            (e.FunctionToken = $),
            (e.AtKeywordToken = U),
            (e.HashToken = q),
            (e.StringToken = G),
            (e.BadStringToken = f),
            (e.URLToken = F),
            (e.BadURLToken = d),
            (e.DelimToken = I),
            (e.NumberToken = H),
            (e.PercentageToken = K),
            (e.DimensionToken = B),
            (e.IncludeMatchToken = C),
            (e.DashMatchToken = P),
            (e.PrefixMatchToken = A),
            (e.SuffixMatchToken = N),
            (e.SubstringMatchToken = O),
            (e.ColumnToken = R),
            (e.WhitespaceToken = m),
            (e.CDOToken = g),
            (e.CDCToken = y),
            (e.ColonToken = _),
            (e.SemicolonToken = v),
            (e.CommaToken = w),
            (e.OpenParenToken = M),
            (e.CloseParenToken = x),
            (e.OpenSquareToken = b),
            (e.CloseSquareToken = k),
            (e.OpenCurlyToken = S),
            (e.CloseCurlyToken = T),
            (e.EOFToken = j),
            (e.CSSParserToken = p),
            (e.GroupingToken = E);
        }),
          void 0 === (o = n.apply(t, [t])) || (e.exports = o);
      },
      461: (e, t, n) => {
        Object.defineProperty(t, '__esModule', {value: !0}),
          (t.parseSelector = function (e) {
            const t = (function (e) {
                let t,
                  n = 0,
                  o = 0;
                const r = {parts: []},
                  i = () => {
                    const t = e.substring(o, n).trim(),
                      i = t.indexOf('=');
                    let s, c;
                    -1 !== i &&
                    t
                      .substring(0, i)
                      .trim()
                      .match(/^[a-zA-Z_0-9-+:*]+$/)
                      ? ((s = t.substring(0, i).trim()),
                        (c = t.substring(i + 1)))
                      : (t.length > 1 &&
                          '"' === t[0] &&
                          '"' === t[t.length - 1]) ||
                        (t.length > 1 &&
                          "'" === t[0] &&
                          "'" === t[t.length - 1])
                      ? ((s = 'text'), (c = t))
                      : /^\(*\/\//.test(t) || t.startsWith('..')
                      ? ((s = 'xpath'), (c = t))
                      : ((s = 'css'), (c = t));
                    let l = !1;
                    if (
                      ('*' === s[0] && ((l = !0), (s = s.substring(1))),
                      r.parts.push({name: s, body: c}),
                      l)
                    ) {
                      if (void 0 !== r.capture)
                        throw new Error(
                          'Only one of the selectors can capture using * modifier',
                        );
                      r.capture = r.parts.length - 1;
                    }
                  };
                if (!e.includes('>>')) return (n = e.length), i(), r;
                for (; n < e.length; ) {
                  const r = e[n];
                  '\\' === r && n + 1 < e.length
                    ? (n += 2)
                    : r === t
                    ? ((t = void 0), n++)
                    : t || ('"' !== r && "'" !== r && '`' !== r)
                    ? t || '>' !== r || '>' !== e[n + 1]
                      ? n++
                      : (i(), (n += 2), (o = n))
                    : ((t = r), n++);
                }
                return i(), r;
              })(e),
              n = t.parts.map((e) =>
                'css' === e.name || 'css:light' === e.name
                  ? ('css:light' === e.name &&
                      (e.body = ':light(' + e.body + ')'),
                    {name: 'css', body: (0, o.parseCSS)(e.body, r).selector})
                  : e,
              );
            return {selector: e, capture: t.capture, parts: n};
          }),
          (t.customCSSNames = void 0);
        var o = n(317);
        const r = new Set([
          'not',
          'is',
          'where',
          'has',
          'scope',
          'light',
          'visible',
          'text',
          'text-matches',
          'text-is',
          'has-text',
          'above',
          'below',
          'right-of',
          'left-of',
          'near',
          'nth-match',
        ]);
        t.customCSSNames = r;
      },
      848: (e, t, n) => {
        Object.defineProperty(t, '__esModule', {value: !0}),
          (t.createLaxTextMatcher = d),
          (t.createStrictTextMatcher = m),
          (t.createRegexTextMatcher = g),
          (t.elementText = _),
          (t.elementMatchesText = v),
          (t.parentElementOrShadowHost = x),
          (t.isVisible = A),
          (t.SelectorEvaluatorImpl = void 0);
        var o = n(461);
        t.SelectorEvaluatorImpl = class {
          constructor(e) {
            (this._engines = new Map()),
              (this._cacheQueryCSS = new Map()),
              (this._cacheMatches = new Map()),
              (this._cacheQuery = new Map()),
              (this._cacheMatchesSimple = new Map()),
              (this._cacheMatchesParents = new Map()),
              (this._cacheCallMatches = new Map()),
              (this._cacheCallQuery = new Map()),
              (this._cacheQuerySimple = new Map()),
              (this._cacheText = new Map()),
              (this._scoreMap = void 0),
              (this._retainCacheCounter = 0);
            for (const [t, n] of e) this._engines.set(t, n);
            this._engines.set('not', c),
              this._engines.set('is', r),
              this._engines.set('where', r),
              this._engines.set('has', i),
              this._engines.set('scope', s),
              this._engines.set('light', l),
              this._engines.set('visible', a),
              this._engines.set('text', h),
              this._engines.set('text-is', u),
              this._engines.set('text-matches', p),
              this._engines.set('has-text', f),
              this._engines.set('right-of', k('right-of', w)),
              this._engines.set('left-of', k('left-of', E)),
              this._engines.set('above', k('above', S)),
              this._engines.set('below', k('below', T)),
              this._engines.set('near', k('near', b)),
              this._engines.set('nth-match', M);
            const t = [...this._engines.keys()];
            t.sort();
            const n = [...o.customCSSNames];
            if ((n.sort(), t.join('|') !== n.join('|')))
              throw new Error(
                `Please keep customCSSNames in sync with evaluator engines: ${t.join(
                  '|',
                )} vs ${n.join('|')}`,
              );
          }
          begin() {
            ++this._retainCacheCounter;
          }
          end() {
            --this._retainCacheCounter,
              this._retainCacheCounter ||
                (this._cacheQueryCSS.clear(),
                this._cacheMatches.clear(),
                this._cacheQuery.clear(),
                this._cacheMatchesSimple.clear(),
                this._cacheMatchesParents.clear(),
                this._cacheCallMatches.clear(),
                this._cacheCallQuery.clear(),
                this._cacheQuerySimple.clear(),
                this._cacheText.clear());
          }
          _cached(e, t, n, o) {
            e.has(t) || e.set(t, []);
            const r = e.get(t),
              i = r.find((e) => n.every((t, n) => e.rest[n] === t));
            if (i) return i.result;
            const s = o();
            return r.push({rest: n, result: s}), s;
          }
          _checkSelector(e) {
            if (
              'object' != typeof e ||
              !e ||
              !(Array.isArray(e) || ('simples' in e && e.simples.length))
            )
              throw new Error(`Malformed selector "${e}"`);
            return e;
          }
          matches(e, t, n) {
            const o = this._checkSelector(t);
            this.begin();
            try {
              return this._cached(
                this._cacheMatches,
                e,
                [o, n.scope, n.pierceShadow],
                () =>
                  Array.isArray(o)
                    ? this._matchesEngine(r, e, o, n)
                    : !!this._matchesSimple(
                        e,
                        o.simples[o.simples.length - 1].selector,
                        n,
                      ) && this._matchesParents(e, o, o.simples.length - 2, n),
              );
            } finally {
              this.end();
            }
          }
          query(e, t) {
            const n = this._checkSelector(t);
            this.begin();
            try {
              return this._cached(
                this._cacheQuery,
                n,
                [e.scope, e.pierceShadow],
                () => {
                  if (Array.isArray(n)) return this._queryEngine(r, e, n);
                  const t = this._scoreMap;
                  this._scoreMap = new Map();
                  let o = this._querySimple(
                    e,
                    n.simples[n.simples.length - 1].selector,
                  );
                  return (
                    (o = o.filter((t) =>
                      this._matchesParents(t, n, n.simples.length - 2, e),
                    )),
                    this._scoreMap.size &&
                      o.sort((e, t) => {
                        const n = this._scoreMap.get(e),
                          o = this._scoreMap.get(t);
                        return n === o
                          ? 0
                          : void 0 === n
                          ? 1
                          : void 0 === o
                          ? -1
                          : n - o;
                      }),
                    (this._scoreMap = t),
                    o
                  );
                },
              );
            } finally {
              this.end();
            }
          }
          _markScore(e, t) {
            this._scoreMap && this._scoreMap.set(e, t);
          }
          _matchesSimple(e, t, n) {
            return this._cached(
              this._cacheMatchesSimple,
              e,
              [t, n.scope, n.pierceShadow],
              () => {
                if (
                  !t.functions.some(
                    (e) => 'scope' === e.name || 'is' === e.name,
                  ) &&
                  e === n.scope
                )
                  return !1;
                if (t.css && !this._matchesCSS(e, t.css)) return !1;
                for (const o of t.functions)
                  if (
                    !this._matchesEngine(this._getEngine(o.name), e, o.args, n)
                  )
                    return !1;
                return !0;
              },
            );
          }
          _querySimple(e, t) {
            return t.functions.length
              ? this._cached(
                  this._cacheQuerySimple,
                  t,
                  [e.scope, e.pierceShadow],
                  () => {
                    let n = t.css;
                    const o = t.functions;
                    let r;
                    '*' === n && o.length && (n = void 0);
                    let i = -1;
                    void 0 !== n
                      ? (r = this._queryCSS(e, n))
                      : ((i = o.findIndex(
                          (e) => void 0 !== this._getEngine(e.name).query,
                        )),
                        -1 === i && (i = 0),
                        (r = this._queryEngine(
                          this._getEngine(o[i].name),
                          e,
                          o[i].args,
                        )));
                    for (let t = 0; t < o.length; t++) {
                      if (t === i) continue;
                      const n = this._getEngine(o[t].name);
                      void 0 !== n.matches &&
                        (r = r.filter((r) =>
                          this._matchesEngine(n, r, o[t].args, e),
                        ));
                    }
                    for (let t = 0; t < o.length; t++) {
                      if (t === i) continue;
                      const n = this._getEngine(o[t].name);
                      void 0 === n.matches &&
                        (r = r.filter((r) =>
                          this._matchesEngine(n, r, o[t].args, e),
                        ));
                    }
                    return r;
                  },
                )
              : this._queryCSS(e, t.css || '*');
          }
          _matchesParents(e, t, n, o) {
            return (
              n < 0 ||
              this._cached(
                this._cacheMatchesParents,
                e,
                [t, n, o.scope, o.pierceShadow],
                () => {
                  const {selector: r, combinator: i} = t.simples[n];
                  if ('>' === i) {
                    const i = C(e, o);
                    return (
                      !(!i || !this._matchesSimple(i, r, o)) &&
                      this._matchesParents(i, t, n - 1, o)
                    );
                  }
                  if ('+' === i) {
                    const i = P(e, o);
                    return (
                      !(!i || !this._matchesSimple(i, r, o)) &&
                      this._matchesParents(i, t, n - 1, o)
                    );
                  }
                  if ('' === i) {
                    let i = C(e, o);
                    for (; i; ) {
                      if (this._matchesSimple(i, r, o)) {
                        if (this._matchesParents(i, t, n - 1, o)) return !0;
                        if ('' === t.simples[n - 1].combinator) break;
                      }
                      i = C(i, o);
                    }
                    return !1;
                  }
                  if ('~' === i) {
                    let i = P(e, o);
                    for (; i; ) {
                      if (this._matchesSimple(i, r, o)) {
                        if (this._matchesParents(i, t, n - 1, o)) return !0;
                        if ('~' === t.simples[n - 1].combinator) break;
                      }
                      i = P(i, o);
                    }
                    return !1;
                  }
                  if ('>=' === i) {
                    let i = e;
                    for (; i; ) {
                      if (this._matchesSimple(i, r, o)) {
                        if (this._matchesParents(i, t, n - 1, o)) return !0;
                        if ('' === t.simples[n - 1].combinator) break;
                      }
                      i = C(i, o);
                    }
                    return !1;
                  }
                  throw new Error(`Unsupported combinator "${i}"`);
                },
              )
            );
          }
          _matchesEngine(e, t, n, o) {
            if (e.matches) return this._callMatches(e, t, n, o);
            if (e.query) return this._callQuery(e, n, o).includes(t);
            throw new Error(
              'Selector engine should implement "matches" or "query"',
            );
          }
          _queryEngine(e, t, n) {
            if (e.query) return this._callQuery(e, n, t);
            if (e.matches)
              return this._queryCSS(t, '*').filter((o) =>
                this._callMatches(e, o, n, t),
              );
            throw new Error(
              'Selector engine should implement "matches" or "query"',
            );
          }
          _callMatches(e, t, n, o) {
            return this._cached(
              this._cacheCallMatches,
              t,
              [e, o.scope, o.pierceShadow, ...n],
              () => e.matches(t, n, o, this),
            );
          }
          _callQuery(e, t, n) {
            return this._cached(
              this._cacheCallQuery,
              e,
              [n.scope, n.pierceShadow, ...t],
              () => e.query(n, t, this),
            );
          }
          _matchesCSS(e, t) {
            return e.matches(t);
          }
          _queryCSS(e, t) {
            return this._cached(
              this._cacheQueryCSS,
              t,
              [e.scope, e.pierceShadow],
              () => {
                let n = [];
                return (
                  (function o(r) {
                    if (
                      ((n = n.concat([...r.querySelectorAll(t)])),
                      e.pierceShadow)
                    ) {
                      r.shadowRoot && o(r.shadowRoot);
                      for (const e of r.querySelectorAll('*'))
                        e.shadowRoot && o(e.shadowRoot);
                    }
                  })(e.scope),
                  n
                );
              },
            );
          }
          _getEngine(e) {
            const t = this._engines.get(e);
            if (!t) throw new Error(`Unknown selector engine "${e}"`);
            return t;
          }
        };
        const r = {
            matches(e, t, n, o) {
              if (0 === t.length)
                throw new Error('"is" engine expects non-empty selector list');
              return t.some((t) => o.matches(e, t, n));
            },
            query(e, t, n) {
              if (0 === t.length)
                throw new Error('"is" engine expects non-empty selector list');
              let o = [];
              for (const r of t) o = o.concat(n.query(e, r));
              return 1 === t.length
                ? o
                : (function (e) {
                    const t = new Map(),
                      n = [],
                      o = [];
                    function r(e) {
                      let o = t.get(e);
                      if (o) return o;
                      const i = x(e);
                      return (
                        i ? r(i).children.push(e) : n.push(e),
                        (o = {children: [], taken: !1}),
                        t.set(e, o),
                        o
                      );
                    }
                    return (
                      e.forEach((e) => (r(e).taken = !0)),
                      n.forEach(function e(n) {
                        const r = t.get(n);
                        if ((r.taken && o.push(n), r.children.length > 1)) {
                          const e = new Set(r.children);
                          r.children = [];
                          let t = n.firstElementChild;
                          for (; t && r.children.length < e.size; )
                            e.has(t) && r.children.push(t),
                              (t = t.nextElementSibling);
                          for (
                            t = n.shadowRoot
                              ? n.shadowRoot.firstElementChild
                              : null;
                            t && r.children.length < e.size;

                          )
                            e.has(t) && r.children.push(t),
                              (t = t.nextElementSibling);
                        }
                        r.children.forEach(e);
                      }),
                      o
                    );
                  })(o);
            },
          },
          i = {
            matches(e, t, n, o) {
              if (0 === t.length)
                throw new Error('"has" engine expects non-empty selector list');
              return o.query({...n, scope: e}, t).length > 0;
            },
          },
          s = {
            matches(e, t, n, o) {
              if (0 !== t.length)
                throw new Error('"scope" engine expects no arguments');
              return 9 === n.scope.nodeType
                ? e === n.scope.documentElement
                : e === n.scope;
            },
            query(e, t, n) {
              if (0 !== t.length)
                throw new Error('"scope" engine expects no arguments');
              if (9 === e.scope.nodeType) {
                const t = e.scope.documentElement;
                return t ? [t] : [];
              }
              return 1 === e.scope.nodeType ? [e.scope] : [];
            },
          },
          c = {
            matches(e, t, n, o) {
              if (0 === t.length)
                throw new Error('"not" engine expects non-empty selector list');
              return !o.matches(e, t, n);
            },
          },
          l = {
            query: (e, t, n) => n.query({...e, pierceShadow: !1}, t),
            matches: (e, t, n, o) => o.matches(e, t, {...n, pierceShadow: !1}),
          },
          a = {
            matches(e, t, n, o) {
              if (t.length)
                throw new Error('"visible" engine expects no arguments');
              return A(e);
            },
          },
          h = {
            matches(e, t, n, o) {
              if (1 !== t.length || 'string' != typeof t[0])
                throw new Error('"text" engine expects a single string');
              return 'self' === v(o, e, d(t[0]));
            },
          },
          u = {
            matches(e, t, n, o) {
              if (1 !== t.length || 'string' != typeof t[0])
                throw new Error('"text-is" engine expects a single string');
              return 'none' !== v(o, e, m(t[0]));
            },
          },
          p = {
            matches(e, t, n, o) {
              if (
                0 === t.length ||
                'string' != typeof t[0] ||
                t.length > 2 ||
                (2 === t.length && 'string' != typeof t[1])
              )
                throw new Error(
                  '"text-matches" engine expects a regexp body and optional regexp flags',
                );
              return (
                'self' === v(o, e, g(t[0], 2 === t.length ? t[1] : void 0))
              );
            },
          },
          f = {
            matches(e, t, n, o) {
              if (1 !== t.length || 'string' != typeof t[0])
                throw new Error('"has-text" engine expects a single string');
              return !y(e) && d(t[0])(_(o, e));
            },
          };
        function d(e) {
          return (
            (e = e.trim().replace(/\s+/g, ' ').toLowerCase()),
            (t) => t.full.trim().replace(/\s+/g, ' ').toLowerCase().includes(e)
          );
        }
        function m(e) {
          return (
            (e = e.trim().replace(/\s+/g, ' ')),
            (t) => t.immediate.some((t) => t.trim().replace(/\s+/g, ' ') === e)
          );
        }
        function g(e, t) {
          const n = new RegExp(e, t);
          return (e) => n.test(e.full);
        }
        function y(e) {
          return (
            'SCRIPT' === e.nodeName ||
            'STYLE' === e.nodeName ||
            (document.head && document.head.contains(e))
          );
        }
        function _(e, t) {
          let n = e._cacheText.get(t);
          if (void 0 === n) {
            if (((n = {full: '', immediate: []}), !y(t))) {
              let o = '';
              if (
                t instanceof HTMLInputElement &&
                ('submit' === t.type || 'button' === t.type)
              )
                n = {full: t.value, immediate: [t.value]};
              else {
                for (let r = t.firstChild; r; r = r.nextSibling)
                  r.nodeType === Node.TEXT_NODE
                    ? ((n.full += r.nodeValue || ''), (o += r.nodeValue || ''))
                    : (o && n.immediate.push(o),
                      (o = ''),
                      r.nodeType === Node.ELEMENT_NODE &&
                        (n.full += _(e, r).full));
                o && n.immediate.push(o),
                  t.shadowRoot && (n.full += _(e, t.shadowRoot).full);
              }
            }
            e._cacheText.set(t, n);
          }
          return n;
        }
        function v(e, t, n) {
          if (y(t)) return 'none';
          if (!n(_(e, t))) return 'none';
          for (let o = t.firstChild; o; o = o.nextSibling)
            if (o.nodeType === Node.ELEMENT_NODE && n(_(e, o)))
              return 'selfAndChildren';
          return t.shadowRoot && n(_(e, t.shadowRoot))
            ? 'selfAndChildren'
            : 'self';
        }
        function w(e, t, n) {
          const o = e.left - t.right;
          if (!(o < 0 || (void 0 !== n && o > n)))
            return (
              o + Math.max(t.bottom - e.bottom, 0) + Math.max(e.top - t.top, 0)
            );
        }
        function E(e, t, n) {
          const o = t.left - e.right;
          if (!(o < 0 || (void 0 !== n && o > n)))
            return (
              o + Math.max(t.bottom - e.bottom, 0) + Math.max(e.top - t.top, 0)
            );
        }
        function S(e, t, n) {
          const o = t.top - e.bottom;
          if (!(o < 0 || (void 0 !== n && o > n)))
            return (
              o + Math.max(e.left - t.left, 0) + Math.max(t.right - e.right, 0)
            );
        }
        function T(e, t, n) {
          const o = e.top - t.bottom;
          if (!(o < 0 || (void 0 !== n && o > n)))
            return (
              o + Math.max(e.left - t.left, 0) + Math.max(t.right - e.right, 0)
            );
        }
        function b(e, t, n) {
          const o = void 0 === n ? 50 : n;
          let r = 0;
          return (
            e.left - t.right >= 0 && (r += e.left - t.right),
            t.left - e.right >= 0 && (r += t.left - e.right),
            t.top - e.bottom >= 0 && (r += t.top - e.bottom),
            e.top - t.bottom >= 0 && (r += e.top - t.bottom),
            r > o ? void 0 : r
          );
        }
        function k(e, t) {
          return {
            matches(n, o, r, i) {
              const s =
                  o.length && 'number' == typeof o[o.length - 1]
                    ? o[o.length - 1]
                    : void 0,
                c = void 0 === s ? o : o.slice(0, o.length - 1);
              if (o.length < 1 + (void 0 === s ? 0 : 1))
                throw new Error(
                  `"${e}" engine expects a selector list and optional maximum distance in pixels`,
                );
              const l = n.getBoundingClientRect();
              let a;
              for (const e of i.query(r, c)) {
                if (e === n) continue;
                const o = t(l, e.getBoundingClientRect(), s);
                void 0 !== o && (void 0 === a || o < a) && (a = o);
              }
              return void 0 !== a && (i._markScore(n, a), !0);
            },
          };
        }
        const M = {
          query(e, t, n) {
            let o = t[t.length - 1];
            if (t.length < 2)
              throw new Error(
                '"nth-match" engine expects non-empty selector list and an index argument',
              );
            if ('number' != typeof o || o < 1)
              throw new Error(
                '"nth-match" engine expects a one-based index as the last argument',
              );
            const i = r.query(e, t.slice(0, t.length - 1), n);
            return o--, o < i.length ? [i[o]] : [];
          },
        };
        function x(e) {
          return e.parentElement
            ? e.parentElement
            : e.parentNode &&
              e.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
              e.parentNode.host
            ? e.parentNode.host
            : void 0;
        }
        function C(e, t) {
          if (e !== t.scope)
            return t.pierceShadow ? x(e) : e.parentElement || void 0;
        }
        function P(e, t) {
          if (e !== t.scope) return e.previousElementSibling || void 0;
        }
        function A(e) {
          if (!e.ownerDocument || !e.ownerDocument.defaultView) return !0;
          const t = e.ownerDocument.defaultView.getComputedStyle(e);
          if (!t || 'hidden' === t.visibility) return !1;
          const n = e.getBoundingClientRect();
          return n.width > 0 && n.height > 0;
        }
      },
      854: (e, t, n) => {
        Object.defineProperty(t, '__esModule', {value: !0}),
          (t.querySelector = function (e, t, n) {
            try {
              const o = e.parseSelector(t);
              return {selector: t, elements: e.querySelectorAll(o, n)};
            } catch (e) {
              return {selector: t, elements: []};
            }
          }),
          (t.generateSelector = function (e, t) {
            e._evaluator.begin();
            try {
              const n = (function (e, t) {
                  if (t.ownerDocument.documentElement === t)
                    return [{engine: 'css', selector: 'html', score: 1}];
                  const n = (a, u) => {
                    const d = u ? r : i;
                    let m = d.get(a);
                    return (
                      void 0 === m &&
                        ((m = ((r, i) => {
                          const a = r === t;
                          let u = i
                            ? (function (e, t, n) {
                                if ('SELECT' === t.nodeName) return [];
                                const r = (0, o.elementText)(e._evaluator, t)
                                  .full.trim()
                                  .replace(/\s+/g, ' ')
                                  .substring(0, 80);
                                if (!r) return [];
                                const i = [];
                                let s = r;
                                if (
                                  ((r.includes('"') ||
                                    r.includes('>>') ||
                                    '/' === r[0]) &&
                                    (s = `/.*${(function (e) {
                                      return e.replace(
                                        /[.*+?^>${}()|[\]\\]/g,
                                        '\\$&',
                                      );
                                    })(r)}.*/`),
                                  i.push({
                                    engine: 'text',
                                    selector: s,
                                    score: 10,
                                  }),
                                  n && s === r)
                                ) {
                                  let e = t.nodeName.toLocaleLowerCase();
                                  t.hasAttribute('role') &&
                                    (e += `[role=${h(
                                      t.getAttribute('role'),
                                    )}]`),
                                    i.push({
                                      engine: 'css',
                                      selector: `${e}:has-text("${r}")`,
                                      score: 30,
                                    });
                                }
                                return i;
                              })(e, r, r === t).map((e) => [e])
                            : [];
                          r !== t && (u = s(u));
                          const d = (function (e, t) {
                            const n = [];
                            for (const e of [
                              'data-testid',
                              'data-test-id',
                              'data-test',
                            ])
                              t.hasAttribute(e) &&
                                n.push({
                                  engine: 'css',
                                  selector: `[${e}=${h(t.getAttribute(e))}]`,
                                  score: 1,
                                });
                            if ('INPUT' === t.nodeName) {
                              const e = t;
                              e.placeholder &&
                                n.push({
                                  engine: 'css',
                                  selector: `[placeholder=${h(e.placeholder)}]`,
                                  score: 10,
                                });
                            }
                            t.hasAttribute('aria-label') &&
                              n.push({
                                engine: 'css',
                                selector: `[aria-label=${h(
                                  t.getAttribute('aria-label'),
                                )}]`,
                                score: 10,
                              }),
                              t.getAttribute('alt') &&
                                ['APPLET', 'AREA', 'IMG', 'INPUT'].includes(
                                  t.nodeName,
                                ) &&
                                n.push({
                                  engine: 'css',
                                  selector: `${t.nodeName.toLowerCase()}[alt=${h(
                                    t.getAttribute('alt'),
                                  )}]`,
                                  score: 10,
                                }),
                              t.hasAttribute('role') &&
                                n.push({
                                  engine: 'css',
                                  selector: `${t.nodeName.toLocaleLowerCase()}[role=${h(
                                    t.getAttribute('role'),
                                  )}]`,
                                  score: 50,
                                }),
                              t.getAttribute('name') &&
                                [
                                  'BUTTON',
                                  'FORM',
                                  'FIELDSET',
                                  'IFRAME',
                                  'INPUT',
                                  'KEYGEN',
                                  'OBJECT',
                                  'OUTPUT',
                                  'SELECT',
                                  'TEXTAREA',
                                  'MAP',
                                  'META',
                                  'PARAM',
                                ].includes(t.nodeName) &&
                                n.push({
                                  engine: 'css',
                                  selector: `${t.nodeName.toLowerCase()}[name=${h(
                                    t.getAttribute('name'),
                                  )}]`,
                                  score: 50,
                                }),
                              ['INPUT', 'TEXTAREA'].includes(t.nodeName) &&
                                'hidden' !== t.getAttribute('type') &&
                                t.getAttribute('type') &&
                                n.push({
                                  engine: 'css',
                                  selector: `${t.nodeName.toLowerCase()}[type=${h(
                                    t.getAttribute('type'),
                                  )}]`,
                                  score: 50,
                                }),
                              ['INPUT', 'TEXTAREA', 'SELECT'].includes(
                                t.nodeName,
                              ) &&
                                n.push({
                                  engine: 'css',
                                  selector: t.nodeName.toLowerCase(),
                                  score: 50,
                                });
                            const o = t.getAttribute('id');
                            return (
                              o &&
                                !(function (e) {
                                  let t,
                                    n = 0;
                                  for (let o = 0; o < e.length; ++o) {
                                    const r = e[o];
                                    let i;
                                    '-' !== r &&
                                      '_' !== r &&
                                      ((i =
                                        r >= 'a' && r <= 'z'
                                          ? 'lower'
                                          : r >= 'A' && r <= 'Z'
                                          ? 'upper'
                                          : r >= '0' && r <= '9'
                                          ? 'digit'
                                          : 'other'),
                                      'lower' !== i || 'upper' !== t
                                        ? (t && t !== i && ++n, (t = i))
                                        : (t = i));
                                  }
                                  return n >= e.length / 4;
                                })(o) &&
                                n.push({
                                  engine: 'css',
                                  selector: l(o),
                                  score: 100,
                                }),
                              n.push({
                                engine: 'css',
                                selector: t.nodeName.toLocaleLowerCase(),
                                score: 200,
                              }),
                              n
                            );
                          })(0, r).map((e) => [e]);
                          let m = f(e, t.ownerDocument, r, [...u, ...d], a);
                          u = s(u);
                          const g = (t) => {
                            const o = i && !t.length,
                              s = [...t, ...d].filter((e) => !m || p(e) < p(m));
                            let l = s[0];
                            if (l)
                              for (let t = c(r); t; t = c(t)) {
                                const i = n(t, o);
                                if (!i) continue;
                                if (m && p([...i, ...l]) >= p(m)) continue;
                                if (((l = f(e, t, r, s, a)), !l)) return;
                                const c = [...i, ...l];
                                (!m || p(c) < p(m)) && (m = c);
                              }
                          };
                          return g(u), r === t && u.length && g([]), m;
                        })(a, u)),
                        d.set(a, m)),
                      m
                    );
                  };
                  return n(t, !0);
                })(
                  e,
                  (t =
                    t.closest(
                      'button,select,input,[role=button],[role=checkbox],[role=radio]',
                    ) || t),
                ),
                d = u(n || [a(e, t)]),
                m = e.parseSelector(d);
              return {
                selector: d,
                elements: e.querySelectorAll(m, t.ownerDocument),
              };
            } finally {
              r.clear(), i.clear(), e._evaluator.end();
            }
          });
        var o = n(848);
        const r = new Map(),
          i = new Map();
        function s(e) {
          return e.filter((e) => '/' !== e[0].selector[0]);
        }
        function c(e) {
          return e.parentElement
            ? e.parentElement
            : e.parentNode &&
              e.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
              e.parentNode.host
            ? e.parentNode.host
            : null;
        }
        function l(e) {
          return /^[a-zA-Z][a-zA-Z0-9\-\_]+$/.test(e) ? '#' + e : `[id="${e}"]`;
        }
        function a(e, t) {
          const n = 1e7,
            o = t.ownerDocument,
            r = [];
          function i(n) {
            const o = r.slice();
            n && o.unshift(n);
            const i = o.join(' '),
              s = e.parseSelector(i);
            return e.querySelector(s, t.ownerDocument, !1) === t ? i : void 0;
          }
          for (let e = t; e && e !== o; e = c(e)) {
            const t = e.nodeName.toLowerCase();
            let o = '';
            if (e.id) {
              const t = l(e.id),
                r = i(t);
              if (r) return {engine: 'css', selector: r, score: n};
              o = t;
            }
            const s = e.parentNode,
              c = [...e.classList];
            for (let e = 0; e < c.length; ++e) {
              const t = '.' + c.slice(0, e + 1).join('.'),
                r = i(t);
              if (r) return {engine: 'css', selector: r, score: n};
              !o && s && 1 === s.querySelectorAll(t).length && (o = t);
            }
            if (s) {
              const r = [...s.children],
                c =
                  0 ===
                  r.filter((e) => e.nodeName.toLowerCase() === t).indexOf(e)
                    ? t
                    : `${t}:nth-child(${1 + r.indexOf(e)})`,
                l = i(c);
              if (l) return {engine: 'css', selector: l, score: n};
              o || (o = c);
            } else o || (o = t);
            r.unshift(o);
          }
          return {engine: 'css', selector: i(), score: n};
        }
        function h(e) {
          return `"${e.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
        }
        function u(e) {
          const t = [];
          let n = '';
          for (const {engine: o, selector: r} of e)
            t.length &&
              ('css' !== n || 'css' !== o || r.startsWith(':nth-match(')) &&
              t.push('>>'),
              (n = o),
              'css' === o ? t.push(r) : t.push(`${o}=${r}`);
          return t.join(' ');
        }
        function p(e) {
          let t = 0;
          for (let n = 0; n < e.length; n++) t += e[n].score * (e.length - n);
          return t;
        }
        function f(e, t, n, o, r) {
          const i = o.map((e) => ({tokens: e, score: p(e)}));
          i.sort((e, t) => e.score - t.score);
          let s = null;
          for (const {tokens: o} of i) {
            const i = e.parseSelector(u(o)),
              c = e.querySelectorAll(i, t),
              l = c.indexOf(n);
            if (0 === l) return o;
            if (!r || s || -1 === l || c.length > 5) continue;
            const a = o.map((e) =>
              'text' !== e.engine
                ? e
                : e.selector.startsWith('/') && e.selector.endsWith('/')
                ? {
                    engine: 'css',
                    selector: `:text-matches("${e.selector.substring(
                      1,
                      e.selector.length - 1,
                    )}")`,
                    score: e.score,
                  }
                : {
                    engine: 'css',
                    selector: `:text("${e.selector}")`,
                    score: e.score,
                  },
            );
            s = [
              {
                engine: 'css',
                selector: `:nth-match(${u(a)}, ${l + 1})`,
                score: p(a) + 1e3,
              },
            ];
          }
          return s;
        }
      },
    },
    t = {};
  function n(o) {
    var r = t[o];
    if (void 0 !== r) return r.exports;
    var i = (t[o] = {exports: {}});
    return e[o](i, i.exports, n), i.exports;
  }
  var o = {};
  (() => {
    var e = o;
    e.default = void 0;
    var t = n(854);
    function r(e) {
      return (
        (e.altKey ? 1 : 0) |
        (e.ctrlKey ? 2 : 0) |
        (e.metaKey ? 4 : 0) |
        (e.shiftKey ? 8 : 0)
      );
    }
    function i(e) {
      switch (e.which) {
        case 1:
          return 'left';
        case 2:
          return 'middle';
        case 3:
          return 'right';
      }
      return 'left';
    }
    function s(e) {
      const t = e.target;
      if ('CANVAS' !== t.nodeName) return;
      const n = t.getBoundingClientRect();
      return {x: e.clientX - n.left, y: e.clientY - n.top};
    }
    function c(e) {
      e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
    }
    function l(e) {
      if (!e || 'INPUT' !== e.nodeName) return null;
      const t = e;
      return 'checkbox' === t.type ? t : null;
    }
    function a(e, t, n, o) {
      return (
        e.addEventListener(t, n, o),
        () => {
          e.removeEventListener(t, n, o);
        }
      );
    }
    var h = class {
      constructor(e, t) {
        (this._injectedScript = void 0),
          (this._performingAction = !1),
          (this._outerGlassPaneElement = void 0),
          (this._glassPaneShadow = void 0),
          (this._innerGlassPaneElement = void 0),
          (this._highlightElements = []),
          (this._tooltipElement = void 0),
          (this._listeners = []),
          (this._hoveredModel = null),
          (this._hoveredElement = null),
          (this._activeModel = null),
          (this._expectProgrammaticKeyUp = !1),
          (this._pollRecorderModeTimer = void 0),
          (this._mode = 'none'),
          (this._actionPointElement = void 0),
          (this._actionPoint = void 0),
          (this._actionSelector = void 0),
          (this._params = void 0),
          (this._params = t),
          (this._injectedScript = e),
          (this._outerGlassPaneElement = document.createElement('x-pw-glass')),
          (this._outerGlassPaneElement.style.position = 'fixed'),
          (this._outerGlassPaneElement.style.top = '0'),
          (this._outerGlassPaneElement.style.right = '0'),
          (this._outerGlassPaneElement.style.bottom = '0'),
          (this._outerGlassPaneElement.style.left = '0'),
          (this._outerGlassPaneElement.style.zIndex = '2147483647'),
          (this._outerGlassPaneElement.style.pointerEvents = 'none'),
          (this._outerGlassPaneElement.style.display = 'flex'),
          (this._tooltipElement = document.createElement('x-pw-tooltip')),
          (this._actionPointElement =
            document.createElement('x-pw-action-point')),
          this._actionPointElement.setAttribute('hidden', 'true'),
          (this._innerGlassPaneElement =
            document.createElement('x-pw-glass-inner')),
          (this._innerGlassPaneElement.style.flex = 'auto'),
          this._innerGlassPaneElement.appendChild(this._tooltipElement),
          (this._glassPaneShadow = this._outerGlassPaneElement.attachShadow({
            mode: this._params.isUnderTest ? 'open' : 'closed',
          })),
          this._glassPaneShadow.appendChild(this._innerGlassPaneElement),
          this._glassPaneShadow.appendChild(this._actionPointElement);
        const n = document.createElement('style');
        (n.textContent =
          "\n        x-pw-tooltip {\n          align-items: center;\n          backdrop-filter: blur(5px);\n          background-color: rgba(0, 0, 0, 0.7);\n          border-radius: 2px;\n          box-shadow: rgba(0, 0, 0, 0.1) 0px 3.6px 3.7px,\n                      rgba(0, 0, 0, 0.15) 0px 12.1px 12.3px,\n                      rgba(0, 0, 0, 0.1) 0px -2px 4px,\n                      rgba(0, 0, 0, 0.15) 0px -12.1px 24px,\n                      rgba(0, 0, 0, 0.25) 0px 54px 55px;\n          color: rgb(204, 204, 204);\n          display: none;\n          font-family: 'Dank Mono', 'Operator Mono', Inconsolata, 'Fira Mono',\n                       'SF Mono', Monaco, 'Droid Sans Mono', 'Source Code Pro', monospace;\n          font-size: 12.8px;\n          font-weight: normal;\n          left: 0;\n          line-height: 1.5;\n          max-width: 600px;\n          padding: 3.2px 5.12px 3.2px;\n          position: absolute;\n          top: 0;\n        }\n        x-pw-action-point {\n          position: absolute;\n          width: 20px;\n          height: 20px;\n          background: red;\n          border-radius: 10px;\n          pointer-events: none;\n          margin: -10px 0 0 -10px;\n          z-index: 2;\n        }\n        *[hidden] {\n          display: none !important;\n        }\n    "),
          this._glassPaneShadow.appendChild(n),
          this._refreshListenersIfNeeded(),
          setInterval(() => {
            this._refreshListenersIfNeeded(),
              t.isUnderTest &&
                !this._reportedReadyForTest &&
                ((this._reportedReadyForTest = !0),
                console.error('Recorder script ready for test'));
          }, 500),
          (globalThis._playwrightRefreshOverlay = () => {
            this._pollRecorderMode().catch((e) => console.log(e));
          }),
          globalThis._playwrightRefreshOverlay();
      }
      _refreshListenersIfNeeded() {
        (this._outerGlassPaneElement.parentElement !==
          document.documentElement ||
          this._outerGlassPaneElement.nextElementSibling) &&
          ((function (e) {
            for (const t of e) t();
            e.splice(0, e.length);
          })(this._listeners),
          (this._listeners = [
            a(document, 'click', (e) => this._onClick(e), !0),
            a(document, 'auxclick', (e) => this._onClick(e), !0),
            a(document, 'input', (e) => this._onInput(e), !0),
            a(document, 'keydown', (e) => this._onKeyDown(e), !0),
            a(document, 'keyup', (e) => this._onKeyUp(e), !0),
            a(document, 'mousedown', (e) => this._onMouseDown(e), !0),
            a(document, 'mouseup', (e) => this._onMouseUp(e), !0),
            a(document, 'mousemove', (e) => this._onMouseMove(e), !0),
            a(document, 'mouseleave', (e) => this._onMouseLeave(e), !0),
            a(document, 'focus', () => this._onFocus(), !0),
            a(
              document,
              'scroll',
              () => {
                (this._hoveredModel = null),
                  (this._actionPointElement.hidden = !0),
                  this._updateHighlight();
              },
              !0,
            ),
          ]),
          document.documentElement.appendChild(this._outerGlassPaneElement));
      }
      async _pollRecorderMode() {
        var e;
        this._pollRecorderModeTimer &&
          clearTimeout(this._pollRecorderModeTimer);
        const n = await globalThis
          ._playwrightRecorderState()
          .catch((e) => null);
        if (!n)
          return void (this._pollRecorderModeTimer = setTimeout(
            () => this._pollRecorderMode(),
            1e3,
          ));
        const {mode: o, actionPoint: r, actionSelector: i} = n;
        o !== this._mode && ((this._mode = o), this._clearHighlight()),
          (r &&
            this._actionPoint &&
            r.x === this._actionPoint.x &&
            r.y === this._actionPoint.y) ||
            ((r || this._actionPoint) &&
              (r
                ? ((this._actionPointElement.style.top = r.y + 'px'),
                  (this._actionPointElement.style.left = r.x + 'px'),
                  (this._actionPointElement.hidden = !1))
                : (this._actionPointElement.hidden = !0),
              (this._actionPoint = r))),
          !this._actionSelector ||
            (null !== (e = this._hoveredModel) &&
              void 0 !== e &&
              e.elements.length) ||
            (this._actionSelector = void 0),
          i !== this._actionSelector &&
            ((this._hoveredModel = i
              ? (0, t.querySelector)(this._injectedScript, i, document)
              : null),
            this._updateHighlight(),
            (this._actionSelector = i)),
          (this._pollRecorderModeTimer = setTimeout(
            () => this._pollRecorderMode(),
            1e3,
          ));
      }
      _clearHighlight() {
        (this._hoveredModel = null),
          (this._activeModel = null),
          this._updateHighlight();
      }
      _actionInProgress(e) {
        return !!this._performingAction || (c(e), !1);
      }
      _consumedDueToNoModel(e, t) {
        return !t && (c(e), !0);
      }
      _consumedDueWrongTarget(e) {
        return !(
          (this._activeModel &&
            this._activeModel.elements[0] === this._deepEventTarget(e)) ||
          (c(e), 0)
        );
      }
      _onClick(e) {
        if (
          ('inspecting' === this._mode &&
            globalThis._playwrightRecorderSetSelector(
              this._hoveredModel ? this._hoveredModel.selector : '',
            ),
          this._shouldIgnoreMouseEvent(e))
        )
          return;
        if (this._actionInProgress(e)) return;
        if (this._consumedDueToNoModel(e, this._hoveredModel)) return;
        const t = l(this._deepEventTarget(e));
        t
          ? this._performAction({
              name: t.checked ? 'check' : 'uncheck',
              selector: this._hoveredModel.selector,
              signals: [],
            })
          : this._performAction({
              name: 'click',
              selector: this._hoveredModel.selector,
              position: s(e),
              signals: [],
              button: i(e),
              modifiers: r(e),
              clickCount: e.detail,
            });
      }
      _shouldIgnoreMouseEvent(e) {
        const t = this._deepEventTarget(e);
        if ('none' === this._mode) return !0;
        if ('inspecting' === this._mode) return c(e), !0;
        const n = t.nodeName;
        return 'SELECT' === n || !('INPUT' !== n || !['date'].includes(t.type));
      }
      _onMouseDown(e) {
        this._shouldIgnoreMouseEvent(e) ||
          (this._performingAction || c(e),
          (this._activeModel = this._hoveredModel));
      }
      _onMouseUp(e) {
        this._shouldIgnoreMouseEvent(e) || this._performingAction || c(e);
      }
      _onMouseMove(e) {
        if ('none' === this._mode) return;
        const t = this._deepEventTarget(e);
        this._hoveredElement !== t &&
          ((this._hoveredElement = t), this._updateModelForHoveredElement());
      }
      _onMouseLeave(e) {
        this._deepEventTarget(e).nodeType === Node.DOCUMENT_NODE &&
          ((this._hoveredElement = null), this._updateModelForHoveredElement());
      }
      _onFocus() {
        const e = this._deepActiveElement(document),
          n = e ? (0, t.generateSelector)(this._injectedScript, e) : null;
        (this._activeModel = n && n.selector ? n : null),
          this._params.isUnderTest &&
            console.error(
              'Highlight updated for test: ' + (n ? n.selector : null),
            );
      }
      _updateModelForHoveredElement() {
        if (!this._hoveredElement)
          return (this._hoveredModel = null), void this._updateHighlight();
        const e = this._hoveredElement,
          {selector: n, elements: o} = (0, t.generateSelector)(
            this._injectedScript,
            e,
          );
        (this._hoveredModel && this._hoveredModel.selector === n) ||
          this._hoveredElement !== e ||
          ((this._hoveredModel = n ? {selector: n, elements: o} : null),
          this._updateHighlight(),
          this._params.isUnderTest &&
            console.error('Highlight updated for test: ' + n));
      }
      _updateHighlight() {
        const e = this._hoveredModel ? this._hoveredModel.elements : [];
        (this._tooltipElement.textContent = this._hoveredModel
          ? this._hoveredModel.selector
          : ''),
          (this._tooltipElement.style.top = '0'),
          (this._tooltipElement.style.left = '0'),
          (this._tooltipElement.style.display = 'flex');
        const t = e.map((e) => e.getBoundingClientRect()),
          n = this._tooltipElement.offsetWidth,
          o = this._tooltipElement.offsetHeight,
          r = this._innerGlassPaneElement.offsetWidth,
          i = this._innerGlassPaneElement.offsetHeight;
        if (t.length) {
          const e = t[0];
          let s = e.left;
          s + n > r - 5 && (s = r - n - 5);
          let c = e.bottom + 5;
          c + o > i - 5 && (c = e.top > o + 5 ? e.top - o - 5 : i - 5 - o),
            (this._tooltipElement.style.top = c + 'px'),
            (this._tooltipElement.style.left = s + 'px');
        } else this._tooltipElement.style.display = 'none';
        const s = this._highlightElements;
        this._highlightElements = [];
        for (const e of t) {
          const t = s.length ? s.shift() : this._createHighlightElement(),
            n = 'recording' === this._mode ? '#dc6f6f7f' : '#6fa8dc7f';
          (t.style.backgroundColor = this._highlightElements.length
            ? '#f6b26b7f'
            : n),
            (t.style.left = e.x + 'px'),
            (t.style.top = e.y + 'px'),
            (t.style.width = e.width + 'px'),
            (t.style.height = e.height + 'px'),
            (t.style.display = 'block'),
            this._highlightElements.push(t);
        }
        for (const e of s)
          (e.style.display = 'none'), this._highlightElements.push(e);
      }
      _createHighlightElement() {
        const e = document.createElement('x-pw-highlight');
        return (
          (e.style.position = 'absolute'),
          (e.style.top = '0'),
          (e.style.left = '0'),
          (e.style.width = '0'),
          (e.style.height = '0'),
          (e.style.boxSizing = 'border-box'),
          this._glassPaneShadow.appendChild(e),
          e
        );
      }
      _onInput(e) {
        if ('recording' !== this._mode) return !0;
        const t = this._deepEventTarget(e);
        if (['INPUT', 'TEXTAREA'].includes(t.nodeName)) {
          const n = t,
            o = (n.type || '').toLowerCase();
          if ('checkbox' === o) return;
          if ('file' === o)
            return void globalThis._playwrightRecorderRecordAction({
              name: 'setInputFiles',
              selector: this._activeModel.selector,
              signals: [],
              files: [...(n.files || [])].map((e) => e.name),
            });
          if (this._consumedDueWrongTarget(e)) return;
          globalThis._playwrightRecorderRecordAction({
            name: 'fill',
            selector: this._activeModel.selector,
            signals: [],
            text: n.value,
          });
        }
        if ('SELECT' === t.nodeName) {
          const n = t;
          if (this._actionInProgress(e)) return;
          this._performAction({
            name: 'select',
            selector: this._hoveredModel.selector,
            options: [...n.selectedOptions].map((e) => e.value),
            signals: [],
          });
        }
      }
      _shouldGenerateKeyPressFor(e) {
        if (['Backspace', 'Delete', 'AltGraph'].includes(e.key)) return !1;
        if ('@' === e.key && 'KeyL' === e.code) return !1;
        if (navigator.platform.includes('Mac')) {
          if ('v' === e.key && e.metaKey) return !1;
        } else {
          if ('v' === e.key && e.ctrlKey) return !1;
          if ('Insert' === e.key && e.shiftKey) return !1;
        }
        if (['Shift', 'Control', 'Meta', 'Alt'].includes(e.key)) return !1;
        const t = e.ctrlKey || e.altKey || e.metaKey;
        return !(1 === e.key.length && !t && !l(this._deepEventTarget(e)));
      }
      _onKeyDown(e) {
        if ('inspecting' !== this._mode) {
          if ('recording' !== this._mode) return !0;
          if (this._shouldGenerateKeyPressFor(e))
            if (this._actionInProgress(e)) this._expectProgrammaticKeyUp = !0;
            else if (!this._consumedDueWrongTarget(e)) {
              if (' ' === e.key) {
                const t = l(this._deepEventTarget(e));
                if (t)
                  return void this._performAction({
                    name: t.checked ? 'uncheck' : 'check',
                    selector: this._activeModel.selector,
                    signals: [],
                  });
              }
              this._performAction({
                name: 'press',
                selector: this._activeModel.selector,
                signals: [],
                key: e.key,
                modifiers: r(e),
              });
            }
        } else c(e);
      }
      _onKeyUp(e) {
        this._shouldGenerateKeyPressFor(e) &&
          (this._expectProgrammaticKeyUp
            ? (this._expectProgrammaticKeyUp = !1)
            : c(e));
      }
      async _performAction(e) {
        (this._performingAction = !0),
          await globalThis._playwrightRecorderPerformAction(e).catch(() => {}),
          (this._performingAction = !1),
          this._updateModelForHoveredElement(),
          this._onFocus(),
          this._params.isUnderTest &&
            console.error(
              'Action performed for test: ' +
                JSON.stringify({
                  hovered: this._hoveredModel
                    ? this._hoveredModel.selector
                    : null,
                  active: this._activeModel ? this._activeModel.selector : null,
                }),
            );
      }
      _deepEventTarget(e) {
        return e.composedPath()[0];
      }
      _deepActiveElement(e) {
        let t = e.activeElement;
        for (; t && t.shadowRoot && t.shadowRoot.activeElement; )
          t = t.shadowRoot.activeElement;
        return t;
      }
    };
    e.default = h;
  })(),
    (pwExport = o.default);
})();
