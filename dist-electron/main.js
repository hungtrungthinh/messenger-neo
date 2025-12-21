import { fileURLToPath as Rv } from "node:url";
import Ce from "node:path";
import Wt, { net as Pv, app as ht, ipcMain as v0, shell as Ba, Menu as Uc, BrowserWindow as _0, Tray as Tv } from "electron";
import He from "node:process";
import { promisify as rt, isDeepStrictEqual as Ol } from "node:util";
import Re from "node:fs";
import yr, { randomUUID as Ov } from "node:crypto";
import Nl from "node:assert";
import E0 from "node:os";
import "node:events";
import "node:stream";
import ur from "fs";
import Nv from "constants";
import Cn from "stream";
import xc from "util";
import w0 from "assert";
import Ke from "path";
import Xa from "child_process";
import $0 from "events";
import Dn from "crypto";
import S0 from "tty";
import Ja from "os";
import Wr from "url";
import Iv from "string_decoder";
import b0 from "zlib";
import Av from "http";
const Or = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, R0 = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), P0 = 1e6, Cv = (e) => e >= "0" && e <= "9";
function T0(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= P0;
  }
  return !1;
}
function Ss(e, t) {
  return R0.has(e) ? !1 : (e && T0(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function Dv(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let o = "", n = "start", f = !1, r = 0;
  for (const i of e) {
    if (r++, f) {
      o += i, f = !1;
      continue;
    }
    if (i === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${i}' in an index at position ${r}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${i}' after an index at position ${r}`);
      f = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (i) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${i}' in an index at position ${r}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Ss(o, t))
          return [];
        o = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${i}' in an index at position ${r}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((o || n === "property") && !Ss(o, t))
            return [];
          o = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (o === "")
            o = (t.pop() || "") + "[]", n = "property";
          else {
            const c = Number.parseInt(o, 10);
            !Number.isNaN(c) && Number.isFinite(c) && c >= 0 && c <= Number.MAX_SAFE_INTEGER && c <= P0 && o === String(c) ? t.push(c) : t.push(o), o = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${i}' after an index at position ${r}`);
        o += i;
        break;
      }
      default: {
        if (n === "index" && !Cv(i))
          throw new Error(`Invalid character '${i}' in an index at position ${r}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${i}' after an index at position ${r}`);
        n === "start" && (n = "property"), o += i;
      }
    }
  }
  switch (f && (o += "\\"), n) {
    case "property": {
      if (!Ss(o, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function Qa(e) {
  if (typeof e == "string")
    return Dv(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [o, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${o}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${o} must be a finite number, got ${n}`);
      if (R0.has(n))
        return [];
      typeof n == "string" && T0(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Il(e, t, o) {
  if (!Or(e) || typeof t != "string" && !Array.isArray(t))
    return o === void 0 ? e : o;
  const n = Qa(t);
  if (n.length === 0)
    return o;
  for (let f = 0; f < n.length; f++) {
    const r = n[f];
    if (e = e[r], e == null) {
      if (f !== n.length - 1)
        return o;
      break;
    }
  }
  return e === void 0 ? o : e;
}
function Hn(e, t, o) {
  if (!Or(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, f = Qa(t);
  if (f.length === 0)
    return e;
  for (let r = 0; r < f.length; r++) {
    const i = f[r];
    if (r === f.length - 1)
      e[i] = o;
    else if (!Or(e[i])) {
      const s = typeof f[r + 1] == "number";
      e[i] = s ? [] : {};
    }
    e = e[i];
  }
  return n;
}
function kv(e, t) {
  if (!Or(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const o = Qa(t);
  if (o.length === 0)
    return !1;
  for (let n = 0; n < o.length; n++) {
    const f = o[n];
    if (n === o.length - 1)
      return Object.hasOwn(e, f) ? (delete e[f], !0) : !1;
    if (e = e[f], !Or(e))
      return !1;
  }
}
function bs(e, t) {
  if (!Or(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const o = Qa(t);
  if (o.length === 0)
    return !1;
  for (const n of o) {
    if (!Or(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const or = E0.homedir(), Vc = E0.tmpdir(), { env: zr } = He, qv = (e) => {
  const t = Ce.join(or, "Library");
  return {
    data: Ce.join(t, "Application Support", e),
    config: Ce.join(t, "Preferences", e),
    cache: Ce.join(t, "Caches", e),
    log: Ce.join(t, "Logs", e),
    temp: Ce.join(Vc, e)
  };
}, Lv = (e) => {
  const t = zr.APPDATA || Ce.join(or, "AppData", "Roaming"), o = zr.LOCALAPPDATA || Ce.join(or, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Ce.join(o, e, "Data"),
    config: Ce.join(t, e, "Config"),
    cache: Ce.join(o, e, "Cache"),
    log: Ce.join(o, e, "Log"),
    temp: Ce.join(Vc, e)
  };
}, Fv = (e) => {
  const t = Ce.basename(or);
  return {
    data: Ce.join(zr.XDG_DATA_HOME || Ce.join(or, ".local", "share"), e),
    config: Ce.join(zr.XDG_CONFIG_HOME || Ce.join(or, ".config"), e),
    cache: Ce.join(zr.XDG_CACHE_HOME || Ce.join(or, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Ce.join(zr.XDG_STATE_HOME || Ce.join(or, ".local", "state"), e),
    temp: Ce.join(Vc, t, e)
  };
};
function jv(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), He.platform === "darwin" ? qv(e) : He.platform === "win32" ? Lv(e) : Fv(e);
}
const Qt = (e, t) => {
  const { onError: o } = t;
  return function(...f) {
    return e.apply(void 0, f).catch(o);
  };
}, Ut = (e, t) => {
  const { onError: o } = t;
  return function(...f) {
    try {
      return e.apply(void 0, f);
    } catch (r) {
      return o(r);
    }
  };
}, Uv = 250, Zt = (e, t) => {
  const { isRetriable: o } = t;
  return function(f) {
    const { timeout: r } = f, i = f.interval ?? Uv, c = Date.now() + r;
    return function s(...u) {
      return e.apply(void 0, u).catch((a) => {
        if (!o(a) || Date.now() >= c)
          throw a;
        const d = Math.round(i * Math.random());
        return d > 0 ? new Promise((m) => setTimeout(m, d)).then(() => s.apply(void 0, u)) : s.apply(void 0, u);
      });
    };
  };
}, er = (e, t) => {
  const { isRetriable: o } = t;
  return function(f) {
    const { timeout: r } = f, i = Date.now() + r;
    return function(...s) {
      for (; ; )
        try {
          return e.apply(void 0, s);
        } catch (u) {
          if (!o(u) || Date.now() >= i)
            throw u;
          continue;
        }
    };
  };
}, Kr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Kr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Mv && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Kr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Kr.isNodeError(e))
      throw e;
    if (!Kr.isChangeErrorOk(e))
      throw e;
  }
}, zn = {
  onError: Kr.onChangeError
}, yt = {
  onError: () => {
  }
}, Mv = He.getuid ? !He.getuid() : !1, nt = {
  isRetriable: Kr.isRetriableError
}, st = {
  attempt: {
    /* ASYNC */
    chmod: Qt(rt(Re.chmod), zn),
    chown: Qt(rt(Re.chown), zn),
    close: Qt(rt(Re.close), yt),
    fsync: Qt(rt(Re.fsync), yt),
    mkdir: Qt(rt(Re.mkdir), yt),
    realpath: Qt(rt(Re.realpath), yt),
    stat: Qt(rt(Re.stat), yt),
    unlink: Qt(rt(Re.unlink), yt),
    /* SYNC */
    chmodSync: Ut(Re.chmodSync, zn),
    chownSync: Ut(Re.chownSync, zn),
    closeSync: Ut(Re.closeSync, yt),
    existsSync: Ut(Re.existsSync, yt),
    fsyncSync: Ut(Re.fsync, yt),
    mkdirSync: Ut(Re.mkdirSync, yt),
    realpathSync: Ut(Re.realpathSync, yt),
    statSync: Ut(Re.statSync, yt),
    unlinkSync: Ut(Re.unlinkSync, yt)
  },
  retry: {
    /* ASYNC */
    close: Zt(rt(Re.close), nt),
    fsync: Zt(rt(Re.fsync), nt),
    open: Zt(rt(Re.open), nt),
    readFile: Zt(rt(Re.readFile), nt),
    rename: Zt(rt(Re.rename), nt),
    stat: Zt(rt(Re.stat), nt),
    write: Zt(rt(Re.write), nt),
    writeFile: Zt(rt(Re.writeFile), nt),
    /* SYNC */
    closeSync: er(Re.closeSync, nt),
    fsyncSync: er(Re.fsyncSync, nt),
    openSync: er(Re.openSync, nt),
    readFileSync: er(Re.readFileSync, nt),
    renameSync: er(Re.renameSync, nt),
    statSync: er(Re.statSync, nt),
    writeSync: er(Re.writeSync, nt),
    writeFileSync: er(Re.writeFileSync, nt)
  }
}, xv = "utf8", Al = 438, Vv = 511, Gv = {}, Bv = He.geteuid ? He.geteuid() : -1, Hv = He.getegid ? He.getegid() : -1, zv = 1e3, Kv = !!He.getuid;
He.getuid && He.getuid();
const Cl = 128, Wv = (e) => e instanceof Error && "code" in e, Dl = (e) => typeof e == "string", Rs = (e) => e === void 0, Yv = He.platform === "linux", O0 = He.platform === "win32", Gc = ["SIGHUP", "SIGINT", "SIGTERM"];
O0 || Gc.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Yv && Gc.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Xv {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const o of this.callbacks)
          o();
        t && (O0 && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? He.kill(He.pid, "SIGTERM") : He.kill(He.pid, t));
      }
    }, this.hook = () => {
      He.once("exit", () => this.exit());
      for (const t of Gc)
        try {
          He.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Jv = new Xv(), Qv = Jv.register, ot = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), f = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${f}`;
  },
  get: (e, t, o = !0) => {
    const n = ot.truncate(t(e));
    return n in ot.store ? ot.get(e, t, o) : (ot.store[n] = o, [n, () => delete ot.store[n]]);
  },
  purge: (e) => {
    ot.store[e] && (delete ot.store[e], st.attempt.unlink(e));
  },
  purgeSync: (e) => {
    ot.store[e] && (delete ot.store[e], st.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in ot.store)
      ot.purgeSync(e);
  },
  truncate: (e) => {
    const t = Ce.basename(e);
    if (t.length <= Cl)
      return e;
    const o = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!o)
      return e;
    const n = t.length - Cl;
    return `${e.slice(0, -t.length)}${o[1]}${o[2].slice(0, -n)}${o[3]}`;
  }
};
Qv(ot.purgeSyncAll);
function N0(e, t, o = Gv) {
  if (Dl(o))
    return N0(e, t, { encoding: o });
  const f = { timeout: o.timeout ?? zv };
  let r = null, i = null, c = null;
  try {
    const s = st.attempt.realpathSync(e), u = !!s;
    e = s || e, [i, r] = ot.get(e, o.tmpCreate || ot.create, o.tmpPurge !== !1);
    const a = Kv && Rs(o.chown), d = Rs(o.mode);
    if (u && (a || d)) {
      const l = st.attempt.statSync(e);
      l && (o = { ...o }, a && (o.chown = { uid: l.uid, gid: l.gid }), d && (o.mode = l.mode));
    }
    if (!u) {
      const l = Ce.dirname(e);
      st.attempt.mkdirSync(l, {
        mode: Vv,
        recursive: !0
      });
    }
    c = st.retry.openSync(f)(i, "w", o.mode || Al), o.tmpCreated && o.tmpCreated(i), Dl(t) ? st.retry.writeSync(f)(c, t, 0, o.encoding || xv) : Rs(t) || st.retry.writeSync(f)(c, t, 0, t.length, 0), o.fsync !== !1 && (o.fsyncWait !== !1 ? st.retry.fsyncSync(f)(c) : st.attempt.fsync(c)), st.retry.closeSync(f)(c), c = null, o.chown && (o.chown.uid !== Bv || o.chown.gid !== Hv) && st.attempt.chownSync(i, o.chown.uid, o.chown.gid), o.mode && o.mode !== Al && st.attempt.chmodSync(i, o.mode);
    try {
      st.retry.renameSync(f)(i, e);
    } catch (l) {
      if (!Wv(l) || l.code !== "ENAMETOOLONG")
        throw l;
      st.retry.renameSync(f)(i, ot.truncate(e));
    }
    r(), i = null;
  } finally {
    c && st.attempt.closeSync(c), i && ot.purge(i);
  }
}
var Ot = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function I0(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Kn = { exports: {} }, Ps = {}, Mt = {}, gr = {}, Ts = {}, Os = {}, Ns = {}, kl;
function Ha() {
  return kl || (kl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class o extends t {
      constructor(p) {
        if (super(), !e.IDENTIFIER.test(p))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = p;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = o;
    class n extends t {
      constructor(p) {
        super(), this._items = typeof p == "string" ? [p] : p;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const p = this._items[0];
        return p === "" || p === '""';
      }
      get str() {
        var p;
        return (p = this._str) !== null && p !== void 0 ? p : this._str = this._items.reduce((E, b) => `${E}${b}`, "");
      }
      get names() {
        var p;
        return (p = this._names) !== null && p !== void 0 ? p : this._names = this._items.reduce((E, b) => (b instanceof o && (E[b.str] = (E[b.str] || 0) + 1), E), {});
      }
    }
    e._Code = n, e.nil = new n("");
    function f(y, ...p) {
      const E = [y[0]];
      let b = 0;
      for (; b < p.length; )
        c(E, p[b]), E.push(y[++b]);
      return new n(E);
    }
    e._ = f;
    const r = new n("+");
    function i(y, ...p) {
      const E = [m(y[0])];
      let b = 0;
      for (; b < p.length; )
        E.push(r), c(E, p[b]), E.push(r, m(y[++b]));
      return s(E), new n(E);
    }
    e.str = i;
    function c(y, p) {
      p instanceof n ? y.push(...p._items) : p instanceof o ? y.push(p) : y.push(d(p));
    }
    e.addCodeArg = c;
    function s(y) {
      let p = 1;
      for (; p < y.length - 1; ) {
        if (y[p] === r) {
          const E = u(y[p - 1], y[p + 1]);
          if (E !== void 0) {
            y.splice(p - 1, 3, E);
            continue;
          }
          y[p++] = "+";
        }
        p++;
      }
    }
    function u(y, p) {
      if (p === '""')
        return y;
      if (y === '""')
        return p;
      if (typeof y == "string")
        return p instanceof o || y[y.length - 1] !== '"' ? void 0 : typeof p != "string" ? `${y.slice(0, -1)}${p}"` : p[0] === '"' ? y.slice(0, -1) + p.slice(1) : void 0;
      if (typeof p == "string" && p[0] === '"' && !(y instanceof o))
        return `"${y}${p.slice(1)}`;
    }
    function a(y, p) {
      return p.emptyStr() ? y : y.emptyStr() ? p : i`${y}${p}`;
    }
    e.strConcat = a;
    function d(y) {
      return typeof y == "number" || typeof y == "boolean" || y === null ? y : m(Array.isArray(y) ? y.join(",") : y);
    }
    function l(y) {
      return new n(m(y));
    }
    e.stringify = l;
    function m(y) {
      return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = m;
    function g(y) {
      return typeof y == "string" && e.IDENTIFIER.test(y) ? new n(`.${y}`) : f`[${y}]`;
    }
    e.getProperty = g;
    function v(y) {
      if (typeof y == "string" && e.IDENTIFIER.test(y))
        return new n(`${y}`);
      throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
    }
    e.getEsmExportName = v;
    function h(y) {
      return new n(y.toString());
    }
    e.regexpCode = h;
  })(Ns)), Ns;
}
var Is = {}, ql;
function Ll() {
  return ql || (ql = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = Ha();
    class o extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var n;
    (function(s) {
      s[s.Started = 0] = "Started", s[s.Completed = 1] = "Completed";
    })(n || (e.UsedValueState = n = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class f {
      constructor({ prefixes: u, parent: a } = {}) {
        this._names = {}, this._prefixes = u, this._parent = a;
      }
      toName(u) {
        return u instanceof t.Name ? u : this.name(u);
      }
      name(u) {
        return new t.Name(this._newName(u));
      }
      _newName(u) {
        const a = this._names[u] || this._nameGroup(u);
        return `${u}${a.index++}`;
      }
      _nameGroup(u) {
        var a, d;
        if (!((d = (a = this._parent) === null || a === void 0 ? void 0 : a._prefixes) === null || d === void 0) && d.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    e.Scope = f;
    class r extends t.Name {
      constructor(u, a) {
        super(a), this.prefix = u;
      }
      setValue(u, { property: a, itemIndex: d }) {
        this.value = u, this.scopePath = (0, t._)`.${new t.Name(a)}[${d}]`;
      }
    }
    e.ValueScopeName = r;
    const i = (0, t._)`\n`;
    class c extends f {
      constructor(u) {
        super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? i : t.nil };
      }
      get() {
        return this._scope;
      }
      name(u) {
        return new r(u, this._newName(u));
      }
      value(u, a) {
        var d;
        if (a.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const l = this.toName(u), { prefix: m } = l, g = (d = a.key) !== null && d !== void 0 ? d : a.ref;
        let v = this._values[m];
        if (v) {
          const p = v.get(g);
          if (p)
            return p;
        } else
          v = this._values[m] = /* @__PURE__ */ new Map();
        v.set(g, l);
        const h = this._scope[m] || (this._scope[m] = []), y = h.length;
        return h[y] = a.ref, l.setValue(a, { property: m, itemIndex: y }), l;
      }
      getValue(u, a) {
        const d = this._values[u];
        if (d)
          return d.get(a);
      }
      scopeRefs(u, a = this._values) {
        return this._reduceValues(a, (d) => {
          if (d.scopePath === void 0)
            throw new Error(`CodeGen: name "${d}" has no value`);
          return (0, t._)`${u}${d.scopePath}`;
        });
      }
      scopeCode(u = this._values, a, d) {
        return this._reduceValues(u, (l) => {
          if (l.value === void 0)
            throw new Error(`CodeGen: name "${l}" has no value`);
          return l.value.code;
        }, a, d);
      }
      _reduceValues(u, a, d = {}, l) {
        let m = t.nil;
        for (const g in u) {
          const v = u[g];
          if (!v)
            continue;
          const h = d[g] = d[g] || /* @__PURE__ */ new Map();
          v.forEach((y) => {
            if (h.has(y))
              return;
            h.set(y, n.Started);
            let p = a(y);
            if (p) {
              const E = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              m = (0, t._)`${m}${E} ${y} = ${p};${this.opts._n}`;
            } else if (p = l?.(y))
              m = (0, t._)`${m}${p}${this.opts._n}`;
            else
              throw new o(y);
            h.set(y, n.Completed);
          });
        }
        return m;
      }
    }
    e.ValueScope = c;
  })(Is)), Is;
}
var Fl;
function Te() {
  return Fl || (Fl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = Ha(), o = Ll();
    var n = Ha();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var f = Ll();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return f.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return f.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return f.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return f.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class r {
      optimizeNodes() {
        return this;
      }
      optimizeNames(R, O) {
        return this;
      }
    }
    class i extends r {
      constructor(R, O, x) {
        super(), this.varKind = R, this.name = O, this.rhs = x;
      }
      render({ es5: R, _n: O }) {
        const x = R ? o.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${x} ${this.name}${I};` + O;
      }
      optimizeNames(R, O) {
        if (R[this.name.str])
          return this.rhs && (this.rhs = k(this.rhs, R, O)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class c extends r {
      constructor(R, O, x) {
        super(), this.lhs = R, this.rhs = O, this.sideEffects = x;
      }
      render({ _n: R }) {
        return `${this.lhs} = ${this.rhs};` + R;
      }
      optimizeNames(R, O) {
        if (!(this.lhs instanceof t.Name && !R[this.lhs.str] && !this.sideEffects))
          return this.rhs = k(this.rhs, R, O), this;
      }
      get names() {
        const R = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return K(R, this.rhs);
      }
    }
    class s extends c {
      constructor(R, O, x, I) {
        super(R, x, I), this.op = O;
      }
      render({ _n: R }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + R;
      }
    }
    class u extends r {
      constructor(R) {
        super(), this.label = R, this.names = {};
      }
      render({ _n: R }) {
        return `${this.label}:` + R;
      }
    }
    class a extends r {
      constructor(R) {
        super(), this.label = R, this.names = {};
      }
      render({ _n: R }) {
        return `break${this.label ? ` ${this.label}` : ""};` + R;
      }
    }
    class d extends r {
      constructor(R) {
        super(), this.error = R;
      }
      render({ _n: R }) {
        return `throw ${this.error};` + R;
      }
      get names() {
        return this.error.names;
      }
    }
    class l extends r {
      constructor(R) {
        super(), this.code = R;
      }
      render({ _n: R }) {
        return `${this.code};` + R;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(R, O) {
        return this.code = k(this.code, R, O), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class m extends r {
      constructor(R = []) {
        super(), this.nodes = R;
      }
      render(R) {
        return this.nodes.reduce((O, x) => O + x.render(R), "");
      }
      optimizeNodes() {
        const { nodes: R } = this;
        let O = R.length;
        for (; O--; ) {
          const x = R[O].optimizeNodes();
          Array.isArray(x) ? R.splice(O, 1, ...x) : x ? R[O] = x : R.splice(O, 1);
        }
        return R.length > 0 ? this : void 0;
      }
      optimizeNames(R, O) {
        const { nodes: x } = this;
        let I = x.length;
        for (; I--; ) {
          const N = x[I];
          N.optimizeNames(R, O) || (F(R, N.names), x.splice(I, 1));
        }
        return x.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((R, O) => M(R, O.names), {});
      }
    }
    class g extends m {
      render(R) {
        return "{" + R._n + super.render(R) + "}" + R._n;
      }
    }
    class v extends m {
    }
    class h extends g {
    }
    h.kind = "else";
    class y extends g {
      constructor(R, O) {
        super(O), this.condition = R;
      }
      render(R) {
        let O = `if(${this.condition})` + super.render(R);
        return this.else && (O += "else " + this.else.render(R)), O;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const R = this.condition;
        if (R === !0)
          return this.nodes;
        let O = this.else;
        if (O) {
          const x = O.optimizeNodes();
          O = this.else = Array.isArray(x) ? new h(x) : x;
        }
        if (O)
          return R === !1 ? O instanceof y ? O : O.nodes : this.nodes.length ? this : new y(X(R), O instanceof y ? [O] : O.nodes);
        if (!(R === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(R, O) {
        var x;
        if (this.else = (x = this.else) === null || x === void 0 ? void 0 : x.optimizeNames(R, O), !!(super.optimizeNames(R, O) || this.else))
          return this.condition = k(this.condition, R, O), this;
      }
      get names() {
        const R = super.names;
        return K(R, this.condition), this.else && M(R, this.else.names), R;
      }
    }
    y.kind = "if";
    class p extends g {
    }
    p.kind = "for";
    class E extends p {
      constructor(R) {
        super(), this.iteration = R;
      }
      render(R) {
        return `for(${this.iteration})` + super.render(R);
      }
      optimizeNames(R, O) {
        if (super.optimizeNames(R, O))
          return this.iteration = k(this.iteration, R, O), this;
      }
      get names() {
        return M(super.names, this.iteration.names);
      }
    }
    class b extends p {
      constructor(R, O, x, I) {
        super(), this.varKind = R, this.name = O, this.from = x, this.to = I;
      }
      render(R) {
        const O = R.es5 ? o.varKinds.var : this.varKind, { name: x, from: I, to: N } = this;
        return `for(${O} ${x}=${I}; ${x}<${N}; ${x}++)` + super.render(R);
      }
      get names() {
        const R = K(super.names, this.from);
        return K(R, this.to);
      }
    }
    class $ extends p {
      constructor(R, O, x, I) {
        super(), this.loop = R, this.varKind = O, this.name = x, this.iterable = I;
      }
      render(R) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(R);
      }
      optimizeNames(R, O) {
        if (super.optimizeNames(R, O))
          return this.iterable = k(this.iterable, R, O), this;
      }
      get names() {
        return M(super.names, this.iterable.names);
      }
    }
    class _ extends g {
      constructor(R, O, x) {
        super(), this.name = R, this.args = O, this.async = x;
      }
      render(R) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(R);
      }
    }
    _.kind = "func";
    class w extends m {
      render(R) {
        return "return " + super.render(R);
      }
    }
    w.kind = "return";
    class P extends g {
      render(R) {
        let O = "try" + super.render(R);
        return this.catch && (O += this.catch.render(R)), this.finally && (O += this.finally.render(R)), O;
      }
      optimizeNodes() {
        var R, O;
        return super.optimizeNodes(), (R = this.catch) === null || R === void 0 || R.optimizeNodes(), (O = this.finally) === null || O === void 0 || O.optimizeNodes(), this;
      }
      optimizeNames(R, O) {
        var x, I;
        return super.optimizeNames(R, O), (x = this.catch) === null || x === void 0 || x.optimizeNames(R, O), (I = this.finally) === null || I === void 0 || I.optimizeNames(R, O), this;
      }
      get names() {
        const R = super.names;
        return this.catch && M(R, this.catch.names), this.finally && M(R, this.finally.names), R;
      }
    }
    class T extends g {
      constructor(R) {
        super(), this.error = R;
      }
      render(R) {
        return `catch(${this.error})` + super.render(R);
      }
    }
    T.kind = "catch";
    class G extends g {
      render(R) {
        return "finally" + super.render(R);
      }
    }
    G.kind = "finally";
    class L {
      constructor(R, O = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...O, _n: O.lines ? `
` : "" }, this._extScope = R, this._scope = new o.Scope({ parent: R }), this._nodes = [new v()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(R) {
        return this._scope.name(R);
      }
      // reserves unique name in the external scope
      scopeName(R) {
        return this._extScope.name(R);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(R, O) {
        const x = this._extScope.value(R, O);
        return (this._values[x.prefix] || (this._values[x.prefix] = /* @__PURE__ */ new Set())).add(x), x;
      }
      getScopeValue(R, O) {
        return this._extScope.getValue(R, O);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(R) {
        return this._extScope.scopeRefs(R, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(R, O, x, I) {
        const N = this._scope.toName(O);
        return x !== void 0 && I && (this._constants[N.str] = x), this._leafNode(new i(R, N, x)), N;
      }
      // `const` declaration (`var` in es5 mode)
      const(R, O, x) {
        return this._def(o.varKinds.const, R, O, x);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(R, O, x) {
        return this._def(o.varKinds.let, R, O, x);
      }
      // `var` declaration with optional assignment
      var(R, O, x) {
        return this._def(o.varKinds.var, R, O, x);
      }
      // assignment code
      assign(R, O, x) {
        return this._leafNode(new c(R, O, x));
      }
      // `+=` code
      add(R, O) {
        return this._leafNode(new s(R, e.operators.ADD, O));
      }
      // appends passed SafeExpr to code or executes Block
      code(R) {
        return typeof R == "function" ? R() : R !== t.nil && this._leafNode(new l(R)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...R) {
        const O = ["{"];
        for (const [x, I] of R)
          O.length > 1 && O.push(","), O.push(x), (x !== I || this.opts.es5) && (O.push(":"), (0, t.addCodeArg)(O, I));
        return O.push("}"), new t._Code(O);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(R, O, x) {
        if (this._blockNode(new y(R)), O && x)
          this.code(O).else().code(x).endIf();
        else if (O)
          this.code(O).endIf();
        else if (x)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(R) {
        return this._elseNode(new y(R));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(y, h);
      }
      _for(R, O) {
        return this._blockNode(R), O && this.code(O).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(R, O) {
        return this._for(new E(R), O);
      }
      // `for` statement for a range of values
      forRange(R, O, x, I, N = this.opts.es5 ? o.varKinds.var : o.varKinds.let) {
        const Q = this._scope.toName(R);
        return this._for(new b(N, Q, O, x), () => I(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(R, O, x, I = o.varKinds.const) {
        const N = this._scope.toName(R);
        if (this.opts.es5) {
          const Q = O instanceof t.Name ? O : this.var("_arr", O);
          return this.forRange("_i", 0, (0, t._)`${Q}.length`, (H) => {
            this.var(N, (0, t._)`${Q}[${H}]`), x(N);
          });
        }
        return this._for(new $("of", I, N, O), () => x(N));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(R, O, x, I = this.opts.es5 ? o.varKinds.var : o.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(R, (0, t._)`Object.keys(${O})`, x);
        const N = this._scope.toName(R);
        return this._for(new $("in", I, N, O), () => x(N));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(p);
      }
      // `label` statement
      label(R) {
        return this._leafNode(new u(R));
      }
      // `break` statement
      break(R) {
        return this._leafNode(new a(R));
      }
      // `return` statement
      return(R) {
        const O = new w();
        if (this._blockNode(O), this.code(R), O.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(w);
      }
      // `try` statement
      try(R, O, x) {
        if (!O && !x)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const I = new P();
        if (this._blockNode(I), this.code(R), O) {
          const N = this.name("e");
          this._currNode = I.catch = new T(N), O(N);
        }
        return x && (this._currNode = I.finally = new G(), this.code(x)), this._endBlockNode(T, G);
      }
      // `throw` statement
      throw(R) {
        return this._leafNode(new d(R));
      }
      // start self-balancing block
      block(R, O) {
        return this._blockStarts.push(this._nodes.length), R && this.code(R).endBlock(O), this;
      }
      // end the current self-balancing block
      endBlock(R) {
        const O = this._blockStarts.pop();
        if (O === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const x = this._nodes.length - O;
        if (x < 0 || R !== void 0 && x !== R)
          throw new Error(`CodeGen: wrong number of nodes: ${x} vs ${R} expected`);
        return this._nodes.length = O, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(R, O = t.nil, x, I) {
        return this._blockNode(new _(R, O, x)), I && this.code(I).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(_);
      }
      optimize(R = 1) {
        for (; R-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(R) {
        return this._currNode.nodes.push(R), this;
      }
      _blockNode(R) {
        this._currNode.nodes.push(R), this._nodes.push(R);
      }
      _endBlockNode(R, O) {
        const x = this._currNode;
        if (x instanceof R || O && x instanceof O)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${O ? `${R.kind}/${O.kind}` : R.kind}"`);
      }
      _elseNode(R) {
        const O = this._currNode;
        if (!(O instanceof y))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = O.else = R, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const R = this._nodes;
        return R[R.length - 1];
      }
      set _currNode(R) {
        const O = this._nodes;
        O[O.length - 1] = R;
      }
    }
    e.CodeGen = L;
    function M(D, R) {
      for (const O in R)
        D[O] = (D[O] || 0) + (R[O] || 0);
      return D;
    }
    function K(D, R) {
      return R instanceof t._CodeOrName ? M(D, R.names) : D;
    }
    function k(D, R, O) {
      if (D instanceof t.Name)
        return x(D);
      if (!I(D))
        return D;
      return new t._Code(D._items.reduce((N, Q) => (Q instanceof t.Name && (Q = x(Q)), Q instanceof t._Code ? N.push(...Q._items) : N.push(Q), N), []));
      function x(N) {
        const Q = O[N.str];
        return Q === void 0 || R[N.str] !== 1 ? N : (delete R[N.str], Q);
      }
      function I(N) {
        return N instanceof t._Code && N._items.some((Q) => Q instanceof t.Name && R[Q.str] === 1 && O[Q.str] !== void 0);
      }
    }
    function F(D, R) {
      for (const O in R)
        D[O] = (D[O] || 0) - (R[O] || 0);
    }
    function X(D) {
      return typeof D == "boolean" || typeof D == "number" || D === null ? !D : (0, t._)`!${U(D)}`;
    }
    e.not = X;
    const B = C(e.operators.AND);
    function Y(...D) {
      return D.reduce(B);
    }
    e.and = Y;
    const Z = C(e.operators.OR);
    function V(...D) {
      return D.reduce(Z);
    }
    e.or = V;
    function C(D) {
      return (R, O) => R === t.nil ? O : O === t.nil ? R : (0, t._)`${U(R)} ${D} ${U(O)}`;
    }
    function U(D) {
      return D instanceof t.Name ? D : (0, t._)`(${D})`;
    }
  })(Os)), Os;
}
var Ie = {}, jl;
function Le() {
  if (jl) return Ie;
  jl = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.checkStrictMode = Ie.getErrorPath = Ie.Type = Ie.useFunc = Ie.setEvaluated = Ie.evaluatedPropsToName = Ie.mergeEvaluated = Ie.eachItem = Ie.unescapeJsonPointer = Ie.escapeJsonPointer = Ie.escapeFragment = Ie.unescapeFragment = Ie.schemaRefOrVal = Ie.schemaHasRulesButRef = Ie.schemaHasRules = Ie.checkUnknownRules = Ie.alwaysValidSchema = Ie.toHash = void 0;
  const e = Te(), t = Ha();
  function o($) {
    const _ = {};
    for (const w of $)
      _[w] = !0;
    return _;
  }
  Ie.toHash = o;
  function n($, _) {
    return typeof _ == "boolean" ? _ : Object.keys(_).length === 0 ? !0 : (f($, _), !r(_, $.self.RULES.all));
  }
  Ie.alwaysValidSchema = n;
  function f($, _ = $.schema) {
    const { opts: w, self: P } = $;
    if (!w.strictSchema || typeof _ == "boolean")
      return;
    const T = P.RULES.keywords;
    for (const G in _)
      T[G] || b($, `unknown keyword: "${G}"`);
  }
  Ie.checkUnknownRules = f;
  function r($, _) {
    if (typeof $ == "boolean")
      return !$;
    for (const w in $)
      if (_[w])
        return !0;
    return !1;
  }
  Ie.schemaHasRules = r;
  function i($, _) {
    if (typeof $ == "boolean")
      return !$;
    for (const w in $)
      if (w !== "$ref" && _.all[w])
        return !0;
    return !1;
  }
  Ie.schemaHasRulesButRef = i;
  function c({ topSchemaRef: $, schemaPath: _ }, w, P, T) {
    if (!T) {
      if (typeof w == "number" || typeof w == "boolean")
        return w;
      if (typeof w == "string")
        return (0, e._)`${w}`;
    }
    return (0, e._)`${$}${_}${(0, e.getProperty)(P)}`;
  }
  Ie.schemaRefOrVal = c;
  function s($) {
    return d(decodeURIComponent($));
  }
  Ie.unescapeFragment = s;
  function u($) {
    return encodeURIComponent(a($));
  }
  Ie.escapeFragment = u;
  function a($) {
    return typeof $ == "number" ? `${$}` : $.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  Ie.escapeJsonPointer = a;
  function d($) {
    return $.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  Ie.unescapeJsonPointer = d;
  function l($, _) {
    if (Array.isArray($))
      for (const w of $)
        _(w);
    else
      _($);
  }
  Ie.eachItem = l;
  function m({ mergeNames: $, mergeToName: _, mergeValues: w, resultToName: P }) {
    return (T, G, L, M) => {
      const K = L === void 0 ? G : L instanceof e.Name ? (G instanceof e.Name ? $(T, G, L) : _(T, G, L), L) : G instanceof e.Name ? (_(T, L, G), G) : w(G, L);
      return M === e.Name && !(K instanceof e.Name) ? P(T, K) : K;
    };
  }
  Ie.mergeEvaluated = {
    props: m({
      mergeNames: ($, _, w) => $.if((0, e._)`${w} !== true && ${_} !== undefined`, () => {
        $.if((0, e._)`${_} === true`, () => $.assign(w, !0), () => $.assign(w, (0, e._)`${w} || {}`).code((0, e._)`Object.assign(${w}, ${_})`));
      }),
      mergeToName: ($, _, w) => $.if((0, e._)`${w} !== true`, () => {
        _ === !0 ? $.assign(w, !0) : ($.assign(w, (0, e._)`${w} || {}`), v($, w, _));
      }),
      mergeValues: ($, _) => $ === !0 ? !0 : { ...$, ..._ },
      resultToName: g
    }),
    items: m({
      mergeNames: ($, _, w) => $.if((0, e._)`${w} !== true && ${_} !== undefined`, () => $.assign(w, (0, e._)`${_} === true ? true : ${w} > ${_} ? ${w} : ${_}`)),
      mergeToName: ($, _, w) => $.if((0, e._)`${w} !== true`, () => $.assign(w, _ === !0 ? !0 : (0, e._)`${w} > ${_} ? ${w} : ${_}`)),
      mergeValues: ($, _) => $ === !0 ? !0 : Math.max($, _),
      resultToName: ($, _) => $.var("items", _)
    })
  };
  function g($, _) {
    if (_ === !0)
      return $.var("props", !0);
    const w = $.var("props", (0, e._)`{}`);
    return _ !== void 0 && v($, w, _), w;
  }
  Ie.evaluatedPropsToName = g;
  function v($, _, w) {
    Object.keys(w).forEach((P) => $.assign((0, e._)`${_}${(0, e.getProperty)(P)}`, !0));
  }
  Ie.setEvaluated = v;
  const h = {};
  function y($, _) {
    return $.scopeValue("func", {
      ref: _,
      code: h[_.code] || (h[_.code] = new t._Code(_.code))
    });
  }
  Ie.useFunc = y;
  var p;
  (function($) {
    $[$.Num = 0] = "Num", $[$.Str = 1] = "Str";
  })(p || (Ie.Type = p = {}));
  function E($, _, w) {
    if ($ instanceof e.Name) {
      const P = _ === p.Num;
      return w ? P ? (0, e._)`"[" + ${$} + "]"` : (0, e._)`"['" + ${$} + "']"` : P ? (0, e._)`"/" + ${$}` : (0, e._)`"/" + ${$}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return w ? (0, e.getProperty)($).toString() : "/" + a($);
  }
  Ie.getErrorPath = E;
  function b($, _, w = $.opts.strictSchema) {
    if (w) {
      if (_ = `strict mode: ${_}`, w === !0)
        throw new Error(_);
      $.self.logger.warn(_);
    }
  }
  return Ie.checkStrictMode = b, Ie;
}
var Wn = {}, Ul;
function Nt() {
  if (Ul) return Wn;
  Ul = 1, Object.defineProperty(Wn, "__esModule", { value: !0 });
  const e = Te(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Wn.default = t, Wn;
}
var Ml;
function Za() {
  return Ml || (Ml = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = Te(), o = Le(), n = Nt();
    e.keywordError = {
      message: ({ keyword: h }) => (0, t.str)`must pass "${h}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: h, schemaType: y }) => y ? (0, t.str)`"${h}" keyword must be ${y} ($data)` : (0, t.str)`"${h}" keyword is invalid ($data)`
    };
    function f(h, y = e.keywordError, p, E) {
      const { it: b } = h, { gen: $, compositeRule: _, allErrors: w } = b, P = d(h, y, p);
      E ?? (_ || w) ? s($, P) : u(b, (0, t._)`[${P}]`);
    }
    e.reportError = f;
    function r(h, y = e.keywordError, p) {
      const { it: E } = h, { gen: b, compositeRule: $, allErrors: _ } = E, w = d(h, y, p);
      s(b, w), $ || _ || u(E, n.default.vErrors);
    }
    e.reportExtraError = r;
    function i(h, y) {
      h.assign(n.default.errors, y), h.if((0, t._)`${n.default.vErrors} !== null`, () => h.if(y, () => h.assign((0, t._)`${n.default.vErrors}.length`, y), () => h.assign(n.default.vErrors, null)));
    }
    e.resetErrorsCount = i;
    function c({ gen: h, keyword: y, schemaValue: p, data: E, errsCount: b, it: $ }) {
      if (b === void 0)
        throw new Error("ajv implementation error");
      const _ = h.name("err");
      h.forRange("i", b, n.default.errors, (w) => {
        h.const(_, (0, t._)`${n.default.vErrors}[${w}]`), h.if((0, t._)`${_}.instancePath === undefined`, () => h.assign((0, t._)`${_}.instancePath`, (0, t.strConcat)(n.default.instancePath, $.errorPath))), h.assign((0, t._)`${_}.schemaPath`, (0, t.str)`${$.errSchemaPath}/${y}`), $.opts.verbose && (h.assign((0, t._)`${_}.schema`, p), h.assign((0, t._)`${_}.data`, E));
      });
    }
    e.extendErrors = c;
    function s(h, y) {
      const p = h.const("err", y);
      h.if((0, t._)`${n.default.vErrors} === null`, () => h.assign(n.default.vErrors, (0, t._)`[${p}]`), (0, t._)`${n.default.vErrors}.push(${p})`), h.code((0, t._)`${n.default.errors}++`);
    }
    function u(h, y) {
      const { gen: p, validateName: E, schemaEnv: b } = h;
      b.$async ? p.throw((0, t._)`new ${h.ValidationError}(${y})`) : (p.assign((0, t._)`${E}.errors`, y), p.return(!1));
    }
    const a = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function d(h, y, p) {
      const { createErrors: E } = h.it;
      return E === !1 ? (0, t._)`{}` : l(h, y, p);
    }
    function l(h, y, p = {}) {
      const { gen: E, it: b } = h, $ = [
        m(b, p),
        g(h, p)
      ];
      return v(h, y, $), E.object(...$);
    }
    function m({ errorPath: h }, { instancePath: y }) {
      const p = y ? (0, t.str)`${h}${(0, o.getErrorPath)(y, o.Type.Str)}` : h;
      return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, p)];
    }
    function g({ keyword: h, it: { errSchemaPath: y } }, { schemaPath: p, parentSchema: E }) {
      let b = E ? y : (0, t.str)`${y}/${h}`;
      return p && (b = (0, t.str)`${b}${(0, o.getErrorPath)(p, o.Type.Str)}`), [a.schemaPath, b];
    }
    function v(h, { params: y, message: p }, E) {
      const { keyword: b, data: $, schemaValue: _, it: w } = h, { opts: P, propertyName: T, topSchemaRef: G, schemaPath: L } = w;
      E.push([a.keyword, b], [a.params, typeof y == "function" ? y(h) : y || (0, t._)`{}`]), P.messages && E.push([a.message, typeof p == "function" ? p(h) : p]), P.verbose && E.push([a.schema, _], [a.parentSchema, (0, t._)`${G}${L}`], [n.default.data, $]), T && E.push([a.propertyName, T]);
    }
  })(Ts)), Ts;
}
var xl;
function Zv() {
  if (xl) return gr;
  xl = 1, Object.defineProperty(gr, "__esModule", { value: !0 }), gr.boolOrEmptySchema = gr.topBoolOrEmptySchema = void 0;
  const e = Za(), t = Te(), o = Nt(), n = {
    message: "boolean schema is false"
  };
  function f(c) {
    const { gen: s, schema: u, validateName: a } = c;
    u === !1 ? i(c, !1) : typeof u == "object" && u.$async === !0 ? s.return(o.default.data) : (s.assign((0, t._)`${a}.errors`, null), s.return(!0));
  }
  gr.topBoolOrEmptySchema = f;
  function r(c, s) {
    const { gen: u, schema: a } = c;
    a === !1 ? (u.var(s, !1), i(c)) : u.var(s, !0);
  }
  gr.boolOrEmptySchema = r;
  function i(c, s) {
    const { gen: u, data: a } = c, d = {
      gen: u,
      keyword: "false schema",
      data: a,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(d, n, void 0, s);
  }
  return gr;
}
var Qe = {}, vr = {}, Vl;
function A0() {
  if (Vl) return vr;
  Vl = 1, Object.defineProperty(vr, "__esModule", { value: !0 }), vr.getRules = vr.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function o(f) {
    return typeof f == "string" && t.has(f);
  }
  vr.isJSONType = o;
  function n() {
    const f = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...f, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, f.number, f.string, f.array, f.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return vr.getRules = n, vr;
}
var xt = {}, Gl;
function C0() {
  if (Gl) return xt;
  Gl = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.shouldUseRule = xt.shouldUseGroup = xt.schemaHasRulesForType = void 0;
  function e({ schema: n, self: f }, r) {
    const i = f.RULES.types[r];
    return i && i !== !0 && t(n, i);
  }
  xt.schemaHasRulesForType = e;
  function t(n, f) {
    return f.rules.some((r) => o(n, r));
  }
  xt.shouldUseGroup = t;
  function o(n, f) {
    var r;
    return n[f.keyword] !== void 0 || ((r = f.definition.implements) === null || r === void 0 ? void 0 : r.some((i) => n[i] !== void 0));
  }
  return xt.shouldUseRule = o, xt;
}
var Bl;
function za() {
  if (Bl) return Qe;
  Bl = 1, Object.defineProperty(Qe, "__esModule", { value: !0 }), Qe.reportTypeError = Qe.checkDataTypes = Qe.checkDataType = Qe.coerceAndCheckDataType = Qe.getJSONTypes = Qe.getSchemaTypes = Qe.DataType = void 0;
  const e = A0(), t = C0(), o = Za(), n = Te(), f = Le();
  var r;
  (function(p) {
    p[p.Correct = 0] = "Correct", p[p.Wrong = 1] = "Wrong";
  })(r || (Qe.DataType = r = {}));
  function i(p) {
    const E = c(p.type);
    if (E.includes("null")) {
      if (p.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!E.length && p.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      p.nullable === !0 && E.push("null");
    }
    return E;
  }
  Qe.getSchemaTypes = i;
  function c(p) {
    const E = Array.isArray(p) ? p : p ? [p] : [];
    if (E.every(e.isJSONType))
      return E;
    throw new Error("type must be JSONType or JSONType[]: " + E.join(","));
  }
  Qe.getJSONTypes = c;
  function s(p, E) {
    const { gen: b, data: $, opts: _ } = p, w = a(E, _.coerceTypes), P = E.length > 0 && !(w.length === 0 && E.length === 1 && (0, t.schemaHasRulesForType)(p, E[0]));
    if (P) {
      const T = g(E, $, _.strictNumbers, r.Wrong);
      b.if(T, () => {
        w.length ? d(p, E, w) : h(p);
      });
    }
    return P;
  }
  Qe.coerceAndCheckDataType = s;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function a(p, E) {
    return E ? p.filter((b) => u.has(b) || E === "array" && b === "array") : [];
  }
  function d(p, E, b) {
    const { gen: $, data: _, opts: w } = p, P = $.let("dataType", (0, n._)`typeof ${_}`), T = $.let("coerced", (0, n._)`undefined`);
    w.coerceTypes === "array" && $.if((0, n._)`${P} == 'object' && Array.isArray(${_}) && ${_}.length == 1`, () => $.assign(_, (0, n._)`${_}[0]`).assign(P, (0, n._)`typeof ${_}`).if(g(E, _, w.strictNumbers), () => $.assign(T, _))), $.if((0, n._)`${T} !== undefined`);
    for (const L of b)
      (u.has(L) || L === "array" && w.coerceTypes === "array") && G(L);
    $.else(), h(p), $.endIf(), $.if((0, n._)`${T} !== undefined`, () => {
      $.assign(_, T), l(p, T);
    });
    function G(L) {
      switch (L) {
        case "string":
          $.elseIf((0, n._)`${P} == "number" || ${P} == "boolean"`).assign(T, (0, n._)`"" + ${_}`).elseIf((0, n._)`${_} === null`).assign(T, (0, n._)`""`);
          return;
        case "number":
          $.elseIf((0, n._)`${P} == "boolean" || ${_} === null
              || (${P} == "string" && ${_} && ${_} == +${_})`).assign(T, (0, n._)`+${_}`);
          return;
        case "integer":
          $.elseIf((0, n._)`${P} === "boolean" || ${_} === null
              || (${P} === "string" && ${_} && ${_} == +${_} && !(${_} % 1))`).assign(T, (0, n._)`+${_}`);
          return;
        case "boolean":
          $.elseIf((0, n._)`${_} === "false" || ${_} === 0 || ${_} === null`).assign(T, !1).elseIf((0, n._)`${_} === "true" || ${_} === 1`).assign(T, !0);
          return;
        case "null":
          $.elseIf((0, n._)`${_} === "" || ${_} === 0 || ${_} === false`), $.assign(T, null);
          return;
        case "array":
          $.elseIf((0, n._)`${P} === "string" || ${P} === "number"
              || ${P} === "boolean" || ${_} === null`).assign(T, (0, n._)`[${_}]`);
      }
    }
  }
  function l({ gen: p, parentData: E, parentDataProperty: b }, $) {
    p.if((0, n._)`${E} !== undefined`, () => p.assign((0, n._)`${E}[${b}]`, $));
  }
  function m(p, E, b, $ = r.Correct) {
    const _ = $ === r.Correct ? n.operators.EQ : n.operators.NEQ;
    let w;
    switch (p) {
      case "null":
        return (0, n._)`${E} ${_} null`;
      case "array":
        w = (0, n._)`Array.isArray(${E})`;
        break;
      case "object":
        w = (0, n._)`${E} && typeof ${E} == "object" && !Array.isArray(${E})`;
        break;
      case "integer":
        w = P((0, n._)`!(${E} % 1) && !isNaN(${E})`);
        break;
      case "number":
        w = P();
        break;
      default:
        return (0, n._)`typeof ${E} ${_} ${p}`;
    }
    return $ === r.Correct ? w : (0, n.not)(w);
    function P(T = n.nil) {
      return (0, n.and)((0, n._)`typeof ${E} == "number"`, T, b ? (0, n._)`isFinite(${E})` : n.nil);
    }
  }
  Qe.checkDataType = m;
  function g(p, E, b, $) {
    if (p.length === 1)
      return m(p[0], E, b, $);
    let _;
    const w = (0, f.toHash)(p);
    if (w.array && w.object) {
      const P = (0, n._)`typeof ${E} != "object"`;
      _ = w.null ? P : (0, n._)`!${E} || ${P}`, delete w.null, delete w.array, delete w.object;
    } else
      _ = n.nil;
    w.number && delete w.integer;
    for (const P in w)
      _ = (0, n.and)(_, m(P, E, b, $));
    return _;
  }
  Qe.checkDataTypes = g;
  const v = {
    message: ({ schema: p }) => `must be ${p}`,
    params: ({ schema: p, schemaValue: E }) => typeof p == "string" ? (0, n._)`{type: ${p}}` : (0, n._)`{type: ${E}}`
  };
  function h(p) {
    const E = y(p);
    (0, o.reportError)(E, v);
  }
  Qe.reportTypeError = h;
  function y(p) {
    const { gen: E, data: b, schema: $ } = p, _ = (0, f.schemaRefOrVal)(p, $, "type");
    return {
      gen: E,
      keyword: "type",
      data: b,
      schema: $.type,
      schemaCode: _,
      schemaValue: _,
      parentSchema: $,
      params: {},
      it: p
    };
  }
  return Qe;
}
var rn = {}, Hl;
function e_() {
  if (Hl) return rn;
  Hl = 1, Object.defineProperty(rn, "__esModule", { value: !0 }), rn.assignDefaults = void 0;
  const e = Te(), t = Le();
  function o(f, r) {
    const { properties: i, items: c } = f.schema;
    if (r === "object" && i)
      for (const s in i)
        n(f, s, i[s].default);
    else r === "array" && Array.isArray(c) && c.forEach((s, u) => n(f, u, s.default));
  }
  rn.assignDefaults = o;
  function n(f, r, i) {
    const { gen: c, compositeRule: s, data: u, opts: a } = f;
    if (i === void 0)
      return;
    const d = (0, e._)`${u}${(0, e.getProperty)(r)}`;
    if (s) {
      (0, t.checkStrictMode)(f, `default is ignored for: ${d}`);
      return;
    }
    let l = (0, e._)`${d} === undefined`;
    a.useDefaults === "empty" && (l = (0, e._)`${l} || ${d} === null || ${d} === ""`), c.if(l, (0, e._)`${d} = ${(0, e.stringify)(i)}`);
  }
  return rn;
}
var Pt = {}, xe = {}, zl;
function It() {
  if (zl) return xe;
  zl = 1, Object.defineProperty(xe, "__esModule", { value: !0 }), xe.validateUnion = xe.validateArray = xe.usePattern = xe.callValidateCode = xe.schemaProperties = xe.allSchemaProperties = xe.noPropertyInData = xe.propertyInData = xe.isOwnProperty = xe.hasPropFunc = xe.reportMissingProp = xe.checkMissingProp = xe.checkReportMissingProp = void 0;
  const e = Te(), t = Le(), o = Nt(), n = Le();
  function f(p, E) {
    const { gen: b, data: $, it: _ } = p;
    b.if(a(b, $, E, _.opts.ownProperties), () => {
      p.setParams({ missingProperty: (0, e._)`${E}` }, !0), p.error();
    });
  }
  xe.checkReportMissingProp = f;
  function r({ gen: p, data: E, it: { opts: b } }, $, _) {
    return (0, e.or)(...$.map((w) => (0, e.and)(a(p, E, w, b.ownProperties), (0, e._)`${_} = ${w}`)));
  }
  xe.checkMissingProp = r;
  function i(p, E) {
    p.setParams({ missingProperty: E }, !0), p.error();
  }
  xe.reportMissingProp = i;
  function c(p) {
    return p.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  xe.hasPropFunc = c;
  function s(p, E, b) {
    return (0, e._)`${c(p)}.call(${E}, ${b})`;
  }
  xe.isOwnProperty = s;
  function u(p, E, b, $) {
    const _ = (0, e._)`${E}${(0, e.getProperty)(b)} !== undefined`;
    return $ ? (0, e._)`${_} && ${s(p, E, b)}` : _;
  }
  xe.propertyInData = u;
  function a(p, E, b, $) {
    const _ = (0, e._)`${E}${(0, e.getProperty)(b)} === undefined`;
    return $ ? (0, e.or)(_, (0, e.not)(s(p, E, b))) : _;
  }
  xe.noPropertyInData = a;
  function d(p) {
    return p ? Object.keys(p).filter((E) => E !== "__proto__") : [];
  }
  xe.allSchemaProperties = d;
  function l(p, E) {
    return d(E).filter((b) => !(0, t.alwaysValidSchema)(p, E[b]));
  }
  xe.schemaProperties = l;
  function m({ schemaCode: p, data: E, it: { gen: b, topSchemaRef: $, schemaPath: _, errorPath: w }, it: P }, T, G, L) {
    const M = L ? (0, e._)`${p}, ${E}, ${$}${_}` : E, K = [
      [o.default.instancePath, (0, e.strConcat)(o.default.instancePath, w)],
      [o.default.parentData, P.parentData],
      [o.default.parentDataProperty, P.parentDataProperty],
      [o.default.rootData, o.default.rootData]
    ];
    P.opts.dynamicRef && K.push([o.default.dynamicAnchors, o.default.dynamicAnchors]);
    const k = (0, e._)`${M}, ${b.object(...K)}`;
    return G !== e.nil ? (0, e._)`${T}.call(${G}, ${k})` : (0, e._)`${T}(${k})`;
  }
  xe.callValidateCode = m;
  const g = (0, e._)`new RegExp`;
  function v({ gen: p, it: { opts: E } }, b) {
    const $ = E.unicodeRegExp ? "u" : "", { regExp: _ } = E.code, w = _(b, $);
    return p.scopeValue("pattern", {
      key: w.toString(),
      ref: w,
      code: (0, e._)`${_.code === "new RegExp" ? g : (0, n.useFunc)(p, _)}(${b}, ${$})`
    });
  }
  xe.usePattern = v;
  function h(p) {
    const { gen: E, data: b, keyword: $, it: _ } = p, w = E.name("valid");
    if (_.allErrors) {
      const T = E.let("valid", !0);
      return P(() => E.assign(T, !1)), T;
    }
    return E.var(w, !0), P(() => E.break()), w;
    function P(T) {
      const G = E.const("len", (0, e._)`${b}.length`);
      E.forRange("i", 0, G, (L) => {
        p.subschema({
          keyword: $,
          dataProp: L,
          dataPropType: t.Type.Num
        }, w), E.if((0, e.not)(w), T);
      });
    }
  }
  xe.validateArray = h;
  function y(p) {
    const { gen: E, schema: b, keyword: $, it: _ } = p;
    if (!Array.isArray(b))
      throw new Error("ajv implementation error");
    if (b.some((G) => (0, t.alwaysValidSchema)(_, G)) && !_.opts.unevaluated)
      return;
    const P = E.let("valid", !1), T = E.name("_valid");
    E.block(() => b.forEach((G, L) => {
      const M = p.subschema({
        keyword: $,
        schemaProp: L,
        compositeRule: !0
      }, T);
      E.assign(P, (0, e._)`${P} || ${T}`), p.mergeValidEvaluated(M, T) || E.if((0, e.not)(P));
    })), p.result(P, () => p.reset(), () => p.error(!0));
  }
  return xe.validateUnion = y, xe;
}
var Kl;
function t_() {
  if (Kl) return Pt;
  Kl = 1, Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.validateKeywordUsage = Pt.validSchemaType = Pt.funcKeywordCode = Pt.macroKeywordCode = void 0;
  const e = Te(), t = Nt(), o = It(), n = Za();
  function f(l, m) {
    const { gen: g, keyword: v, schema: h, parentSchema: y, it: p } = l, E = m.macro.call(p.self, h, y, p), b = u(g, v, E);
    p.opts.validateSchema !== !1 && p.self.validateSchema(E, !0);
    const $ = g.name("valid");
    l.subschema({
      schema: E,
      schemaPath: e.nil,
      errSchemaPath: `${p.errSchemaPath}/${v}`,
      topSchemaRef: b,
      compositeRule: !0
    }, $), l.pass($, () => l.error(!0));
  }
  Pt.macroKeywordCode = f;
  function r(l, m) {
    var g;
    const { gen: v, keyword: h, schema: y, parentSchema: p, $data: E, it: b } = l;
    s(b, m);
    const $ = !E && m.compile ? m.compile.call(b.self, y, p, b) : m.validate, _ = u(v, h, $), w = v.let("valid");
    l.block$data(w, P), l.ok((g = m.valid) !== null && g !== void 0 ? g : w);
    function P() {
      if (m.errors === !1)
        L(), m.modifying && i(l), M(() => l.error());
      else {
        const K = m.async ? T() : G();
        m.modifying && i(l), M(() => c(l, K));
      }
    }
    function T() {
      const K = v.let("ruleErrs", null);
      return v.try(() => L((0, e._)`await `), (k) => v.assign(w, !1).if((0, e._)`${k} instanceof ${b.ValidationError}`, () => v.assign(K, (0, e._)`${k}.errors`), () => v.throw(k))), K;
    }
    function G() {
      const K = (0, e._)`${_}.errors`;
      return v.assign(K, null), L(e.nil), K;
    }
    function L(K = m.async ? (0, e._)`await ` : e.nil) {
      const k = b.opts.passContext ? t.default.this : t.default.self, F = !("compile" in m && !E || m.schema === !1);
      v.assign(w, (0, e._)`${K}${(0, o.callValidateCode)(l, _, k, F)}`, m.modifying);
    }
    function M(K) {
      var k;
      v.if((0, e.not)((k = m.valid) !== null && k !== void 0 ? k : w), K);
    }
  }
  Pt.funcKeywordCode = r;
  function i(l) {
    const { gen: m, data: g, it: v } = l;
    m.if(v.parentData, () => m.assign(g, (0, e._)`${v.parentData}[${v.parentDataProperty}]`));
  }
  function c(l, m) {
    const { gen: g } = l;
    g.if((0, e._)`Array.isArray(${m})`, () => {
      g.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${m} : ${t.default.vErrors}.concat(${m})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(l);
    }, () => l.error());
  }
  function s({ schemaEnv: l }, m) {
    if (m.async && !l.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(l, m, g) {
    if (g === void 0)
      throw new Error(`keyword "${m}" failed to compile`);
    return l.scopeValue("keyword", typeof g == "function" ? { ref: g } : { ref: g, code: (0, e.stringify)(g) });
  }
  function a(l, m, g = !1) {
    return !m.length || m.some((v) => v === "array" ? Array.isArray(l) : v === "object" ? l && typeof l == "object" && !Array.isArray(l) : typeof l == v || g && typeof l > "u");
  }
  Pt.validSchemaType = a;
  function d({ schema: l, opts: m, self: g, errSchemaPath: v }, h, y) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(y) : h.keyword !== y)
      throw new Error("ajv implementation error");
    const p = h.dependencies;
    if (p?.some((E) => !Object.prototype.hasOwnProperty.call(l, E)))
      throw new Error(`parent schema must have dependencies of ${y}: ${p.join(",")}`);
    if (h.validateSchema && !h.validateSchema(l[y])) {
      const b = `keyword "${y}" value is invalid at path "${v}": ` + g.errorsText(h.validateSchema.errors);
      if (m.validateSchema === "log")
        g.logger.error(b);
      else
        throw new Error(b);
    }
  }
  return Pt.validateKeywordUsage = d, Pt;
}
var Vt = {}, Wl;
function r_() {
  if (Wl) return Vt;
  Wl = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.extendSubschemaMode = Vt.extendSubschemaData = Vt.getSubschema = void 0;
  const e = Te(), t = Le();
  function o(r, { keyword: i, schemaProp: c, schema: s, schemaPath: u, errSchemaPath: a, topSchemaRef: d }) {
    if (i !== void 0 && s !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const l = r.schema[i];
      return c === void 0 ? {
        schema: l,
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${r.errSchemaPath}/${i}`
      } : {
        schema: l[c],
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(i)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${r.errSchemaPath}/${i}/${(0, t.escapeFragment)(c)}`
      };
    }
    if (s !== void 0) {
      if (u === void 0 || a === void 0 || d === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: s,
        schemaPath: u,
        topSchemaRef: d,
        errSchemaPath: a
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Vt.getSubschema = o;
  function n(r, i, { dataProp: c, dataPropType: s, data: u, dataTypes: a, propertyName: d }) {
    if (u !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: l } = i;
    if (c !== void 0) {
      const { errorPath: g, dataPathArr: v, opts: h } = i, y = l.let("data", (0, e._)`${i.data}${(0, e.getProperty)(c)}`, !0);
      m(y), r.errorPath = (0, e.str)`${g}${(0, t.getErrorPath)(c, s, h.jsPropertySyntax)}`, r.parentDataProperty = (0, e._)`${c}`, r.dataPathArr = [...v, r.parentDataProperty];
    }
    if (u !== void 0) {
      const g = u instanceof e.Name ? u : l.let("data", u, !0);
      m(g), d !== void 0 && (r.propertyName = d);
    }
    a && (r.dataTypes = a);
    function m(g) {
      r.data = g, r.dataLevel = i.dataLevel + 1, r.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), r.parentData = i.data, r.dataNames = [...i.dataNames, g];
    }
  }
  Vt.extendSubschemaData = n;
  function f(r, { jtdDiscriminator: i, jtdMetadata: c, compositeRule: s, createErrors: u, allErrors: a }) {
    s !== void 0 && (r.compositeRule = s), u !== void 0 && (r.createErrors = u), a !== void 0 && (r.allErrors = a), r.jtdDiscriminator = i, r.jtdMetadata = c;
  }
  return Vt.extendSubschemaMode = f, Vt;
}
var ut = {}, As, Yl;
function es() {
  return Yl || (Yl = 1, As = function e(t, o) {
    if (t === o) return !0;
    if (t && o && typeof t == "object" && typeof o == "object") {
      if (t.constructor !== o.constructor) return !1;
      var n, f, r;
      if (Array.isArray(t)) {
        if (n = t.length, n != o.length) return !1;
        for (f = n; f-- !== 0; )
          if (!e(t[f], o[f])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === o.source && t.flags === o.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === o.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === o.toString();
      if (r = Object.keys(t), n = r.length, n !== Object.keys(o).length) return !1;
      for (f = n; f-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(o, r[f])) return !1;
      for (f = n; f-- !== 0; ) {
        var i = r[f];
        if (!e(t[i], o[i])) return !1;
      }
      return !0;
    }
    return t !== t && o !== o;
  }), As;
}
var Cs = { exports: {} }, Xl;
function n_() {
  if (Xl) return Cs.exports;
  Xl = 1;
  var e = Cs.exports = function(n, f, r) {
    typeof f == "function" && (r = f, f = {}), r = f.cb || r;
    var i = typeof r == "function" ? r : r.pre || function() {
    }, c = r.post || function() {
    };
    t(f, i, c, n, "", n);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(n, f, r, i, c, s, u, a, d, l) {
    if (i && typeof i == "object" && !Array.isArray(i)) {
      f(i, c, s, u, a, d, l);
      for (var m in i) {
        var g = i[m];
        if (Array.isArray(g)) {
          if (m in e.arrayKeywords)
            for (var v = 0; v < g.length; v++)
              t(n, f, r, g[v], c + "/" + m + "/" + v, s, c, m, i, v);
        } else if (m in e.propsKeywords) {
          if (g && typeof g == "object")
            for (var h in g)
              t(n, f, r, g[h], c + "/" + m + "/" + o(h), s, c, m, i, h);
        } else (m in e.keywords || n.allKeys && !(m in e.skipKeywords)) && t(n, f, r, g, c + "/" + m, s, c, m, i);
      }
      r(i, c, s, u, a, d, l);
    }
  }
  function o(n) {
    return n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Cs.exports;
}
var Jl;
function ts() {
  if (Jl) return ut;
  Jl = 1, Object.defineProperty(ut, "__esModule", { value: !0 }), ut.getSchemaRefs = ut.resolveUrl = ut.normalizeId = ut._getFullPath = ut.getFullPath = ut.inlineRef = void 0;
  const e = Le(), t = es(), o = n_(), n = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function f(v, h = !0) {
    return typeof v == "boolean" ? !0 : h === !0 ? !i(v) : h ? c(v) <= h : !1;
  }
  ut.inlineRef = f;
  const r = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function i(v) {
    for (const h in v) {
      if (r.has(h))
        return !0;
      const y = v[h];
      if (Array.isArray(y) && y.some(i) || typeof y == "object" && i(y))
        return !0;
    }
    return !1;
  }
  function c(v) {
    let h = 0;
    for (const y in v) {
      if (y === "$ref")
        return 1 / 0;
      if (h++, !n.has(y) && (typeof v[y] == "object" && (0, e.eachItem)(v[y], (p) => h += c(p)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function s(v, h = "", y) {
    y !== !1 && (h = d(h));
    const p = v.parse(h);
    return u(v, p);
  }
  ut.getFullPath = s;
  function u(v, h) {
    return v.serialize(h).split("#")[0] + "#";
  }
  ut._getFullPath = u;
  const a = /#\/?$/;
  function d(v) {
    return v ? v.replace(a, "") : "";
  }
  ut.normalizeId = d;
  function l(v, h, y) {
    return y = d(y), v.resolve(h, y);
  }
  ut.resolveUrl = l;
  const m = /^[a-z_][-a-z0-9._]*$/i;
  function g(v, h) {
    if (typeof v == "boolean")
      return {};
    const { schemaId: y, uriResolver: p } = this.opts, E = d(v[y] || h), b = { "": E }, $ = s(p, E, !1), _ = {}, w = /* @__PURE__ */ new Set();
    return o(v, { allKeys: !0 }, (G, L, M, K) => {
      if (K === void 0)
        return;
      const k = $ + L;
      let F = b[K];
      typeof G[y] == "string" && (F = X.call(this, G[y])), B.call(this, G.$anchor), B.call(this, G.$dynamicAnchor), b[L] = F;
      function X(Y) {
        const Z = this.opts.uriResolver.resolve;
        if (Y = d(F ? Z(F, Y) : Y), w.has(Y))
          throw T(Y);
        w.add(Y);
        let V = this.refs[Y];
        return typeof V == "string" && (V = this.refs[V]), typeof V == "object" ? P(G, V.schema, Y) : Y !== d(k) && (Y[0] === "#" ? (P(G, _[Y], Y), _[Y] = G) : this.refs[Y] = k), Y;
      }
      function B(Y) {
        if (typeof Y == "string") {
          if (!m.test(Y))
            throw new Error(`invalid anchor "${Y}"`);
          X.call(this, `#${Y}`);
        }
      }
    }), _;
    function P(G, L, M) {
      if (L !== void 0 && !t(G, L))
        throw T(M);
    }
    function T(G) {
      return new Error(`reference "${G}" resolves to more than one schema`);
    }
  }
  return ut.getSchemaRefs = g, ut;
}
var Ql;
function rs() {
  if (Ql) return Mt;
  Ql = 1, Object.defineProperty(Mt, "__esModule", { value: !0 }), Mt.getData = Mt.KeywordCxt = Mt.validateFunctionCode = void 0;
  const e = Zv(), t = za(), o = C0(), n = za(), f = e_(), r = t_(), i = r_(), c = Te(), s = Nt(), u = ts(), a = Le(), d = Za();
  function l(A) {
    if ($(A) && (w(A), b(A))) {
      h(A);
      return;
    }
    m(A, () => (0, e.topBoolOrEmptySchema)(A));
  }
  Mt.validateFunctionCode = l;
  function m({ gen: A, validateName: q, schema: W, schemaEnv: J, opts: re }, fe) {
    re.code.es5 ? A.func(q, (0, c._)`${s.default.data}, ${s.default.valCxt}`, J.$async, () => {
      A.code((0, c._)`"use strict"; ${p(W, re)}`), v(A, re), A.code(fe);
    }) : A.func(q, (0, c._)`${s.default.data}, ${g(re)}`, J.$async, () => A.code(p(W, re)).code(fe));
  }
  function g(A) {
    return (0, c._)`{${s.default.instancePath}="", ${s.default.parentData}, ${s.default.parentDataProperty}, ${s.default.rootData}=${s.default.data}${A.dynamicRef ? (0, c._)`, ${s.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function v(A, q) {
    A.if(s.default.valCxt, () => {
      A.var(s.default.instancePath, (0, c._)`${s.default.valCxt}.${s.default.instancePath}`), A.var(s.default.parentData, (0, c._)`${s.default.valCxt}.${s.default.parentData}`), A.var(s.default.parentDataProperty, (0, c._)`${s.default.valCxt}.${s.default.parentDataProperty}`), A.var(s.default.rootData, (0, c._)`${s.default.valCxt}.${s.default.rootData}`), q.dynamicRef && A.var(s.default.dynamicAnchors, (0, c._)`${s.default.valCxt}.${s.default.dynamicAnchors}`);
    }, () => {
      A.var(s.default.instancePath, (0, c._)`""`), A.var(s.default.parentData, (0, c._)`undefined`), A.var(s.default.parentDataProperty, (0, c._)`undefined`), A.var(s.default.rootData, s.default.data), q.dynamicRef && A.var(s.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function h(A) {
    const { schema: q, opts: W, gen: J } = A;
    m(A, () => {
      W.$comment && q.$comment && K(A), G(A), J.let(s.default.vErrors, null), J.let(s.default.errors, 0), W.unevaluated && y(A), P(A), k(A);
    });
  }
  function y(A) {
    const { gen: q, validateName: W } = A;
    A.evaluated = q.const("evaluated", (0, c._)`${W}.evaluated`), q.if((0, c._)`${A.evaluated}.dynamicProps`, () => q.assign((0, c._)`${A.evaluated}.props`, (0, c._)`undefined`)), q.if((0, c._)`${A.evaluated}.dynamicItems`, () => q.assign((0, c._)`${A.evaluated}.items`, (0, c._)`undefined`));
  }
  function p(A, q) {
    const W = typeof A == "object" && A[q.schemaId];
    return W && (q.code.source || q.code.process) ? (0, c._)`/*# sourceURL=${W} */` : c.nil;
  }
  function E(A, q) {
    if ($(A) && (w(A), b(A))) {
      _(A, q);
      return;
    }
    (0, e.boolOrEmptySchema)(A, q);
  }
  function b({ schema: A, self: q }) {
    if (typeof A == "boolean")
      return !A;
    for (const W in A)
      if (q.RULES.all[W])
        return !0;
    return !1;
  }
  function $(A) {
    return typeof A.schema != "boolean";
  }
  function _(A, q) {
    const { schema: W, gen: J, opts: re } = A;
    re.$comment && W.$comment && K(A), L(A), M(A);
    const fe = J.const("_errs", s.default.errors);
    P(A, fe), J.var(q, (0, c._)`${fe} === ${s.default.errors}`);
  }
  function w(A) {
    (0, a.checkUnknownRules)(A), T(A);
  }
  function P(A, q) {
    if (A.opts.jtd)
      return X(A, [], !1, q);
    const W = (0, t.getSchemaTypes)(A.schema), J = (0, t.coerceAndCheckDataType)(A, W);
    X(A, W, !J, q);
  }
  function T(A) {
    const { schema: q, errSchemaPath: W, opts: J, self: re } = A;
    q.$ref && J.ignoreKeywordsWithRef && (0, a.schemaHasRulesButRef)(q, re.RULES) && re.logger.warn(`$ref: keywords ignored in schema at path "${W}"`);
  }
  function G(A) {
    const { schema: q, opts: W } = A;
    q.default !== void 0 && W.useDefaults && W.strictSchema && (0, a.checkStrictMode)(A, "default is ignored in the schema root");
  }
  function L(A) {
    const q = A.schema[A.opts.schemaId];
    q && (A.baseId = (0, u.resolveUrl)(A.opts.uriResolver, A.baseId, q));
  }
  function M(A) {
    if (A.schema.$async && !A.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function K({ gen: A, schemaEnv: q, schema: W, errSchemaPath: J, opts: re }) {
    const fe = W.$comment;
    if (re.$comment === !0)
      A.code((0, c._)`${s.default.self}.logger.log(${fe})`);
    else if (typeof re.$comment == "function") {
      const ge = (0, c.str)`${J}/$comment`, Oe = A.scopeValue("root", { ref: q.root });
      A.code((0, c._)`${s.default.self}.opts.$comment(${fe}, ${ge}, ${Oe}.schema)`);
    }
  }
  function k(A) {
    const { gen: q, schemaEnv: W, validateName: J, ValidationError: re, opts: fe } = A;
    W.$async ? q.if((0, c._)`${s.default.errors} === 0`, () => q.return(s.default.data), () => q.throw((0, c._)`new ${re}(${s.default.vErrors})`)) : (q.assign((0, c._)`${J}.errors`, s.default.vErrors), fe.unevaluated && F(A), q.return((0, c._)`${s.default.errors} === 0`));
  }
  function F({ gen: A, evaluated: q, props: W, items: J }) {
    W instanceof c.Name && A.assign((0, c._)`${q}.props`, W), J instanceof c.Name && A.assign((0, c._)`${q}.items`, J);
  }
  function X(A, q, W, J) {
    const { gen: re, schema: fe, data: ge, allErrors: Oe, opts: ke, self: Ne } = A, { RULES: Se } = Ne;
    if (fe.$ref && (ke.ignoreKeywordsWithRef || !(0, a.schemaHasRulesButRef)(fe, Se))) {
      re.block(() => I(A, "$ref", Se.all.$ref.definition));
      return;
    }
    ke.jtd || Y(A, q), re.block(() => {
      for (const te of Se.rules)
        S(te);
      S(Se.post);
    });
    function S(te) {
      (0, o.shouldUseGroup)(fe, te) && (te.type ? (re.if((0, n.checkDataType)(te.type, ge, ke.strictNumbers)), B(A, te), q.length === 1 && q[0] === te.type && W && (re.else(), (0, n.reportTypeError)(A)), re.endIf()) : B(A, te), Oe || re.if((0, c._)`${s.default.errors} === ${J || 0}`));
    }
  }
  function B(A, q) {
    const { gen: W, schema: J, opts: { useDefaults: re } } = A;
    re && (0, f.assignDefaults)(A, q.type), W.block(() => {
      for (const fe of q.rules)
        (0, o.shouldUseRule)(J, fe) && I(A, fe.keyword, fe.definition, q.type);
    });
  }
  function Y(A, q) {
    A.schemaEnv.meta || !A.opts.strictTypes || (Z(A, q), A.opts.allowUnionTypes || V(A, q), C(A, A.dataTypes));
  }
  function Z(A, q) {
    if (q.length) {
      if (!A.dataTypes.length) {
        A.dataTypes = q;
        return;
      }
      q.forEach((W) => {
        D(A.dataTypes, W) || O(A, `type "${W}" not allowed by context "${A.dataTypes.join(",")}"`);
      }), R(A, q);
    }
  }
  function V(A, q) {
    q.length > 1 && !(q.length === 2 && q.includes("null")) && O(A, "use allowUnionTypes to allow union type keyword");
  }
  function C(A, q) {
    const W = A.self.RULES.all;
    for (const J in W) {
      const re = W[J];
      if (typeof re == "object" && (0, o.shouldUseRule)(A.schema, re)) {
        const { type: fe } = re.definition;
        fe.length && !fe.some((ge) => U(q, ge)) && O(A, `missing type "${fe.join(",")}" for keyword "${J}"`);
      }
    }
  }
  function U(A, q) {
    return A.includes(q) || q === "number" && A.includes("integer");
  }
  function D(A, q) {
    return A.includes(q) || q === "integer" && A.includes("number");
  }
  function R(A, q) {
    const W = [];
    for (const J of A.dataTypes)
      D(q, J) ? W.push(J) : q.includes("integer") && J === "number" && W.push("integer");
    A.dataTypes = W;
  }
  function O(A, q) {
    const W = A.schemaEnv.baseId + A.errSchemaPath;
    q += ` at "${W}" (strictTypes)`, (0, a.checkStrictMode)(A, q, A.opts.strictTypes);
  }
  class x {
    constructor(q, W, J) {
      if ((0, r.validateKeywordUsage)(q, W, J), this.gen = q.gen, this.allErrors = q.allErrors, this.keyword = J, this.data = q.data, this.schema = q.schema[J], this.$data = W.$data && q.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, a.schemaRefOrVal)(q, this.schema, J, this.$data), this.schemaType = W.schemaType, this.parentSchema = q.schema, this.params = {}, this.it = q, this.def = W, this.$data)
        this.schemaCode = q.gen.const("vSchema", H(this.$data, q));
      else if (this.schemaCode = this.schemaValue, !(0, r.validSchemaType)(this.schema, W.schemaType, W.allowUndefined))
        throw new Error(`${J} value must be ${JSON.stringify(W.schemaType)}`);
      ("code" in W ? W.trackErrors : W.errors !== !1) && (this.errsCount = q.gen.const("_errs", s.default.errors));
    }
    result(q, W, J) {
      this.failResult((0, c.not)(q), W, J);
    }
    failResult(q, W, J) {
      this.gen.if(q), J ? J() : this.error(), W ? (this.gen.else(), W(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(q, W) {
      this.failResult((0, c.not)(q), void 0, W);
    }
    fail(q) {
      if (q === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(q), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(q) {
      if (!this.$data)
        return this.fail(q);
      const { schemaCode: W } = this;
      this.fail((0, c._)`${W} !== undefined && (${(0, c.or)(this.invalid$data(), q)})`);
    }
    error(q, W, J) {
      if (W) {
        this.setParams(W), this._error(q, J), this.setParams({});
        return;
      }
      this._error(q, J);
    }
    _error(q, W) {
      (q ? d.reportExtraError : d.reportError)(this, this.def.error, W);
    }
    $dataError() {
      (0, d.reportError)(this, this.def.$dataError || d.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, d.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(q) {
      this.allErrors || this.gen.if(q);
    }
    setParams(q, W) {
      W ? Object.assign(this.params, q) : this.params = q;
    }
    block$data(q, W, J = c.nil) {
      this.gen.block(() => {
        this.check$data(q, J), W();
      });
    }
    check$data(q = c.nil, W = c.nil) {
      if (!this.$data)
        return;
      const { gen: J, schemaCode: re, schemaType: fe, def: ge } = this;
      J.if((0, c.or)((0, c._)`${re} === undefined`, W)), q !== c.nil && J.assign(q, !0), (fe.length || ge.validateSchema) && (J.elseIf(this.invalid$data()), this.$dataError(), q !== c.nil && J.assign(q, !1)), J.else();
    }
    invalid$data() {
      const { gen: q, schemaCode: W, schemaType: J, def: re, it: fe } = this;
      return (0, c.or)(ge(), Oe());
      function ge() {
        if (J.length) {
          if (!(W instanceof c.Name))
            throw new Error("ajv implementation error");
          const ke = Array.isArray(J) ? J : [J];
          return (0, c._)`${(0, n.checkDataTypes)(ke, W, fe.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function Oe() {
        if (re.validateSchema) {
          const ke = q.scopeValue("validate$data", { ref: re.validateSchema });
          return (0, c._)`!${ke}(${W})`;
        }
        return c.nil;
      }
    }
    subschema(q, W) {
      const J = (0, i.getSubschema)(this.it, q);
      (0, i.extendSubschemaData)(J, this.it, q), (0, i.extendSubschemaMode)(J, q);
      const re = { ...this.it, ...J, items: void 0, props: void 0 };
      return E(re, W), re;
    }
    mergeEvaluated(q, W) {
      const { it: J, gen: re } = this;
      J.opts.unevaluated && (J.props !== !0 && q.props !== void 0 && (J.props = a.mergeEvaluated.props(re, q.props, J.props, W)), J.items !== !0 && q.items !== void 0 && (J.items = a.mergeEvaluated.items(re, q.items, J.items, W)));
    }
    mergeValidEvaluated(q, W) {
      const { it: J, gen: re } = this;
      if (J.opts.unevaluated && (J.props !== !0 || J.items !== !0))
        return re.if(W, () => this.mergeEvaluated(q, c.Name)), !0;
    }
  }
  Mt.KeywordCxt = x;
  function I(A, q, W, J) {
    const re = new x(A, W, q);
    "code" in W ? W.code(re, J) : re.$data && W.validate ? (0, r.funcKeywordCode)(re, W) : "macro" in W ? (0, r.macroKeywordCode)(re, W) : (W.compile || W.validate) && (0, r.funcKeywordCode)(re, W);
  }
  const N = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function H(A, { dataLevel: q, dataNames: W, dataPathArr: J }) {
    let re, fe;
    if (A === "")
      return s.default.rootData;
    if (A[0] === "/") {
      if (!N.test(A))
        throw new Error(`Invalid JSON-pointer: ${A}`);
      re = A, fe = s.default.rootData;
    } else {
      const Ne = Q.exec(A);
      if (!Ne)
        throw new Error(`Invalid JSON-pointer: ${A}`);
      const Se = +Ne[1];
      if (re = Ne[2], re === "#") {
        if (Se >= q)
          throw new Error(ke("property/index", Se));
        return J[q - Se];
      }
      if (Se > q)
        throw new Error(ke("data", Se));
      if (fe = W[q - Se], !re)
        return fe;
    }
    let ge = fe;
    const Oe = re.split("/");
    for (const Ne of Oe)
      Ne && (fe = (0, c._)`${fe}${(0, c.getProperty)((0, a.unescapeJsonPointer)(Ne))}`, ge = (0, c._)`${ge} && ${fe}`);
    return ge;
    function ke(Ne, Se) {
      return `Cannot access ${Ne} ${Se} levels up, current level is ${q}`;
    }
  }
  return Mt.getData = H, Mt;
}
var Yn = {}, Zl;
function Bc() {
  if (Zl) return Yn;
  Zl = 1, Object.defineProperty(Yn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(o) {
      super("validation failed"), this.errors = o, this.ajv = this.validation = !0;
    }
  }
  return Yn.default = e, Yn;
}
var Xn = {}, ef;
function ns() {
  if (ef) return Xn;
  ef = 1, Object.defineProperty(Xn, "__esModule", { value: !0 });
  const e = ts();
  class t extends Error {
    constructor(n, f, r, i) {
      super(i || `can't resolve reference ${r} from id ${f}`), this.missingRef = (0, e.resolveUrl)(n, f, r), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(n, this.missingRef));
    }
  }
  return Xn.default = t, Xn;
}
var gt = {}, tf;
function is() {
  if (tf) return gt;
  tf = 1, Object.defineProperty(gt, "__esModule", { value: !0 }), gt.resolveSchema = gt.getCompilingSchema = gt.resolveRef = gt.compileSchema = gt.SchemaEnv = void 0;
  const e = Te(), t = Bc(), o = Nt(), n = ts(), f = Le(), r = rs();
  class i {
    constructor(y) {
      var p;
      this.refs = {}, this.dynamicAnchors = {};
      let E;
      typeof y.schema == "object" && (E = y.schema), this.schema = y.schema, this.schemaId = y.schemaId, this.root = y.root || this, this.baseId = (p = y.baseId) !== null && p !== void 0 ? p : (0, n.normalizeId)(E?.[y.schemaId || "$id"]), this.schemaPath = y.schemaPath, this.localRefs = y.localRefs, this.meta = y.meta, this.$async = E?.$async, this.refs = {};
    }
  }
  gt.SchemaEnv = i;
  function c(h) {
    const y = a.call(this, h);
    if (y)
      return y;
    const p = (0, n.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: E, lines: b } = this.opts.code, { ownProperties: $ } = this.opts, _ = new e.CodeGen(this.scope, { es5: E, lines: b, ownProperties: $ });
    let w;
    h.$async && (w = _.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const P = _.scopeName("validate");
    h.validateName = P;
    const T = {
      gen: _,
      allErrors: this.opts.allErrors,
      data: o.default.data,
      parentData: o.default.parentData,
      parentDataProperty: o.default.parentDataProperty,
      dataNames: [o.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: _.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, e.stringify)(h.schema) } : { ref: h.schema }),
      validateName: P,
      ValidationError: w,
      schema: h.schema,
      schemaEnv: h,
      rootId: p,
      baseId: h.baseId || p,
      schemaPath: e.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let G;
    try {
      this._compilations.add(h), (0, r.validateFunctionCode)(T), _.optimize(this.opts.code.optimize);
      const L = _.toString();
      G = `${_.scopeRefs(o.default.scope)}return ${L}`, this.opts.code.process && (G = this.opts.code.process(G, h));
      const K = new Function(`${o.default.self}`, `${o.default.scope}`, G)(this, this.scope.get());
      if (this.scope.value(P, { ref: K }), K.errors = null, K.schema = h.schema, K.schemaEnv = h, h.$async && (K.$async = !0), this.opts.code.source === !0 && (K.source = { validateName: P, validateCode: L, scopeValues: _._values }), this.opts.unevaluated) {
        const { props: k, items: F } = T;
        K.evaluated = {
          props: k instanceof e.Name ? void 0 : k,
          items: F instanceof e.Name ? void 0 : F,
          dynamicProps: k instanceof e.Name,
          dynamicItems: F instanceof e.Name
        }, K.source && (K.source.evaluated = (0, e.stringify)(K.evaluated));
      }
      return h.validate = K, h;
    } catch (L) {
      throw delete h.validate, delete h.validateName, G && this.logger.error("Error compiling schema, function code:", G), L;
    } finally {
      this._compilations.delete(h);
    }
  }
  gt.compileSchema = c;
  function s(h, y, p) {
    var E;
    p = (0, n.resolveUrl)(this.opts.uriResolver, y, p);
    const b = h.refs[p];
    if (b)
      return b;
    let $ = l.call(this, h, p);
    if ($ === void 0) {
      const _ = (E = h.localRefs) === null || E === void 0 ? void 0 : E[p], { schemaId: w } = this.opts;
      _ && ($ = new i({ schema: _, schemaId: w, root: h, baseId: y }));
    }
    if ($ !== void 0)
      return h.refs[p] = u.call(this, $);
  }
  gt.resolveRef = s;
  function u(h) {
    return (0, n.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : c.call(this, h);
  }
  function a(h) {
    for (const y of this._compilations)
      if (d(y, h))
        return y;
  }
  gt.getCompilingSchema = a;
  function d(h, y) {
    return h.schema === y.schema && h.root === y.root && h.baseId === y.baseId;
  }
  function l(h, y) {
    let p;
    for (; typeof (p = this.refs[y]) == "string"; )
      y = p;
    return p || this.schemas[y] || m.call(this, h, y);
  }
  function m(h, y) {
    const p = this.opts.uriResolver.parse(y), E = (0, n._getFullPath)(this.opts.uriResolver, p);
    let b = (0, n.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && E === b)
      return v.call(this, p, h);
    const $ = (0, n.normalizeId)(E), _ = this.refs[$] || this.schemas[$];
    if (typeof _ == "string") {
      const w = m.call(this, h, _);
      return typeof w?.schema != "object" ? void 0 : v.call(this, p, w);
    }
    if (typeof _?.schema == "object") {
      if (_.validate || c.call(this, _), $ === (0, n.normalizeId)(y)) {
        const { schema: w } = _, { schemaId: P } = this.opts, T = w[P];
        return T && (b = (0, n.resolveUrl)(this.opts.uriResolver, b, T)), new i({ schema: w, schemaId: P, root: h, baseId: b });
      }
      return v.call(this, p, _);
    }
  }
  gt.resolveSchema = m;
  const g = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function v(h, { baseId: y, schema: p, root: E }) {
    var b;
    if (((b = h.fragment) === null || b === void 0 ? void 0 : b[0]) !== "/")
      return;
    for (const w of h.fragment.slice(1).split("/")) {
      if (typeof p == "boolean")
        return;
      const P = p[(0, f.unescapeFragment)(w)];
      if (P === void 0)
        return;
      p = P;
      const T = typeof p == "object" && p[this.opts.schemaId];
      !g.has(w) && T && (y = (0, n.resolveUrl)(this.opts.uriResolver, y, T));
    }
    let $;
    if (typeof p != "boolean" && p.$ref && !(0, f.schemaHasRulesButRef)(p, this.RULES)) {
      const w = (0, n.resolveUrl)(this.opts.uriResolver, y, p.$ref);
      $ = m.call(this, E, w);
    }
    const { schemaId: _ } = this.opts;
    if ($ = $ || new i({ schema: p, schemaId: _, root: E, baseId: y }), $.schema !== $.root.schema)
      return $;
  }
  return gt;
}
const i_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", a_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", s_ = "object", o_ = ["$data"], u_ = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, c_ = !1, l_ = {
  $id: i_,
  description: a_,
  type: s_,
  required: o_,
  properties: u_,
  additionalProperties: c_
};
var Jn = {}, nn = { exports: {} }, Ds, rf;
function D0() {
  if (rf) return Ds;
  rf = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), t = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  function o(l) {
    let m = "", g = 0, v = 0;
    for (v = 0; v < l.length; v++)
      if (g = l[v].charCodeAt(0), g !== 48) {
        if (!(g >= 48 && g <= 57 || g >= 65 && g <= 70 || g >= 97 && g <= 102))
          return "";
        m += l[v];
        break;
      }
    for (v += 1; v < l.length; v++) {
      if (g = l[v].charCodeAt(0), !(g >= 48 && g <= 57 || g >= 65 && g <= 70 || g >= 97 && g <= 102))
        return "";
      m += l[v];
    }
    return m;
  }
  const n = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function f(l) {
    return l.length = 0, !0;
  }
  function r(l, m, g) {
    if (l.length) {
      const v = o(l);
      if (v !== "")
        m.push(v);
      else
        return g.error = !0, !1;
      l.length = 0;
    }
    return !0;
  }
  function i(l) {
    let m = 0;
    const g = { error: !1, address: "", zone: "" }, v = [], h = [];
    let y = !1, p = !1, E = r;
    for (let b = 0; b < l.length; b++) {
      const $ = l[b];
      if (!($ === "[" || $ === "]"))
        if ($ === ":") {
          if (y === !0 && (p = !0), !E(h, v, g))
            break;
          if (++m > 7) {
            g.error = !0;
            break;
          }
          b > 0 && l[b - 1] === ":" && (y = !0), v.push(":");
          continue;
        } else if ($ === "%") {
          if (!E(h, v, g))
            break;
          E = f;
        } else {
          h.push($);
          continue;
        }
    }
    return h.length && (E === f ? g.zone = h.join("") : p ? v.push(h.join("")) : v.push(o(h))), g.address = v.join(""), g;
  }
  function c(l) {
    if (s(l, ":") < 2)
      return { host: l, isIPV6: !1 };
    const m = i(l);
    if (m.error)
      return { host: l, isIPV6: !1 };
    {
      let g = m.address, v = m.address;
      return m.zone && (g += "%" + m.zone, v += "%25" + m.zone), { host: g, isIPV6: !0, escapedHost: v };
    }
  }
  function s(l, m) {
    let g = 0;
    for (let v = 0; v < l.length; v++)
      l[v] === m && g++;
    return g;
  }
  function u(l) {
    let m = l;
    const g = [];
    let v = -1, h = 0;
    for (; h = m.length; ) {
      if (h === 1) {
        if (m === ".")
          break;
        if (m === "/") {
          g.push("/");
          break;
        } else {
          g.push(m);
          break;
        }
      } else if (h === 2) {
        if (m[0] === ".") {
          if (m[1] === ".")
            break;
          if (m[1] === "/") {
            m = m.slice(2);
            continue;
          }
        } else if (m[0] === "/" && (m[1] === "." || m[1] === "/")) {
          g.push("/");
          break;
        }
      } else if (h === 3 && m === "/..") {
        g.length !== 0 && g.pop(), g.push("/");
        break;
      }
      if (m[0] === ".") {
        if (m[1] === ".") {
          if (m[2] === "/") {
            m = m.slice(3);
            continue;
          }
        } else if (m[1] === "/") {
          m = m.slice(2);
          continue;
        }
      } else if (m[0] === "/" && m[1] === ".") {
        if (m[2] === "/") {
          m = m.slice(2);
          continue;
        } else if (m[2] === "." && m[3] === "/") {
          m = m.slice(3), g.length !== 0 && g.pop();
          continue;
        }
      }
      if ((v = m.indexOf("/", 1)) === -1) {
        g.push(m);
        break;
      } else
        g.push(m.slice(0, v)), m = m.slice(v);
    }
    return g.join("");
  }
  function a(l, m) {
    const g = m !== !0 ? escape : unescape;
    return l.scheme !== void 0 && (l.scheme = g(l.scheme)), l.userinfo !== void 0 && (l.userinfo = g(l.userinfo)), l.host !== void 0 && (l.host = g(l.host)), l.path !== void 0 && (l.path = g(l.path)), l.query !== void 0 && (l.query = g(l.query)), l.fragment !== void 0 && (l.fragment = g(l.fragment)), l;
  }
  function d(l) {
    const m = [];
    if (l.userinfo !== void 0 && (m.push(l.userinfo), m.push("@")), l.host !== void 0) {
      let g = unescape(l.host);
      if (!t(g)) {
        const v = c(g);
        v.isIPV6 === !0 ? g = `[${v.escapedHost}]` : g = l.host;
      }
      m.push(g);
    }
    return (typeof l.port == "number" || typeof l.port == "string") && (m.push(":"), m.push(String(l.port))), m.length ? m.join("") : void 0;
  }
  return Ds = {
    nonSimpleDomain: n,
    recomposeAuthority: d,
    normalizeComponentEncoding: a,
    removeDotSegments: u,
    isIPv4: t,
    isUUID: e,
    normalizeIPv6: c,
    stringArrayToHexStripped: o
  }, Ds;
}
var ks, nf;
function f_() {
  if (nf) return ks;
  nf = 1;
  const { isUUID: e } = D0(), t = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, o = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function n($) {
    return o.indexOf(
      /** @type {*} */
      $
    ) !== -1;
  }
  function f($) {
    return $.secure === !0 ? !0 : $.secure === !1 ? !1 : $.scheme ? $.scheme.length === 3 && ($.scheme[0] === "w" || $.scheme[0] === "W") && ($.scheme[1] === "s" || $.scheme[1] === "S") && ($.scheme[2] === "s" || $.scheme[2] === "S") : !1;
  }
  function r($) {
    return $.host || ($.error = $.error || "HTTP URIs must have a host."), $;
  }
  function i($) {
    const _ = String($.scheme).toLowerCase() === "https";
    return ($.port === (_ ? 443 : 80) || $.port === "") && ($.port = void 0), $.path || ($.path = "/"), $;
  }
  function c($) {
    return $.secure = f($), $.resourceName = ($.path || "/") + ($.query ? "?" + $.query : ""), $.path = void 0, $.query = void 0, $;
  }
  function s($) {
    if (($.port === (f($) ? 443 : 80) || $.port === "") && ($.port = void 0), typeof $.secure == "boolean" && ($.scheme = $.secure ? "wss" : "ws", $.secure = void 0), $.resourceName) {
      const [_, w] = $.resourceName.split("?");
      $.path = _ && _ !== "/" ? _ : void 0, $.query = w, $.resourceName = void 0;
    }
    return $.fragment = void 0, $;
  }
  function u($, _) {
    if (!$.path)
      return $.error = "URN can not be parsed", $;
    const w = $.path.match(t);
    if (w) {
      const P = _.scheme || $.scheme || "urn";
      $.nid = w[1].toLowerCase(), $.nss = w[2];
      const T = `${P}:${_.nid || $.nid}`, G = b(T);
      $.path = void 0, G && ($ = G.parse($, _));
    } else
      $.error = $.error || "URN can not be parsed.";
    return $;
  }
  function a($, _) {
    if ($.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const w = _.scheme || $.scheme || "urn", P = $.nid.toLowerCase(), T = `${w}:${_.nid || P}`, G = b(T);
    G && ($ = G.serialize($, _));
    const L = $, M = $.nss;
    return L.path = `${P || _.nid}:${M}`, _.skipEscape = !0, L;
  }
  function d($, _) {
    const w = $;
    return w.uuid = w.nss, w.nss = void 0, !_.tolerant && (!w.uuid || !e(w.uuid)) && (w.error = w.error || "UUID is not valid."), w;
  }
  function l($) {
    const _ = $;
    return _.nss = ($.uuid || "").toLowerCase(), _;
  }
  const m = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: r,
      serialize: i
    }
  ), g = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: m.domainHost,
      parse: r,
      serialize: i
    }
  ), v = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: c,
      serialize: s
    }
  ), h = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: v.domainHost,
      parse: v.parse,
      serialize: v.serialize
    }
  ), E = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: m,
      https: g,
      ws: v,
      wss: h,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: u,
          serialize: a,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: d,
          serialize: l,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(E, null);
  function b($) {
    return $ && (E[
      /** @type {SchemeName} */
      $
    ] || E[
      /** @type {SchemeName} */
      $.toLowerCase()
    ]) || void 0;
  }
  return ks = {
    wsIsSecure: f,
    SCHEMES: E,
    isValidSchemeName: n,
    getSchemeHandler: b
  }, ks;
}
var af;
function k0() {
  if (af) return nn.exports;
  af = 1;
  const { normalizeIPv6: e, removeDotSegments: t, recomposeAuthority: o, normalizeComponentEncoding: n, isIPv4: f, nonSimpleDomain: r } = D0(), { SCHEMES: i, getSchemeHandler: c } = f_();
  function s(h, y) {
    return typeof h == "string" ? h = /** @type {T} */
    l(g(h, y), y) : typeof h == "object" && (h = /** @type {T} */
    g(l(h, y), y)), h;
  }
  function u(h, y, p) {
    const E = p ? Object.assign({ scheme: "null" }, p) : { scheme: "null" }, b = a(g(h, E), g(y, E), E, !0);
    return E.skipEscape = !0, l(b, E);
  }
  function a(h, y, p, E) {
    const b = {};
    return E || (h = g(l(h, p), p), y = g(l(y, p), p)), p = p || {}, !p.tolerant && y.scheme ? (b.scheme = y.scheme, b.userinfo = y.userinfo, b.host = y.host, b.port = y.port, b.path = t(y.path || ""), b.query = y.query) : (y.userinfo !== void 0 || y.host !== void 0 || y.port !== void 0 ? (b.userinfo = y.userinfo, b.host = y.host, b.port = y.port, b.path = t(y.path || ""), b.query = y.query) : (y.path ? (y.path[0] === "/" ? b.path = t(y.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? b.path = "/" + y.path : h.path ? b.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + y.path : b.path = y.path, b.path = t(b.path)), b.query = y.query) : (b.path = h.path, y.query !== void 0 ? b.query = y.query : b.query = h.query), b.userinfo = h.userinfo, b.host = h.host, b.port = h.port), b.scheme = h.scheme), b.fragment = y.fragment, b;
  }
  function d(h, y, p) {
    return typeof h == "string" ? (h = unescape(h), h = l(n(g(h, p), !0), { ...p, skipEscape: !0 })) : typeof h == "object" && (h = l(n(h, !0), { ...p, skipEscape: !0 })), typeof y == "string" ? (y = unescape(y), y = l(n(g(y, p), !0), { ...p, skipEscape: !0 })) : typeof y == "object" && (y = l(n(y, !0), { ...p, skipEscape: !0 })), h.toLowerCase() === y.toLowerCase();
  }
  function l(h, y) {
    const p = {
      host: h.host,
      scheme: h.scheme,
      userinfo: h.userinfo,
      port: h.port,
      path: h.path,
      query: h.query,
      nid: h.nid,
      nss: h.nss,
      uuid: h.uuid,
      fragment: h.fragment,
      reference: h.reference,
      resourceName: h.resourceName,
      secure: h.secure,
      error: ""
    }, E = Object.assign({}, y), b = [], $ = c(E.scheme || p.scheme);
    $ && $.serialize && $.serialize(p, E), p.path !== void 0 && (E.skipEscape ? p.path = unescape(p.path) : (p.path = escape(p.path), p.scheme !== void 0 && (p.path = p.path.split("%3A").join(":")))), E.reference !== "suffix" && p.scheme && b.push(p.scheme, ":");
    const _ = o(p);
    if (_ !== void 0 && (E.reference !== "suffix" && b.push("//"), b.push(_), p.path && p.path[0] !== "/" && b.push("/")), p.path !== void 0) {
      let w = p.path;
      !E.absolutePath && (!$ || !$.absolutePath) && (w = t(w)), _ === void 0 && w[0] === "/" && w[1] === "/" && (w = "/%2F" + w.slice(2)), b.push(w);
    }
    return p.query !== void 0 && b.push("?", p.query), p.fragment !== void 0 && b.push("#", p.fragment), b.join("");
  }
  const m = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function g(h, y) {
    const p = Object.assign({}, y), E = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let b = !1;
    p.reference === "suffix" && (p.scheme ? h = p.scheme + ":" + h : h = "//" + h);
    const $ = h.match(m);
    if ($) {
      if (E.scheme = $[1], E.userinfo = $[3], E.host = $[4], E.port = parseInt($[5], 10), E.path = $[6] || "", E.query = $[7], E.fragment = $[8], isNaN(E.port) && (E.port = $[5]), E.host)
        if (f(E.host) === !1) {
          const P = e(E.host);
          E.host = P.host.toLowerCase(), b = P.isIPV6;
        } else
          b = !0;
      E.scheme === void 0 && E.userinfo === void 0 && E.host === void 0 && E.port === void 0 && E.query === void 0 && !E.path ? E.reference = "same-document" : E.scheme === void 0 ? E.reference = "relative" : E.fragment === void 0 ? E.reference = "absolute" : E.reference = "uri", p.reference && p.reference !== "suffix" && p.reference !== E.reference && (E.error = E.error || "URI is not a " + p.reference + " reference.");
      const _ = c(p.scheme || E.scheme);
      if (!p.unicodeSupport && (!_ || !_.unicodeSupport) && E.host && (p.domainHost || _ && _.domainHost) && b === !1 && r(E.host))
        try {
          E.host = URL.domainToASCII(E.host.toLowerCase());
        } catch (w) {
          E.error = E.error || "Host's domain name can not be converted to ASCII: " + w;
        }
      (!_ || _ && !_.skipNormalize) && (h.indexOf("%") !== -1 && (E.scheme !== void 0 && (E.scheme = unescape(E.scheme)), E.host !== void 0 && (E.host = unescape(E.host))), E.path && (E.path = escape(unescape(E.path))), E.fragment && (E.fragment = encodeURI(decodeURIComponent(E.fragment)))), _ && _.parse && _.parse(E, p);
    } else
      E.error = E.error || "URI can not be parsed.";
    return E;
  }
  const v = {
    SCHEMES: i,
    normalize: s,
    resolve: u,
    resolveComponent: a,
    equal: d,
    serialize: l,
    parse: g
  };
  return nn.exports = v, nn.exports.default = v, nn.exports.fastUri = v, nn.exports;
}
var sf;
function d_() {
  if (sf) return Jn;
  sf = 1, Object.defineProperty(Jn, "__esModule", { value: !0 });
  const e = k0();
  return e.code = 'require("ajv/dist/runtime/uri").default', Jn.default = e, Jn;
}
var of;
function h_() {
  return of || (of = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = rs();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var o = Te();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return o._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return o.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return o.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return o.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return o.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return o.CodeGen;
    } });
    const n = Bc(), f = ns(), r = A0(), i = is(), c = Te(), s = ts(), u = za(), a = Le(), d = l_, l = d_(), m = (V, C) => new RegExp(V, C);
    m.code = "new RegExp";
    const g = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), h = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, y = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, p = 200;
    function E(V) {
      var C, U, D, R, O, x, I, N, Q, H, A, q, W, J, re, fe, ge, Oe, ke, Ne, Se, S, te, ie, pe;
      const ae = V.strict, de = (C = V.code) === null || C === void 0 ? void 0 : C.optimize, le = de === !0 || de === void 0 ? 1 : de || 0, me = (D = (U = V.code) === null || U === void 0 ? void 0 : U.regExp) !== null && D !== void 0 ? D : m, ve = (R = V.uriResolver) !== null && R !== void 0 ? R : l.default;
      return {
        strictSchema: (x = (O = V.strictSchema) !== null && O !== void 0 ? O : ae) !== null && x !== void 0 ? x : !0,
        strictNumbers: (N = (I = V.strictNumbers) !== null && I !== void 0 ? I : ae) !== null && N !== void 0 ? N : !0,
        strictTypes: (H = (Q = V.strictTypes) !== null && Q !== void 0 ? Q : ae) !== null && H !== void 0 ? H : "log",
        strictTuples: (q = (A = V.strictTuples) !== null && A !== void 0 ? A : ae) !== null && q !== void 0 ? q : "log",
        strictRequired: (J = (W = V.strictRequired) !== null && W !== void 0 ? W : ae) !== null && J !== void 0 ? J : !1,
        code: V.code ? { ...V.code, optimize: le, regExp: me } : { optimize: le, regExp: me },
        loopRequired: (re = V.loopRequired) !== null && re !== void 0 ? re : p,
        loopEnum: (fe = V.loopEnum) !== null && fe !== void 0 ? fe : p,
        meta: (ge = V.meta) !== null && ge !== void 0 ? ge : !0,
        messages: (Oe = V.messages) !== null && Oe !== void 0 ? Oe : !0,
        inlineRefs: (ke = V.inlineRefs) !== null && ke !== void 0 ? ke : !0,
        schemaId: (Ne = V.schemaId) !== null && Ne !== void 0 ? Ne : "$id",
        addUsedSchema: (Se = V.addUsedSchema) !== null && Se !== void 0 ? Se : !0,
        validateSchema: (S = V.validateSchema) !== null && S !== void 0 ? S : !0,
        validateFormats: (te = V.validateFormats) !== null && te !== void 0 ? te : !0,
        unicodeRegExp: (ie = V.unicodeRegExp) !== null && ie !== void 0 ? ie : !0,
        int32range: (pe = V.int32range) !== null && pe !== void 0 ? pe : !0,
        uriResolver: ve
      };
    }
    class b {
      constructor(C = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), C = this.opts = { ...C, ...E(C) };
        const { es5: U, lines: D } = this.opts.code;
        this.scope = new c.ValueScope({ scope: {}, prefixes: v, es5: U, lines: D }), this.logger = M(C.logger);
        const R = C.validateFormats;
        C.validateFormats = !1, this.RULES = (0, r.getRules)(), $.call(this, h, C, "NOT SUPPORTED"), $.call(this, y, C, "DEPRECATED", "warn"), this._metaOpts = G.call(this), C.formats && P.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), C.keywords && T.call(this, C.keywords), typeof C.meta == "object" && this.addMetaSchema(C.meta), w.call(this), C.validateFormats = R;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: C, meta: U, schemaId: D } = this.opts;
        let R = d;
        D === "id" && (R = { ...d }, R.id = R.$id, delete R.$id), U && C && this.addMetaSchema(R, R[D], !1);
      }
      defaultMeta() {
        const { meta: C, schemaId: U } = this.opts;
        return this.opts.defaultMeta = typeof C == "object" ? C[U] || C : void 0;
      }
      validate(C, U) {
        let D;
        if (typeof C == "string") {
          if (D = this.getSchema(C), !D)
            throw new Error(`no schema with key or ref "${C}"`);
        } else
          D = this.compile(C);
        const R = D(U);
        return "$async" in D || (this.errors = D.errors), R;
      }
      compile(C, U) {
        const D = this._addSchema(C, U);
        return D.validate || this._compileSchemaEnv(D);
      }
      compileAsync(C, U) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: D } = this.opts;
        return R.call(this, C, U);
        async function R(H, A) {
          await O.call(this, H.$schema);
          const q = this._addSchema(H, A);
          return q.validate || x.call(this, q);
        }
        async function O(H) {
          H && !this.getSchema(H) && await R.call(this, { $ref: H }, !0);
        }
        async function x(H) {
          try {
            return this._compileSchemaEnv(H);
          } catch (A) {
            if (!(A instanceof f.default))
              throw A;
            return I.call(this, A), await N.call(this, A.missingSchema), x.call(this, H);
          }
        }
        function I({ missingSchema: H, missingRef: A }) {
          if (this.refs[H])
            throw new Error(`AnySchema ${H} is loaded but ${A} cannot be resolved`);
        }
        async function N(H) {
          const A = await Q.call(this, H);
          this.refs[H] || await O.call(this, A.$schema), this.refs[H] || this.addSchema(A, H, U);
        }
        async function Q(H) {
          const A = this._loading[H];
          if (A)
            return A;
          try {
            return await (this._loading[H] = D(H));
          } finally {
            delete this._loading[H];
          }
        }
      }
      // Adds schema to the instance
      addSchema(C, U, D, R = this.opts.validateSchema) {
        if (Array.isArray(C)) {
          for (const x of C)
            this.addSchema(x, void 0, D, R);
          return this;
        }
        let O;
        if (typeof C == "object") {
          const { schemaId: x } = this.opts;
          if (O = C[x], O !== void 0 && typeof O != "string")
            throw new Error(`schema ${x} must be string`);
        }
        return U = (0, s.normalizeId)(U || O), this._checkUnique(U), this.schemas[U] = this._addSchema(C, D, U, R, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(C, U, D = this.opts.validateSchema) {
        return this.addSchema(C, U, !0, D), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(C, U) {
        if (typeof C == "boolean")
          return !0;
        let D;
        if (D = C.$schema, D !== void 0 && typeof D != "string")
          throw new Error("$schema must be a string");
        if (D = D || this.opts.defaultMeta || this.defaultMeta(), !D)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const R = this.validate(D, C);
        if (!R && U) {
          const O = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(O);
          else
            throw new Error(O);
        }
        return R;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(C) {
        let U;
        for (; typeof (U = _.call(this, C)) == "string"; )
          C = U;
        if (U === void 0) {
          const { schemaId: D } = this.opts, R = new i.SchemaEnv({ schema: {}, schemaId: D });
          if (U = i.resolveSchema.call(this, R, C), !U)
            return;
          this.refs[C] = U;
        }
        return U.validate || this._compileSchemaEnv(U);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(C) {
        if (C instanceof RegExp)
          return this._removeAllSchemas(this.schemas, C), this._removeAllSchemas(this.refs, C), this;
        switch (typeof C) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const U = _.call(this, C);
            return typeof U == "object" && this._cache.delete(U.schema), delete this.schemas[C], delete this.refs[C], this;
          }
          case "object": {
            const U = C;
            this._cache.delete(U);
            let D = C[this.opts.schemaId];
            return D && (D = (0, s.normalizeId)(D), delete this.schemas[D], delete this.refs[D]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(C) {
        for (const U of C)
          this.addKeyword(U);
        return this;
      }
      addKeyword(C, U) {
        let D;
        if (typeof C == "string")
          D = C, typeof U == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), U.keyword = D);
        else if (typeof C == "object" && U === void 0) {
          if (U = C, D = U.keyword, Array.isArray(D) && !D.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (k.call(this, D, U), !U)
          return (0, a.eachItem)(D, (O) => F.call(this, O)), this;
        B.call(this, U);
        const R = {
          ...U,
          type: (0, u.getJSONTypes)(U.type),
          schemaType: (0, u.getJSONTypes)(U.schemaType)
        };
        return (0, a.eachItem)(D, R.type.length === 0 ? (O) => F.call(this, O, R) : (O) => R.type.forEach((x) => F.call(this, O, R, x))), this;
      }
      getKeyword(C) {
        const U = this.RULES.all[C];
        return typeof U == "object" ? U.definition : !!U;
      }
      // Remove keyword
      removeKeyword(C) {
        const { RULES: U } = this;
        delete U.keywords[C], delete U.all[C];
        for (const D of U.rules) {
          const R = D.rules.findIndex((O) => O.keyword === C);
          R >= 0 && D.rules.splice(R, 1);
        }
        return this;
      }
      // Add format
      addFormat(C, U) {
        return typeof U == "string" && (U = new RegExp(U)), this.formats[C] = U, this;
      }
      errorsText(C = this.errors, { separator: U = ", ", dataVar: D = "data" } = {}) {
        return !C || C.length === 0 ? "No errors" : C.map((R) => `${D}${R.instancePath} ${R.message}`).reduce((R, O) => R + U + O);
      }
      $dataMetaSchema(C, U) {
        const D = this.RULES.all;
        C = JSON.parse(JSON.stringify(C));
        for (const R of U) {
          const O = R.split("/").slice(1);
          let x = C;
          for (const I of O)
            x = x[I];
          for (const I in D) {
            const N = D[I];
            if (typeof N != "object")
              continue;
            const { $data: Q } = N.definition, H = x[I];
            Q && H && (x[I] = Z(H));
          }
        }
        return C;
      }
      _removeAllSchemas(C, U) {
        for (const D in C) {
          const R = C[D];
          (!U || U.test(D)) && (typeof R == "string" ? delete C[D] : R && !R.meta && (this._cache.delete(R.schema), delete C[D]));
        }
      }
      _addSchema(C, U, D, R = this.opts.validateSchema, O = this.opts.addUsedSchema) {
        let x;
        const { schemaId: I } = this.opts;
        if (typeof C == "object")
          x = C[I];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof C != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let N = this._cache.get(C);
        if (N !== void 0)
          return N;
        D = (0, s.normalizeId)(x || D);
        const Q = s.getSchemaRefs.call(this, C, D);
        return N = new i.SchemaEnv({ schema: C, schemaId: I, meta: U, baseId: D, localRefs: Q }), this._cache.set(N.schema, N), O && !D.startsWith("#") && (D && this._checkUnique(D), this.refs[D] = N), R && this.validateSchema(C, !0), N;
      }
      _checkUnique(C) {
        if (this.schemas[C] || this.refs[C])
          throw new Error(`schema with key or id "${C}" already exists`);
      }
      _compileSchemaEnv(C) {
        if (C.meta ? this._compileMetaSchema(C) : i.compileSchema.call(this, C), !C.validate)
          throw new Error("ajv implementation error");
        return C.validate;
      }
      _compileMetaSchema(C) {
        const U = this.opts;
        this.opts = this._metaOpts;
        try {
          i.compileSchema.call(this, C);
        } finally {
          this.opts = U;
        }
      }
    }
    b.ValidationError = n.default, b.MissingRefError = f.default, e.default = b;
    function $(V, C, U, D = "error") {
      for (const R in V) {
        const O = R;
        O in C && this.logger[D](`${U}: option ${R}. ${V[O]}`);
      }
    }
    function _(V) {
      return V = (0, s.normalizeId)(V), this.schemas[V] || this.refs[V];
    }
    function w() {
      const V = this.opts.schemas;
      if (V)
        if (Array.isArray(V))
          this.addSchema(V);
        else
          for (const C in V)
            this.addSchema(V[C], C);
    }
    function P() {
      for (const V in this.opts.formats) {
        const C = this.opts.formats[V];
        C && this.addFormat(V, C);
      }
    }
    function T(V) {
      if (Array.isArray(V)) {
        this.addVocabulary(V);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const C in V) {
        const U = V[C];
        U.keyword || (U.keyword = C), this.addKeyword(U);
      }
    }
    function G() {
      const V = { ...this.opts };
      for (const C of g)
        delete V[C];
      return V;
    }
    const L = { log() {
    }, warn() {
    }, error() {
    } };
    function M(V) {
      if (V === !1)
        return L;
      if (V === void 0)
        return console;
      if (V.log && V.warn && V.error)
        return V;
      throw new Error("logger must implement log, warn and error methods");
    }
    const K = /^[a-z_$][a-z0-9_$:-]*$/i;
    function k(V, C) {
      const { RULES: U } = this;
      if ((0, a.eachItem)(V, (D) => {
        if (U.keywords[D])
          throw new Error(`Keyword ${D} is already defined`);
        if (!K.test(D))
          throw new Error(`Keyword ${D} has invalid name`);
      }), !!C && C.$data && !("code" in C || "validate" in C))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function F(V, C, U) {
      var D;
      const R = C?.post;
      if (U && R)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: O } = this;
      let x = R ? O.post : O.rules.find(({ type: N }) => N === U);
      if (x || (x = { type: U, rules: [] }, O.rules.push(x)), O.keywords[V] = !0, !C)
        return;
      const I = {
        keyword: V,
        definition: {
          ...C,
          type: (0, u.getJSONTypes)(C.type),
          schemaType: (0, u.getJSONTypes)(C.schemaType)
        }
      };
      C.before ? X.call(this, x, I, C.before) : x.rules.push(I), O.all[V] = I, (D = C.implements) === null || D === void 0 || D.forEach((N) => this.addKeyword(N));
    }
    function X(V, C, U) {
      const D = V.rules.findIndex((R) => R.keyword === U);
      D >= 0 ? V.rules.splice(D, 0, C) : (V.rules.push(C), this.logger.warn(`rule ${U} is not defined`));
    }
    function B(V) {
      let { metaSchema: C } = V;
      C !== void 0 && (V.$data && this.opts.$data && (C = Z(C)), V.validateSchema = this.compile(C, !0));
    }
    const Y = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function Z(V) {
      return { anyOf: [V, Y] };
    }
  })(Ps)), Ps;
}
var Qn = {}, Zn = {}, ei = {}, uf;
function p_() {
  if (uf) return ei;
  uf = 1, Object.defineProperty(ei, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return ei.default = e, ei;
}
var tr = {}, cf;
function Hc() {
  if (cf) return tr;
  cf = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.callRef = tr.getValidate = void 0;
  const e = ns(), t = It(), o = Te(), n = Nt(), f = is(), r = Le(), i = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: a, schema: d, it: l } = u, { baseId: m, schemaEnv: g, validateName: v, opts: h, self: y } = l, { root: p } = g;
      if ((d === "#" || d === "#/") && m === p.baseId)
        return b();
      const E = f.resolveRef.call(y, p, m, d);
      if (E === void 0)
        throw new e.default(l.opts.uriResolver, m, d);
      if (E instanceof f.SchemaEnv)
        return $(E);
      return _(E);
      function b() {
        if (g === p)
          return s(u, v, g, g.$async);
        const w = a.scopeValue("root", { ref: p });
        return s(u, (0, o._)`${w}.validate`, p, p.$async);
      }
      function $(w) {
        const P = c(u, w);
        s(u, P, w, w.$async);
      }
      function _(w) {
        const P = a.scopeValue("schema", h.code.source === !0 ? { ref: w, code: (0, o.stringify)(w) } : { ref: w }), T = a.name("valid"), G = u.subschema({
          schema: w,
          dataTypes: [],
          schemaPath: o.nil,
          topSchemaRef: P,
          errSchemaPath: d
        }, T);
        u.mergeEvaluated(G), u.ok(T);
      }
    }
  };
  function c(u, a) {
    const { gen: d } = u;
    return a.validate ? d.scopeValue("validate", { ref: a.validate }) : (0, o._)`${d.scopeValue("wrapper", { ref: a })}.validate`;
  }
  tr.getValidate = c;
  function s(u, a, d, l) {
    const { gen: m, it: g } = u, { allErrors: v, schemaEnv: h, opts: y } = g, p = y.passContext ? n.default.this : o.nil;
    l ? E() : b();
    function E() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const w = m.let("valid");
      m.try(() => {
        m.code((0, o._)`await ${(0, t.callValidateCode)(u, a, p)}`), _(a), v || m.assign(w, !0);
      }, (P) => {
        m.if((0, o._)`!(${P} instanceof ${g.ValidationError})`, () => m.throw(P)), $(P), v || m.assign(w, !1);
      }), u.ok(w);
    }
    function b() {
      u.result((0, t.callValidateCode)(u, a, p), () => _(a), () => $(a));
    }
    function $(w) {
      const P = (0, o._)`${w}.errors`;
      m.assign(n.default.vErrors, (0, o._)`${n.default.vErrors} === null ? ${P} : ${n.default.vErrors}.concat(${P})`), m.assign(n.default.errors, (0, o._)`${n.default.vErrors}.length`);
    }
    function _(w) {
      var P;
      if (!g.opts.unevaluated)
        return;
      const T = (P = d?.validate) === null || P === void 0 ? void 0 : P.evaluated;
      if (g.props !== !0)
        if (T && !T.dynamicProps)
          T.props !== void 0 && (g.props = r.mergeEvaluated.props(m, T.props, g.props));
        else {
          const G = m.var("props", (0, o._)`${w}.evaluated.props`);
          g.props = r.mergeEvaluated.props(m, G, g.props, o.Name);
        }
      if (g.items !== !0)
        if (T && !T.dynamicItems)
          T.items !== void 0 && (g.items = r.mergeEvaluated.items(m, T.items, g.items));
        else {
          const G = m.var("items", (0, o._)`${w}.evaluated.items`);
          g.items = r.mergeEvaluated.items(m, G, g.items, o.Name);
        }
    }
  }
  return tr.callRef = s, tr.default = i, tr;
}
var lf;
function m_() {
  if (lf) return Zn;
  lf = 1, Object.defineProperty(Zn, "__esModule", { value: !0 });
  const e = p_(), t = Hc(), o = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return Zn.default = o, Zn;
}
var ti = {}, ri = {}, ff;
function y_() {
  if (ff) return ri;
  ff = 1, Object.defineProperty(ri, "__esModule", { value: !0 });
  const e = Te(), t = e.operators, o = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, n = {
    message: ({ keyword: r, schemaCode: i }) => (0, e.str)`must be ${o[r].okStr} ${i}`,
    params: ({ keyword: r, schemaCode: i }) => (0, e._)`{comparison: ${o[r].okStr}, limit: ${i}}`
  }, f = {
    keyword: Object.keys(o),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: n,
    code(r) {
      const { keyword: i, data: c, schemaCode: s } = r;
      r.fail$data((0, e._)`${c} ${o[i].fail} ${s} || isNaN(${c})`);
    }
  };
  return ri.default = f, ri;
}
var ni = {}, df;
function g_() {
  if (df) return ni;
  df = 1, Object.defineProperty(ni, "__esModule", { value: !0 });
  const e = Te(), o = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must be multiple of ${n}`,
      params: ({ schemaCode: n }) => (0, e._)`{multipleOf: ${n}}`
    },
    code(n) {
      const { gen: f, data: r, schemaCode: i, it: c } = n, s = c.opts.multipleOfPrecision, u = f.let("res"), a = s ? (0, e._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${s}` : (0, e._)`${u} !== parseInt(${u})`;
      n.fail$data((0, e._)`(${i} === 0 || (${u} = ${r}/${i}, ${a}))`);
    }
  };
  return ni.default = o, ni;
}
var ii = {}, ai = {}, hf;
function v_() {
  if (hf) return ai;
  hf = 1, Object.defineProperty(ai, "__esModule", { value: !0 });
  function e(t) {
    const o = t.length;
    let n = 0, f = 0, r;
    for (; f < o; )
      n++, r = t.charCodeAt(f++), r >= 55296 && r <= 56319 && f < o && (r = t.charCodeAt(f), (r & 64512) === 56320 && f++);
    return n;
  }
  return ai.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', ai;
}
var pf;
function __() {
  if (pf) return ii;
  pf = 1, Object.defineProperty(ii, "__esModule", { value: !0 });
  const e = Te(), t = Le(), o = v_(), f = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: i }) {
        const c = r === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${c} than ${i} characters`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: i, data: c, schemaCode: s, it: u } = r, a = i === "maxLength" ? e.operators.GT : e.operators.LT, d = u.opts.unicode === !1 ? (0, e._)`${c}.length` : (0, e._)`${(0, t.useFunc)(r.gen, o.default)}(${c})`;
      r.fail$data((0, e._)`${d} ${a} ${s}`);
    }
  };
  return ii.default = f, ii;
}
var si = {}, mf;
function E_() {
  if (mf) return si;
  mf = 1, Object.defineProperty(si, "__esModule", { value: !0 });
  const e = It(), t = Te(), n = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: f }) => (0, t.str)`must match pattern "${f}"`,
      params: ({ schemaCode: f }) => (0, t._)`{pattern: ${f}}`
    },
    code(f) {
      const { data: r, $data: i, schema: c, schemaCode: s, it: u } = f, a = u.opts.unicodeRegExp ? "u" : "", d = i ? (0, t._)`(new RegExp(${s}, ${a}))` : (0, e.usePattern)(f, c);
      f.fail$data((0, t._)`!${d}.test(${r})`);
    }
  };
  return si.default = n, si;
}
var oi = {}, yf;
function w_() {
  if (yf) return oi;
  yf = 1, Object.defineProperty(oi, "__esModule", { value: !0 });
  const e = Te(), o = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: f }) {
        const r = n === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${f} properties`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: f, data: r, schemaCode: i } = n, c = f === "maxProperties" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`Object.keys(${r}).length ${c} ${i}`);
    }
  };
  return oi.default = o, oi;
}
var ui = {}, gf;
function $_() {
  if (gf) return ui;
  gf = 1, Object.defineProperty(ui, "__esModule", { value: !0 });
  const e = It(), t = Te(), o = Le(), f = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: r } }) => (0, t.str)`must have required property '${r}'`,
      params: ({ params: { missingProperty: r } }) => (0, t._)`{missingProperty: ${r}}`
    },
    code(r) {
      const { gen: i, schema: c, schemaCode: s, data: u, $data: a, it: d } = r, { opts: l } = d;
      if (!a && c.length === 0)
        return;
      const m = c.length >= l.loopRequired;
      if (d.allErrors ? g() : v(), l.strictRequired) {
        const p = r.parentSchema.properties, { definedProperties: E } = r.it;
        for (const b of c)
          if (p?.[b] === void 0 && !E.has(b)) {
            const $ = d.schemaEnv.baseId + d.errSchemaPath, _ = `required property "${b}" is not defined at "${$}" (strictRequired)`;
            (0, o.checkStrictMode)(d, _, d.opts.strictRequired);
          }
      }
      function g() {
        if (m || a)
          r.block$data(t.nil, h);
        else
          for (const p of c)
            (0, e.checkReportMissingProp)(r, p);
      }
      function v() {
        const p = i.let("missing");
        if (m || a) {
          const E = i.let("valid", !0);
          r.block$data(E, () => y(p, E)), r.ok(E);
        } else
          i.if((0, e.checkMissingProp)(r, c, p)), (0, e.reportMissingProp)(r, p), i.else();
      }
      function h() {
        i.forOf("prop", s, (p) => {
          r.setParams({ missingProperty: p }), i.if((0, e.noPropertyInData)(i, u, p, l.ownProperties), () => r.error());
        });
      }
      function y(p, E) {
        r.setParams({ missingProperty: p }), i.forOf(p, s, () => {
          i.assign(E, (0, e.propertyInData)(i, u, p, l.ownProperties)), i.if((0, t.not)(E), () => {
            r.error(), i.break();
          });
        }, t.nil);
      }
    }
  };
  return ui.default = f, ui;
}
var ci = {}, vf;
function S_() {
  if (vf) return ci;
  vf = 1, Object.defineProperty(ci, "__esModule", { value: !0 });
  const e = Te(), o = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: f }) {
        const r = n === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${f} items`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: f, data: r, schemaCode: i } = n, c = f === "maxItems" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`${r}.length ${c} ${i}`);
    }
  };
  return ci.default = o, ci;
}
var li = {}, fi = {}, _f;
function zc() {
  if (_f) return fi;
  _f = 1, Object.defineProperty(fi, "__esModule", { value: !0 });
  const e = es();
  return e.code = 'require("ajv/dist/runtime/equal").default', fi.default = e, fi;
}
var Ef;
function b_() {
  if (Ef) return li;
  Ef = 1, Object.defineProperty(li, "__esModule", { value: !0 });
  const e = za(), t = Te(), o = Le(), n = zc(), r = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i, j: c } }) => (0, t.str)`must NOT have duplicate items (items ## ${c} and ${i} are identical)`,
      params: ({ params: { i, j: c } }) => (0, t._)`{i: ${i}, j: ${c}}`
    },
    code(i) {
      const { gen: c, data: s, $data: u, schema: a, parentSchema: d, schemaCode: l, it: m } = i;
      if (!u && !a)
        return;
      const g = c.let("valid"), v = d.items ? (0, e.getSchemaTypes)(d.items) : [];
      i.block$data(g, h, (0, t._)`${l} === false`), i.ok(g);
      function h() {
        const b = c.let("i", (0, t._)`${s}.length`), $ = c.let("j");
        i.setParams({ i: b, j: $ }), c.assign(g, !0), c.if((0, t._)`${b} > 1`, () => (y() ? p : E)(b, $));
      }
      function y() {
        return v.length > 0 && !v.some((b) => b === "object" || b === "array");
      }
      function p(b, $) {
        const _ = c.name("item"), w = (0, e.checkDataTypes)(v, _, m.opts.strictNumbers, e.DataType.Wrong), P = c.const("indices", (0, t._)`{}`);
        c.for((0, t._)`;${b}--;`, () => {
          c.let(_, (0, t._)`${s}[${b}]`), c.if(w, (0, t._)`continue`), v.length > 1 && c.if((0, t._)`typeof ${_} == "string"`, (0, t._)`${_} += "_"`), c.if((0, t._)`typeof ${P}[${_}] == "number"`, () => {
            c.assign($, (0, t._)`${P}[${_}]`), i.error(), c.assign(g, !1).break();
          }).code((0, t._)`${P}[${_}] = ${b}`);
        });
      }
      function E(b, $) {
        const _ = (0, o.useFunc)(c, n.default), w = c.name("outer");
        c.label(w).for((0, t._)`;${b}--;`, () => c.for((0, t._)`${$} = ${b}; ${$}--;`, () => c.if((0, t._)`${_}(${s}[${b}], ${s}[${$}])`, () => {
          i.error(), c.assign(g, !1).break(w);
        })));
      }
    }
  };
  return li.default = r, li;
}
var di = {}, wf;
function R_() {
  if (wf) return di;
  wf = 1, Object.defineProperty(di, "__esModule", { value: !0 });
  const e = Te(), t = Le(), o = zc(), f = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValue: ${r}}`
    },
    code(r) {
      const { gen: i, data: c, $data: s, schemaCode: u, schema: a } = r;
      s || a && typeof a == "object" ? r.fail$data((0, e._)`!${(0, t.useFunc)(i, o.default)}(${c}, ${u})`) : r.fail((0, e._)`${a} !== ${c}`);
    }
  };
  return di.default = f, di;
}
var hi = {}, $f;
function P_() {
  if ($f) return hi;
  $f = 1, Object.defineProperty(hi, "__esModule", { value: !0 });
  const e = Te(), t = Le(), o = zc(), f = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValues: ${r}}`
    },
    code(r) {
      const { gen: i, data: c, $data: s, schema: u, schemaCode: a, it: d } = r;
      if (!s && u.length === 0)
        throw new Error("enum must have non-empty array");
      const l = u.length >= d.opts.loopEnum;
      let m;
      const g = () => m ?? (m = (0, t.useFunc)(i, o.default));
      let v;
      if (l || s)
        v = i.let("valid"), r.block$data(v, h);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const p = i.const("vSchema", a);
        v = (0, e.or)(...u.map((E, b) => y(p, b)));
      }
      r.pass(v);
      function h() {
        i.assign(v, !1), i.forOf("v", a, (p) => i.if((0, e._)`${g()}(${c}, ${p})`, () => i.assign(v, !0).break()));
      }
      function y(p, E) {
        const b = u[E];
        return typeof b == "object" && b !== null ? (0, e._)`${g()}(${c}, ${p}[${E}])` : (0, e._)`${c} === ${b}`;
      }
    }
  };
  return hi.default = f, hi;
}
var Sf;
function T_() {
  if (Sf) return ti;
  Sf = 1, Object.defineProperty(ti, "__esModule", { value: !0 });
  const e = y_(), t = g_(), o = __(), n = E_(), f = w_(), r = $_(), i = S_(), c = b_(), s = R_(), u = P_(), a = [
    // number
    e.default,
    t.default,
    // string
    o.default,
    n.default,
    // object
    f.default,
    r.default,
    // array
    i.default,
    c.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    s.default,
    u.default
  ];
  return ti.default = a, ti;
}
var pi = {}, qr = {}, bf;
function q0() {
  if (bf) return qr;
  bf = 1, Object.defineProperty(qr, "__esModule", { value: !0 }), qr.validateAdditionalItems = void 0;
  const e = Te(), t = Le(), n = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: r } }) => (0, e.str)`must NOT have more than ${r} items`,
      params: ({ params: { len: r } }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { parentSchema: i, it: c } = r, { items: s } = i;
      if (!Array.isArray(s)) {
        (0, t.checkStrictMode)(c, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      f(r, s);
    }
  };
  function f(r, i) {
    const { gen: c, schema: s, data: u, keyword: a, it: d } = r;
    d.items = !0;
    const l = c.const("len", (0, e._)`${u}.length`);
    if (s === !1)
      r.setParams({ len: i.length }), r.pass((0, e._)`${l} <= ${i.length}`);
    else if (typeof s == "object" && !(0, t.alwaysValidSchema)(d, s)) {
      const g = c.var("valid", (0, e._)`${l} <= ${i.length}`);
      c.if((0, e.not)(g), () => m(g)), r.ok(g);
    }
    function m(g) {
      c.forRange("i", i.length, l, (v) => {
        r.subschema({ keyword: a, dataProp: v, dataPropType: t.Type.Num }, g), d.allErrors || c.if((0, e.not)(g), () => c.break());
      });
    }
  }
  return qr.validateAdditionalItems = f, qr.default = n, qr;
}
var mi = {}, Lr = {}, Rf;
function L0() {
  if (Rf) return Lr;
  Rf = 1, Object.defineProperty(Lr, "__esModule", { value: !0 }), Lr.validateTuple = void 0;
  const e = Te(), t = Le(), o = It(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(r) {
      const { schema: i, it: c } = r;
      if (Array.isArray(i))
        return f(r, "additionalItems", i);
      c.items = !0, !(0, t.alwaysValidSchema)(c, i) && r.ok((0, o.validateArray)(r));
    }
  };
  function f(r, i, c = r.schema) {
    const { gen: s, parentSchema: u, data: a, keyword: d, it: l } = r;
    v(u), l.opts.unevaluated && c.length && l.items !== !0 && (l.items = t.mergeEvaluated.items(s, c.length, l.items));
    const m = s.name("valid"), g = s.const("len", (0, e._)`${a}.length`);
    c.forEach((h, y) => {
      (0, t.alwaysValidSchema)(l, h) || (s.if((0, e._)`${g} > ${y}`, () => r.subschema({
        keyword: d,
        schemaProp: y,
        dataProp: y
      }, m)), r.ok(m));
    });
    function v(h) {
      const { opts: y, errSchemaPath: p } = l, E = c.length, b = E === h.minItems && (E === h.maxItems || h[i] === !1);
      if (y.strictTuples && !b) {
        const $ = `"${d}" is ${E}-tuple, but minItems or maxItems/${i} are not specified or different at path "${p}"`;
        (0, t.checkStrictMode)(l, $, y.strictTuples);
      }
    }
  }
  return Lr.validateTuple = f, Lr.default = n, Lr;
}
var Pf;
function O_() {
  if (Pf) return mi;
  Pf = 1, Object.defineProperty(mi, "__esModule", { value: !0 });
  const e = L0(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (o) => (0, e.validateTuple)(o, "items")
  };
  return mi.default = t, mi;
}
var yi = {}, Tf;
function N_() {
  if (Tf) return yi;
  Tf = 1, Object.defineProperty(yi, "__esModule", { value: !0 });
  const e = Te(), t = Le(), o = It(), n = q0(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, e.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { schema: c, parentSchema: s, it: u } = i, { prefixItems: a } = s;
      u.items = !0, !(0, t.alwaysValidSchema)(u, c) && (a ? (0, n.validateAdditionalItems)(i, a) : i.ok((0, o.validateArray)(i)));
    }
  };
  return yi.default = r, yi;
}
var gi = {}, Of;
function I_() {
  if (Of) return gi;
  Of = 1, Object.defineProperty(gi, "__esModule", { value: !0 });
  const e = Te(), t = Le(), n = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: f, max: r } }) => r === void 0 ? (0, e.str)`must contain at least ${f} valid item(s)` : (0, e.str)`must contain at least ${f} and no more than ${r} valid item(s)`,
      params: ({ params: { min: f, max: r } }) => r === void 0 ? (0, e._)`{minContains: ${f}}` : (0, e._)`{minContains: ${f}, maxContains: ${r}}`
    },
    code(f) {
      const { gen: r, schema: i, parentSchema: c, data: s, it: u } = f;
      let a, d;
      const { minContains: l, maxContains: m } = c;
      u.opts.next ? (a = l === void 0 ? 1 : l, d = m) : a = 1;
      const g = r.const("len", (0, e._)`${s}.length`);
      if (f.setParams({ min: a, max: d }), d === void 0 && a === 0) {
        (0, t.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (d !== void 0 && a > d) {
        (0, t.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), f.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(u, i)) {
        let E = (0, e._)`${g} >= ${a}`;
        d !== void 0 && (E = (0, e._)`${E} && ${g} <= ${d}`), f.pass(E);
        return;
      }
      u.items = !0;
      const v = r.name("valid");
      d === void 0 && a === 1 ? y(v, () => r.if(v, () => r.break())) : a === 0 ? (r.let(v, !0), d !== void 0 && r.if((0, e._)`${s}.length > 0`, h)) : (r.let(v, !1), h()), f.result(v, () => f.reset());
      function h() {
        const E = r.name("_valid"), b = r.let("count", 0);
        y(E, () => r.if(E, () => p(b)));
      }
      function y(E, b) {
        r.forRange("i", 0, g, ($) => {
          f.subschema({
            keyword: "contains",
            dataProp: $,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, E), b();
        });
      }
      function p(E) {
        r.code((0, e._)`${E}++`), d === void 0 ? r.if((0, e._)`${E} >= ${a}`, () => r.assign(v, !0).break()) : (r.if((0, e._)`${E} > ${d}`, () => r.assign(v, !1).break()), a === 1 ? r.assign(v, !0) : r.if((0, e._)`${E} >= ${a}`, () => r.assign(v, !0)));
      }
    }
  };
  return gi.default = n, gi;
}
var qs = {}, Nf;
function Kc() {
  return Nf || (Nf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = Te(), o = Le(), n = It();
    e.error = {
      message: ({ params: { property: s, depsCount: u, deps: a } }) => {
        const d = u === 1 ? "property" : "properties";
        return (0, t.str)`must have ${d} ${a} when property ${s} is present`;
      },
      params: ({ params: { property: s, depsCount: u, deps: a, missingProperty: d } }) => (0, t._)`{property: ${s},
    missingProperty: ${d},
    depsCount: ${u},
    deps: ${a}}`
      // TODO change to reference
    };
    const f = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(s) {
        const [u, a] = r(s);
        i(s, u), c(s, a);
      }
    };
    function r({ schema: s }) {
      const u = {}, a = {};
      for (const d in s) {
        if (d === "__proto__")
          continue;
        const l = Array.isArray(s[d]) ? u : a;
        l[d] = s[d];
      }
      return [u, a];
    }
    function i(s, u = s.schema) {
      const { gen: a, data: d, it: l } = s;
      if (Object.keys(u).length === 0)
        return;
      const m = a.let("missing");
      for (const g in u) {
        const v = u[g];
        if (v.length === 0)
          continue;
        const h = (0, n.propertyInData)(a, d, g, l.opts.ownProperties);
        s.setParams({
          property: g,
          depsCount: v.length,
          deps: v.join(", ")
        }), l.allErrors ? a.if(h, () => {
          for (const y of v)
            (0, n.checkReportMissingProp)(s, y);
        }) : (a.if((0, t._)`${h} && (${(0, n.checkMissingProp)(s, v, m)})`), (0, n.reportMissingProp)(s, m), a.else());
      }
    }
    e.validatePropertyDeps = i;
    function c(s, u = s.schema) {
      const { gen: a, data: d, keyword: l, it: m } = s, g = a.name("valid");
      for (const v in u)
        (0, o.alwaysValidSchema)(m, u[v]) || (a.if(
          (0, n.propertyInData)(a, d, v, m.opts.ownProperties),
          () => {
            const h = s.subschema({ keyword: l, schemaProp: v }, g);
            s.mergeValidEvaluated(h, g);
          },
          () => a.var(g, !0)
          // TODO var
        ), s.ok(g));
    }
    e.validateSchemaDeps = c, e.default = f;
  })(qs)), qs;
}
var vi = {}, If;
function A_() {
  if (If) return vi;
  If = 1, Object.defineProperty(vi, "__esModule", { value: !0 });
  const e = Te(), t = Le(), n = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: f }) => (0, e._)`{propertyName: ${f.propertyName}}`
    },
    code(f) {
      const { gen: r, schema: i, data: c, it: s } = f;
      if ((0, t.alwaysValidSchema)(s, i))
        return;
      const u = r.name("valid");
      r.forIn("key", c, (a) => {
        f.setParams({ propertyName: a }), f.subschema({
          keyword: "propertyNames",
          data: a,
          dataTypes: ["string"],
          propertyName: a,
          compositeRule: !0
        }, u), r.if((0, e.not)(u), () => {
          f.error(!0), s.allErrors || r.break();
        });
      }), f.ok(u);
    }
  };
  return vi.default = n, vi;
}
var _i = {}, Af;
function F0() {
  if (Af) return _i;
  Af = 1, Object.defineProperty(_i, "__esModule", { value: !0 });
  const e = It(), t = Te(), o = Nt(), n = Le(), r = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: i }) => (0, t._)`{additionalProperty: ${i.additionalProperty}}`
    },
    code(i) {
      const { gen: c, schema: s, parentSchema: u, data: a, errsCount: d, it: l } = i;
      if (!d)
        throw new Error("ajv implementation error");
      const { allErrors: m, opts: g } = l;
      if (l.props = !0, g.removeAdditional !== "all" && (0, n.alwaysValidSchema)(l, s))
        return;
      const v = (0, e.allSchemaProperties)(u.properties), h = (0, e.allSchemaProperties)(u.patternProperties);
      y(), i.ok((0, t._)`${d} === ${o.default.errors}`);
      function y() {
        c.forIn("key", a, (_) => {
          !v.length && !h.length ? b(_) : c.if(p(_), () => b(_));
        });
      }
      function p(_) {
        let w;
        if (v.length > 8) {
          const P = (0, n.schemaRefOrVal)(l, u.properties, "properties");
          w = (0, e.isOwnProperty)(c, P, _);
        } else v.length ? w = (0, t.or)(...v.map((P) => (0, t._)`${_} === ${P}`)) : w = t.nil;
        return h.length && (w = (0, t.or)(w, ...h.map((P) => (0, t._)`${(0, e.usePattern)(i, P)}.test(${_})`))), (0, t.not)(w);
      }
      function E(_) {
        c.code((0, t._)`delete ${a}[${_}]`);
      }
      function b(_) {
        if (g.removeAdditional === "all" || g.removeAdditional && s === !1) {
          E(_);
          return;
        }
        if (s === !1) {
          i.setParams({ additionalProperty: _ }), i.error(), m || c.break();
          return;
        }
        if (typeof s == "object" && !(0, n.alwaysValidSchema)(l, s)) {
          const w = c.name("valid");
          g.removeAdditional === "failing" ? ($(_, w, !1), c.if((0, t.not)(w), () => {
            i.reset(), E(_);
          })) : ($(_, w), m || c.if((0, t.not)(w), () => c.break()));
        }
      }
      function $(_, w, P) {
        const T = {
          keyword: "additionalProperties",
          dataProp: _,
          dataPropType: n.Type.Str
        };
        P === !1 && Object.assign(T, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), i.subschema(T, w);
      }
    }
  };
  return _i.default = r, _i;
}
var Ei = {}, Cf;
function C_() {
  if (Cf) return Ei;
  Cf = 1, Object.defineProperty(Ei, "__esModule", { value: !0 });
  const e = rs(), t = It(), o = Le(), n = F0(), f = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: i, schema: c, parentSchema: s, data: u, it: a } = r;
      a.opts.removeAdditional === "all" && s.additionalProperties === void 0 && n.default.code(new e.KeywordCxt(a, n.default, "additionalProperties"));
      const d = (0, t.allSchemaProperties)(c);
      for (const h of d)
        a.definedProperties.add(h);
      a.opts.unevaluated && d.length && a.props !== !0 && (a.props = o.mergeEvaluated.props(i, (0, o.toHash)(d), a.props));
      const l = d.filter((h) => !(0, o.alwaysValidSchema)(a, c[h]));
      if (l.length === 0)
        return;
      const m = i.name("valid");
      for (const h of l)
        g(h) ? v(h) : (i.if((0, t.propertyInData)(i, u, h, a.opts.ownProperties)), v(h), a.allErrors || i.else().var(m, !0), i.endIf()), r.it.definedProperties.add(h), r.ok(m);
      function g(h) {
        return a.opts.useDefaults && !a.compositeRule && c[h].default !== void 0;
      }
      function v(h) {
        r.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, m);
      }
    }
  };
  return Ei.default = f, Ei;
}
var wi = {}, Df;
function D_() {
  if (Df) return wi;
  Df = 1, Object.defineProperty(wi, "__esModule", { value: !0 });
  const e = It(), t = Te(), o = Le(), n = Le(), f = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: i, schema: c, data: s, parentSchema: u, it: a } = r, { opts: d } = a, l = (0, e.allSchemaProperties)(c), m = l.filter((b) => (0, o.alwaysValidSchema)(a, c[b]));
      if (l.length === 0 || m.length === l.length && (!a.opts.unevaluated || a.props === !0))
        return;
      const g = d.strictSchema && !d.allowMatchingProperties && u.properties, v = i.name("valid");
      a.props !== !0 && !(a.props instanceof t.Name) && (a.props = (0, n.evaluatedPropsToName)(i, a.props));
      const { props: h } = a;
      y();
      function y() {
        for (const b of l)
          g && p(b), a.allErrors ? E(b) : (i.var(v, !0), E(b), i.if(v));
      }
      function p(b) {
        for (const $ in g)
          new RegExp(b).test($) && (0, o.checkStrictMode)(a, `property ${$} matches pattern ${b} (use allowMatchingProperties)`);
      }
      function E(b) {
        i.forIn("key", s, ($) => {
          i.if((0, t._)`${(0, e.usePattern)(r, b)}.test(${$})`, () => {
            const _ = m.includes(b);
            _ || r.subschema({
              keyword: "patternProperties",
              schemaProp: b,
              dataProp: $,
              dataPropType: n.Type.Str
            }, v), a.opts.unevaluated && h !== !0 ? i.assign((0, t._)`${h}[${$}]`, !0) : !_ && !a.allErrors && i.if((0, t.not)(v), () => i.break());
          });
        });
      }
    }
  };
  return wi.default = f, wi;
}
var $i = {}, kf;
function k_() {
  if (kf) return $i;
  kf = 1, Object.defineProperty($i, "__esModule", { value: !0 });
  const e = Le(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(o) {
      const { gen: n, schema: f, it: r } = o;
      if ((0, e.alwaysValidSchema)(r, f)) {
        o.fail();
        return;
      }
      const i = n.name("valid");
      o.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i), o.failResult(i, () => o.reset(), () => o.error());
    },
    error: { message: "must NOT be valid" }
  };
  return $i.default = t, $i;
}
var Si = {}, qf;
function q_() {
  if (qf) return Si;
  qf = 1, Object.defineProperty(Si, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: It().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return Si.default = t, Si;
}
var bi = {}, Lf;
function L_() {
  if (Lf) return bi;
  Lf = 1, Object.defineProperty(bi, "__esModule", { value: !0 });
  const e = Te(), t = Le(), n = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: f }) => (0, e._)`{passingSchemas: ${f.passing}}`
    },
    code(f) {
      const { gen: r, schema: i, parentSchema: c, it: s } = f;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      if (s.opts.discriminator && c.discriminator)
        return;
      const u = i, a = r.let("valid", !1), d = r.let("passing", null), l = r.name("_valid");
      f.setParams({ passing: d }), r.block(m), f.result(a, () => f.reset(), () => f.error(!0));
      function m() {
        u.forEach((g, v) => {
          let h;
          (0, t.alwaysValidSchema)(s, g) ? r.var(l, !0) : h = f.subschema({
            keyword: "oneOf",
            schemaProp: v,
            compositeRule: !0
          }, l), v > 0 && r.if((0, e._)`${l} && ${a}`).assign(a, !1).assign(d, (0, e._)`[${d}, ${v}]`).else(), r.if(l, () => {
            r.assign(a, !0), r.assign(d, v), h && f.mergeEvaluated(h, e.Name);
          });
        });
      }
    }
  };
  return bi.default = n, bi;
}
var Ri = {}, Ff;
function F_() {
  if (Ff) return Ri;
  Ff = 1, Object.defineProperty(Ri, "__esModule", { value: !0 });
  const e = Le(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(o) {
      const { gen: n, schema: f, it: r } = o;
      if (!Array.isArray(f))
        throw new Error("ajv implementation error");
      const i = n.name("valid");
      f.forEach((c, s) => {
        if ((0, e.alwaysValidSchema)(r, c))
          return;
        const u = o.subschema({ keyword: "allOf", schemaProp: s }, i);
        o.ok(i), o.mergeEvaluated(u);
      });
    }
  };
  return Ri.default = t, Ri;
}
var Pi = {}, jf;
function j_() {
  if (jf) return Pi;
  jf = 1, Object.defineProperty(Pi, "__esModule", { value: !0 });
  const e = Te(), t = Le(), n = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: r }) => (0, e.str)`must match "${r.ifClause}" schema`,
      params: ({ params: r }) => (0, e._)`{failingKeyword: ${r.ifClause}}`
    },
    code(r) {
      const { gen: i, parentSchema: c, it: s } = r;
      c.then === void 0 && c.else === void 0 && (0, t.checkStrictMode)(s, '"if" without "then" and "else" is ignored');
      const u = f(s, "then"), a = f(s, "else");
      if (!u && !a)
        return;
      const d = i.let("valid", !0), l = i.name("_valid");
      if (m(), r.reset(), u && a) {
        const v = i.let("ifClause");
        r.setParams({ ifClause: v }), i.if(l, g("then", v), g("else", v));
      } else u ? i.if(l, g("then")) : i.if((0, e.not)(l), g("else"));
      r.pass(d, () => r.error(!0));
      function m() {
        const v = r.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, l);
        r.mergeEvaluated(v);
      }
      function g(v, h) {
        return () => {
          const y = r.subschema({ keyword: v }, l);
          i.assign(d, l), r.mergeValidEvaluated(y, d), h ? i.assign(h, (0, e._)`${v}`) : r.setParams({ ifClause: v });
        };
      }
    }
  };
  function f(r, i) {
    const c = r.schema[i];
    return c !== void 0 && !(0, t.alwaysValidSchema)(r, c);
  }
  return Pi.default = n, Pi;
}
var Ti = {}, Uf;
function U_() {
  if (Uf) return Ti;
  Uf = 1, Object.defineProperty(Ti, "__esModule", { value: !0 });
  const e = Le(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: o, parentSchema: n, it: f }) {
      n.if === void 0 && (0, e.checkStrictMode)(f, `"${o}" without "if" is ignored`);
    }
  };
  return Ti.default = t, Ti;
}
var Mf;
function M_() {
  if (Mf) return pi;
  Mf = 1, Object.defineProperty(pi, "__esModule", { value: !0 });
  const e = q0(), t = O_(), o = L0(), n = N_(), f = I_(), r = Kc(), i = A_(), c = F0(), s = C_(), u = D_(), a = k_(), d = q_(), l = L_(), m = F_(), g = j_(), v = U_();
  function h(y = !1) {
    const p = [
      // any
      a.default,
      d.default,
      l.default,
      m.default,
      g.default,
      v.default,
      // object
      i.default,
      c.default,
      r.default,
      s.default,
      u.default
    ];
    return y ? p.push(t.default, n.default) : p.push(e.default, o.default), p.push(f.default), p;
  }
  return pi.default = h, pi;
}
var Oi = {}, Fr = {}, xf;
function j0() {
  if (xf) return Fr;
  xf = 1, Object.defineProperty(Fr, "__esModule", { value: !0 }), Fr.dynamicAnchor = void 0;
  const e = Te(), t = Nt(), o = is(), n = Hc(), f = {
    keyword: "$dynamicAnchor",
    schemaType: "string",
    code: (c) => r(c, c.schema)
  };
  function r(c, s) {
    const { gen: u, it: a } = c;
    a.schemaEnv.root.dynamicAnchors[s] = !0;
    const d = (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(s)}`, l = a.errSchemaPath === "#" ? a.validateName : i(c);
    u.if((0, e._)`!${d}`, () => u.assign(d, l));
  }
  Fr.dynamicAnchor = r;
  function i(c) {
    const { schemaEnv: s, schema: u, self: a } = c.it, { root: d, baseId: l, localRefs: m, meta: g } = s.root, { schemaId: v } = a.opts, h = new o.SchemaEnv({ schema: u, schemaId: v, root: d, baseId: l, localRefs: m, meta: g });
    return o.compileSchema.call(a, h), (0, n.getValidate)(c, h);
  }
  return Fr.default = f, Fr;
}
var jr = {}, Vf;
function U0() {
  if (Vf) return jr;
  Vf = 1, Object.defineProperty(jr, "__esModule", { value: !0 }), jr.dynamicRef = void 0;
  const e = Te(), t = Nt(), o = Hc(), n = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (r) => f(r, r.schema)
  };
  function f(r, i) {
    const { gen: c, keyword: s, it: u } = r;
    if (i[0] !== "#")
      throw new Error(`"${s}" only supports hash fragment reference`);
    const a = i.slice(1);
    if (u.allErrors)
      d();
    else {
      const m = c.let("valid", !1);
      d(m), r.ok(m);
    }
    function d(m) {
      if (u.schemaEnv.root.dynamicAnchors[a]) {
        const g = c.let("_v", (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(a)}`);
        c.if(g, l(g, m), l(u.validateName, m));
      } else
        l(u.validateName, m)();
    }
    function l(m, g) {
      return g ? () => c.block(() => {
        (0, o.callRef)(r, m), c.let(g, !0);
      }) : () => (0, o.callRef)(r, m);
    }
  }
  return jr.dynamicRef = f, jr.default = n, jr;
}
var Ni = {}, Gf;
function x_() {
  if (Gf) return Ni;
  Gf = 1, Object.defineProperty(Ni, "__esModule", { value: !0 });
  const e = j0(), t = Le(), o = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(n) {
      n.schema ? (0, e.dynamicAnchor)(n, "") : (0, t.checkStrictMode)(n.it, "$recursiveAnchor: false is ignored");
    }
  };
  return Ni.default = o, Ni;
}
var Ii = {}, Bf;
function V_() {
  if (Bf) return Ii;
  Bf = 1, Object.defineProperty(Ii, "__esModule", { value: !0 });
  const e = U0(), t = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (o) => (0, e.dynamicRef)(o, o.schema)
  };
  return Ii.default = t, Ii;
}
var Hf;
function G_() {
  if (Hf) return Oi;
  Hf = 1, Object.defineProperty(Oi, "__esModule", { value: !0 });
  const e = j0(), t = U0(), o = x_(), n = V_(), f = [e.default, t.default, o.default, n.default];
  return Oi.default = f, Oi;
}
var Ai = {}, Ci = {}, zf;
function B_() {
  if (zf) return Ci;
  zf = 1, Object.defineProperty(Ci, "__esModule", { value: !0 });
  const e = Kc(), t = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: e.error,
    code: (o) => (0, e.validatePropertyDeps)(o)
  };
  return Ci.default = t, Ci;
}
var Di = {}, Kf;
function H_() {
  if (Kf) return Di;
  Kf = 1, Object.defineProperty(Di, "__esModule", { value: !0 });
  const e = Kc(), t = {
    keyword: "dependentSchemas",
    type: "object",
    schemaType: "object",
    code: (o) => (0, e.validateSchemaDeps)(o)
  };
  return Di.default = t, Di;
}
var ki = {}, Wf;
function z_() {
  if (Wf) return ki;
  Wf = 1, Object.defineProperty(ki, "__esModule", { value: !0 });
  const e = Le(), t = {
    keyword: ["maxContains", "minContains"],
    type: "array",
    schemaType: "number",
    code({ keyword: o, parentSchema: n, it: f }) {
      n.contains === void 0 && (0, e.checkStrictMode)(f, `"${o}" without "contains" is ignored`);
    }
  };
  return ki.default = t, ki;
}
var Yf;
function K_() {
  if (Yf) return Ai;
  Yf = 1, Object.defineProperty(Ai, "__esModule", { value: !0 });
  const e = B_(), t = H_(), o = z_(), n = [e.default, t.default, o.default];
  return Ai.default = n, Ai;
}
var qi = {}, Li = {}, Xf;
function W_() {
  if (Xf) return Li;
  Xf = 1, Object.defineProperty(Li, "__esModule", { value: !0 });
  const e = Te(), t = Le(), o = Nt(), f = {
    keyword: "unevaluatedProperties",
    type: "object",
    schemaType: ["boolean", "object"],
    trackErrors: !0,
    error: {
      message: "must NOT have unevaluated properties",
      params: ({ params: r }) => (0, e._)`{unevaluatedProperty: ${r.unevaluatedProperty}}`
    },
    code(r) {
      const { gen: i, schema: c, data: s, errsCount: u, it: a } = r;
      if (!u)
        throw new Error("ajv implementation error");
      const { allErrors: d, props: l } = a;
      l instanceof e.Name ? i.if((0, e._)`${l} !== true`, () => i.forIn("key", s, (h) => i.if(g(l, h), () => m(h)))) : l !== !0 && i.forIn("key", s, (h) => l === void 0 ? m(h) : i.if(v(l, h), () => m(h))), a.props = !0, r.ok((0, e._)`${u} === ${o.default.errors}`);
      function m(h) {
        if (c === !1) {
          r.setParams({ unevaluatedProperty: h }), r.error(), d || i.break();
          return;
        }
        if (!(0, t.alwaysValidSchema)(a, c)) {
          const y = i.name("valid");
          r.subschema({
            keyword: "unevaluatedProperties",
            dataProp: h,
            dataPropType: t.Type.Str
          }, y), d || i.if((0, e.not)(y), () => i.break());
        }
      }
      function g(h, y) {
        return (0, e._)`!${h} || !${h}[${y}]`;
      }
      function v(h, y) {
        const p = [];
        for (const E in h)
          h[E] === !0 && p.push((0, e._)`${y} !== ${E}`);
        return (0, e.and)(...p);
      }
    }
  };
  return Li.default = f, Li;
}
var Fi = {}, Jf;
function Y_() {
  if (Jf) return Fi;
  Jf = 1, Object.defineProperty(Fi, "__esModule", { value: !0 });
  const e = Te(), t = Le(), n = {
    keyword: "unevaluatedItems",
    type: "array",
    schemaType: ["boolean", "object"],
    error: {
      message: ({ params: { len: f } }) => (0, e.str)`must NOT have more than ${f} items`,
      params: ({ params: { len: f } }) => (0, e._)`{limit: ${f}}`
    },
    code(f) {
      const { gen: r, schema: i, data: c, it: s } = f, u = s.items || 0;
      if (u === !0)
        return;
      const a = r.const("len", (0, e._)`${c}.length`);
      if (i === !1)
        f.setParams({ len: u }), f.fail((0, e._)`${a} > ${u}`);
      else if (typeof i == "object" && !(0, t.alwaysValidSchema)(s, i)) {
        const l = r.var("valid", (0, e._)`${a} <= ${u}`);
        r.if((0, e.not)(l), () => d(l, u)), f.ok(l);
      }
      s.items = !0;
      function d(l, m) {
        r.forRange("i", m, a, (g) => {
          f.subschema({ keyword: "unevaluatedItems", dataProp: g, dataPropType: t.Type.Num }, l), s.allErrors || r.if((0, e.not)(l), () => r.break());
        });
      }
    }
  };
  return Fi.default = n, Fi;
}
var Qf;
function X_() {
  if (Qf) return qi;
  Qf = 1, Object.defineProperty(qi, "__esModule", { value: !0 });
  const e = W_(), t = Y_(), o = [e.default, t.default];
  return qi.default = o, qi;
}
var ji = {}, Ui = {}, Zf;
function J_() {
  if (Zf) return Ui;
  Zf = 1, Object.defineProperty(Ui, "__esModule", { value: !0 });
  const e = Te(), o = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match format "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{format: ${n}}`
    },
    code(n, f) {
      const { gen: r, data: i, $data: c, schema: s, schemaCode: u, it: a } = n, { opts: d, errSchemaPath: l, schemaEnv: m, self: g } = a;
      if (!d.validateFormats)
        return;
      c ? v() : h();
      function v() {
        const y = r.scopeValue("formats", {
          ref: g.formats,
          code: d.code.formats
        }), p = r.const("fDef", (0, e._)`${y}[${u}]`), E = r.let("fType"), b = r.let("format");
        r.if((0, e._)`typeof ${p} == "object" && !(${p} instanceof RegExp)`, () => r.assign(E, (0, e._)`${p}.type || "string"`).assign(b, (0, e._)`${p}.validate`), () => r.assign(E, (0, e._)`"string"`).assign(b, p)), n.fail$data((0, e.or)($(), _()));
        function $() {
          return d.strictSchema === !1 ? e.nil : (0, e._)`${u} && !${b}`;
        }
        function _() {
          const w = m.$async ? (0, e._)`(${p}.async ? await ${b}(${i}) : ${b}(${i}))` : (0, e._)`${b}(${i})`, P = (0, e._)`(typeof ${b} == "function" ? ${w} : ${b}.test(${i}))`;
          return (0, e._)`${b} && ${b} !== true && ${E} === ${f} && !${P}`;
        }
      }
      function h() {
        const y = g.formats[s];
        if (!y) {
          $();
          return;
        }
        if (y === !0)
          return;
        const [p, E, b] = _(y);
        p === f && n.pass(w());
        function $() {
          if (d.strictSchema === !1) {
            g.logger.warn(P());
            return;
          }
          throw new Error(P());
          function P() {
            return `unknown format "${s}" ignored in schema at path "${l}"`;
          }
        }
        function _(P) {
          const T = P instanceof RegExp ? (0, e.regexpCode)(P) : d.code.formats ? (0, e._)`${d.code.formats}${(0, e.getProperty)(s)}` : void 0, G = r.scopeValue("formats", { key: s, ref: P, code: T });
          return typeof P == "object" && !(P instanceof RegExp) ? [P.type || "string", P.validate, (0, e._)`${G}.validate`] : ["string", P, G];
        }
        function w() {
          if (typeof y == "object" && !(y instanceof RegExp) && y.async) {
            if (!m.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${b}(${i})`;
          }
          return typeof E == "function" ? (0, e._)`${b}(${i})` : (0, e._)`${b}.test(${i})`;
        }
      }
    }
  };
  return Ui.default = o, Ui;
}
var ed;
function Q_() {
  if (ed) return ji;
  ed = 1, Object.defineProperty(ji, "__esModule", { value: !0 });
  const t = [J_().default];
  return ji.default = t, ji;
}
var _r = {}, td;
function Z_() {
  return td || (td = 1, Object.defineProperty(_r, "__esModule", { value: !0 }), _r.contentVocabulary = _r.metadataVocabulary = void 0, _r.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], _r.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), _r;
}
var rd;
function eE() {
  if (rd) return Qn;
  rd = 1, Object.defineProperty(Qn, "__esModule", { value: !0 });
  const e = m_(), t = T_(), o = M_(), n = G_(), f = K_(), r = X_(), i = Q_(), c = Z_(), s = [
    n.default,
    e.default,
    t.default,
    (0, o.default)(!0),
    i.default,
    c.metadataVocabulary,
    c.contentVocabulary,
    f.default,
    r.default
  ];
  return Qn.default = s, Qn;
}
var Mi = {}, an = {}, nd;
function tE() {
  if (nd) return an;
  nd = 1, Object.defineProperty(an, "__esModule", { value: !0 }), an.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (an.DiscrError = e = {})), an;
}
var id;
function rE() {
  if (id) return Mi;
  id = 1, Object.defineProperty(Mi, "__esModule", { value: !0 });
  const e = Te(), t = tE(), o = is(), n = ns(), f = Le(), i = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: c, tagName: s } }) => c === t.DiscrError.Tag ? `tag "${s}" must be string` : `value of tag "${s}" must be in oneOf`,
      params: ({ params: { discrError: c, tag: s, tagName: u } }) => (0, e._)`{error: ${c}, tag: ${u}, tagValue: ${s}}`
    },
    code(c) {
      const { gen: s, data: u, schema: a, parentSchema: d, it: l } = c, { oneOf: m } = d;
      if (!l.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const g = a.propertyName;
      if (typeof g != "string")
        throw new Error("discriminator: requires propertyName");
      if (a.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!m)
        throw new Error("discriminator: requires oneOf keyword");
      const v = s.let("valid", !1), h = s.const("tag", (0, e._)`${u}${(0, e.getProperty)(g)}`);
      s.if((0, e._)`typeof ${h} == "string"`, () => y(), () => c.error(!1, { discrError: t.DiscrError.Tag, tag: h, tagName: g })), c.ok(v);
      function y() {
        const b = E();
        s.if(!1);
        for (const $ in b)
          s.elseIf((0, e._)`${h} === ${$}`), s.assign(v, p(b[$]));
        s.else(), c.error(!1, { discrError: t.DiscrError.Mapping, tag: h, tagName: g }), s.endIf();
      }
      function p(b) {
        const $ = s.name("valid"), _ = c.subschema({ keyword: "oneOf", schemaProp: b }, $);
        return c.mergeEvaluated(_, e.Name), $;
      }
      function E() {
        var b;
        const $ = {}, _ = P(d);
        let w = !0;
        for (let L = 0; L < m.length; L++) {
          let M = m[L];
          if (M?.$ref && !(0, f.schemaHasRulesButRef)(M, l.self.RULES)) {
            const k = M.$ref;
            if (M = o.resolveRef.call(l.self, l.schemaEnv.root, l.baseId, k), M instanceof o.SchemaEnv && (M = M.schema), M === void 0)
              throw new n.default(l.opts.uriResolver, l.baseId, k);
          }
          const K = (b = M?.properties) === null || b === void 0 ? void 0 : b[g];
          if (typeof K != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${g}"`);
          w = w && (_ || P(M)), T(K, L);
        }
        if (!w)
          throw new Error(`discriminator: "${g}" must be required`);
        return $;
        function P({ required: L }) {
          return Array.isArray(L) && L.includes(g);
        }
        function T(L, M) {
          if (L.const)
            G(L.const, M);
          else if (L.enum)
            for (const K of L.enum)
              G(K, M);
          else
            throw new Error(`discriminator: "properties/${g}" must have "const" or "enum"`);
        }
        function G(L, M) {
          if (typeof L != "string" || L in $)
            throw new Error(`discriminator: "${g}" values must be unique strings`);
          $[L] = M;
        }
      }
    }
  };
  return Mi.default = i, Mi;
}
var xi = {};
const nE = "https://json-schema.org/draft/2020-12/schema", iE = "https://json-schema.org/draft/2020-12/schema", aE = { "https://json-schema.org/draft/2020-12/vocab/core": !0, "https://json-schema.org/draft/2020-12/vocab/applicator": !0, "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0, "https://json-schema.org/draft/2020-12/vocab/validation": !0, "https://json-schema.org/draft/2020-12/vocab/meta-data": !0, "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0, "https://json-schema.org/draft/2020-12/vocab/content": !0 }, sE = "meta", oE = "Core and Validation specifications meta-schema", uE = [{ $ref: "meta/core" }, { $ref: "meta/applicator" }, { $ref: "meta/unevaluated" }, { $ref: "meta/validation" }, { $ref: "meta/meta-data" }, { $ref: "meta/format-annotation" }, { $ref: "meta/content" }], cE = ["object", "boolean"], lE = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", fE = { definitions: { $comment: '"definitions" has been replaced by "$defs".', type: "object", additionalProperties: { $dynamicRef: "#meta" }, deprecated: !0, default: {} }, dependencies: { $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.', type: "object", additionalProperties: { anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }] }, deprecated: !0, default: {} }, $recursiveAnchor: { $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".', $ref: "meta/core#/$defs/anchorString", deprecated: !0 }, $recursiveRef: { $comment: '"$recursiveRef" has been replaced by "$dynamicRef".', $ref: "meta/core#/$defs/uriReferenceString", deprecated: !0 } }, dE = {
  $schema: nE,
  $id: iE,
  $vocabulary: aE,
  $dynamicAnchor: sE,
  title: oE,
  allOf: uE,
  type: cE,
  $comment: lE,
  properties: fE
}, hE = "https://json-schema.org/draft/2020-12/schema", pE = "https://json-schema.org/draft/2020-12/meta/applicator", mE = { "https://json-schema.org/draft/2020-12/vocab/applicator": !0 }, yE = "meta", gE = "Applicator vocabulary meta-schema", vE = ["object", "boolean"], _E = { prefixItems: { $ref: "#/$defs/schemaArray" }, items: { $dynamicRef: "#meta" }, contains: { $dynamicRef: "#meta" }, additionalProperties: { $dynamicRef: "#meta" }, properties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, propertyNames: { format: "regex" }, default: {} }, dependentSchemas: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, propertyNames: { $dynamicRef: "#meta" }, if: { $dynamicRef: "#meta" }, then: { $dynamicRef: "#meta" }, else: { $dynamicRef: "#meta" }, allOf: { $ref: "#/$defs/schemaArray" }, anyOf: { $ref: "#/$defs/schemaArray" }, oneOf: { $ref: "#/$defs/schemaArray" }, not: { $dynamicRef: "#meta" } }, EE = { schemaArray: { type: "array", minItems: 1, items: { $dynamicRef: "#meta" } } }, wE = {
  $schema: hE,
  $id: pE,
  $vocabulary: mE,
  $dynamicAnchor: yE,
  title: gE,
  type: vE,
  properties: _E,
  $defs: EE
}, $E = "https://json-schema.org/draft/2020-12/schema", SE = "https://json-schema.org/draft/2020-12/meta/unevaluated", bE = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0 }, RE = "meta", PE = "Unevaluated applicator vocabulary meta-schema", TE = ["object", "boolean"], OE = { unevaluatedItems: { $dynamicRef: "#meta" }, unevaluatedProperties: { $dynamicRef: "#meta" } }, NE = {
  $schema: $E,
  $id: SE,
  $vocabulary: bE,
  $dynamicAnchor: RE,
  title: PE,
  type: TE,
  properties: OE
}, IE = "https://json-schema.org/draft/2020-12/schema", AE = "https://json-schema.org/draft/2020-12/meta/content", CE = { "https://json-schema.org/draft/2020-12/vocab/content": !0 }, DE = "meta", kE = "Content vocabulary meta-schema", qE = ["object", "boolean"], LE = { contentEncoding: { type: "string" }, contentMediaType: { type: "string" }, contentSchema: { $dynamicRef: "#meta" } }, FE = {
  $schema: IE,
  $id: AE,
  $vocabulary: CE,
  $dynamicAnchor: DE,
  title: kE,
  type: qE,
  properties: LE
}, jE = "https://json-schema.org/draft/2020-12/schema", UE = "https://json-schema.org/draft/2020-12/meta/core", ME = { "https://json-schema.org/draft/2020-12/vocab/core": !0 }, xE = "meta", VE = "Core vocabulary meta-schema", GE = ["object", "boolean"], BE = { $id: { $ref: "#/$defs/uriReferenceString", $comment: "Non-empty fragments not allowed.", pattern: "^[^#]*#?$" }, $schema: { $ref: "#/$defs/uriString" }, $ref: { $ref: "#/$defs/uriReferenceString" }, $anchor: { $ref: "#/$defs/anchorString" }, $dynamicRef: { $ref: "#/$defs/uriReferenceString" }, $dynamicAnchor: { $ref: "#/$defs/anchorString" }, $vocabulary: { type: "object", propertyNames: { $ref: "#/$defs/uriString" }, additionalProperties: { type: "boolean" } }, $comment: { type: "string" }, $defs: { type: "object", additionalProperties: { $dynamicRef: "#meta" } } }, HE = { anchorString: { type: "string", pattern: "^[A-Za-z_][-A-Za-z0-9._]*$" }, uriString: { type: "string", format: "uri" }, uriReferenceString: { type: "string", format: "uri-reference" } }, zE = {
  $schema: jE,
  $id: UE,
  $vocabulary: ME,
  $dynamicAnchor: xE,
  title: VE,
  type: GE,
  properties: BE,
  $defs: HE
}, KE = "https://json-schema.org/draft/2020-12/schema", WE = "https://json-schema.org/draft/2020-12/meta/format-annotation", YE = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0 }, XE = "meta", JE = "Format vocabulary meta-schema for annotation results", QE = ["object", "boolean"], ZE = { format: { type: "string" } }, ew = {
  $schema: KE,
  $id: WE,
  $vocabulary: YE,
  $dynamicAnchor: XE,
  title: JE,
  type: QE,
  properties: ZE
}, tw = "https://json-schema.org/draft/2020-12/schema", rw = "https://json-schema.org/draft/2020-12/meta/meta-data", nw = { "https://json-schema.org/draft/2020-12/vocab/meta-data": !0 }, iw = "meta", aw = "Meta-data vocabulary meta-schema", sw = ["object", "boolean"], ow = { title: { type: "string" }, description: { type: "string" }, default: !0, deprecated: { type: "boolean", default: !1 }, readOnly: { type: "boolean", default: !1 }, writeOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 } }, uw = {
  $schema: tw,
  $id: rw,
  $vocabulary: nw,
  $dynamicAnchor: iw,
  title: aw,
  type: sw,
  properties: ow
}, cw = "https://json-schema.org/draft/2020-12/schema", lw = "https://json-schema.org/draft/2020-12/meta/validation", fw = { "https://json-schema.org/draft/2020-12/vocab/validation": !0 }, dw = "meta", hw = "Validation vocabulary meta-schema", pw = ["object", "boolean"], mw = { type: { anyOf: [{ $ref: "#/$defs/simpleTypes" }, { type: "array", items: { $ref: "#/$defs/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, const: !0, enum: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/$defs/nonNegativeInteger" }, minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, maxItems: { $ref: "#/$defs/nonNegativeInteger" }, minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, maxContains: { $ref: "#/$defs/nonNegativeInteger" }, minContains: { $ref: "#/$defs/nonNegativeInteger", default: 1 }, maxProperties: { $ref: "#/$defs/nonNegativeInteger" }, minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, required: { $ref: "#/$defs/stringArray" }, dependentRequired: { type: "object", additionalProperties: { $ref: "#/$defs/stringArray" } } }, yw = { nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { $ref: "#/$defs/nonNegativeInteger", default: 0 }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, gw = {
  $schema: cw,
  $id: lw,
  $vocabulary: fw,
  $dynamicAnchor: dw,
  title: hw,
  type: pw,
  properties: mw,
  $defs: yw
};
var ad;
function vw() {
  if (ad) return xi;
  ad = 1, Object.defineProperty(xi, "__esModule", { value: !0 });
  const e = dE, t = wE, o = NE, n = FE, f = zE, r = ew, i = uw, c = gw, s = ["/properties"];
  function u(a) {
    return [
      e,
      t,
      o,
      n,
      f,
      d(this, r),
      i,
      d(this, c)
    ].forEach((l) => this.addMetaSchema(l, void 0, !1)), this;
    function d(l, m) {
      return a ? l.$dataMetaSchema(m, s) : m;
    }
  }
  return xi.default = u, xi;
}
var sd;
function _w() {
  return sd || (sd = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
    const o = h_(), n = eE(), f = rE(), r = vw(), i = "https://json-schema.org/draft/2020-12/schema";
    class c extends o.default {
      constructor(m = {}) {
        super({
          ...m,
          dynamicRef: !0,
          next: !0,
          unevaluated: !0
        });
      }
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((m) => this.addVocabulary(m)), this.opts.discriminator && this.addKeyword(f.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data: m, meta: g } = this.opts;
        g && (r.default.call(this, m), this.refs["http://json-schema.org/schema"] = i);
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
      }
    }
    t.Ajv2020 = c, e.exports = t = c, e.exports.Ajv2020 = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
    var s = rs();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return s.KeywordCxt;
    } });
    var u = Te();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return u._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return u.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return u.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return u.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return u.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return u.CodeGen;
    } });
    var a = Bc();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return a.default;
    } });
    var d = ns();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return d.default;
    } });
  })(Kn, Kn.exports)), Kn.exports;
}
var Ew = _w(), Vi = { exports: {} }, Ls = {}, od;
function ww() {
  return od || (od = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function t(L, M) {
      return { validate: L, compare: M };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: t(r, i),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: t(s(!0), u),
      "date-time": t(l(!0), m),
      "iso-time": t(s(), a),
      "iso-date-time": t(l(), g),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: y,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex: G,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte: E,
      // signed 32 bit integer
      int32: { type: "number", validate: _ },
      // signed 64 bit integer
      int64: { type: "number", validate: w },
      // C-type float
      float: { type: "number", validate: P },
      // C-type double
      double: { type: "number", validate: P },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, i),
      time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
      "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, m),
      "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, a),
      "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, g),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, e.formatNames = Object.keys(e.fullFormats);
    function o(L) {
      return L % 4 === 0 && (L % 100 !== 0 || L % 400 === 0);
    }
    const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, f = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function r(L) {
      const M = n.exec(L);
      if (!M)
        return !1;
      const K = +M[1], k = +M[2], F = +M[3];
      return k >= 1 && k <= 12 && F >= 1 && F <= (k === 2 && o(K) ? 29 : f[k]);
    }
    function i(L, M) {
      if (L && M)
        return L > M ? 1 : L < M ? -1 : 0;
    }
    const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function s(L) {
      return function(K) {
        const k = c.exec(K);
        if (!k)
          return !1;
        const F = +k[1], X = +k[2], B = +k[3], Y = k[4], Z = k[5] === "-" ? -1 : 1, V = +(k[6] || 0), C = +(k[7] || 0);
        if (V > 23 || C > 59 || L && !Y)
          return !1;
        if (F <= 23 && X <= 59 && B < 60)
          return !0;
        const U = X - C * Z, D = F - V * Z - (U < 0 ? 1 : 0);
        return (D === 23 || D === -1) && (U === 59 || U === -1) && B < 61;
      };
    }
    function u(L, M) {
      if (!(L && M))
        return;
      const K = (/* @__PURE__ */ new Date("2020-01-01T" + L)).valueOf(), k = (/* @__PURE__ */ new Date("2020-01-01T" + M)).valueOf();
      if (K && k)
        return K - k;
    }
    function a(L, M) {
      if (!(L && M))
        return;
      const K = c.exec(L), k = c.exec(M);
      if (K && k)
        return L = K[1] + K[2] + K[3], M = k[1] + k[2] + k[3], L > M ? 1 : L < M ? -1 : 0;
    }
    const d = /t|\s/i;
    function l(L) {
      const M = s(L);
      return function(k) {
        const F = k.split(d);
        return F.length === 2 && r(F[0]) && M(F[1]);
      };
    }
    function m(L, M) {
      if (!(L && M))
        return;
      const K = new Date(L).valueOf(), k = new Date(M).valueOf();
      if (K && k)
        return K - k;
    }
    function g(L, M) {
      if (!(L && M))
        return;
      const [K, k] = L.split(d), [F, X] = M.split(d), B = i(K, F);
      if (B !== void 0)
        return B || u(k, X);
    }
    const v = /\/|:/, h = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function y(L) {
      return v.test(L) && h.test(L);
    }
    const p = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function E(L) {
      return p.lastIndex = 0, p.test(L);
    }
    const b = -2147483648, $ = 2 ** 31 - 1;
    function _(L) {
      return Number.isInteger(L) && L <= $ && L >= b;
    }
    function w(L) {
      return Number.isInteger(L);
    }
    function P() {
      return !0;
    }
    const T = /[^\\]\\Z/;
    function G(L) {
      if (T.test(L))
        return !1;
      try {
        return new RegExp(L), !0;
      } catch {
        return !1;
      }
    }
  })(Ls)), Ls;
}
var Fs = {}, Gi = { exports: {} }, js = {}, Gt = {}, Er = {}, Us = {}, Ms = {}, xs = {}, ud;
function Ka() {
  return ud || (ud = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class o extends t {
      constructor(p) {
        if (super(), !e.IDENTIFIER.test(p))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = p;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = o;
    class n extends t {
      constructor(p) {
        super(), this._items = typeof p == "string" ? [p] : p;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const p = this._items[0];
        return p === "" || p === '""';
      }
      get str() {
        var p;
        return (p = this._str) !== null && p !== void 0 ? p : this._str = this._items.reduce((E, b) => `${E}${b}`, "");
      }
      get names() {
        var p;
        return (p = this._names) !== null && p !== void 0 ? p : this._names = this._items.reduce((E, b) => (b instanceof o && (E[b.str] = (E[b.str] || 0) + 1), E), {});
      }
    }
    e._Code = n, e.nil = new n("");
    function f(y, ...p) {
      const E = [y[0]];
      let b = 0;
      for (; b < p.length; )
        c(E, p[b]), E.push(y[++b]);
      return new n(E);
    }
    e._ = f;
    const r = new n("+");
    function i(y, ...p) {
      const E = [m(y[0])];
      let b = 0;
      for (; b < p.length; )
        E.push(r), c(E, p[b]), E.push(r, m(y[++b]));
      return s(E), new n(E);
    }
    e.str = i;
    function c(y, p) {
      p instanceof n ? y.push(...p._items) : p instanceof o ? y.push(p) : y.push(d(p));
    }
    e.addCodeArg = c;
    function s(y) {
      let p = 1;
      for (; p < y.length - 1; ) {
        if (y[p] === r) {
          const E = u(y[p - 1], y[p + 1]);
          if (E !== void 0) {
            y.splice(p - 1, 3, E);
            continue;
          }
          y[p++] = "+";
        }
        p++;
      }
    }
    function u(y, p) {
      if (p === '""')
        return y;
      if (y === '""')
        return p;
      if (typeof y == "string")
        return p instanceof o || y[y.length - 1] !== '"' ? void 0 : typeof p != "string" ? `${y.slice(0, -1)}${p}"` : p[0] === '"' ? y.slice(0, -1) + p.slice(1) : void 0;
      if (typeof p == "string" && p[0] === '"' && !(y instanceof o))
        return `"${y}${p.slice(1)}`;
    }
    function a(y, p) {
      return p.emptyStr() ? y : y.emptyStr() ? p : i`${y}${p}`;
    }
    e.strConcat = a;
    function d(y) {
      return typeof y == "number" || typeof y == "boolean" || y === null ? y : m(Array.isArray(y) ? y.join(",") : y);
    }
    function l(y) {
      return new n(m(y));
    }
    e.stringify = l;
    function m(y) {
      return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = m;
    function g(y) {
      return typeof y == "string" && e.IDENTIFIER.test(y) ? new n(`.${y}`) : f`[${y}]`;
    }
    e.getProperty = g;
    function v(y) {
      if (typeof y == "string" && e.IDENTIFIER.test(y))
        return new n(`${y}`);
      throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
    }
    e.getEsmExportName = v;
    function h(y) {
      return new n(y.toString());
    }
    e.regexpCode = h;
  })(xs)), xs;
}
var Vs = {}, cd;
function ld() {
  return cd || (cd = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = Ka();
    class o extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var n;
    (function(s) {
      s[s.Started = 0] = "Started", s[s.Completed = 1] = "Completed";
    })(n || (e.UsedValueState = n = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class f {
      constructor({ prefixes: u, parent: a } = {}) {
        this._names = {}, this._prefixes = u, this._parent = a;
      }
      toName(u) {
        return u instanceof t.Name ? u : this.name(u);
      }
      name(u) {
        return new t.Name(this._newName(u));
      }
      _newName(u) {
        const a = this._names[u] || this._nameGroup(u);
        return `${u}${a.index++}`;
      }
      _nameGroup(u) {
        var a, d;
        if (!((d = (a = this._parent) === null || a === void 0 ? void 0 : a._prefixes) === null || d === void 0) && d.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    e.Scope = f;
    class r extends t.Name {
      constructor(u, a) {
        super(a), this.prefix = u;
      }
      setValue(u, { property: a, itemIndex: d }) {
        this.value = u, this.scopePath = (0, t._)`.${new t.Name(a)}[${d}]`;
      }
    }
    e.ValueScopeName = r;
    const i = (0, t._)`\n`;
    class c extends f {
      constructor(u) {
        super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? i : t.nil };
      }
      get() {
        return this._scope;
      }
      name(u) {
        return new r(u, this._newName(u));
      }
      value(u, a) {
        var d;
        if (a.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const l = this.toName(u), { prefix: m } = l, g = (d = a.key) !== null && d !== void 0 ? d : a.ref;
        let v = this._values[m];
        if (v) {
          const p = v.get(g);
          if (p)
            return p;
        } else
          v = this._values[m] = /* @__PURE__ */ new Map();
        v.set(g, l);
        const h = this._scope[m] || (this._scope[m] = []), y = h.length;
        return h[y] = a.ref, l.setValue(a, { property: m, itemIndex: y }), l;
      }
      getValue(u, a) {
        const d = this._values[u];
        if (d)
          return d.get(a);
      }
      scopeRefs(u, a = this._values) {
        return this._reduceValues(a, (d) => {
          if (d.scopePath === void 0)
            throw new Error(`CodeGen: name "${d}" has no value`);
          return (0, t._)`${u}${d.scopePath}`;
        });
      }
      scopeCode(u = this._values, a, d) {
        return this._reduceValues(u, (l) => {
          if (l.value === void 0)
            throw new Error(`CodeGen: name "${l}" has no value`);
          return l.value.code;
        }, a, d);
      }
      _reduceValues(u, a, d = {}, l) {
        let m = t.nil;
        for (const g in u) {
          const v = u[g];
          if (!v)
            continue;
          const h = d[g] = d[g] || /* @__PURE__ */ new Map();
          v.forEach((y) => {
            if (h.has(y))
              return;
            h.set(y, n.Started);
            let p = a(y);
            if (p) {
              const E = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              m = (0, t._)`${m}${E} ${y} = ${p};${this.opts._n}`;
            } else if (p = l?.(y))
              m = (0, t._)`${m}${p}${this.opts._n}`;
            else
              throw new o(y);
            h.set(y, n.Completed);
          });
        }
        return m;
      }
    }
    e.ValueScope = c;
  })(Vs)), Vs;
}
var fd;
function De() {
  return fd || (fd = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = Ka(), o = ld();
    var n = Ka();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var f = ld();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return f.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return f.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return f.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return f.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class r {
      optimizeNodes() {
        return this;
      }
      optimizeNames(R, O) {
        return this;
      }
    }
    class i extends r {
      constructor(R, O, x) {
        super(), this.varKind = R, this.name = O, this.rhs = x;
      }
      render({ es5: R, _n: O }) {
        const x = R ? o.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${x} ${this.name}${I};` + O;
      }
      optimizeNames(R, O) {
        if (R[this.name.str])
          return this.rhs && (this.rhs = k(this.rhs, R, O)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class c extends r {
      constructor(R, O, x) {
        super(), this.lhs = R, this.rhs = O, this.sideEffects = x;
      }
      render({ _n: R }) {
        return `${this.lhs} = ${this.rhs};` + R;
      }
      optimizeNames(R, O) {
        if (!(this.lhs instanceof t.Name && !R[this.lhs.str] && !this.sideEffects))
          return this.rhs = k(this.rhs, R, O), this;
      }
      get names() {
        const R = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return K(R, this.rhs);
      }
    }
    class s extends c {
      constructor(R, O, x, I) {
        super(R, x, I), this.op = O;
      }
      render({ _n: R }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + R;
      }
    }
    class u extends r {
      constructor(R) {
        super(), this.label = R, this.names = {};
      }
      render({ _n: R }) {
        return `${this.label}:` + R;
      }
    }
    class a extends r {
      constructor(R) {
        super(), this.label = R, this.names = {};
      }
      render({ _n: R }) {
        return `break${this.label ? ` ${this.label}` : ""};` + R;
      }
    }
    class d extends r {
      constructor(R) {
        super(), this.error = R;
      }
      render({ _n: R }) {
        return `throw ${this.error};` + R;
      }
      get names() {
        return this.error.names;
      }
    }
    class l extends r {
      constructor(R) {
        super(), this.code = R;
      }
      render({ _n: R }) {
        return `${this.code};` + R;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(R, O) {
        return this.code = k(this.code, R, O), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class m extends r {
      constructor(R = []) {
        super(), this.nodes = R;
      }
      render(R) {
        return this.nodes.reduce((O, x) => O + x.render(R), "");
      }
      optimizeNodes() {
        const { nodes: R } = this;
        let O = R.length;
        for (; O--; ) {
          const x = R[O].optimizeNodes();
          Array.isArray(x) ? R.splice(O, 1, ...x) : x ? R[O] = x : R.splice(O, 1);
        }
        return R.length > 0 ? this : void 0;
      }
      optimizeNames(R, O) {
        const { nodes: x } = this;
        let I = x.length;
        for (; I--; ) {
          const N = x[I];
          N.optimizeNames(R, O) || (F(R, N.names), x.splice(I, 1));
        }
        return x.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((R, O) => M(R, O.names), {});
      }
    }
    class g extends m {
      render(R) {
        return "{" + R._n + super.render(R) + "}" + R._n;
      }
    }
    class v extends m {
    }
    class h extends g {
    }
    h.kind = "else";
    class y extends g {
      constructor(R, O) {
        super(O), this.condition = R;
      }
      render(R) {
        let O = `if(${this.condition})` + super.render(R);
        return this.else && (O += "else " + this.else.render(R)), O;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const R = this.condition;
        if (R === !0)
          return this.nodes;
        let O = this.else;
        if (O) {
          const x = O.optimizeNodes();
          O = this.else = Array.isArray(x) ? new h(x) : x;
        }
        if (O)
          return R === !1 ? O instanceof y ? O : O.nodes : this.nodes.length ? this : new y(X(R), O instanceof y ? [O] : O.nodes);
        if (!(R === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(R, O) {
        var x;
        if (this.else = (x = this.else) === null || x === void 0 ? void 0 : x.optimizeNames(R, O), !!(super.optimizeNames(R, O) || this.else))
          return this.condition = k(this.condition, R, O), this;
      }
      get names() {
        const R = super.names;
        return K(R, this.condition), this.else && M(R, this.else.names), R;
      }
    }
    y.kind = "if";
    class p extends g {
    }
    p.kind = "for";
    class E extends p {
      constructor(R) {
        super(), this.iteration = R;
      }
      render(R) {
        return `for(${this.iteration})` + super.render(R);
      }
      optimizeNames(R, O) {
        if (super.optimizeNames(R, O))
          return this.iteration = k(this.iteration, R, O), this;
      }
      get names() {
        return M(super.names, this.iteration.names);
      }
    }
    class b extends p {
      constructor(R, O, x, I) {
        super(), this.varKind = R, this.name = O, this.from = x, this.to = I;
      }
      render(R) {
        const O = R.es5 ? o.varKinds.var : this.varKind, { name: x, from: I, to: N } = this;
        return `for(${O} ${x}=${I}; ${x}<${N}; ${x}++)` + super.render(R);
      }
      get names() {
        const R = K(super.names, this.from);
        return K(R, this.to);
      }
    }
    class $ extends p {
      constructor(R, O, x, I) {
        super(), this.loop = R, this.varKind = O, this.name = x, this.iterable = I;
      }
      render(R) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(R);
      }
      optimizeNames(R, O) {
        if (super.optimizeNames(R, O))
          return this.iterable = k(this.iterable, R, O), this;
      }
      get names() {
        return M(super.names, this.iterable.names);
      }
    }
    class _ extends g {
      constructor(R, O, x) {
        super(), this.name = R, this.args = O, this.async = x;
      }
      render(R) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(R);
      }
    }
    _.kind = "func";
    class w extends m {
      render(R) {
        return "return " + super.render(R);
      }
    }
    w.kind = "return";
    class P extends g {
      render(R) {
        let O = "try" + super.render(R);
        return this.catch && (O += this.catch.render(R)), this.finally && (O += this.finally.render(R)), O;
      }
      optimizeNodes() {
        var R, O;
        return super.optimizeNodes(), (R = this.catch) === null || R === void 0 || R.optimizeNodes(), (O = this.finally) === null || O === void 0 || O.optimizeNodes(), this;
      }
      optimizeNames(R, O) {
        var x, I;
        return super.optimizeNames(R, O), (x = this.catch) === null || x === void 0 || x.optimizeNames(R, O), (I = this.finally) === null || I === void 0 || I.optimizeNames(R, O), this;
      }
      get names() {
        const R = super.names;
        return this.catch && M(R, this.catch.names), this.finally && M(R, this.finally.names), R;
      }
    }
    class T extends g {
      constructor(R) {
        super(), this.error = R;
      }
      render(R) {
        return `catch(${this.error})` + super.render(R);
      }
    }
    T.kind = "catch";
    class G extends g {
      render(R) {
        return "finally" + super.render(R);
      }
    }
    G.kind = "finally";
    class L {
      constructor(R, O = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...O, _n: O.lines ? `
` : "" }, this._extScope = R, this._scope = new o.Scope({ parent: R }), this._nodes = [new v()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(R) {
        return this._scope.name(R);
      }
      // reserves unique name in the external scope
      scopeName(R) {
        return this._extScope.name(R);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(R, O) {
        const x = this._extScope.value(R, O);
        return (this._values[x.prefix] || (this._values[x.prefix] = /* @__PURE__ */ new Set())).add(x), x;
      }
      getScopeValue(R, O) {
        return this._extScope.getValue(R, O);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(R) {
        return this._extScope.scopeRefs(R, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(R, O, x, I) {
        const N = this._scope.toName(O);
        return x !== void 0 && I && (this._constants[N.str] = x), this._leafNode(new i(R, N, x)), N;
      }
      // `const` declaration (`var` in es5 mode)
      const(R, O, x) {
        return this._def(o.varKinds.const, R, O, x);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(R, O, x) {
        return this._def(o.varKinds.let, R, O, x);
      }
      // `var` declaration with optional assignment
      var(R, O, x) {
        return this._def(o.varKinds.var, R, O, x);
      }
      // assignment code
      assign(R, O, x) {
        return this._leafNode(new c(R, O, x));
      }
      // `+=` code
      add(R, O) {
        return this._leafNode(new s(R, e.operators.ADD, O));
      }
      // appends passed SafeExpr to code or executes Block
      code(R) {
        return typeof R == "function" ? R() : R !== t.nil && this._leafNode(new l(R)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...R) {
        const O = ["{"];
        for (const [x, I] of R)
          O.length > 1 && O.push(","), O.push(x), (x !== I || this.opts.es5) && (O.push(":"), (0, t.addCodeArg)(O, I));
        return O.push("}"), new t._Code(O);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(R, O, x) {
        if (this._blockNode(new y(R)), O && x)
          this.code(O).else().code(x).endIf();
        else if (O)
          this.code(O).endIf();
        else if (x)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(R) {
        return this._elseNode(new y(R));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(y, h);
      }
      _for(R, O) {
        return this._blockNode(R), O && this.code(O).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(R, O) {
        return this._for(new E(R), O);
      }
      // `for` statement for a range of values
      forRange(R, O, x, I, N = this.opts.es5 ? o.varKinds.var : o.varKinds.let) {
        const Q = this._scope.toName(R);
        return this._for(new b(N, Q, O, x), () => I(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(R, O, x, I = o.varKinds.const) {
        const N = this._scope.toName(R);
        if (this.opts.es5) {
          const Q = O instanceof t.Name ? O : this.var("_arr", O);
          return this.forRange("_i", 0, (0, t._)`${Q}.length`, (H) => {
            this.var(N, (0, t._)`${Q}[${H}]`), x(N);
          });
        }
        return this._for(new $("of", I, N, O), () => x(N));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(R, O, x, I = this.opts.es5 ? o.varKinds.var : o.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(R, (0, t._)`Object.keys(${O})`, x);
        const N = this._scope.toName(R);
        return this._for(new $("in", I, N, O), () => x(N));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(p);
      }
      // `label` statement
      label(R) {
        return this._leafNode(new u(R));
      }
      // `break` statement
      break(R) {
        return this._leafNode(new a(R));
      }
      // `return` statement
      return(R) {
        const O = new w();
        if (this._blockNode(O), this.code(R), O.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(w);
      }
      // `try` statement
      try(R, O, x) {
        if (!O && !x)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const I = new P();
        if (this._blockNode(I), this.code(R), O) {
          const N = this.name("e");
          this._currNode = I.catch = new T(N), O(N);
        }
        return x && (this._currNode = I.finally = new G(), this.code(x)), this._endBlockNode(T, G);
      }
      // `throw` statement
      throw(R) {
        return this._leafNode(new d(R));
      }
      // start self-balancing block
      block(R, O) {
        return this._blockStarts.push(this._nodes.length), R && this.code(R).endBlock(O), this;
      }
      // end the current self-balancing block
      endBlock(R) {
        const O = this._blockStarts.pop();
        if (O === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const x = this._nodes.length - O;
        if (x < 0 || R !== void 0 && x !== R)
          throw new Error(`CodeGen: wrong number of nodes: ${x} vs ${R} expected`);
        return this._nodes.length = O, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(R, O = t.nil, x, I) {
        return this._blockNode(new _(R, O, x)), I && this.code(I).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(_);
      }
      optimize(R = 1) {
        for (; R-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(R) {
        return this._currNode.nodes.push(R), this;
      }
      _blockNode(R) {
        this._currNode.nodes.push(R), this._nodes.push(R);
      }
      _endBlockNode(R, O) {
        const x = this._currNode;
        if (x instanceof R || O && x instanceof O)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${O ? `${R.kind}/${O.kind}` : R.kind}"`);
      }
      _elseNode(R) {
        const O = this._currNode;
        if (!(O instanceof y))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = O.else = R, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const R = this._nodes;
        return R[R.length - 1];
      }
      set _currNode(R) {
        const O = this._nodes;
        O[O.length - 1] = R;
      }
    }
    e.CodeGen = L;
    function M(D, R) {
      for (const O in R)
        D[O] = (D[O] || 0) + (R[O] || 0);
      return D;
    }
    function K(D, R) {
      return R instanceof t._CodeOrName ? M(D, R.names) : D;
    }
    function k(D, R, O) {
      if (D instanceof t.Name)
        return x(D);
      if (!I(D))
        return D;
      return new t._Code(D._items.reduce((N, Q) => (Q instanceof t.Name && (Q = x(Q)), Q instanceof t._Code ? N.push(...Q._items) : N.push(Q), N), []));
      function x(N) {
        const Q = O[N.str];
        return Q === void 0 || R[N.str] !== 1 ? N : (delete R[N.str], Q);
      }
      function I(N) {
        return N instanceof t._Code && N._items.some((Q) => Q instanceof t.Name && R[Q.str] === 1 && O[Q.str] !== void 0);
      }
    }
    function F(D, R) {
      for (const O in R)
        D[O] = (D[O] || 0) - (R[O] || 0);
    }
    function X(D) {
      return typeof D == "boolean" || typeof D == "number" || D === null ? !D : (0, t._)`!${U(D)}`;
    }
    e.not = X;
    const B = C(e.operators.AND);
    function Y(...D) {
      return D.reduce(B);
    }
    e.and = Y;
    const Z = C(e.operators.OR);
    function V(...D) {
      return D.reduce(Z);
    }
    e.or = V;
    function C(D) {
      return (R, O) => R === t.nil ? O : O === t.nil ? R : (0, t._)`${U(R)} ${D} ${U(O)}`;
    }
    function U(D) {
      return D instanceof t.Name ? D : (0, t._)`(${D})`;
    }
  })(Ms)), Ms;
}
var Ae = {}, dd;
function Ue() {
  if (dd) return Ae;
  dd = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.checkStrictMode = Ae.getErrorPath = Ae.Type = Ae.useFunc = Ae.setEvaluated = Ae.evaluatedPropsToName = Ae.mergeEvaluated = Ae.eachItem = Ae.unescapeJsonPointer = Ae.escapeJsonPointer = Ae.escapeFragment = Ae.unescapeFragment = Ae.schemaRefOrVal = Ae.schemaHasRulesButRef = Ae.schemaHasRules = Ae.checkUnknownRules = Ae.alwaysValidSchema = Ae.toHash = void 0;
  const e = De(), t = Ka();
  function o($) {
    const _ = {};
    for (const w of $)
      _[w] = !0;
    return _;
  }
  Ae.toHash = o;
  function n($, _) {
    return typeof _ == "boolean" ? _ : Object.keys(_).length === 0 ? !0 : (f($, _), !r(_, $.self.RULES.all));
  }
  Ae.alwaysValidSchema = n;
  function f($, _ = $.schema) {
    const { opts: w, self: P } = $;
    if (!w.strictSchema || typeof _ == "boolean")
      return;
    const T = P.RULES.keywords;
    for (const G in _)
      T[G] || b($, `unknown keyword: "${G}"`);
  }
  Ae.checkUnknownRules = f;
  function r($, _) {
    if (typeof $ == "boolean")
      return !$;
    for (const w in $)
      if (_[w])
        return !0;
    return !1;
  }
  Ae.schemaHasRules = r;
  function i($, _) {
    if (typeof $ == "boolean")
      return !$;
    for (const w in $)
      if (w !== "$ref" && _.all[w])
        return !0;
    return !1;
  }
  Ae.schemaHasRulesButRef = i;
  function c({ topSchemaRef: $, schemaPath: _ }, w, P, T) {
    if (!T) {
      if (typeof w == "number" || typeof w == "boolean")
        return w;
      if (typeof w == "string")
        return (0, e._)`${w}`;
    }
    return (0, e._)`${$}${_}${(0, e.getProperty)(P)}`;
  }
  Ae.schemaRefOrVal = c;
  function s($) {
    return d(decodeURIComponent($));
  }
  Ae.unescapeFragment = s;
  function u($) {
    return encodeURIComponent(a($));
  }
  Ae.escapeFragment = u;
  function a($) {
    return typeof $ == "number" ? `${$}` : $.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  Ae.escapeJsonPointer = a;
  function d($) {
    return $.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  Ae.unescapeJsonPointer = d;
  function l($, _) {
    if (Array.isArray($))
      for (const w of $)
        _(w);
    else
      _($);
  }
  Ae.eachItem = l;
  function m({ mergeNames: $, mergeToName: _, mergeValues: w, resultToName: P }) {
    return (T, G, L, M) => {
      const K = L === void 0 ? G : L instanceof e.Name ? (G instanceof e.Name ? $(T, G, L) : _(T, G, L), L) : G instanceof e.Name ? (_(T, L, G), G) : w(G, L);
      return M === e.Name && !(K instanceof e.Name) ? P(T, K) : K;
    };
  }
  Ae.mergeEvaluated = {
    props: m({
      mergeNames: ($, _, w) => $.if((0, e._)`${w} !== true && ${_} !== undefined`, () => {
        $.if((0, e._)`${_} === true`, () => $.assign(w, !0), () => $.assign(w, (0, e._)`${w} || {}`).code((0, e._)`Object.assign(${w}, ${_})`));
      }),
      mergeToName: ($, _, w) => $.if((0, e._)`${w} !== true`, () => {
        _ === !0 ? $.assign(w, !0) : ($.assign(w, (0, e._)`${w} || {}`), v($, w, _));
      }),
      mergeValues: ($, _) => $ === !0 ? !0 : { ...$, ..._ },
      resultToName: g
    }),
    items: m({
      mergeNames: ($, _, w) => $.if((0, e._)`${w} !== true && ${_} !== undefined`, () => $.assign(w, (0, e._)`${_} === true ? true : ${w} > ${_} ? ${w} : ${_}`)),
      mergeToName: ($, _, w) => $.if((0, e._)`${w} !== true`, () => $.assign(w, _ === !0 ? !0 : (0, e._)`${w} > ${_} ? ${w} : ${_}`)),
      mergeValues: ($, _) => $ === !0 ? !0 : Math.max($, _),
      resultToName: ($, _) => $.var("items", _)
    })
  };
  function g($, _) {
    if (_ === !0)
      return $.var("props", !0);
    const w = $.var("props", (0, e._)`{}`);
    return _ !== void 0 && v($, w, _), w;
  }
  Ae.evaluatedPropsToName = g;
  function v($, _, w) {
    Object.keys(w).forEach((P) => $.assign((0, e._)`${_}${(0, e.getProperty)(P)}`, !0));
  }
  Ae.setEvaluated = v;
  const h = {};
  function y($, _) {
    return $.scopeValue("func", {
      ref: _,
      code: h[_.code] || (h[_.code] = new t._Code(_.code))
    });
  }
  Ae.useFunc = y;
  var p;
  (function($) {
    $[$.Num = 0] = "Num", $[$.Str = 1] = "Str";
  })(p || (Ae.Type = p = {}));
  function E($, _, w) {
    if ($ instanceof e.Name) {
      const P = _ === p.Num;
      return w ? P ? (0, e._)`"[" + ${$} + "]"` : (0, e._)`"['" + ${$} + "']"` : P ? (0, e._)`"/" + ${$}` : (0, e._)`"/" + ${$}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return w ? (0, e.getProperty)($).toString() : "/" + a($);
  }
  Ae.getErrorPath = E;
  function b($, _, w = $.opts.strictSchema) {
    if (w) {
      if (_ = `strict mode: ${_}`, w === !0)
        throw new Error(_);
      $.self.logger.warn(_);
    }
  }
  return Ae.checkStrictMode = b, Ae;
}
var Bi = {}, hd;
function cr() {
  if (hd) return Bi;
  hd = 1, Object.defineProperty(Bi, "__esModule", { value: !0 });
  const e = De(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Bi.default = t, Bi;
}
var pd;
function as() {
  return pd || (pd = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = De(), o = Ue(), n = cr();
    e.keywordError = {
      message: ({ keyword: h }) => (0, t.str)`must pass "${h}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: h, schemaType: y }) => y ? (0, t.str)`"${h}" keyword must be ${y} ($data)` : (0, t.str)`"${h}" keyword is invalid ($data)`
    };
    function f(h, y = e.keywordError, p, E) {
      const { it: b } = h, { gen: $, compositeRule: _, allErrors: w } = b, P = d(h, y, p);
      E ?? (_ || w) ? s($, P) : u(b, (0, t._)`[${P}]`);
    }
    e.reportError = f;
    function r(h, y = e.keywordError, p) {
      const { it: E } = h, { gen: b, compositeRule: $, allErrors: _ } = E, w = d(h, y, p);
      s(b, w), $ || _ || u(E, n.default.vErrors);
    }
    e.reportExtraError = r;
    function i(h, y) {
      h.assign(n.default.errors, y), h.if((0, t._)`${n.default.vErrors} !== null`, () => h.if(y, () => h.assign((0, t._)`${n.default.vErrors}.length`, y), () => h.assign(n.default.vErrors, null)));
    }
    e.resetErrorsCount = i;
    function c({ gen: h, keyword: y, schemaValue: p, data: E, errsCount: b, it: $ }) {
      if (b === void 0)
        throw new Error("ajv implementation error");
      const _ = h.name("err");
      h.forRange("i", b, n.default.errors, (w) => {
        h.const(_, (0, t._)`${n.default.vErrors}[${w}]`), h.if((0, t._)`${_}.instancePath === undefined`, () => h.assign((0, t._)`${_}.instancePath`, (0, t.strConcat)(n.default.instancePath, $.errorPath))), h.assign((0, t._)`${_}.schemaPath`, (0, t.str)`${$.errSchemaPath}/${y}`), $.opts.verbose && (h.assign((0, t._)`${_}.schema`, p), h.assign((0, t._)`${_}.data`, E));
      });
    }
    e.extendErrors = c;
    function s(h, y) {
      const p = h.const("err", y);
      h.if((0, t._)`${n.default.vErrors} === null`, () => h.assign(n.default.vErrors, (0, t._)`[${p}]`), (0, t._)`${n.default.vErrors}.push(${p})`), h.code((0, t._)`${n.default.errors}++`);
    }
    function u(h, y) {
      const { gen: p, validateName: E, schemaEnv: b } = h;
      b.$async ? p.throw((0, t._)`new ${h.ValidationError}(${y})`) : (p.assign((0, t._)`${E}.errors`, y), p.return(!1));
    }
    const a = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function d(h, y, p) {
      const { createErrors: E } = h.it;
      return E === !1 ? (0, t._)`{}` : l(h, y, p);
    }
    function l(h, y, p = {}) {
      const { gen: E, it: b } = h, $ = [
        m(b, p),
        g(h, p)
      ];
      return v(h, y, $), E.object(...$);
    }
    function m({ errorPath: h }, { instancePath: y }) {
      const p = y ? (0, t.str)`${h}${(0, o.getErrorPath)(y, o.Type.Str)}` : h;
      return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, p)];
    }
    function g({ keyword: h, it: { errSchemaPath: y } }, { schemaPath: p, parentSchema: E }) {
      let b = E ? y : (0, t.str)`${y}/${h}`;
      return p && (b = (0, t.str)`${b}${(0, o.getErrorPath)(p, o.Type.Str)}`), [a.schemaPath, b];
    }
    function v(h, { params: y, message: p }, E) {
      const { keyword: b, data: $, schemaValue: _, it: w } = h, { opts: P, propertyName: T, topSchemaRef: G, schemaPath: L } = w;
      E.push([a.keyword, b], [a.params, typeof y == "function" ? y(h) : y || (0, t._)`{}`]), P.messages && E.push([a.message, typeof p == "function" ? p(h) : p]), P.verbose && E.push([a.schema, _], [a.parentSchema, (0, t._)`${G}${L}`], [n.default.data, $]), T && E.push([a.propertyName, T]);
    }
  })(Us)), Us;
}
var md;
function $w() {
  if (md) return Er;
  md = 1, Object.defineProperty(Er, "__esModule", { value: !0 }), Er.boolOrEmptySchema = Er.topBoolOrEmptySchema = void 0;
  const e = as(), t = De(), o = cr(), n = {
    message: "boolean schema is false"
  };
  function f(c) {
    const { gen: s, schema: u, validateName: a } = c;
    u === !1 ? i(c, !1) : typeof u == "object" && u.$async === !0 ? s.return(o.default.data) : (s.assign((0, t._)`${a}.errors`, null), s.return(!0));
  }
  Er.topBoolOrEmptySchema = f;
  function r(c, s) {
    const { gen: u, schema: a } = c;
    a === !1 ? (u.var(s, !1), i(c)) : u.var(s, !0);
  }
  Er.boolOrEmptySchema = r;
  function i(c, s) {
    const { gen: u, data: a } = c, d = {
      gen: u,
      keyword: "false schema",
      data: a,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(d, n, void 0, s);
  }
  return Er;
}
var Ze = {}, wr = {}, yd;
function M0() {
  if (yd) return wr;
  yd = 1, Object.defineProperty(wr, "__esModule", { value: !0 }), wr.getRules = wr.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function o(f) {
    return typeof f == "string" && t.has(f);
  }
  wr.isJSONType = o;
  function n() {
    const f = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...f, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, f.number, f.string, f.array, f.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return wr.getRules = n, wr;
}
var Bt = {}, gd;
function x0() {
  if (gd) return Bt;
  gd = 1, Object.defineProperty(Bt, "__esModule", { value: !0 }), Bt.shouldUseRule = Bt.shouldUseGroup = Bt.schemaHasRulesForType = void 0;
  function e({ schema: n, self: f }, r) {
    const i = f.RULES.types[r];
    return i && i !== !0 && t(n, i);
  }
  Bt.schemaHasRulesForType = e;
  function t(n, f) {
    return f.rules.some((r) => o(n, r));
  }
  Bt.shouldUseGroup = t;
  function o(n, f) {
    var r;
    return n[f.keyword] !== void 0 || ((r = f.definition.implements) === null || r === void 0 ? void 0 : r.some((i) => n[i] !== void 0));
  }
  return Bt.shouldUseRule = o, Bt;
}
var vd;
function Wa() {
  if (vd) return Ze;
  vd = 1, Object.defineProperty(Ze, "__esModule", { value: !0 }), Ze.reportTypeError = Ze.checkDataTypes = Ze.checkDataType = Ze.coerceAndCheckDataType = Ze.getJSONTypes = Ze.getSchemaTypes = Ze.DataType = void 0;
  const e = M0(), t = x0(), o = as(), n = De(), f = Ue();
  var r;
  (function(p) {
    p[p.Correct = 0] = "Correct", p[p.Wrong = 1] = "Wrong";
  })(r || (Ze.DataType = r = {}));
  function i(p) {
    const E = c(p.type);
    if (E.includes("null")) {
      if (p.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!E.length && p.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      p.nullable === !0 && E.push("null");
    }
    return E;
  }
  Ze.getSchemaTypes = i;
  function c(p) {
    const E = Array.isArray(p) ? p : p ? [p] : [];
    if (E.every(e.isJSONType))
      return E;
    throw new Error("type must be JSONType or JSONType[]: " + E.join(","));
  }
  Ze.getJSONTypes = c;
  function s(p, E) {
    const { gen: b, data: $, opts: _ } = p, w = a(E, _.coerceTypes), P = E.length > 0 && !(w.length === 0 && E.length === 1 && (0, t.schemaHasRulesForType)(p, E[0]));
    if (P) {
      const T = g(E, $, _.strictNumbers, r.Wrong);
      b.if(T, () => {
        w.length ? d(p, E, w) : h(p);
      });
    }
    return P;
  }
  Ze.coerceAndCheckDataType = s;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function a(p, E) {
    return E ? p.filter((b) => u.has(b) || E === "array" && b === "array") : [];
  }
  function d(p, E, b) {
    const { gen: $, data: _, opts: w } = p, P = $.let("dataType", (0, n._)`typeof ${_}`), T = $.let("coerced", (0, n._)`undefined`);
    w.coerceTypes === "array" && $.if((0, n._)`${P} == 'object' && Array.isArray(${_}) && ${_}.length == 1`, () => $.assign(_, (0, n._)`${_}[0]`).assign(P, (0, n._)`typeof ${_}`).if(g(E, _, w.strictNumbers), () => $.assign(T, _))), $.if((0, n._)`${T} !== undefined`);
    for (const L of b)
      (u.has(L) || L === "array" && w.coerceTypes === "array") && G(L);
    $.else(), h(p), $.endIf(), $.if((0, n._)`${T} !== undefined`, () => {
      $.assign(_, T), l(p, T);
    });
    function G(L) {
      switch (L) {
        case "string":
          $.elseIf((0, n._)`${P} == "number" || ${P} == "boolean"`).assign(T, (0, n._)`"" + ${_}`).elseIf((0, n._)`${_} === null`).assign(T, (0, n._)`""`);
          return;
        case "number":
          $.elseIf((0, n._)`${P} == "boolean" || ${_} === null
              || (${P} == "string" && ${_} && ${_} == +${_})`).assign(T, (0, n._)`+${_}`);
          return;
        case "integer":
          $.elseIf((0, n._)`${P} === "boolean" || ${_} === null
              || (${P} === "string" && ${_} && ${_} == +${_} && !(${_} % 1))`).assign(T, (0, n._)`+${_}`);
          return;
        case "boolean":
          $.elseIf((0, n._)`${_} === "false" || ${_} === 0 || ${_} === null`).assign(T, !1).elseIf((0, n._)`${_} === "true" || ${_} === 1`).assign(T, !0);
          return;
        case "null":
          $.elseIf((0, n._)`${_} === "" || ${_} === 0 || ${_} === false`), $.assign(T, null);
          return;
        case "array":
          $.elseIf((0, n._)`${P} === "string" || ${P} === "number"
              || ${P} === "boolean" || ${_} === null`).assign(T, (0, n._)`[${_}]`);
      }
    }
  }
  function l({ gen: p, parentData: E, parentDataProperty: b }, $) {
    p.if((0, n._)`${E} !== undefined`, () => p.assign((0, n._)`${E}[${b}]`, $));
  }
  function m(p, E, b, $ = r.Correct) {
    const _ = $ === r.Correct ? n.operators.EQ : n.operators.NEQ;
    let w;
    switch (p) {
      case "null":
        return (0, n._)`${E} ${_} null`;
      case "array":
        w = (0, n._)`Array.isArray(${E})`;
        break;
      case "object":
        w = (0, n._)`${E} && typeof ${E} == "object" && !Array.isArray(${E})`;
        break;
      case "integer":
        w = P((0, n._)`!(${E} % 1) && !isNaN(${E})`);
        break;
      case "number":
        w = P();
        break;
      default:
        return (0, n._)`typeof ${E} ${_} ${p}`;
    }
    return $ === r.Correct ? w : (0, n.not)(w);
    function P(T = n.nil) {
      return (0, n.and)((0, n._)`typeof ${E} == "number"`, T, b ? (0, n._)`isFinite(${E})` : n.nil);
    }
  }
  Ze.checkDataType = m;
  function g(p, E, b, $) {
    if (p.length === 1)
      return m(p[0], E, b, $);
    let _;
    const w = (0, f.toHash)(p);
    if (w.array && w.object) {
      const P = (0, n._)`typeof ${E} != "object"`;
      _ = w.null ? P : (0, n._)`!${E} || ${P}`, delete w.null, delete w.array, delete w.object;
    } else
      _ = n.nil;
    w.number && delete w.integer;
    for (const P in w)
      _ = (0, n.and)(_, m(P, E, b, $));
    return _;
  }
  Ze.checkDataTypes = g;
  const v = {
    message: ({ schema: p }) => `must be ${p}`,
    params: ({ schema: p, schemaValue: E }) => typeof p == "string" ? (0, n._)`{type: ${p}}` : (0, n._)`{type: ${E}}`
  };
  function h(p) {
    const E = y(p);
    (0, o.reportError)(E, v);
  }
  Ze.reportTypeError = h;
  function y(p) {
    const { gen: E, data: b, schema: $ } = p, _ = (0, f.schemaRefOrVal)(p, $, "type");
    return {
      gen: E,
      keyword: "type",
      data: b,
      schema: $.type,
      schemaCode: _,
      schemaValue: _,
      parentSchema: $,
      params: {},
      it: p
    };
  }
  return Ze;
}
var sn = {}, _d;
function Sw() {
  if (_d) return sn;
  _d = 1, Object.defineProperty(sn, "__esModule", { value: !0 }), sn.assignDefaults = void 0;
  const e = De(), t = Ue();
  function o(f, r) {
    const { properties: i, items: c } = f.schema;
    if (r === "object" && i)
      for (const s in i)
        n(f, s, i[s].default);
    else r === "array" && Array.isArray(c) && c.forEach((s, u) => n(f, u, s.default));
  }
  sn.assignDefaults = o;
  function n(f, r, i) {
    const { gen: c, compositeRule: s, data: u, opts: a } = f;
    if (i === void 0)
      return;
    const d = (0, e._)`${u}${(0, e.getProperty)(r)}`;
    if (s) {
      (0, t.checkStrictMode)(f, `default is ignored for: ${d}`);
      return;
    }
    let l = (0, e._)`${d} === undefined`;
    a.useDefaults === "empty" && (l = (0, e._)`${l} || ${d} === null || ${d} === ""`), c.if(l, (0, e._)`${d} = ${(0, e.stringify)(i)}`);
  }
  return sn;
}
var Tt = {}, Ve = {}, Ed;
function At() {
  if (Ed) return Ve;
  Ed = 1, Object.defineProperty(Ve, "__esModule", { value: !0 }), Ve.validateUnion = Ve.validateArray = Ve.usePattern = Ve.callValidateCode = Ve.schemaProperties = Ve.allSchemaProperties = Ve.noPropertyInData = Ve.propertyInData = Ve.isOwnProperty = Ve.hasPropFunc = Ve.reportMissingProp = Ve.checkMissingProp = Ve.checkReportMissingProp = void 0;
  const e = De(), t = Ue(), o = cr(), n = Ue();
  function f(p, E) {
    const { gen: b, data: $, it: _ } = p;
    b.if(a(b, $, E, _.opts.ownProperties), () => {
      p.setParams({ missingProperty: (0, e._)`${E}` }, !0), p.error();
    });
  }
  Ve.checkReportMissingProp = f;
  function r({ gen: p, data: E, it: { opts: b } }, $, _) {
    return (0, e.or)(...$.map((w) => (0, e.and)(a(p, E, w, b.ownProperties), (0, e._)`${_} = ${w}`)));
  }
  Ve.checkMissingProp = r;
  function i(p, E) {
    p.setParams({ missingProperty: E }, !0), p.error();
  }
  Ve.reportMissingProp = i;
  function c(p) {
    return p.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  Ve.hasPropFunc = c;
  function s(p, E, b) {
    return (0, e._)`${c(p)}.call(${E}, ${b})`;
  }
  Ve.isOwnProperty = s;
  function u(p, E, b, $) {
    const _ = (0, e._)`${E}${(0, e.getProperty)(b)} !== undefined`;
    return $ ? (0, e._)`${_} && ${s(p, E, b)}` : _;
  }
  Ve.propertyInData = u;
  function a(p, E, b, $) {
    const _ = (0, e._)`${E}${(0, e.getProperty)(b)} === undefined`;
    return $ ? (0, e.or)(_, (0, e.not)(s(p, E, b))) : _;
  }
  Ve.noPropertyInData = a;
  function d(p) {
    return p ? Object.keys(p).filter((E) => E !== "__proto__") : [];
  }
  Ve.allSchemaProperties = d;
  function l(p, E) {
    return d(E).filter((b) => !(0, t.alwaysValidSchema)(p, E[b]));
  }
  Ve.schemaProperties = l;
  function m({ schemaCode: p, data: E, it: { gen: b, topSchemaRef: $, schemaPath: _, errorPath: w }, it: P }, T, G, L) {
    const M = L ? (0, e._)`${p}, ${E}, ${$}${_}` : E, K = [
      [o.default.instancePath, (0, e.strConcat)(o.default.instancePath, w)],
      [o.default.parentData, P.parentData],
      [o.default.parentDataProperty, P.parentDataProperty],
      [o.default.rootData, o.default.rootData]
    ];
    P.opts.dynamicRef && K.push([o.default.dynamicAnchors, o.default.dynamicAnchors]);
    const k = (0, e._)`${M}, ${b.object(...K)}`;
    return G !== e.nil ? (0, e._)`${T}.call(${G}, ${k})` : (0, e._)`${T}(${k})`;
  }
  Ve.callValidateCode = m;
  const g = (0, e._)`new RegExp`;
  function v({ gen: p, it: { opts: E } }, b) {
    const $ = E.unicodeRegExp ? "u" : "", { regExp: _ } = E.code, w = _(b, $);
    return p.scopeValue("pattern", {
      key: w.toString(),
      ref: w,
      code: (0, e._)`${_.code === "new RegExp" ? g : (0, n.useFunc)(p, _)}(${b}, ${$})`
    });
  }
  Ve.usePattern = v;
  function h(p) {
    const { gen: E, data: b, keyword: $, it: _ } = p, w = E.name("valid");
    if (_.allErrors) {
      const T = E.let("valid", !0);
      return P(() => E.assign(T, !1)), T;
    }
    return E.var(w, !0), P(() => E.break()), w;
    function P(T) {
      const G = E.const("len", (0, e._)`${b}.length`);
      E.forRange("i", 0, G, (L) => {
        p.subschema({
          keyword: $,
          dataProp: L,
          dataPropType: t.Type.Num
        }, w), E.if((0, e.not)(w), T);
      });
    }
  }
  Ve.validateArray = h;
  function y(p) {
    const { gen: E, schema: b, keyword: $, it: _ } = p;
    if (!Array.isArray(b))
      throw new Error("ajv implementation error");
    if (b.some((G) => (0, t.alwaysValidSchema)(_, G)) && !_.opts.unevaluated)
      return;
    const P = E.let("valid", !1), T = E.name("_valid");
    E.block(() => b.forEach((G, L) => {
      const M = p.subschema({
        keyword: $,
        schemaProp: L,
        compositeRule: !0
      }, T);
      E.assign(P, (0, e._)`${P} || ${T}`), p.mergeValidEvaluated(M, T) || E.if((0, e.not)(P));
    })), p.result(P, () => p.reset(), () => p.error(!0));
  }
  return Ve.validateUnion = y, Ve;
}
var wd;
function bw() {
  if (wd) return Tt;
  wd = 1, Object.defineProperty(Tt, "__esModule", { value: !0 }), Tt.validateKeywordUsage = Tt.validSchemaType = Tt.funcKeywordCode = Tt.macroKeywordCode = void 0;
  const e = De(), t = cr(), o = At(), n = as();
  function f(l, m) {
    const { gen: g, keyword: v, schema: h, parentSchema: y, it: p } = l, E = m.macro.call(p.self, h, y, p), b = u(g, v, E);
    p.opts.validateSchema !== !1 && p.self.validateSchema(E, !0);
    const $ = g.name("valid");
    l.subschema({
      schema: E,
      schemaPath: e.nil,
      errSchemaPath: `${p.errSchemaPath}/${v}`,
      topSchemaRef: b,
      compositeRule: !0
    }, $), l.pass($, () => l.error(!0));
  }
  Tt.macroKeywordCode = f;
  function r(l, m) {
    var g;
    const { gen: v, keyword: h, schema: y, parentSchema: p, $data: E, it: b } = l;
    s(b, m);
    const $ = !E && m.compile ? m.compile.call(b.self, y, p, b) : m.validate, _ = u(v, h, $), w = v.let("valid");
    l.block$data(w, P), l.ok((g = m.valid) !== null && g !== void 0 ? g : w);
    function P() {
      if (m.errors === !1)
        L(), m.modifying && i(l), M(() => l.error());
      else {
        const K = m.async ? T() : G();
        m.modifying && i(l), M(() => c(l, K));
      }
    }
    function T() {
      const K = v.let("ruleErrs", null);
      return v.try(() => L((0, e._)`await `), (k) => v.assign(w, !1).if((0, e._)`${k} instanceof ${b.ValidationError}`, () => v.assign(K, (0, e._)`${k}.errors`), () => v.throw(k))), K;
    }
    function G() {
      const K = (0, e._)`${_}.errors`;
      return v.assign(K, null), L(e.nil), K;
    }
    function L(K = m.async ? (0, e._)`await ` : e.nil) {
      const k = b.opts.passContext ? t.default.this : t.default.self, F = !("compile" in m && !E || m.schema === !1);
      v.assign(w, (0, e._)`${K}${(0, o.callValidateCode)(l, _, k, F)}`, m.modifying);
    }
    function M(K) {
      var k;
      v.if((0, e.not)((k = m.valid) !== null && k !== void 0 ? k : w), K);
    }
  }
  Tt.funcKeywordCode = r;
  function i(l) {
    const { gen: m, data: g, it: v } = l;
    m.if(v.parentData, () => m.assign(g, (0, e._)`${v.parentData}[${v.parentDataProperty}]`));
  }
  function c(l, m) {
    const { gen: g } = l;
    g.if((0, e._)`Array.isArray(${m})`, () => {
      g.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${m} : ${t.default.vErrors}.concat(${m})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(l);
    }, () => l.error());
  }
  function s({ schemaEnv: l }, m) {
    if (m.async && !l.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(l, m, g) {
    if (g === void 0)
      throw new Error(`keyword "${m}" failed to compile`);
    return l.scopeValue("keyword", typeof g == "function" ? { ref: g } : { ref: g, code: (0, e.stringify)(g) });
  }
  function a(l, m, g = !1) {
    return !m.length || m.some((v) => v === "array" ? Array.isArray(l) : v === "object" ? l && typeof l == "object" && !Array.isArray(l) : typeof l == v || g && typeof l > "u");
  }
  Tt.validSchemaType = a;
  function d({ schema: l, opts: m, self: g, errSchemaPath: v }, h, y) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(y) : h.keyword !== y)
      throw new Error("ajv implementation error");
    const p = h.dependencies;
    if (p?.some((E) => !Object.prototype.hasOwnProperty.call(l, E)))
      throw new Error(`parent schema must have dependencies of ${y}: ${p.join(",")}`);
    if (h.validateSchema && !h.validateSchema(l[y])) {
      const b = `keyword "${y}" value is invalid at path "${v}": ` + g.errorsText(h.validateSchema.errors);
      if (m.validateSchema === "log")
        g.logger.error(b);
      else
        throw new Error(b);
    }
  }
  return Tt.validateKeywordUsage = d, Tt;
}
var Ht = {}, $d;
function Rw() {
  if ($d) return Ht;
  $d = 1, Object.defineProperty(Ht, "__esModule", { value: !0 }), Ht.extendSubschemaMode = Ht.extendSubschemaData = Ht.getSubschema = void 0;
  const e = De(), t = Ue();
  function o(r, { keyword: i, schemaProp: c, schema: s, schemaPath: u, errSchemaPath: a, topSchemaRef: d }) {
    if (i !== void 0 && s !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const l = r.schema[i];
      return c === void 0 ? {
        schema: l,
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${r.errSchemaPath}/${i}`
      } : {
        schema: l[c],
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(i)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${r.errSchemaPath}/${i}/${(0, t.escapeFragment)(c)}`
      };
    }
    if (s !== void 0) {
      if (u === void 0 || a === void 0 || d === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: s,
        schemaPath: u,
        topSchemaRef: d,
        errSchemaPath: a
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ht.getSubschema = o;
  function n(r, i, { dataProp: c, dataPropType: s, data: u, dataTypes: a, propertyName: d }) {
    if (u !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: l } = i;
    if (c !== void 0) {
      const { errorPath: g, dataPathArr: v, opts: h } = i, y = l.let("data", (0, e._)`${i.data}${(0, e.getProperty)(c)}`, !0);
      m(y), r.errorPath = (0, e.str)`${g}${(0, t.getErrorPath)(c, s, h.jsPropertySyntax)}`, r.parentDataProperty = (0, e._)`${c}`, r.dataPathArr = [...v, r.parentDataProperty];
    }
    if (u !== void 0) {
      const g = u instanceof e.Name ? u : l.let("data", u, !0);
      m(g), d !== void 0 && (r.propertyName = d);
    }
    a && (r.dataTypes = a);
    function m(g) {
      r.data = g, r.dataLevel = i.dataLevel + 1, r.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), r.parentData = i.data, r.dataNames = [...i.dataNames, g];
    }
  }
  Ht.extendSubschemaData = n;
  function f(r, { jtdDiscriminator: i, jtdMetadata: c, compositeRule: s, createErrors: u, allErrors: a }) {
    s !== void 0 && (r.compositeRule = s), u !== void 0 && (r.createErrors = u), a !== void 0 && (r.allErrors = a), r.jtdDiscriminator = i, r.jtdMetadata = c;
  }
  return Ht.extendSubschemaMode = f, Ht;
}
var ct = {}, Gs = { exports: {} }, Sd;
function Pw() {
  if (Sd) return Gs.exports;
  Sd = 1;
  var e = Gs.exports = function(n, f, r) {
    typeof f == "function" && (r = f, f = {}), r = f.cb || r;
    var i = typeof r == "function" ? r : r.pre || function() {
    }, c = r.post || function() {
    };
    t(f, i, c, n, "", n);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(n, f, r, i, c, s, u, a, d, l) {
    if (i && typeof i == "object" && !Array.isArray(i)) {
      f(i, c, s, u, a, d, l);
      for (var m in i) {
        var g = i[m];
        if (Array.isArray(g)) {
          if (m in e.arrayKeywords)
            for (var v = 0; v < g.length; v++)
              t(n, f, r, g[v], c + "/" + m + "/" + v, s, c, m, i, v);
        } else if (m in e.propsKeywords) {
          if (g && typeof g == "object")
            for (var h in g)
              t(n, f, r, g[h], c + "/" + m + "/" + o(h), s, c, m, i, h);
        } else (m in e.keywords || n.allKeys && !(m in e.skipKeywords)) && t(n, f, r, g, c + "/" + m, s, c, m, i);
      }
      r(i, c, s, u, a, d, l);
    }
  }
  function o(n) {
    return n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Gs.exports;
}
var bd;
function ss() {
  if (bd) return ct;
  bd = 1, Object.defineProperty(ct, "__esModule", { value: !0 }), ct.getSchemaRefs = ct.resolveUrl = ct.normalizeId = ct._getFullPath = ct.getFullPath = ct.inlineRef = void 0;
  const e = Ue(), t = es(), o = Pw(), n = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function f(v, h = !0) {
    return typeof v == "boolean" ? !0 : h === !0 ? !i(v) : h ? c(v) <= h : !1;
  }
  ct.inlineRef = f;
  const r = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function i(v) {
    for (const h in v) {
      if (r.has(h))
        return !0;
      const y = v[h];
      if (Array.isArray(y) && y.some(i) || typeof y == "object" && i(y))
        return !0;
    }
    return !1;
  }
  function c(v) {
    let h = 0;
    for (const y in v) {
      if (y === "$ref")
        return 1 / 0;
      if (h++, !n.has(y) && (typeof v[y] == "object" && (0, e.eachItem)(v[y], (p) => h += c(p)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function s(v, h = "", y) {
    y !== !1 && (h = d(h));
    const p = v.parse(h);
    return u(v, p);
  }
  ct.getFullPath = s;
  function u(v, h) {
    return v.serialize(h).split("#")[0] + "#";
  }
  ct._getFullPath = u;
  const a = /#\/?$/;
  function d(v) {
    return v ? v.replace(a, "") : "";
  }
  ct.normalizeId = d;
  function l(v, h, y) {
    return y = d(y), v.resolve(h, y);
  }
  ct.resolveUrl = l;
  const m = /^[a-z_][-a-z0-9._]*$/i;
  function g(v, h) {
    if (typeof v == "boolean")
      return {};
    const { schemaId: y, uriResolver: p } = this.opts, E = d(v[y] || h), b = { "": E }, $ = s(p, E, !1), _ = {}, w = /* @__PURE__ */ new Set();
    return o(v, { allKeys: !0 }, (G, L, M, K) => {
      if (K === void 0)
        return;
      const k = $ + L;
      let F = b[K];
      typeof G[y] == "string" && (F = X.call(this, G[y])), B.call(this, G.$anchor), B.call(this, G.$dynamicAnchor), b[L] = F;
      function X(Y) {
        const Z = this.opts.uriResolver.resolve;
        if (Y = d(F ? Z(F, Y) : Y), w.has(Y))
          throw T(Y);
        w.add(Y);
        let V = this.refs[Y];
        return typeof V == "string" && (V = this.refs[V]), typeof V == "object" ? P(G, V.schema, Y) : Y !== d(k) && (Y[0] === "#" ? (P(G, _[Y], Y), _[Y] = G) : this.refs[Y] = k), Y;
      }
      function B(Y) {
        if (typeof Y == "string") {
          if (!m.test(Y))
            throw new Error(`invalid anchor "${Y}"`);
          X.call(this, `#${Y}`);
        }
      }
    }), _;
    function P(G, L, M) {
      if (L !== void 0 && !t(G, L))
        throw T(M);
    }
    function T(G) {
      return new Error(`reference "${G}" resolves to more than one schema`);
    }
  }
  return ct.getSchemaRefs = g, ct;
}
var Rd;
function os() {
  if (Rd) return Gt;
  Rd = 1, Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt.getData = Gt.KeywordCxt = Gt.validateFunctionCode = void 0;
  const e = $w(), t = Wa(), o = x0(), n = Wa(), f = Sw(), r = bw(), i = Rw(), c = De(), s = cr(), u = ss(), a = Ue(), d = as();
  function l(A) {
    if ($(A) && (w(A), b(A))) {
      h(A);
      return;
    }
    m(A, () => (0, e.topBoolOrEmptySchema)(A));
  }
  Gt.validateFunctionCode = l;
  function m({ gen: A, validateName: q, schema: W, schemaEnv: J, opts: re }, fe) {
    re.code.es5 ? A.func(q, (0, c._)`${s.default.data}, ${s.default.valCxt}`, J.$async, () => {
      A.code((0, c._)`"use strict"; ${p(W, re)}`), v(A, re), A.code(fe);
    }) : A.func(q, (0, c._)`${s.default.data}, ${g(re)}`, J.$async, () => A.code(p(W, re)).code(fe));
  }
  function g(A) {
    return (0, c._)`{${s.default.instancePath}="", ${s.default.parentData}, ${s.default.parentDataProperty}, ${s.default.rootData}=${s.default.data}${A.dynamicRef ? (0, c._)`, ${s.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function v(A, q) {
    A.if(s.default.valCxt, () => {
      A.var(s.default.instancePath, (0, c._)`${s.default.valCxt}.${s.default.instancePath}`), A.var(s.default.parentData, (0, c._)`${s.default.valCxt}.${s.default.parentData}`), A.var(s.default.parentDataProperty, (0, c._)`${s.default.valCxt}.${s.default.parentDataProperty}`), A.var(s.default.rootData, (0, c._)`${s.default.valCxt}.${s.default.rootData}`), q.dynamicRef && A.var(s.default.dynamicAnchors, (0, c._)`${s.default.valCxt}.${s.default.dynamicAnchors}`);
    }, () => {
      A.var(s.default.instancePath, (0, c._)`""`), A.var(s.default.parentData, (0, c._)`undefined`), A.var(s.default.parentDataProperty, (0, c._)`undefined`), A.var(s.default.rootData, s.default.data), q.dynamicRef && A.var(s.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function h(A) {
    const { schema: q, opts: W, gen: J } = A;
    m(A, () => {
      W.$comment && q.$comment && K(A), G(A), J.let(s.default.vErrors, null), J.let(s.default.errors, 0), W.unevaluated && y(A), P(A), k(A);
    });
  }
  function y(A) {
    const { gen: q, validateName: W } = A;
    A.evaluated = q.const("evaluated", (0, c._)`${W}.evaluated`), q.if((0, c._)`${A.evaluated}.dynamicProps`, () => q.assign((0, c._)`${A.evaluated}.props`, (0, c._)`undefined`)), q.if((0, c._)`${A.evaluated}.dynamicItems`, () => q.assign((0, c._)`${A.evaluated}.items`, (0, c._)`undefined`));
  }
  function p(A, q) {
    const W = typeof A == "object" && A[q.schemaId];
    return W && (q.code.source || q.code.process) ? (0, c._)`/*# sourceURL=${W} */` : c.nil;
  }
  function E(A, q) {
    if ($(A) && (w(A), b(A))) {
      _(A, q);
      return;
    }
    (0, e.boolOrEmptySchema)(A, q);
  }
  function b({ schema: A, self: q }) {
    if (typeof A == "boolean")
      return !A;
    for (const W in A)
      if (q.RULES.all[W])
        return !0;
    return !1;
  }
  function $(A) {
    return typeof A.schema != "boolean";
  }
  function _(A, q) {
    const { schema: W, gen: J, opts: re } = A;
    re.$comment && W.$comment && K(A), L(A), M(A);
    const fe = J.const("_errs", s.default.errors);
    P(A, fe), J.var(q, (0, c._)`${fe} === ${s.default.errors}`);
  }
  function w(A) {
    (0, a.checkUnknownRules)(A), T(A);
  }
  function P(A, q) {
    if (A.opts.jtd)
      return X(A, [], !1, q);
    const W = (0, t.getSchemaTypes)(A.schema), J = (0, t.coerceAndCheckDataType)(A, W);
    X(A, W, !J, q);
  }
  function T(A) {
    const { schema: q, errSchemaPath: W, opts: J, self: re } = A;
    q.$ref && J.ignoreKeywordsWithRef && (0, a.schemaHasRulesButRef)(q, re.RULES) && re.logger.warn(`$ref: keywords ignored in schema at path "${W}"`);
  }
  function G(A) {
    const { schema: q, opts: W } = A;
    q.default !== void 0 && W.useDefaults && W.strictSchema && (0, a.checkStrictMode)(A, "default is ignored in the schema root");
  }
  function L(A) {
    const q = A.schema[A.opts.schemaId];
    q && (A.baseId = (0, u.resolveUrl)(A.opts.uriResolver, A.baseId, q));
  }
  function M(A) {
    if (A.schema.$async && !A.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function K({ gen: A, schemaEnv: q, schema: W, errSchemaPath: J, opts: re }) {
    const fe = W.$comment;
    if (re.$comment === !0)
      A.code((0, c._)`${s.default.self}.logger.log(${fe})`);
    else if (typeof re.$comment == "function") {
      const ge = (0, c.str)`${J}/$comment`, Oe = A.scopeValue("root", { ref: q.root });
      A.code((0, c._)`${s.default.self}.opts.$comment(${fe}, ${ge}, ${Oe}.schema)`);
    }
  }
  function k(A) {
    const { gen: q, schemaEnv: W, validateName: J, ValidationError: re, opts: fe } = A;
    W.$async ? q.if((0, c._)`${s.default.errors} === 0`, () => q.return(s.default.data), () => q.throw((0, c._)`new ${re}(${s.default.vErrors})`)) : (q.assign((0, c._)`${J}.errors`, s.default.vErrors), fe.unevaluated && F(A), q.return((0, c._)`${s.default.errors} === 0`));
  }
  function F({ gen: A, evaluated: q, props: W, items: J }) {
    W instanceof c.Name && A.assign((0, c._)`${q}.props`, W), J instanceof c.Name && A.assign((0, c._)`${q}.items`, J);
  }
  function X(A, q, W, J) {
    const { gen: re, schema: fe, data: ge, allErrors: Oe, opts: ke, self: Ne } = A, { RULES: Se } = Ne;
    if (fe.$ref && (ke.ignoreKeywordsWithRef || !(0, a.schemaHasRulesButRef)(fe, Se))) {
      re.block(() => I(A, "$ref", Se.all.$ref.definition));
      return;
    }
    ke.jtd || Y(A, q), re.block(() => {
      for (const te of Se.rules)
        S(te);
      S(Se.post);
    });
    function S(te) {
      (0, o.shouldUseGroup)(fe, te) && (te.type ? (re.if((0, n.checkDataType)(te.type, ge, ke.strictNumbers)), B(A, te), q.length === 1 && q[0] === te.type && W && (re.else(), (0, n.reportTypeError)(A)), re.endIf()) : B(A, te), Oe || re.if((0, c._)`${s.default.errors} === ${J || 0}`));
    }
  }
  function B(A, q) {
    const { gen: W, schema: J, opts: { useDefaults: re } } = A;
    re && (0, f.assignDefaults)(A, q.type), W.block(() => {
      for (const fe of q.rules)
        (0, o.shouldUseRule)(J, fe) && I(A, fe.keyword, fe.definition, q.type);
    });
  }
  function Y(A, q) {
    A.schemaEnv.meta || !A.opts.strictTypes || (Z(A, q), A.opts.allowUnionTypes || V(A, q), C(A, A.dataTypes));
  }
  function Z(A, q) {
    if (q.length) {
      if (!A.dataTypes.length) {
        A.dataTypes = q;
        return;
      }
      q.forEach((W) => {
        D(A.dataTypes, W) || O(A, `type "${W}" not allowed by context "${A.dataTypes.join(",")}"`);
      }), R(A, q);
    }
  }
  function V(A, q) {
    q.length > 1 && !(q.length === 2 && q.includes("null")) && O(A, "use allowUnionTypes to allow union type keyword");
  }
  function C(A, q) {
    const W = A.self.RULES.all;
    for (const J in W) {
      const re = W[J];
      if (typeof re == "object" && (0, o.shouldUseRule)(A.schema, re)) {
        const { type: fe } = re.definition;
        fe.length && !fe.some((ge) => U(q, ge)) && O(A, `missing type "${fe.join(",")}" for keyword "${J}"`);
      }
    }
  }
  function U(A, q) {
    return A.includes(q) || q === "number" && A.includes("integer");
  }
  function D(A, q) {
    return A.includes(q) || q === "integer" && A.includes("number");
  }
  function R(A, q) {
    const W = [];
    for (const J of A.dataTypes)
      D(q, J) ? W.push(J) : q.includes("integer") && J === "number" && W.push("integer");
    A.dataTypes = W;
  }
  function O(A, q) {
    const W = A.schemaEnv.baseId + A.errSchemaPath;
    q += ` at "${W}" (strictTypes)`, (0, a.checkStrictMode)(A, q, A.opts.strictTypes);
  }
  class x {
    constructor(q, W, J) {
      if ((0, r.validateKeywordUsage)(q, W, J), this.gen = q.gen, this.allErrors = q.allErrors, this.keyword = J, this.data = q.data, this.schema = q.schema[J], this.$data = W.$data && q.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, a.schemaRefOrVal)(q, this.schema, J, this.$data), this.schemaType = W.schemaType, this.parentSchema = q.schema, this.params = {}, this.it = q, this.def = W, this.$data)
        this.schemaCode = q.gen.const("vSchema", H(this.$data, q));
      else if (this.schemaCode = this.schemaValue, !(0, r.validSchemaType)(this.schema, W.schemaType, W.allowUndefined))
        throw new Error(`${J} value must be ${JSON.stringify(W.schemaType)}`);
      ("code" in W ? W.trackErrors : W.errors !== !1) && (this.errsCount = q.gen.const("_errs", s.default.errors));
    }
    result(q, W, J) {
      this.failResult((0, c.not)(q), W, J);
    }
    failResult(q, W, J) {
      this.gen.if(q), J ? J() : this.error(), W ? (this.gen.else(), W(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(q, W) {
      this.failResult((0, c.not)(q), void 0, W);
    }
    fail(q) {
      if (q === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(q), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(q) {
      if (!this.$data)
        return this.fail(q);
      const { schemaCode: W } = this;
      this.fail((0, c._)`${W} !== undefined && (${(0, c.or)(this.invalid$data(), q)})`);
    }
    error(q, W, J) {
      if (W) {
        this.setParams(W), this._error(q, J), this.setParams({});
        return;
      }
      this._error(q, J);
    }
    _error(q, W) {
      (q ? d.reportExtraError : d.reportError)(this, this.def.error, W);
    }
    $dataError() {
      (0, d.reportError)(this, this.def.$dataError || d.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, d.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(q) {
      this.allErrors || this.gen.if(q);
    }
    setParams(q, W) {
      W ? Object.assign(this.params, q) : this.params = q;
    }
    block$data(q, W, J = c.nil) {
      this.gen.block(() => {
        this.check$data(q, J), W();
      });
    }
    check$data(q = c.nil, W = c.nil) {
      if (!this.$data)
        return;
      const { gen: J, schemaCode: re, schemaType: fe, def: ge } = this;
      J.if((0, c.or)((0, c._)`${re} === undefined`, W)), q !== c.nil && J.assign(q, !0), (fe.length || ge.validateSchema) && (J.elseIf(this.invalid$data()), this.$dataError(), q !== c.nil && J.assign(q, !1)), J.else();
    }
    invalid$data() {
      const { gen: q, schemaCode: W, schemaType: J, def: re, it: fe } = this;
      return (0, c.or)(ge(), Oe());
      function ge() {
        if (J.length) {
          if (!(W instanceof c.Name))
            throw new Error("ajv implementation error");
          const ke = Array.isArray(J) ? J : [J];
          return (0, c._)`${(0, n.checkDataTypes)(ke, W, fe.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function Oe() {
        if (re.validateSchema) {
          const ke = q.scopeValue("validate$data", { ref: re.validateSchema });
          return (0, c._)`!${ke}(${W})`;
        }
        return c.nil;
      }
    }
    subschema(q, W) {
      const J = (0, i.getSubschema)(this.it, q);
      (0, i.extendSubschemaData)(J, this.it, q), (0, i.extendSubschemaMode)(J, q);
      const re = { ...this.it, ...J, items: void 0, props: void 0 };
      return E(re, W), re;
    }
    mergeEvaluated(q, W) {
      const { it: J, gen: re } = this;
      J.opts.unevaluated && (J.props !== !0 && q.props !== void 0 && (J.props = a.mergeEvaluated.props(re, q.props, J.props, W)), J.items !== !0 && q.items !== void 0 && (J.items = a.mergeEvaluated.items(re, q.items, J.items, W)));
    }
    mergeValidEvaluated(q, W) {
      const { it: J, gen: re } = this;
      if (J.opts.unevaluated && (J.props !== !0 || J.items !== !0))
        return re.if(W, () => this.mergeEvaluated(q, c.Name)), !0;
    }
  }
  Gt.KeywordCxt = x;
  function I(A, q, W, J) {
    const re = new x(A, W, q);
    "code" in W ? W.code(re, J) : re.$data && W.validate ? (0, r.funcKeywordCode)(re, W) : "macro" in W ? (0, r.macroKeywordCode)(re, W) : (W.compile || W.validate) && (0, r.funcKeywordCode)(re, W);
  }
  const N = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function H(A, { dataLevel: q, dataNames: W, dataPathArr: J }) {
    let re, fe;
    if (A === "")
      return s.default.rootData;
    if (A[0] === "/") {
      if (!N.test(A))
        throw new Error(`Invalid JSON-pointer: ${A}`);
      re = A, fe = s.default.rootData;
    } else {
      const Ne = Q.exec(A);
      if (!Ne)
        throw new Error(`Invalid JSON-pointer: ${A}`);
      const Se = +Ne[1];
      if (re = Ne[2], re === "#") {
        if (Se >= q)
          throw new Error(ke("property/index", Se));
        return J[q - Se];
      }
      if (Se > q)
        throw new Error(ke("data", Se));
      if (fe = W[q - Se], !re)
        return fe;
    }
    let ge = fe;
    const Oe = re.split("/");
    for (const Ne of Oe)
      Ne && (fe = (0, c._)`${fe}${(0, c.getProperty)((0, a.unescapeJsonPointer)(Ne))}`, ge = (0, c._)`${ge} && ${fe}`);
    return ge;
    function ke(Ne, Se) {
      return `Cannot access ${Ne} ${Se} levels up, current level is ${q}`;
    }
  }
  return Gt.getData = H, Gt;
}
var Hi = {}, Pd;
function Wc() {
  if (Pd) return Hi;
  Pd = 1, Object.defineProperty(Hi, "__esModule", { value: !0 });
  class e extends Error {
    constructor(o) {
      super("validation failed"), this.errors = o, this.ajv = this.validation = !0;
    }
  }
  return Hi.default = e, Hi;
}
var zi = {}, Td;
function us() {
  if (Td) return zi;
  Td = 1, Object.defineProperty(zi, "__esModule", { value: !0 });
  const e = ss();
  class t extends Error {
    constructor(n, f, r, i) {
      super(i || `can't resolve reference ${r} from id ${f}`), this.missingRef = (0, e.resolveUrl)(n, f, r), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(n, this.missingRef));
    }
  }
  return zi.default = t, zi;
}
var vt = {}, Od;
function Yc() {
  if (Od) return vt;
  Od = 1, Object.defineProperty(vt, "__esModule", { value: !0 }), vt.resolveSchema = vt.getCompilingSchema = vt.resolveRef = vt.compileSchema = vt.SchemaEnv = void 0;
  const e = De(), t = Wc(), o = cr(), n = ss(), f = Ue(), r = os();
  class i {
    constructor(y) {
      var p;
      this.refs = {}, this.dynamicAnchors = {};
      let E;
      typeof y.schema == "object" && (E = y.schema), this.schema = y.schema, this.schemaId = y.schemaId, this.root = y.root || this, this.baseId = (p = y.baseId) !== null && p !== void 0 ? p : (0, n.normalizeId)(E?.[y.schemaId || "$id"]), this.schemaPath = y.schemaPath, this.localRefs = y.localRefs, this.meta = y.meta, this.$async = E?.$async, this.refs = {};
    }
  }
  vt.SchemaEnv = i;
  function c(h) {
    const y = a.call(this, h);
    if (y)
      return y;
    const p = (0, n.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: E, lines: b } = this.opts.code, { ownProperties: $ } = this.opts, _ = new e.CodeGen(this.scope, { es5: E, lines: b, ownProperties: $ });
    let w;
    h.$async && (w = _.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const P = _.scopeName("validate");
    h.validateName = P;
    const T = {
      gen: _,
      allErrors: this.opts.allErrors,
      data: o.default.data,
      parentData: o.default.parentData,
      parentDataProperty: o.default.parentDataProperty,
      dataNames: [o.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: _.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, e.stringify)(h.schema) } : { ref: h.schema }),
      validateName: P,
      ValidationError: w,
      schema: h.schema,
      schemaEnv: h,
      rootId: p,
      baseId: h.baseId || p,
      schemaPath: e.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let G;
    try {
      this._compilations.add(h), (0, r.validateFunctionCode)(T), _.optimize(this.opts.code.optimize);
      const L = _.toString();
      G = `${_.scopeRefs(o.default.scope)}return ${L}`, this.opts.code.process && (G = this.opts.code.process(G, h));
      const K = new Function(`${o.default.self}`, `${o.default.scope}`, G)(this, this.scope.get());
      if (this.scope.value(P, { ref: K }), K.errors = null, K.schema = h.schema, K.schemaEnv = h, h.$async && (K.$async = !0), this.opts.code.source === !0 && (K.source = { validateName: P, validateCode: L, scopeValues: _._values }), this.opts.unevaluated) {
        const { props: k, items: F } = T;
        K.evaluated = {
          props: k instanceof e.Name ? void 0 : k,
          items: F instanceof e.Name ? void 0 : F,
          dynamicProps: k instanceof e.Name,
          dynamicItems: F instanceof e.Name
        }, K.source && (K.source.evaluated = (0, e.stringify)(K.evaluated));
      }
      return h.validate = K, h;
    } catch (L) {
      throw delete h.validate, delete h.validateName, G && this.logger.error("Error compiling schema, function code:", G), L;
    } finally {
      this._compilations.delete(h);
    }
  }
  vt.compileSchema = c;
  function s(h, y, p) {
    var E;
    p = (0, n.resolveUrl)(this.opts.uriResolver, y, p);
    const b = h.refs[p];
    if (b)
      return b;
    let $ = l.call(this, h, p);
    if ($ === void 0) {
      const _ = (E = h.localRefs) === null || E === void 0 ? void 0 : E[p], { schemaId: w } = this.opts;
      _ && ($ = new i({ schema: _, schemaId: w, root: h, baseId: y }));
    }
    if ($ !== void 0)
      return h.refs[p] = u.call(this, $);
  }
  vt.resolveRef = s;
  function u(h) {
    return (0, n.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : c.call(this, h);
  }
  function a(h) {
    for (const y of this._compilations)
      if (d(y, h))
        return y;
  }
  vt.getCompilingSchema = a;
  function d(h, y) {
    return h.schema === y.schema && h.root === y.root && h.baseId === y.baseId;
  }
  function l(h, y) {
    let p;
    for (; typeof (p = this.refs[y]) == "string"; )
      y = p;
    return p || this.schemas[y] || m.call(this, h, y);
  }
  function m(h, y) {
    const p = this.opts.uriResolver.parse(y), E = (0, n._getFullPath)(this.opts.uriResolver, p);
    let b = (0, n.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && E === b)
      return v.call(this, p, h);
    const $ = (0, n.normalizeId)(E), _ = this.refs[$] || this.schemas[$];
    if (typeof _ == "string") {
      const w = m.call(this, h, _);
      return typeof w?.schema != "object" ? void 0 : v.call(this, p, w);
    }
    if (typeof _?.schema == "object") {
      if (_.validate || c.call(this, _), $ === (0, n.normalizeId)(y)) {
        const { schema: w } = _, { schemaId: P } = this.opts, T = w[P];
        return T && (b = (0, n.resolveUrl)(this.opts.uriResolver, b, T)), new i({ schema: w, schemaId: P, root: h, baseId: b });
      }
      return v.call(this, p, _);
    }
  }
  vt.resolveSchema = m;
  const g = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function v(h, { baseId: y, schema: p, root: E }) {
    var b;
    if (((b = h.fragment) === null || b === void 0 ? void 0 : b[0]) !== "/")
      return;
    for (const w of h.fragment.slice(1).split("/")) {
      if (typeof p == "boolean")
        return;
      const P = p[(0, f.unescapeFragment)(w)];
      if (P === void 0)
        return;
      p = P;
      const T = typeof p == "object" && p[this.opts.schemaId];
      !g.has(w) && T && (y = (0, n.resolveUrl)(this.opts.uriResolver, y, T));
    }
    let $;
    if (typeof p != "boolean" && p.$ref && !(0, f.schemaHasRulesButRef)(p, this.RULES)) {
      const w = (0, n.resolveUrl)(this.opts.uriResolver, y, p.$ref);
      $ = m.call(this, E, w);
    }
    const { schemaId: _ } = this.opts;
    if ($ = $ || new i({ schema: p, schemaId: _, root: E, baseId: y }), $.schema !== $.root.schema)
      return $;
  }
  return vt;
}
const Tw = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Ow = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Nw = "object", Iw = ["$data"], Aw = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Cw = !1, Dw = {
  $id: Tw,
  description: Ow,
  type: Nw,
  required: Iw,
  properties: Aw,
  additionalProperties: Cw
};
var Ki = {}, Nd;
function kw() {
  if (Nd) return Ki;
  Nd = 1, Object.defineProperty(Ki, "__esModule", { value: !0 });
  const e = k0();
  return e.code = 'require("ajv/dist/runtime/uri").default', Ki.default = e, Ki;
}
var Id;
function qw() {
  return Id || (Id = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = os();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var o = De();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return o._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return o.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return o.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return o.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return o.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return o.CodeGen;
    } });
    const n = Wc(), f = us(), r = M0(), i = Yc(), c = De(), s = ss(), u = Wa(), a = Ue(), d = Dw, l = kw(), m = (V, C) => new RegExp(V, C);
    m.code = "new RegExp";
    const g = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), h = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, y = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, p = 200;
    function E(V) {
      var C, U, D, R, O, x, I, N, Q, H, A, q, W, J, re, fe, ge, Oe, ke, Ne, Se, S, te, ie, pe;
      const ae = V.strict, de = (C = V.code) === null || C === void 0 ? void 0 : C.optimize, le = de === !0 || de === void 0 ? 1 : de || 0, me = (D = (U = V.code) === null || U === void 0 ? void 0 : U.regExp) !== null && D !== void 0 ? D : m, ve = (R = V.uriResolver) !== null && R !== void 0 ? R : l.default;
      return {
        strictSchema: (x = (O = V.strictSchema) !== null && O !== void 0 ? O : ae) !== null && x !== void 0 ? x : !0,
        strictNumbers: (N = (I = V.strictNumbers) !== null && I !== void 0 ? I : ae) !== null && N !== void 0 ? N : !0,
        strictTypes: (H = (Q = V.strictTypes) !== null && Q !== void 0 ? Q : ae) !== null && H !== void 0 ? H : "log",
        strictTuples: (q = (A = V.strictTuples) !== null && A !== void 0 ? A : ae) !== null && q !== void 0 ? q : "log",
        strictRequired: (J = (W = V.strictRequired) !== null && W !== void 0 ? W : ae) !== null && J !== void 0 ? J : !1,
        code: V.code ? { ...V.code, optimize: le, regExp: me } : { optimize: le, regExp: me },
        loopRequired: (re = V.loopRequired) !== null && re !== void 0 ? re : p,
        loopEnum: (fe = V.loopEnum) !== null && fe !== void 0 ? fe : p,
        meta: (ge = V.meta) !== null && ge !== void 0 ? ge : !0,
        messages: (Oe = V.messages) !== null && Oe !== void 0 ? Oe : !0,
        inlineRefs: (ke = V.inlineRefs) !== null && ke !== void 0 ? ke : !0,
        schemaId: (Ne = V.schemaId) !== null && Ne !== void 0 ? Ne : "$id",
        addUsedSchema: (Se = V.addUsedSchema) !== null && Se !== void 0 ? Se : !0,
        validateSchema: (S = V.validateSchema) !== null && S !== void 0 ? S : !0,
        validateFormats: (te = V.validateFormats) !== null && te !== void 0 ? te : !0,
        unicodeRegExp: (ie = V.unicodeRegExp) !== null && ie !== void 0 ? ie : !0,
        int32range: (pe = V.int32range) !== null && pe !== void 0 ? pe : !0,
        uriResolver: ve
      };
    }
    class b {
      constructor(C = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), C = this.opts = { ...C, ...E(C) };
        const { es5: U, lines: D } = this.opts.code;
        this.scope = new c.ValueScope({ scope: {}, prefixes: v, es5: U, lines: D }), this.logger = M(C.logger);
        const R = C.validateFormats;
        C.validateFormats = !1, this.RULES = (0, r.getRules)(), $.call(this, h, C, "NOT SUPPORTED"), $.call(this, y, C, "DEPRECATED", "warn"), this._metaOpts = G.call(this), C.formats && P.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), C.keywords && T.call(this, C.keywords), typeof C.meta == "object" && this.addMetaSchema(C.meta), w.call(this), C.validateFormats = R;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: C, meta: U, schemaId: D } = this.opts;
        let R = d;
        D === "id" && (R = { ...d }, R.id = R.$id, delete R.$id), U && C && this.addMetaSchema(R, R[D], !1);
      }
      defaultMeta() {
        const { meta: C, schemaId: U } = this.opts;
        return this.opts.defaultMeta = typeof C == "object" ? C[U] || C : void 0;
      }
      validate(C, U) {
        let D;
        if (typeof C == "string") {
          if (D = this.getSchema(C), !D)
            throw new Error(`no schema with key or ref "${C}"`);
        } else
          D = this.compile(C);
        const R = D(U);
        return "$async" in D || (this.errors = D.errors), R;
      }
      compile(C, U) {
        const D = this._addSchema(C, U);
        return D.validate || this._compileSchemaEnv(D);
      }
      compileAsync(C, U) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: D } = this.opts;
        return R.call(this, C, U);
        async function R(H, A) {
          await O.call(this, H.$schema);
          const q = this._addSchema(H, A);
          return q.validate || x.call(this, q);
        }
        async function O(H) {
          H && !this.getSchema(H) && await R.call(this, { $ref: H }, !0);
        }
        async function x(H) {
          try {
            return this._compileSchemaEnv(H);
          } catch (A) {
            if (!(A instanceof f.default))
              throw A;
            return I.call(this, A), await N.call(this, A.missingSchema), x.call(this, H);
          }
        }
        function I({ missingSchema: H, missingRef: A }) {
          if (this.refs[H])
            throw new Error(`AnySchema ${H} is loaded but ${A} cannot be resolved`);
        }
        async function N(H) {
          const A = await Q.call(this, H);
          this.refs[H] || await O.call(this, A.$schema), this.refs[H] || this.addSchema(A, H, U);
        }
        async function Q(H) {
          const A = this._loading[H];
          if (A)
            return A;
          try {
            return await (this._loading[H] = D(H));
          } finally {
            delete this._loading[H];
          }
        }
      }
      // Adds schema to the instance
      addSchema(C, U, D, R = this.opts.validateSchema) {
        if (Array.isArray(C)) {
          for (const x of C)
            this.addSchema(x, void 0, D, R);
          return this;
        }
        let O;
        if (typeof C == "object") {
          const { schemaId: x } = this.opts;
          if (O = C[x], O !== void 0 && typeof O != "string")
            throw new Error(`schema ${x} must be string`);
        }
        return U = (0, s.normalizeId)(U || O), this._checkUnique(U), this.schemas[U] = this._addSchema(C, D, U, R, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(C, U, D = this.opts.validateSchema) {
        return this.addSchema(C, U, !0, D), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(C, U) {
        if (typeof C == "boolean")
          return !0;
        let D;
        if (D = C.$schema, D !== void 0 && typeof D != "string")
          throw new Error("$schema must be a string");
        if (D = D || this.opts.defaultMeta || this.defaultMeta(), !D)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const R = this.validate(D, C);
        if (!R && U) {
          const O = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(O);
          else
            throw new Error(O);
        }
        return R;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(C) {
        let U;
        for (; typeof (U = _.call(this, C)) == "string"; )
          C = U;
        if (U === void 0) {
          const { schemaId: D } = this.opts, R = new i.SchemaEnv({ schema: {}, schemaId: D });
          if (U = i.resolveSchema.call(this, R, C), !U)
            return;
          this.refs[C] = U;
        }
        return U.validate || this._compileSchemaEnv(U);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(C) {
        if (C instanceof RegExp)
          return this._removeAllSchemas(this.schemas, C), this._removeAllSchemas(this.refs, C), this;
        switch (typeof C) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const U = _.call(this, C);
            return typeof U == "object" && this._cache.delete(U.schema), delete this.schemas[C], delete this.refs[C], this;
          }
          case "object": {
            const U = C;
            this._cache.delete(U);
            let D = C[this.opts.schemaId];
            return D && (D = (0, s.normalizeId)(D), delete this.schemas[D], delete this.refs[D]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(C) {
        for (const U of C)
          this.addKeyword(U);
        return this;
      }
      addKeyword(C, U) {
        let D;
        if (typeof C == "string")
          D = C, typeof U == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), U.keyword = D);
        else if (typeof C == "object" && U === void 0) {
          if (U = C, D = U.keyword, Array.isArray(D) && !D.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (k.call(this, D, U), !U)
          return (0, a.eachItem)(D, (O) => F.call(this, O)), this;
        B.call(this, U);
        const R = {
          ...U,
          type: (0, u.getJSONTypes)(U.type),
          schemaType: (0, u.getJSONTypes)(U.schemaType)
        };
        return (0, a.eachItem)(D, R.type.length === 0 ? (O) => F.call(this, O, R) : (O) => R.type.forEach((x) => F.call(this, O, R, x))), this;
      }
      getKeyword(C) {
        const U = this.RULES.all[C];
        return typeof U == "object" ? U.definition : !!U;
      }
      // Remove keyword
      removeKeyword(C) {
        const { RULES: U } = this;
        delete U.keywords[C], delete U.all[C];
        for (const D of U.rules) {
          const R = D.rules.findIndex((O) => O.keyword === C);
          R >= 0 && D.rules.splice(R, 1);
        }
        return this;
      }
      // Add format
      addFormat(C, U) {
        return typeof U == "string" && (U = new RegExp(U)), this.formats[C] = U, this;
      }
      errorsText(C = this.errors, { separator: U = ", ", dataVar: D = "data" } = {}) {
        return !C || C.length === 0 ? "No errors" : C.map((R) => `${D}${R.instancePath} ${R.message}`).reduce((R, O) => R + U + O);
      }
      $dataMetaSchema(C, U) {
        const D = this.RULES.all;
        C = JSON.parse(JSON.stringify(C));
        for (const R of U) {
          const O = R.split("/").slice(1);
          let x = C;
          for (const I of O)
            x = x[I];
          for (const I in D) {
            const N = D[I];
            if (typeof N != "object")
              continue;
            const { $data: Q } = N.definition, H = x[I];
            Q && H && (x[I] = Z(H));
          }
        }
        return C;
      }
      _removeAllSchemas(C, U) {
        for (const D in C) {
          const R = C[D];
          (!U || U.test(D)) && (typeof R == "string" ? delete C[D] : R && !R.meta && (this._cache.delete(R.schema), delete C[D]));
        }
      }
      _addSchema(C, U, D, R = this.opts.validateSchema, O = this.opts.addUsedSchema) {
        let x;
        const { schemaId: I } = this.opts;
        if (typeof C == "object")
          x = C[I];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof C != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let N = this._cache.get(C);
        if (N !== void 0)
          return N;
        D = (0, s.normalizeId)(x || D);
        const Q = s.getSchemaRefs.call(this, C, D);
        return N = new i.SchemaEnv({ schema: C, schemaId: I, meta: U, baseId: D, localRefs: Q }), this._cache.set(N.schema, N), O && !D.startsWith("#") && (D && this._checkUnique(D), this.refs[D] = N), R && this.validateSchema(C, !0), N;
      }
      _checkUnique(C) {
        if (this.schemas[C] || this.refs[C])
          throw new Error(`schema with key or id "${C}" already exists`);
      }
      _compileSchemaEnv(C) {
        if (C.meta ? this._compileMetaSchema(C) : i.compileSchema.call(this, C), !C.validate)
          throw new Error("ajv implementation error");
        return C.validate;
      }
      _compileMetaSchema(C) {
        const U = this.opts;
        this.opts = this._metaOpts;
        try {
          i.compileSchema.call(this, C);
        } finally {
          this.opts = U;
        }
      }
    }
    b.ValidationError = n.default, b.MissingRefError = f.default, e.default = b;
    function $(V, C, U, D = "error") {
      for (const R in V) {
        const O = R;
        O in C && this.logger[D](`${U}: option ${R}. ${V[O]}`);
      }
    }
    function _(V) {
      return V = (0, s.normalizeId)(V), this.schemas[V] || this.refs[V];
    }
    function w() {
      const V = this.opts.schemas;
      if (V)
        if (Array.isArray(V))
          this.addSchema(V);
        else
          for (const C in V)
            this.addSchema(V[C], C);
    }
    function P() {
      for (const V in this.opts.formats) {
        const C = this.opts.formats[V];
        C && this.addFormat(V, C);
      }
    }
    function T(V) {
      if (Array.isArray(V)) {
        this.addVocabulary(V);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const C in V) {
        const U = V[C];
        U.keyword || (U.keyword = C), this.addKeyword(U);
      }
    }
    function G() {
      const V = { ...this.opts };
      for (const C of g)
        delete V[C];
      return V;
    }
    const L = { log() {
    }, warn() {
    }, error() {
    } };
    function M(V) {
      if (V === !1)
        return L;
      if (V === void 0)
        return console;
      if (V.log && V.warn && V.error)
        return V;
      throw new Error("logger must implement log, warn and error methods");
    }
    const K = /^[a-z_$][a-z0-9_$:-]*$/i;
    function k(V, C) {
      const { RULES: U } = this;
      if ((0, a.eachItem)(V, (D) => {
        if (U.keywords[D])
          throw new Error(`Keyword ${D} is already defined`);
        if (!K.test(D))
          throw new Error(`Keyword ${D} has invalid name`);
      }), !!C && C.$data && !("code" in C || "validate" in C))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function F(V, C, U) {
      var D;
      const R = C?.post;
      if (U && R)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: O } = this;
      let x = R ? O.post : O.rules.find(({ type: N }) => N === U);
      if (x || (x = { type: U, rules: [] }, O.rules.push(x)), O.keywords[V] = !0, !C)
        return;
      const I = {
        keyword: V,
        definition: {
          ...C,
          type: (0, u.getJSONTypes)(C.type),
          schemaType: (0, u.getJSONTypes)(C.schemaType)
        }
      };
      C.before ? X.call(this, x, I, C.before) : x.rules.push(I), O.all[V] = I, (D = C.implements) === null || D === void 0 || D.forEach((N) => this.addKeyword(N));
    }
    function X(V, C, U) {
      const D = V.rules.findIndex((R) => R.keyword === U);
      D >= 0 ? V.rules.splice(D, 0, C) : (V.rules.push(C), this.logger.warn(`rule ${U} is not defined`));
    }
    function B(V) {
      let { metaSchema: C } = V;
      C !== void 0 && (V.$data && this.opts.$data && (C = Z(C)), V.validateSchema = this.compile(C, !0));
    }
    const Y = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function Z(V) {
      return { anyOf: [V, Y] };
    }
  })(js)), js;
}
var Wi = {}, Yi = {}, Xi = {}, Ad;
function Lw() {
  if (Ad) return Xi;
  Ad = 1, Object.defineProperty(Xi, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Xi.default = e, Xi;
}
var rr = {}, Cd;
function Fw() {
  if (Cd) return rr;
  Cd = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.callRef = rr.getValidate = void 0;
  const e = us(), t = At(), o = De(), n = cr(), f = Yc(), r = Ue(), i = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: a, schema: d, it: l } = u, { baseId: m, schemaEnv: g, validateName: v, opts: h, self: y } = l, { root: p } = g;
      if ((d === "#" || d === "#/") && m === p.baseId)
        return b();
      const E = f.resolveRef.call(y, p, m, d);
      if (E === void 0)
        throw new e.default(l.opts.uriResolver, m, d);
      if (E instanceof f.SchemaEnv)
        return $(E);
      return _(E);
      function b() {
        if (g === p)
          return s(u, v, g, g.$async);
        const w = a.scopeValue("root", { ref: p });
        return s(u, (0, o._)`${w}.validate`, p, p.$async);
      }
      function $(w) {
        const P = c(u, w);
        s(u, P, w, w.$async);
      }
      function _(w) {
        const P = a.scopeValue("schema", h.code.source === !0 ? { ref: w, code: (0, o.stringify)(w) } : { ref: w }), T = a.name("valid"), G = u.subschema({
          schema: w,
          dataTypes: [],
          schemaPath: o.nil,
          topSchemaRef: P,
          errSchemaPath: d
        }, T);
        u.mergeEvaluated(G), u.ok(T);
      }
    }
  };
  function c(u, a) {
    const { gen: d } = u;
    return a.validate ? d.scopeValue("validate", { ref: a.validate }) : (0, o._)`${d.scopeValue("wrapper", { ref: a })}.validate`;
  }
  rr.getValidate = c;
  function s(u, a, d, l) {
    const { gen: m, it: g } = u, { allErrors: v, schemaEnv: h, opts: y } = g, p = y.passContext ? n.default.this : o.nil;
    l ? E() : b();
    function E() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const w = m.let("valid");
      m.try(() => {
        m.code((0, o._)`await ${(0, t.callValidateCode)(u, a, p)}`), _(a), v || m.assign(w, !0);
      }, (P) => {
        m.if((0, o._)`!(${P} instanceof ${g.ValidationError})`, () => m.throw(P)), $(P), v || m.assign(w, !1);
      }), u.ok(w);
    }
    function b() {
      u.result((0, t.callValidateCode)(u, a, p), () => _(a), () => $(a));
    }
    function $(w) {
      const P = (0, o._)`${w}.errors`;
      m.assign(n.default.vErrors, (0, o._)`${n.default.vErrors} === null ? ${P} : ${n.default.vErrors}.concat(${P})`), m.assign(n.default.errors, (0, o._)`${n.default.vErrors}.length`);
    }
    function _(w) {
      var P;
      if (!g.opts.unevaluated)
        return;
      const T = (P = d?.validate) === null || P === void 0 ? void 0 : P.evaluated;
      if (g.props !== !0)
        if (T && !T.dynamicProps)
          T.props !== void 0 && (g.props = r.mergeEvaluated.props(m, T.props, g.props));
        else {
          const G = m.var("props", (0, o._)`${w}.evaluated.props`);
          g.props = r.mergeEvaluated.props(m, G, g.props, o.Name);
        }
      if (g.items !== !0)
        if (T && !T.dynamicItems)
          T.items !== void 0 && (g.items = r.mergeEvaluated.items(m, T.items, g.items));
        else {
          const G = m.var("items", (0, o._)`${w}.evaluated.items`);
          g.items = r.mergeEvaluated.items(m, G, g.items, o.Name);
        }
    }
  }
  return rr.callRef = s, rr.default = i, rr;
}
var Dd;
function jw() {
  if (Dd) return Yi;
  Dd = 1, Object.defineProperty(Yi, "__esModule", { value: !0 });
  const e = Lw(), t = Fw(), o = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return Yi.default = o, Yi;
}
var Ji = {}, Qi = {}, kd;
function Uw() {
  if (kd) return Qi;
  kd = 1, Object.defineProperty(Qi, "__esModule", { value: !0 });
  const e = De(), t = e.operators, o = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, n = {
    message: ({ keyword: r, schemaCode: i }) => (0, e.str)`must be ${o[r].okStr} ${i}`,
    params: ({ keyword: r, schemaCode: i }) => (0, e._)`{comparison: ${o[r].okStr}, limit: ${i}}`
  }, f = {
    keyword: Object.keys(o),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: n,
    code(r) {
      const { keyword: i, data: c, schemaCode: s } = r;
      r.fail$data((0, e._)`${c} ${o[i].fail} ${s} || isNaN(${c})`);
    }
  };
  return Qi.default = f, Qi;
}
var Zi = {}, qd;
function Mw() {
  if (qd) return Zi;
  qd = 1, Object.defineProperty(Zi, "__esModule", { value: !0 });
  const e = De(), o = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must be multiple of ${n}`,
      params: ({ schemaCode: n }) => (0, e._)`{multipleOf: ${n}}`
    },
    code(n) {
      const { gen: f, data: r, schemaCode: i, it: c } = n, s = c.opts.multipleOfPrecision, u = f.let("res"), a = s ? (0, e._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${s}` : (0, e._)`${u} !== parseInt(${u})`;
      n.fail$data((0, e._)`(${i} === 0 || (${u} = ${r}/${i}, ${a}))`);
    }
  };
  return Zi.default = o, Zi;
}
var ea = {}, ta = {}, Ld;
function xw() {
  if (Ld) return ta;
  Ld = 1, Object.defineProperty(ta, "__esModule", { value: !0 });
  function e(t) {
    const o = t.length;
    let n = 0, f = 0, r;
    for (; f < o; )
      n++, r = t.charCodeAt(f++), r >= 55296 && r <= 56319 && f < o && (r = t.charCodeAt(f), (r & 64512) === 56320 && f++);
    return n;
  }
  return ta.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', ta;
}
var Fd;
function Vw() {
  if (Fd) return ea;
  Fd = 1, Object.defineProperty(ea, "__esModule", { value: !0 });
  const e = De(), t = Ue(), o = xw(), f = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: i }) {
        const c = r === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${c} than ${i} characters`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: i, data: c, schemaCode: s, it: u } = r, a = i === "maxLength" ? e.operators.GT : e.operators.LT, d = u.opts.unicode === !1 ? (0, e._)`${c}.length` : (0, e._)`${(0, t.useFunc)(r.gen, o.default)}(${c})`;
      r.fail$data((0, e._)`${d} ${a} ${s}`);
    }
  };
  return ea.default = f, ea;
}
var ra = {}, jd;
function Gw() {
  if (jd) return ra;
  jd = 1, Object.defineProperty(ra, "__esModule", { value: !0 });
  const e = At(), t = De(), n = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: f }) => (0, t.str)`must match pattern "${f}"`,
      params: ({ schemaCode: f }) => (0, t._)`{pattern: ${f}}`
    },
    code(f) {
      const { data: r, $data: i, schema: c, schemaCode: s, it: u } = f, a = u.opts.unicodeRegExp ? "u" : "", d = i ? (0, t._)`(new RegExp(${s}, ${a}))` : (0, e.usePattern)(f, c);
      f.fail$data((0, t._)`!${d}.test(${r})`);
    }
  };
  return ra.default = n, ra;
}
var na = {}, Ud;
function Bw() {
  if (Ud) return na;
  Ud = 1, Object.defineProperty(na, "__esModule", { value: !0 });
  const e = De(), o = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: f }) {
        const r = n === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${f} properties`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: f, data: r, schemaCode: i } = n, c = f === "maxProperties" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`Object.keys(${r}).length ${c} ${i}`);
    }
  };
  return na.default = o, na;
}
var ia = {}, Md;
function Hw() {
  if (Md) return ia;
  Md = 1, Object.defineProperty(ia, "__esModule", { value: !0 });
  const e = At(), t = De(), o = Ue(), f = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: r } }) => (0, t.str)`must have required property '${r}'`,
      params: ({ params: { missingProperty: r } }) => (0, t._)`{missingProperty: ${r}}`
    },
    code(r) {
      const { gen: i, schema: c, schemaCode: s, data: u, $data: a, it: d } = r, { opts: l } = d;
      if (!a && c.length === 0)
        return;
      const m = c.length >= l.loopRequired;
      if (d.allErrors ? g() : v(), l.strictRequired) {
        const p = r.parentSchema.properties, { definedProperties: E } = r.it;
        for (const b of c)
          if (p?.[b] === void 0 && !E.has(b)) {
            const $ = d.schemaEnv.baseId + d.errSchemaPath, _ = `required property "${b}" is not defined at "${$}" (strictRequired)`;
            (0, o.checkStrictMode)(d, _, d.opts.strictRequired);
          }
      }
      function g() {
        if (m || a)
          r.block$data(t.nil, h);
        else
          for (const p of c)
            (0, e.checkReportMissingProp)(r, p);
      }
      function v() {
        const p = i.let("missing");
        if (m || a) {
          const E = i.let("valid", !0);
          r.block$data(E, () => y(p, E)), r.ok(E);
        } else
          i.if((0, e.checkMissingProp)(r, c, p)), (0, e.reportMissingProp)(r, p), i.else();
      }
      function h() {
        i.forOf("prop", s, (p) => {
          r.setParams({ missingProperty: p }), i.if((0, e.noPropertyInData)(i, u, p, l.ownProperties), () => r.error());
        });
      }
      function y(p, E) {
        r.setParams({ missingProperty: p }), i.forOf(p, s, () => {
          i.assign(E, (0, e.propertyInData)(i, u, p, l.ownProperties)), i.if((0, t.not)(E), () => {
            r.error(), i.break();
          });
        }, t.nil);
      }
    }
  };
  return ia.default = f, ia;
}
var aa = {}, xd;
function zw() {
  if (xd) return aa;
  xd = 1, Object.defineProperty(aa, "__esModule", { value: !0 });
  const e = De(), o = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: f }) {
        const r = n === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${f} items`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: f, data: r, schemaCode: i } = n, c = f === "maxItems" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`${r}.length ${c} ${i}`);
    }
  };
  return aa.default = o, aa;
}
var sa = {}, oa = {}, Vd;
function Xc() {
  if (Vd) return oa;
  Vd = 1, Object.defineProperty(oa, "__esModule", { value: !0 });
  const e = es();
  return e.code = 'require("ajv/dist/runtime/equal").default', oa.default = e, oa;
}
var Gd;
function Kw() {
  if (Gd) return sa;
  Gd = 1, Object.defineProperty(sa, "__esModule", { value: !0 });
  const e = Wa(), t = De(), o = Ue(), n = Xc(), r = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i, j: c } }) => (0, t.str)`must NOT have duplicate items (items ## ${c} and ${i} are identical)`,
      params: ({ params: { i, j: c } }) => (0, t._)`{i: ${i}, j: ${c}}`
    },
    code(i) {
      const { gen: c, data: s, $data: u, schema: a, parentSchema: d, schemaCode: l, it: m } = i;
      if (!u && !a)
        return;
      const g = c.let("valid"), v = d.items ? (0, e.getSchemaTypes)(d.items) : [];
      i.block$data(g, h, (0, t._)`${l} === false`), i.ok(g);
      function h() {
        const b = c.let("i", (0, t._)`${s}.length`), $ = c.let("j");
        i.setParams({ i: b, j: $ }), c.assign(g, !0), c.if((0, t._)`${b} > 1`, () => (y() ? p : E)(b, $));
      }
      function y() {
        return v.length > 0 && !v.some((b) => b === "object" || b === "array");
      }
      function p(b, $) {
        const _ = c.name("item"), w = (0, e.checkDataTypes)(v, _, m.opts.strictNumbers, e.DataType.Wrong), P = c.const("indices", (0, t._)`{}`);
        c.for((0, t._)`;${b}--;`, () => {
          c.let(_, (0, t._)`${s}[${b}]`), c.if(w, (0, t._)`continue`), v.length > 1 && c.if((0, t._)`typeof ${_} == "string"`, (0, t._)`${_} += "_"`), c.if((0, t._)`typeof ${P}[${_}] == "number"`, () => {
            c.assign($, (0, t._)`${P}[${_}]`), i.error(), c.assign(g, !1).break();
          }).code((0, t._)`${P}[${_}] = ${b}`);
        });
      }
      function E(b, $) {
        const _ = (0, o.useFunc)(c, n.default), w = c.name("outer");
        c.label(w).for((0, t._)`;${b}--;`, () => c.for((0, t._)`${$} = ${b}; ${$}--;`, () => c.if((0, t._)`${_}(${s}[${b}], ${s}[${$}])`, () => {
          i.error(), c.assign(g, !1).break(w);
        })));
      }
    }
  };
  return sa.default = r, sa;
}
var ua = {}, Bd;
function Ww() {
  if (Bd) return ua;
  Bd = 1, Object.defineProperty(ua, "__esModule", { value: !0 });
  const e = De(), t = Ue(), o = Xc(), f = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValue: ${r}}`
    },
    code(r) {
      const { gen: i, data: c, $data: s, schemaCode: u, schema: a } = r;
      s || a && typeof a == "object" ? r.fail$data((0, e._)`!${(0, t.useFunc)(i, o.default)}(${c}, ${u})`) : r.fail((0, e._)`${a} !== ${c}`);
    }
  };
  return ua.default = f, ua;
}
var ca = {}, Hd;
function Yw() {
  if (Hd) return ca;
  Hd = 1, Object.defineProperty(ca, "__esModule", { value: !0 });
  const e = De(), t = Ue(), o = Xc(), f = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValues: ${r}}`
    },
    code(r) {
      const { gen: i, data: c, $data: s, schema: u, schemaCode: a, it: d } = r;
      if (!s && u.length === 0)
        throw new Error("enum must have non-empty array");
      const l = u.length >= d.opts.loopEnum;
      let m;
      const g = () => m ?? (m = (0, t.useFunc)(i, o.default));
      let v;
      if (l || s)
        v = i.let("valid"), r.block$data(v, h);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const p = i.const("vSchema", a);
        v = (0, e.or)(...u.map((E, b) => y(p, b)));
      }
      r.pass(v);
      function h() {
        i.assign(v, !1), i.forOf("v", a, (p) => i.if((0, e._)`${g()}(${c}, ${p})`, () => i.assign(v, !0).break()));
      }
      function y(p, E) {
        const b = u[E];
        return typeof b == "object" && b !== null ? (0, e._)`${g()}(${c}, ${p}[${E}])` : (0, e._)`${c} === ${b}`;
      }
    }
  };
  return ca.default = f, ca;
}
var zd;
function Xw() {
  if (zd) return Ji;
  zd = 1, Object.defineProperty(Ji, "__esModule", { value: !0 });
  const e = Uw(), t = Mw(), o = Vw(), n = Gw(), f = Bw(), r = Hw(), i = zw(), c = Kw(), s = Ww(), u = Yw(), a = [
    // number
    e.default,
    t.default,
    // string
    o.default,
    n.default,
    // object
    f.default,
    r.default,
    // array
    i.default,
    c.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    s.default,
    u.default
  ];
  return Ji.default = a, Ji;
}
var la = {}, Ur = {}, Kd;
function V0() {
  if (Kd) return Ur;
  Kd = 1, Object.defineProperty(Ur, "__esModule", { value: !0 }), Ur.validateAdditionalItems = void 0;
  const e = De(), t = Ue(), n = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: r } }) => (0, e.str)`must NOT have more than ${r} items`,
      params: ({ params: { len: r } }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { parentSchema: i, it: c } = r, { items: s } = i;
      if (!Array.isArray(s)) {
        (0, t.checkStrictMode)(c, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      f(r, s);
    }
  };
  function f(r, i) {
    const { gen: c, schema: s, data: u, keyword: a, it: d } = r;
    d.items = !0;
    const l = c.const("len", (0, e._)`${u}.length`);
    if (s === !1)
      r.setParams({ len: i.length }), r.pass((0, e._)`${l} <= ${i.length}`);
    else if (typeof s == "object" && !(0, t.alwaysValidSchema)(d, s)) {
      const g = c.var("valid", (0, e._)`${l} <= ${i.length}`);
      c.if((0, e.not)(g), () => m(g)), r.ok(g);
    }
    function m(g) {
      c.forRange("i", i.length, l, (v) => {
        r.subschema({ keyword: a, dataProp: v, dataPropType: t.Type.Num }, g), d.allErrors || c.if((0, e.not)(g), () => c.break());
      });
    }
  }
  return Ur.validateAdditionalItems = f, Ur.default = n, Ur;
}
var fa = {}, Mr = {}, Wd;
function G0() {
  if (Wd) return Mr;
  Wd = 1, Object.defineProperty(Mr, "__esModule", { value: !0 }), Mr.validateTuple = void 0;
  const e = De(), t = Ue(), o = At(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(r) {
      const { schema: i, it: c } = r;
      if (Array.isArray(i))
        return f(r, "additionalItems", i);
      c.items = !0, !(0, t.alwaysValidSchema)(c, i) && r.ok((0, o.validateArray)(r));
    }
  };
  function f(r, i, c = r.schema) {
    const { gen: s, parentSchema: u, data: a, keyword: d, it: l } = r;
    v(u), l.opts.unevaluated && c.length && l.items !== !0 && (l.items = t.mergeEvaluated.items(s, c.length, l.items));
    const m = s.name("valid"), g = s.const("len", (0, e._)`${a}.length`);
    c.forEach((h, y) => {
      (0, t.alwaysValidSchema)(l, h) || (s.if((0, e._)`${g} > ${y}`, () => r.subschema({
        keyword: d,
        schemaProp: y,
        dataProp: y
      }, m)), r.ok(m));
    });
    function v(h) {
      const { opts: y, errSchemaPath: p } = l, E = c.length, b = E === h.minItems && (E === h.maxItems || h[i] === !1);
      if (y.strictTuples && !b) {
        const $ = `"${d}" is ${E}-tuple, but minItems or maxItems/${i} are not specified or different at path "${p}"`;
        (0, t.checkStrictMode)(l, $, y.strictTuples);
      }
    }
  }
  return Mr.validateTuple = f, Mr.default = n, Mr;
}
var Yd;
function Jw() {
  if (Yd) return fa;
  Yd = 1, Object.defineProperty(fa, "__esModule", { value: !0 });
  const e = G0(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (o) => (0, e.validateTuple)(o, "items")
  };
  return fa.default = t, fa;
}
var da = {}, Xd;
function Qw() {
  if (Xd) return da;
  Xd = 1, Object.defineProperty(da, "__esModule", { value: !0 });
  const e = De(), t = Ue(), o = At(), n = V0(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, e.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { schema: c, parentSchema: s, it: u } = i, { prefixItems: a } = s;
      u.items = !0, !(0, t.alwaysValidSchema)(u, c) && (a ? (0, n.validateAdditionalItems)(i, a) : i.ok((0, o.validateArray)(i)));
    }
  };
  return da.default = r, da;
}
var ha = {}, Jd;
function Zw() {
  if (Jd) return ha;
  Jd = 1, Object.defineProperty(ha, "__esModule", { value: !0 });
  const e = De(), t = Ue(), n = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: f, max: r } }) => r === void 0 ? (0, e.str)`must contain at least ${f} valid item(s)` : (0, e.str)`must contain at least ${f} and no more than ${r} valid item(s)`,
      params: ({ params: { min: f, max: r } }) => r === void 0 ? (0, e._)`{minContains: ${f}}` : (0, e._)`{minContains: ${f}, maxContains: ${r}}`
    },
    code(f) {
      const { gen: r, schema: i, parentSchema: c, data: s, it: u } = f;
      let a, d;
      const { minContains: l, maxContains: m } = c;
      u.opts.next ? (a = l === void 0 ? 1 : l, d = m) : a = 1;
      const g = r.const("len", (0, e._)`${s}.length`);
      if (f.setParams({ min: a, max: d }), d === void 0 && a === 0) {
        (0, t.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (d !== void 0 && a > d) {
        (0, t.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), f.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(u, i)) {
        let E = (0, e._)`${g} >= ${a}`;
        d !== void 0 && (E = (0, e._)`${E} && ${g} <= ${d}`), f.pass(E);
        return;
      }
      u.items = !0;
      const v = r.name("valid");
      d === void 0 && a === 1 ? y(v, () => r.if(v, () => r.break())) : a === 0 ? (r.let(v, !0), d !== void 0 && r.if((0, e._)`${s}.length > 0`, h)) : (r.let(v, !1), h()), f.result(v, () => f.reset());
      function h() {
        const E = r.name("_valid"), b = r.let("count", 0);
        y(E, () => r.if(E, () => p(b)));
      }
      function y(E, b) {
        r.forRange("i", 0, g, ($) => {
          f.subschema({
            keyword: "contains",
            dataProp: $,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, E), b();
        });
      }
      function p(E) {
        r.code((0, e._)`${E}++`), d === void 0 ? r.if((0, e._)`${E} >= ${a}`, () => r.assign(v, !0).break()) : (r.if((0, e._)`${E} > ${d}`, () => r.assign(v, !1).break()), a === 1 ? r.assign(v, !0) : r.if((0, e._)`${E} >= ${a}`, () => r.assign(v, !0)));
      }
    }
  };
  return ha.default = n, ha;
}
var Bs = {}, Qd;
function e$() {
  return Qd || (Qd = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = De(), o = Ue(), n = At();
    e.error = {
      message: ({ params: { property: s, depsCount: u, deps: a } }) => {
        const d = u === 1 ? "property" : "properties";
        return (0, t.str)`must have ${d} ${a} when property ${s} is present`;
      },
      params: ({ params: { property: s, depsCount: u, deps: a, missingProperty: d } }) => (0, t._)`{property: ${s},
    missingProperty: ${d},
    depsCount: ${u},
    deps: ${a}}`
      // TODO change to reference
    };
    const f = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(s) {
        const [u, a] = r(s);
        i(s, u), c(s, a);
      }
    };
    function r({ schema: s }) {
      const u = {}, a = {};
      for (const d in s) {
        if (d === "__proto__")
          continue;
        const l = Array.isArray(s[d]) ? u : a;
        l[d] = s[d];
      }
      return [u, a];
    }
    function i(s, u = s.schema) {
      const { gen: a, data: d, it: l } = s;
      if (Object.keys(u).length === 0)
        return;
      const m = a.let("missing");
      for (const g in u) {
        const v = u[g];
        if (v.length === 0)
          continue;
        const h = (0, n.propertyInData)(a, d, g, l.opts.ownProperties);
        s.setParams({
          property: g,
          depsCount: v.length,
          deps: v.join(", ")
        }), l.allErrors ? a.if(h, () => {
          for (const y of v)
            (0, n.checkReportMissingProp)(s, y);
        }) : (a.if((0, t._)`${h} && (${(0, n.checkMissingProp)(s, v, m)})`), (0, n.reportMissingProp)(s, m), a.else());
      }
    }
    e.validatePropertyDeps = i;
    function c(s, u = s.schema) {
      const { gen: a, data: d, keyword: l, it: m } = s, g = a.name("valid");
      for (const v in u)
        (0, o.alwaysValidSchema)(m, u[v]) || (a.if(
          (0, n.propertyInData)(a, d, v, m.opts.ownProperties),
          () => {
            const h = s.subschema({ keyword: l, schemaProp: v }, g);
            s.mergeValidEvaluated(h, g);
          },
          () => a.var(g, !0)
          // TODO var
        ), s.ok(g));
    }
    e.validateSchemaDeps = c, e.default = f;
  })(Bs)), Bs;
}
var pa = {}, Zd;
function t$() {
  if (Zd) return pa;
  Zd = 1, Object.defineProperty(pa, "__esModule", { value: !0 });
  const e = De(), t = Ue(), n = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: f }) => (0, e._)`{propertyName: ${f.propertyName}}`
    },
    code(f) {
      const { gen: r, schema: i, data: c, it: s } = f;
      if ((0, t.alwaysValidSchema)(s, i))
        return;
      const u = r.name("valid");
      r.forIn("key", c, (a) => {
        f.setParams({ propertyName: a }), f.subschema({
          keyword: "propertyNames",
          data: a,
          dataTypes: ["string"],
          propertyName: a,
          compositeRule: !0
        }, u), r.if((0, e.not)(u), () => {
          f.error(!0), s.allErrors || r.break();
        });
      }), f.ok(u);
    }
  };
  return pa.default = n, pa;
}
var ma = {}, eh;
function B0() {
  if (eh) return ma;
  eh = 1, Object.defineProperty(ma, "__esModule", { value: !0 });
  const e = At(), t = De(), o = cr(), n = Ue(), r = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: i }) => (0, t._)`{additionalProperty: ${i.additionalProperty}}`
    },
    code(i) {
      const { gen: c, schema: s, parentSchema: u, data: a, errsCount: d, it: l } = i;
      if (!d)
        throw new Error("ajv implementation error");
      const { allErrors: m, opts: g } = l;
      if (l.props = !0, g.removeAdditional !== "all" && (0, n.alwaysValidSchema)(l, s))
        return;
      const v = (0, e.allSchemaProperties)(u.properties), h = (0, e.allSchemaProperties)(u.patternProperties);
      y(), i.ok((0, t._)`${d} === ${o.default.errors}`);
      function y() {
        c.forIn("key", a, (_) => {
          !v.length && !h.length ? b(_) : c.if(p(_), () => b(_));
        });
      }
      function p(_) {
        let w;
        if (v.length > 8) {
          const P = (0, n.schemaRefOrVal)(l, u.properties, "properties");
          w = (0, e.isOwnProperty)(c, P, _);
        } else v.length ? w = (0, t.or)(...v.map((P) => (0, t._)`${_} === ${P}`)) : w = t.nil;
        return h.length && (w = (0, t.or)(w, ...h.map((P) => (0, t._)`${(0, e.usePattern)(i, P)}.test(${_})`))), (0, t.not)(w);
      }
      function E(_) {
        c.code((0, t._)`delete ${a}[${_}]`);
      }
      function b(_) {
        if (g.removeAdditional === "all" || g.removeAdditional && s === !1) {
          E(_);
          return;
        }
        if (s === !1) {
          i.setParams({ additionalProperty: _ }), i.error(), m || c.break();
          return;
        }
        if (typeof s == "object" && !(0, n.alwaysValidSchema)(l, s)) {
          const w = c.name("valid");
          g.removeAdditional === "failing" ? ($(_, w, !1), c.if((0, t.not)(w), () => {
            i.reset(), E(_);
          })) : ($(_, w), m || c.if((0, t.not)(w), () => c.break()));
        }
      }
      function $(_, w, P) {
        const T = {
          keyword: "additionalProperties",
          dataProp: _,
          dataPropType: n.Type.Str
        };
        P === !1 && Object.assign(T, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), i.subschema(T, w);
      }
    }
  };
  return ma.default = r, ma;
}
var ya = {}, th;
function r$() {
  if (th) return ya;
  th = 1, Object.defineProperty(ya, "__esModule", { value: !0 });
  const e = os(), t = At(), o = Ue(), n = B0(), f = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: i, schema: c, parentSchema: s, data: u, it: a } = r;
      a.opts.removeAdditional === "all" && s.additionalProperties === void 0 && n.default.code(new e.KeywordCxt(a, n.default, "additionalProperties"));
      const d = (0, t.allSchemaProperties)(c);
      for (const h of d)
        a.definedProperties.add(h);
      a.opts.unevaluated && d.length && a.props !== !0 && (a.props = o.mergeEvaluated.props(i, (0, o.toHash)(d), a.props));
      const l = d.filter((h) => !(0, o.alwaysValidSchema)(a, c[h]));
      if (l.length === 0)
        return;
      const m = i.name("valid");
      for (const h of l)
        g(h) ? v(h) : (i.if((0, t.propertyInData)(i, u, h, a.opts.ownProperties)), v(h), a.allErrors || i.else().var(m, !0), i.endIf()), r.it.definedProperties.add(h), r.ok(m);
      function g(h) {
        return a.opts.useDefaults && !a.compositeRule && c[h].default !== void 0;
      }
      function v(h) {
        r.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, m);
      }
    }
  };
  return ya.default = f, ya;
}
var ga = {}, rh;
function n$() {
  if (rh) return ga;
  rh = 1, Object.defineProperty(ga, "__esModule", { value: !0 });
  const e = At(), t = De(), o = Ue(), n = Ue(), f = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: i, schema: c, data: s, parentSchema: u, it: a } = r, { opts: d } = a, l = (0, e.allSchemaProperties)(c), m = l.filter((b) => (0, o.alwaysValidSchema)(a, c[b]));
      if (l.length === 0 || m.length === l.length && (!a.opts.unevaluated || a.props === !0))
        return;
      const g = d.strictSchema && !d.allowMatchingProperties && u.properties, v = i.name("valid");
      a.props !== !0 && !(a.props instanceof t.Name) && (a.props = (0, n.evaluatedPropsToName)(i, a.props));
      const { props: h } = a;
      y();
      function y() {
        for (const b of l)
          g && p(b), a.allErrors ? E(b) : (i.var(v, !0), E(b), i.if(v));
      }
      function p(b) {
        for (const $ in g)
          new RegExp(b).test($) && (0, o.checkStrictMode)(a, `property ${$} matches pattern ${b} (use allowMatchingProperties)`);
      }
      function E(b) {
        i.forIn("key", s, ($) => {
          i.if((0, t._)`${(0, e.usePattern)(r, b)}.test(${$})`, () => {
            const _ = m.includes(b);
            _ || r.subschema({
              keyword: "patternProperties",
              schemaProp: b,
              dataProp: $,
              dataPropType: n.Type.Str
            }, v), a.opts.unevaluated && h !== !0 ? i.assign((0, t._)`${h}[${$}]`, !0) : !_ && !a.allErrors && i.if((0, t.not)(v), () => i.break());
          });
        });
      }
    }
  };
  return ga.default = f, ga;
}
var va = {}, nh;
function i$() {
  if (nh) return va;
  nh = 1, Object.defineProperty(va, "__esModule", { value: !0 });
  const e = Ue(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(o) {
      const { gen: n, schema: f, it: r } = o;
      if ((0, e.alwaysValidSchema)(r, f)) {
        o.fail();
        return;
      }
      const i = n.name("valid");
      o.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i), o.failResult(i, () => o.reset(), () => o.error());
    },
    error: { message: "must NOT be valid" }
  };
  return va.default = t, va;
}
var _a = {}, ih;
function a$() {
  if (ih) return _a;
  ih = 1, Object.defineProperty(_a, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: At().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return _a.default = t, _a;
}
var Ea = {}, ah;
function s$() {
  if (ah) return Ea;
  ah = 1, Object.defineProperty(Ea, "__esModule", { value: !0 });
  const e = De(), t = Ue(), n = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: f }) => (0, e._)`{passingSchemas: ${f.passing}}`
    },
    code(f) {
      const { gen: r, schema: i, parentSchema: c, it: s } = f;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      if (s.opts.discriminator && c.discriminator)
        return;
      const u = i, a = r.let("valid", !1), d = r.let("passing", null), l = r.name("_valid");
      f.setParams({ passing: d }), r.block(m), f.result(a, () => f.reset(), () => f.error(!0));
      function m() {
        u.forEach((g, v) => {
          let h;
          (0, t.alwaysValidSchema)(s, g) ? r.var(l, !0) : h = f.subschema({
            keyword: "oneOf",
            schemaProp: v,
            compositeRule: !0
          }, l), v > 0 && r.if((0, e._)`${l} && ${a}`).assign(a, !1).assign(d, (0, e._)`[${d}, ${v}]`).else(), r.if(l, () => {
            r.assign(a, !0), r.assign(d, v), h && f.mergeEvaluated(h, e.Name);
          });
        });
      }
    }
  };
  return Ea.default = n, Ea;
}
var wa = {}, sh;
function o$() {
  if (sh) return wa;
  sh = 1, Object.defineProperty(wa, "__esModule", { value: !0 });
  const e = Ue(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(o) {
      const { gen: n, schema: f, it: r } = o;
      if (!Array.isArray(f))
        throw new Error("ajv implementation error");
      const i = n.name("valid");
      f.forEach((c, s) => {
        if ((0, e.alwaysValidSchema)(r, c))
          return;
        const u = o.subschema({ keyword: "allOf", schemaProp: s }, i);
        o.ok(i), o.mergeEvaluated(u);
      });
    }
  };
  return wa.default = t, wa;
}
var $a = {}, oh;
function u$() {
  if (oh) return $a;
  oh = 1, Object.defineProperty($a, "__esModule", { value: !0 });
  const e = De(), t = Ue(), n = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: r }) => (0, e.str)`must match "${r.ifClause}" schema`,
      params: ({ params: r }) => (0, e._)`{failingKeyword: ${r.ifClause}}`
    },
    code(r) {
      const { gen: i, parentSchema: c, it: s } = r;
      c.then === void 0 && c.else === void 0 && (0, t.checkStrictMode)(s, '"if" without "then" and "else" is ignored');
      const u = f(s, "then"), a = f(s, "else");
      if (!u && !a)
        return;
      const d = i.let("valid", !0), l = i.name("_valid");
      if (m(), r.reset(), u && a) {
        const v = i.let("ifClause");
        r.setParams({ ifClause: v }), i.if(l, g("then", v), g("else", v));
      } else u ? i.if(l, g("then")) : i.if((0, e.not)(l), g("else"));
      r.pass(d, () => r.error(!0));
      function m() {
        const v = r.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, l);
        r.mergeEvaluated(v);
      }
      function g(v, h) {
        return () => {
          const y = r.subschema({ keyword: v }, l);
          i.assign(d, l), r.mergeValidEvaluated(y, d), h ? i.assign(h, (0, e._)`${v}`) : r.setParams({ ifClause: v });
        };
      }
    }
  };
  function f(r, i) {
    const c = r.schema[i];
    return c !== void 0 && !(0, t.alwaysValidSchema)(r, c);
  }
  return $a.default = n, $a;
}
var Sa = {}, uh;
function c$() {
  if (uh) return Sa;
  uh = 1, Object.defineProperty(Sa, "__esModule", { value: !0 });
  const e = Ue(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: o, parentSchema: n, it: f }) {
      n.if === void 0 && (0, e.checkStrictMode)(f, `"${o}" without "if" is ignored`);
    }
  };
  return Sa.default = t, Sa;
}
var ch;
function l$() {
  if (ch) return la;
  ch = 1, Object.defineProperty(la, "__esModule", { value: !0 });
  const e = V0(), t = Jw(), o = G0(), n = Qw(), f = Zw(), r = e$(), i = t$(), c = B0(), s = r$(), u = n$(), a = i$(), d = a$(), l = s$(), m = o$(), g = u$(), v = c$();
  function h(y = !1) {
    const p = [
      // any
      a.default,
      d.default,
      l.default,
      m.default,
      g.default,
      v.default,
      // object
      i.default,
      c.default,
      r.default,
      s.default,
      u.default
    ];
    return y ? p.push(t.default, n.default) : p.push(e.default, o.default), p.push(f.default), p;
  }
  return la.default = h, la;
}
var ba = {}, Ra = {}, lh;
function f$() {
  if (lh) return Ra;
  lh = 1, Object.defineProperty(Ra, "__esModule", { value: !0 });
  const e = De(), o = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match format "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{format: ${n}}`
    },
    code(n, f) {
      const { gen: r, data: i, $data: c, schema: s, schemaCode: u, it: a } = n, { opts: d, errSchemaPath: l, schemaEnv: m, self: g } = a;
      if (!d.validateFormats)
        return;
      c ? v() : h();
      function v() {
        const y = r.scopeValue("formats", {
          ref: g.formats,
          code: d.code.formats
        }), p = r.const("fDef", (0, e._)`${y}[${u}]`), E = r.let("fType"), b = r.let("format");
        r.if((0, e._)`typeof ${p} == "object" && !(${p} instanceof RegExp)`, () => r.assign(E, (0, e._)`${p}.type || "string"`).assign(b, (0, e._)`${p}.validate`), () => r.assign(E, (0, e._)`"string"`).assign(b, p)), n.fail$data((0, e.or)($(), _()));
        function $() {
          return d.strictSchema === !1 ? e.nil : (0, e._)`${u} && !${b}`;
        }
        function _() {
          const w = m.$async ? (0, e._)`(${p}.async ? await ${b}(${i}) : ${b}(${i}))` : (0, e._)`${b}(${i})`, P = (0, e._)`(typeof ${b} == "function" ? ${w} : ${b}.test(${i}))`;
          return (0, e._)`${b} && ${b} !== true && ${E} === ${f} && !${P}`;
        }
      }
      function h() {
        const y = g.formats[s];
        if (!y) {
          $();
          return;
        }
        if (y === !0)
          return;
        const [p, E, b] = _(y);
        p === f && n.pass(w());
        function $() {
          if (d.strictSchema === !1) {
            g.logger.warn(P());
            return;
          }
          throw new Error(P());
          function P() {
            return `unknown format "${s}" ignored in schema at path "${l}"`;
          }
        }
        function _(P) {
          const T = P instanceof RegExp ? (0, e.regexpCode)(P) : d.code.formats ? (0, e._)`${d.code.formats}${(0, e.getProperty)(s)}` : void 0, G = r.scopeValue("formats", { key: s, ref: P, code: T });
          return typeof P == "object" && !(P instanceof RegExp) ? [P.type || "string", P.validate, (0, e._)`${G}.validate`] : ["string", P, G];
        }
        function w() {
          if (typeof y == "object" && !(y instanceof RegExp) && y.async) {
            if (!m.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${b}(${i})`;
          }
          return typeof E == "function" ? (0, e._)`${b}(${i})` : (0, e._)`${b}.test(${i})`;
        }
      }
    }
  };
  return Ra.default = o, Ra;
}
var fh;
function d$() {
  if (fh) return ba;
  fh = 1, Object.defineProperty(ba, "__esModule", { value: !0 });
  const t = [f$().default];
  return ba.default = t, ba;
}
var $r = {}, dh;
function h$() {
  return dh || (dh = 1, Object.defineProperty($r, "__esModule", { value: !0 }), $r.contentVocabulary = $r.metadataVocabulary = void 0, $r.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], $r.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), $r;
}
var hh;
function p$() {
  if (hh) return Wi;
  hh = 1, Object.defineProperty(Wi, "__esModule", { value: !0 });
  const e = jw(), t = Xw(), o = l$(), n = d$(), f = h$(), r = [
    e.default,
    t.default,
    (0, o.default)(),
    n.default,
    f.metadataVocabulary,
    f.contentVocabulary
  ];
  return Wi.default = r, Wi;
}
var Pa = {}, on = {}, ph;
function m$() {
  if (ph) return on;
  ph = 1, Object.defineProperty(on, "__esModule", { value: !0 }), on.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (on.DiscrError = e = {})), on;
}
var mh;
function y$() {
  if (mh) return Pa;
  mh = 1, Object.defineProperty(Pa, "__esModule", { value: !0 });
  const e = De(), t = m$(), o = Yc(), n = us(), f = Ue(), i = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: c, tagName: s } }) => c === t.DiscrError.Tag ? `tag "${s}" must be string` : `value of tag "${s}" must be in oneOf`,
      params: ({ params: { discrError: c, tag: s, tagName: u } }) => (0, e._)`{error: ${c}, tag: ${u}, tagValue: ${s}}`
    },
    code(c) {
      const { gen: s, data: u, schema: a, parentSchema: d, it: l } = c, { oneOf: m } = d;
      if (!l.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const g = a.propertyName;
      if (typeof g != "string")
        throw new Error("discriminator: requires propertyName");
      if (a.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!m)
        throw new Error("discriminator: requires oneOf keyword");
      const v = s.let("valid", !1), h = s.const("tag", (0, e._)`${u}${(0, e.getProperty)(g)}`);
      s.if((0, e._)`typeof ${h} == "string"`, () => y(), () => c.error(!1, { discrError: t.DiscrError.Tag, tag: h, tagName: g })), c.ok(v);
      function y() {
        const b = E();
        s.if(!1);
        for (const $ in b)
          s.elseIf((0, e._)`${h} === ${$}`), s.assign(v, p(b[$]));
        s.else(), c.error(!1, { discrError: t.DiscrError.Mapping, tag: h, tagName: g }), s.endIf();
      }
      function p(b) {
        const $ = s.name("valid"), _ = c.subschema({ keyword: "oneOf", schemaProp: b }, $);
        return c.mergeEvaluated(_, e.Name), $;
      }
      function E() {
        var b;
        const $ = {}, _ = P(d);
        let w = !0;
        for (let L = 0; L < m.length; L++) {
          let M = m[L];
          if (M?.$ref && !(0, f.schemaHasRulesButRef)(M, l.self.RULES)) {
            const k = M.$ref;
            if (M = o.resolveRef.call(l.self, l.schemaEnv.root, l.baseId, k), M instanceof o.SchemaEnv && (M = M.schema), M === void 0)
              throw new n.default(l.opts.uriResolver, l.baseId, k);
          }
          const K = (b = M?.properties) === null || b === void 0 ? void 0 : b[g];
          if (typeof K != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${g}"`);
          w = w && (_ || P(M)), T(K, L);
        }
        if (!w)
          throw new Error(`discriminator: "${g}" must be required`);
        return $;
        function P({ required: L }) {
          return Array.isArray(L) && L.includes(g);
        }
        function T(L, M) {
          if (L.const)
            G(L.const, M);
          else if (L.enum)
            for (const K of L.enum)
              G(K, M);
          else
            throw new Error(`discriminator: "properties/${g}" must have "const" or "enum"`);
        }
        function G(L, M) {
          if (typeof L != "string" || L in $)
            throw new Error(`discriminator: "${g}" values must be unique strings`);
          $[L] = M;
        }
      }
    }
  };
  return Pa.default = i, Pa;
}
const g$ = "http://json-schema.org/draft-07/schema#", v$ = "http://json-schema.org/draft-07/schema#", _$ = "Core schema meta-schema", E$ = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, w$ = ["object", "boolean"], $$ = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, S$ = {
  $schema: g$,
  $id: v$,
  title: _$,
  definitions: E$,
  type: w$,
  properties: $$,
  default: !0
};
var yh;
function b$() {
  return yh || (yh = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
    const o = qw(), n = p$(), f = y$(), r = S$, i = ["/properties"], c = "http://json-schema.org/draft-07/schema";
    class s extends o.default {
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(f.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const g = this.opts.$data ? this.$dataMetaSchema(r, i) : r;
        this.addMetaSchema(g, c, !1), this.refs["http://json-schema.org/schema"] = c;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
      }
    }
    t.Ajv = s, e.exports = t = s, e.exports.Ajv = s, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = s;
    var u = os();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var a = De();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return a._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return a.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return a.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return a.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return a.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return a.CodeGen;
    } });
    var d = Wc();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return d.default;
    } });
    var l = us();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return l.default;
    } });
  })(Gi, Gi.exports)), Gi.exports;
}
var gh;
function R$() {
  return gh || (gh = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const t = b$(), o = De(), n = o.operators, f = {
      formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
      formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
      formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
    }, r = {
      message: ({ keyword: c, schemaCode: s }) => (0, o.str)`should be ${f[c].okStr} ${s}`,
      params: ({ keyword: c, schemaCode: s }) => (0, o._)`{comparison: ${f[c].okStr}, limit: ${s}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(f),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: r,
      code(c) {
        const { gen: s, data: u, schemaCode: a, keyword: d, it: l } = c, { opts: m, self: g } = l;
        if (!m.validateFormats)
          return;
        const v = new t.KeywordCxt(l, g.RULES.all.format.definition, "format");
        v.$data ? h() : y();
        function h() {
          const E = s.scopeValue("formats", {
            ref: g.formats,
            code: m.code.formats
          }), b = s.const("fmt", (0, o._)`${E}[${v.schemaCode}]`);
          c.fail$data((0, o.or)((0, o._)`typeof ${b} != "object"`, (0, o._)`${b} instanceof RegExp`, (0, o._)`typeof ${b}.compare != "function"`, p(b)));
        }
        function y() {
          const E = v.schema, b = g.formats[E];
          if (!b || b === !0)
            return;
          if (typeof b != "object" || b instanceof RegExp || typeof b.compare != "function")
            throw new Error(`"${d}": format "${E}" does not define "compare" function`);
          const $ = s.scopeValue("formats", {
            key: E,
            ref: b,
            code: m.code.formats ? (0, o._)`${m.code.formats}${(0, o.getProperty)(E)}` : void 0
          });
          c.fail$data(p($));
        }
        function p(E) {
          return (0, o._)`${E}.compare(${u}, ${a}) ${f[d].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const i = (c) => (c.addKeyword(e.formatLimitDefinition), c);
    e.default = i;
  })(Fs)), Fs;
}
var vh;
function P$() {
  return vh || (vh = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 });
    const o = ww(), n = R$(), f = De(), r = new f.Name("fullFormats"), i = new f.Name("fastFormats"), c = (u, a = { keywords: !0 }) => {
      if (Array.isArray(a))
        return s(u, a, o.fullFormats, r), u;
      const [d, l] = a.mode === "fast" ? [o.fastFormats, i] : [o.fullFormats, r], m = a.formats || o.formatNames;
      return s(u, m, d, l), a.keywords && (0, n.default)(u), u;
    };
    c.get = (u, a = "full") => {
      const l = (a === "fast" ? o.fastFormats : o.fullFormats)[u];
      if (!l)
        throw new Error(`Unknown format "${u}"`);
      return l;
    };
    function s(u, a, d, l) {
      var m, g;
      (m = (g = u.opts.code).formats) !== null && m !== void 0 || (g.formats = (0, f._)`require("ajv-formats/dist/formats").${l}`);
      for (const v of a)
        u.addFormat(v, d[v]);
    }
    e.exports = t = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  })(Vi, Vi.exports)), Vi.exports;
}
var T$ = P$();
const O$ = /* @__PURE__ */ I0(T$), N$ = (e, t, o, n) => {
  if (o === "length" || o === "prototype" || o === "arguments" || o === "caller")
    return;
  const f = Object.getOwnPropertyDescriptor(e, o), r = Object.getOwnPropertyDescriptor(t, o);
  !I$(f, r) && n || Object.defineProperty(e, o, r);
}, I$ = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, A$ = (e, t) => {
  const o = Object.getPrototypeOf(t);
  o !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, o);
}, C$ = (e, t) => `/* Wrapped ${e}*/
${t}`, D$ = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), k$ = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), q$ = (e, t, o) => {
  const n = o === "" ? "" : `with ${o.trim()}() `, f = C$.bind(null, n, t.toString());
  Object.defineProperty(f, "name", k$);
  const { writable: r, enumerable: i, configurable: c } = D$;
  Object.defineProperty(e, "toString", { value: f, writable: r, enumerable: i, configurable: c });
};
function L$(e, t, { ignoreNonConfigurable: o = !1 } = {}) {
  const { name: n } = e;
  for (const f of Reflect.ownKeys(t))
    N$(e, t, f, o);
  return A$(e, t), q$(e, t, n), e;
}
const _h = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: o = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: f = !1,
    after: r = !0
  } = t;
  if (o < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!f && !r)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let i, c, s;
  const u = function(...a) {
    const d = this, l = () => {
      i = void 0, c && (clearTimeout(c), c = void 0), r && (s = e.apply(d, a));
    }, m = () => {
      c = void 0, i && (clearTimeout(i), i = void 0), r && (s = e.apply(d, a));
    }, g = f && !i;
    return clearTimeout(i), i = setTimeout(l, o), n > 0 && n !== Number.POSITIVE_INFINITY && !c && (c = setTimeout(m, n)), g && (s = e.apply(d, a)), s;
  };
  return L$(u, e), u.cancel = () => {
    i && (clearTimeout(i), i = void 0), c && (clearTimeout(c), c = void 0);
  }, u;
};
var Ta = { exports: {} }, Hs, Eh;
function cs() {
  if (Eh) return Hs;
  Eh = 1;
  const e = "2.0.0", t = 256, o = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, n = 16, f = t - 6;
  return Hs = {
    MAX_LENGTH: t,
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: f,
    MAX_SAFE_INTEGER: o,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, Hs;
}
var zs, wh;
function ls() {
  return wh || (wh = 1, zs = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
  }), zs;
}
var $h;
function kn() {
  return $h || ($h = 1, (function(e, t) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: o,
      MAX_SAFE_BUILD_LENGTH: n,
      MAX_LENGTH: f
    } = cs(), r = ls();
    t = e.exports = {};
    const i = t.re = [], c = t.safeRe = [], s = t.src = [], u = t.safeSrc = [], a = t.t = {};
    let d = 0;
    const l = "[a-zA-Z0-9-]", m = [
      ["\\s", 1],
      ["\\d", f],
      [l, n]
    ], g = (h) => {
      for (const [y, p] of m)
        h = h.split(`${y}*`).join(`${y}{0,${p}}`).split(`${y}+`).join(`${y}{1,${p}}`);
      return h;
    }, v = (h, y, p) => {
      const E = g(y), b = d++;
      r(h, b, y), a[h] = b, s[b] = y, u[b] = E, i[b] = new RegExp(y, p ? "g" : void 0), c[b] = new RegExp(E, p ? "g" : void 0);
    };
    v("NUMERICIDENTIFIER", "0|[1-9]\\d*"), v("NUMERICIDENTIFIERLOOSE", "\\d+"), v("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${l}*`), v("MAINVERSION", `(${s[a.NUMERICIDENTIFIER]})\\.(${s[a.NUMERICIDENTIFIER]})\\.(${s[a.NUMERICIDENTIFIER]})`), v("MAINVERSIONLOOSE", `(${s[a.NUMERICIDENTIFIERLOOSE]})\\.(${s[a.NUMERICIDENTIFIERLOOSE]})\\.(${s[a.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASEIDENTIFIER", `(?:${s[a.NONNUMERICIDENTIFIER]}|${s[a.NUMERICIDENTIFIER]})`), v("PRERELEASEIDENTIFIERLOOSE", `(?:${s[a.NONNUMERICIDENTIFIER]}|${s[a.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASE", `(?:-(${s[a.PRERELEASEIDENTIFIER]}(?:\\.${s[a.PRERELEASEIDENTIFIER]})*))`), v("PRERELEASELOOSE", `(?:-?(${s[a.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${s[a.PRERELEASEIDENTIFIERLOOSE]})*))`), v("BUILDIDENTIFIER", `${l}+`), v("BUILD", `(?:\\+(${s[a.BUILDIDENTIFIER]}(?:\\.${s[a.BUILDIDENTIFIER]})*))`), v("FULLPLAIN", `v?${s[a.MAINVERSION]}${s[a.PRERELEASE]}?${s[a.BUILD]}?`), v("FULL", `^${s[a.FULLPLAIN]}$`), v("LOOSEPLAIN", `[v=\\s]*${s[a.MAINVERSIONLOOSE]}${s[a.PRERELEASELOOSE]}?${s[a.BUILD]}?`), v("LOOSE", `^${s[a.LOOSEPLAIN]}$`), v("GTLT", "((?:<|>)?=?)"), v("XRANGEIDENTIFIERLOOSE", `${s[a.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), v("XRANGEIDENTIFIER", `${s[a.NUMERICIDENTIFIER]}|x|X|\\*`), v("XRANGEPLAIN", `[v=\\s]*(${s[a.XRANGEIDENTIFIER]})(?:\\.(${s[a.XRANGEIDENTIFIER]})(?:\\.(${s[a.XRANGEIDENTIFIER]})(?:${s[a.PRERELEASE]})?${s[a.BUILD]}?)?)?`), v("XRANGEPLAINLOOSE", `[v=\\s]*(${s[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[a.XRANGEIDENTIFIERLOOSE]})(?:${s[a.PRERELEASELOOSE]})?${s[a.BUILD]}?)?)?`), v("XRANGE", `^${s[a.GTLT]}\\s*${s[a.XRANGEPLAIN]}$`), v("XRANGELOOSE", `^${s[a.GTLT]}\\s*${s[a.XRANGEPLAINLOOSE]}$`), v("COERCEPLAIN", `(^|[^\\d])(\\d{1,${o}})(?:\\.(\\d{1,${o}}))?(?:\\.(\\d{1,${o}}))?`), v("COERCE", `${s[a.COERCEPLAIN]}(?:$|[^\\d])`), v("COERCEFULL", s[a.COERCEPLAIN] + `(?:${s[a.PRERELEASE]})?(?:${s[a.BUILD]})?(?:$|[^\\d])`), v("COERCERTL", s[a.COERCE], !0), v("COERCERTLFULL", s[a.COERCEFULL], !0), v("LONETILDE", "(?:~>?)"), v("TILDETRIM", `(\\s*)${s[a.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", v("TILDE", `^${s[a.LONETILDE]}${s[a.XRANGEPLAIN]}$`), v("TILDELOOSE", `^${s[a.LONETILDE]}${s[a.XRANGEPLAINLOOSE]}$`), v("LONECARET", "(?:\\^)"), v("CARETTRIM", `(\\s*)${s[a.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", v("CARET", `^${s[a.LONECARET]}${s[a.XRANGEPLAIN]}$`), v("CARETLOOSE", `^${s[a.LONECARET]}${s[a.XRANGEPLAINLOOSE]}$`), v("COMPARATORLOOSE", `^${s[a.GTLT]}\\s*(${s[a.LOOSEPLAIN]})$|^$`), v("COMPARATOR", `^${s[a.GTLT]}\\s*(${s[a.FULLPLAIN]})$|^$`), v("COMPARATORTRIM", `(\\s*)${s[a.GTLT]}\\s*(${s[a.LOOSEPLAIN]}|${s[a.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", v("HYPHENRANGE", `^\\s*(${s[a.XRANGEPLAIN]})\\s+-\\s+(${s[a.XRANGEPLAIN]})\\s*$`), v("HYPHENRANGELOOSE", `^\\s*(${s[a.XRANGEPLAINLOOSE]})\\s+-\\s+(${s[a.XRANGEPLAINLOOSE]})\\s*$`), v("STAR", "(<|>)?=?\\s*\\*"), v("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), v("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Ta, Ta.exports)), Ta.exports;
}
var Ks, Sh;
function Jc() {
  if (Sh) return Ks;
  Sh = 1;
  const e = Object.freeze({ loose: !0 }), t = Object.freeze({});
  return Ks = (n) => n ? typeof n != "object" ? e : n : t, Ks;
}
var Ws, bh;
function H0() {
  if (bh) return Ws;
  bh = 1;
  const e = /^[0-9]+$/, t = (n, f) => {
    if (typeof n == "number" && typeof f == "number")
      return n === f ? 0 : n < f ? -1 : 1;
    const r = e.test(n), i = e.test(f);
    return r && i && (n = +n, f = +f), n === f ? 0 : r && !i ? -1 : i && !r ? 1 : n < f ? -1 : 1;
  };
  return Ws = {
    compareIdentifiers: t,
    rcompareIdentifiers: (n, f) => t(f, n)
  }, Ws;
}
var Ys, Rh;
function lt() {
  if (Rh) return Ys;
  Rh = 1;
  const e = ls(), { MAX_LENGTH: t, MAX_SAFE_INTEGER: o } = cs(), { safeRe: n, t: f } = kn(), r = Jc(), { compareIdentifiers: i } = H0();
  class c {
    constructor(u, a) {
      if (a = r(a), u instanceof c) {
        if (u.loose === !!a.loose && u.includePrerelease === !!a.includePrerelease)
          return u;
        u = u.version;
      } else if (typeof u != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof u}".`);
      if (u.length > t)
        throw new TypeError(
          `version is longer than ${t} characters`
        );
      e("SemVer", u, a), this.options = a, this.loose = !!a.loose, this.includePrerelease = !!a.includePrerelease;
      const d = u.trim().match(a.loose ? n[f.LOOSE] : n[f.FULL]);
      if (!d)
        throw new TypeError(`Invalid Version: ${u}`);
      if (this.raw = u, this.major = +d[1], this.minor = +d[2], this.patch = +d[3], this.major > o || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > o || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > o || this.patch < 0)
        throw new TypeError("Invalid patch version");
      d[4] ? this.prerelease = d[4].split(".").map((l) => {
        if (/^[0-9]+$/.test(l)) {
          const m = +l;
          if (m >= 0 && m < o)
            return m;
        }
        return l;
      }) : this.prerelease = [], this.build = d[5] ? d[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(u) {
      if (e("SemVer.compare", this.version, this.options, u), !(u instanceof c)) {
        if (typeof u == "string" && u === this.version)
          return 0;
        u = new c(u, this.options);
      }
      return u.version === this.version ? 0 : this.compareMain(u) || this.comparePre(u);
    }
    compareMain(u) {
      return u instanceof c || (u = new c(u, this.options)), this.major < u.major ? -1 : this.major > u.major ? 1 : this.minor < u.minor ? -1 : this.minor > u.minor ? 1 : this.patch < u.patch ? -1 : this.patch > u.patch ? 1 : 0;
    }
    comparePre(u) {
      if (u instanceof c || (u = new c(u, this.options)), this.prerelease.length && !u.prerelease.length)
        return -1;
      if (!this.prerelease.length && u.prerelease.length)
        return 1;
      if (!this.prerelease.length && !u.prerelease.length)
        return 0;
      let a = 0;
      do {
        const d = this.prerelease[a], l = u.prerelease[a];
        if (e("prerelease compare", a, d, l), d === void 0 && l === void 0)
          return 0;
        if (l === void 0)
          return 1;
        if (d === void 0)
          return -1;
        if (d === l)
          continue;
        return i(d, l);
      } while (++a);
    }
    compareBuild(u) {
      u instanceof c || (u = new c(u, this.options));
      let a = 0;
      do {
        const d = this.build[a], l = u.build[a];
        if (e("build compare", a, d, l), d === void 0 && l === void 0)
          return 0;
        if (l === void 0)
          return 1;
        if (d === void 0)
          return -1;
        if (d === l)
          continue;
        return i(d, l);
      } while (++a);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(u, a, d) {
      if (u.startsWith("pre")) {
        if (!a && d === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (a) {
          const l = `-${a}`.match(this.options.loose ? n[f.PRERELEASELOOSE] : n[f.PRERELEASE]);
          if (!l || l[1] !== a)
            throw new Error(`invalid identifier: ${a}`);
        }
      }
      switch (u) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", a, d);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", a, d);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", a, d), this.inc("pre", a, d);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", a, d), this.inc("pre", a, d);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const l = Number(d) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [l];
          else {
            let m = this.prerelease.length;
            for (; --m >= 0; )
              typeof this.prerelease[m] == "number" && (this.prerelease[m]++, m = -2);
            if (m === -1) {
              if (a === this.prerelease.join(".") && d === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(l);
            }
          }
          if (a) {
            let m = [a, l];
            d === !1 && (m = [a]), i(this.prerelease[0], a) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = m) : this.prerelease = m;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${u}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return Ys = c, Ys;
}
var Xs, Ph;
function Yr() {
  if (Ph) return Xs;
  Ph = 1;
  const e = lt();
  return Xs = (o, n, f = !1) => {
    if (o instanceof e)
      return o;
    try {
      return new e(o, n);
    } catch (r) {
      if (!f)
        return null;
      throw r;
    }
  }, Xs;
}
var Js, Th;
function F$() {
  if (Th) return Js;
  Th = 1;
  const e = Yr();
  return Js = (o, n) => {
    const f = e(o, n);
    return f ? f.version : null;
  }, Js;
}
var Qs, Oh;
function j$() {
  if (Oh) return Qs;
  Oh = 1;
  const e = Yr();
  return Qs = (o, n) => {
    const f = e(o.trim().replace(/^[=v]+/, ""), n);
    return f ? f.version : null;
  }, Qs;
}
var Zs, Nh;
function U$() {
  if (Nh) return Zs;
  Nh = 1;
  const e = lt();
  return Zs = (o, n, f, r, i) => {
    typeof f == "string" && (i = r, r = f, f = void 0);
    try {
      return new e(
        o instanceof e ? o.version : o,
        f
      ).inc(n, r, i).version;
    } catch {
      return null;
    }
  }, Zs;
}
var eo, Ih;
function M$() {
  if (Ih) return eo;
  Ih = 1;
  const e = Yr();
  return eo = (o, n) => {
    const f = e(o, null, !0), r = e(n, null, !0), i = f.compare(r);
    if (i === 0)
      return null;
    const c = i > 0, s = c ? f : r, u = c ? r : f, a = !!s.prerelease.length;
    if (!!u.prerelease.length && !a) {
      if (!u.patch && !u.minor)
        return "major";
      if (u.compareMain(s) === 0)
        return u.minor && !u.patch ? "minor" : "patch";
    }
    const l = a ? "pre" : "";
    return f.major !== r.major ? l + "major" : f.minor !== r.minor ? l + "minor" : f.patch !== r.patch ? l + "patch" : "prerelease";
  }, eo;
}
var to, Ah;
function x$() {
  if (Ah) return to;
  Ah = 1;
  const e = lt();
  return to = (o, n) => new e(o, n).major, to;
}
var ro, Ch;
function V$() {
  if (Ch) return ro;
  Ch = 1;
  const e = lt();
  return ro = (o, n) => new e(o, n).minor, ro;
}
var no, Dh;
function G$() {
  if (Dh) return no;
  Dh = 1;
  const e = lt();
  return no = (o, n) => new e(o, n).patch, no;
}
var io, kh;
function B$() {
  if (kh) return io;
  kh = 1;
  const e = Yr();
  return io = (o, n) => {
    const f = e(o, n);
    return f && f.prerelease.length ? f.prerelease : null;
  }, io;
}
var ao, qh;
function Ct() {
  if (qh) return ao;
  qh = 1;
  const e = lt();
  return ao = (o, n, f) => new e(o, f).compare(new e(n, f)), ao;
}
var so, Lh;
function H$() {
  if (Lh) return so;
  Lh = 1;
  const e = Ct();
  return so = (o, n, f) => e(n, o, f), so;
}
var oo, Fh;
function z$() {
  if (Fh) return oo;
  Fh = 1;
  const e = Ct();
  return oo = (o, n) => e(o, n, !0), oo;
}
var uo, jh;
function Qc() {
  if (jh) return uo;
  jh = 1;
  const e = lt();
  return uo = (o, n, f) => {
    const r = new e(o, f), i = new e(n, f);
    return r.compare(i) || r.compareBuild(i);
  }, uo;
}
var co, Uh;
function K$() {
  if (Uh) return co;
  Uh = 1;
  const e = Qc();
  return co = (o, n) => o.sort((f, r) => e(f, r, n)), co;
}
var lo, Mh;
function W$() {
  if (Mh) return lo;
  Mh = 1;
  const e = Qc();
  return lo = (o, n) => o.sort((f, r) => e(r, f, n)), lo;
}
var fo, xh;
function fs() {
  if (xh) return fo;
  xh = 1;
  const e = Ct();
  return fo = (o, n, f) => e(o, n, f) > 0, fo;
}
var ho, Vh;
function Zc() {
  if (Vh) return ho;
  Vh = 1;
  const e = Ct();
  return ho = (o, n, f) => e(o, n, f) < 0, ho;
}
var po, Gh;
function z0() {
  if (Gh) return po;
  Gh = 1;
  const e = Ct();
  return po = (o, n, f) => e(o, n, f) === 0, po;
}
var mo, Bh;
function K0() {
  if (Bh) return mo;
  Bh = 1;
  const e = Ct();
  return mo = (o, n, f) => e(o, n, f) !== 0, mo;
}
var yo, Hh;
function el() {
  if (Hh) return yo;
  Hh = 1;
  const e = Ct();
  return yo = (o, n, f) => e(o, n, f) >= 0, yo;
}
var go, zh;
function tl() {
  if (zh) return go;
  zh = 1;
  const e = Ct();
  return go = (o, n, f) => e(o, n, f) <= 0, go;
}
var vo, Kh;
function W0() {
  if (Kh) return vo;
  Kh = 1;
  const e = z0(), t = K0(), o = fs(), n = el(), f = Zc(), r = tl();
  return vo = (c, s, u, a) => {
    switch (s) {
      case "===":
        return typeof c == "object" && (c = c.version), typeof u == "object" && (u = u.version), c === u;
      case "!==":
        return typeof c == "object" && (c = c.version), typeof u == "object" && (u = u.version), c !== u;
      case "":
      case "=":
      case "==":
        return e(c, u, a);
      case "!=":
        return t(c, u, a);
      case ">":
        return o(c, u, a);
      case ">=":
        return n(c, u, a);
      case "<":
        return f(c, u, a);
      case "<=":
        return r(c, u, a);
      default:
        throw new TypeError(`Invalid operator: ${s}`);
    }
  }, vo;
}
var _o, Wh;
function Y$() {
  if (Wh) return _o;
  Wh = 1;
  const e = lt(), t = Yr(), { safeRe: o, t: n } = kn();
  return _o = (r, i) => {
    if (r instanceof e)
      return r;
    if (typeof r == "number" && (r = String(r)), typeof r != "string")
      return null;
    i = i || {};
    let c = null;
    if (!i.rtl)
      c = r.match(i.includePrerelease ? o[n.COERCEFULL] : o[n.COERCE]);
    else {
      const m = i.includePrerelease ? o[n.COERCERTLFULL] : o[n.COERCERTL];
      let g;
      for (; (g = m.exec(r)) && (!c || c.index + c[0].length !== r.length); )
        (!c || g.index + g[0].length !== c.index + c[0].length) && (c = g), m.lastIndex = g.index + g[1].length + g[2].length;
      m.lastIndex = -1;
    }
    if (c === null)
      return null;
    const s = c[2], u = c[3] || "0", a = c[4] || "0", d = i.includePrerelease && c[5] ? `-${c[5]}` : "", l = i.includePrerelease && c[6] ? `+${c[6]}` : "";
    return t(`${s}.${u}.${a}${d}${l}`, i);
  }, _o;
}
var Eo, Yh;
function X$() {
  if (Yh) return Eo;
  Yh = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(o) {
      const n = this.map.get(o);
      if (n !== void 0)
        return this.map.delete(o), this.map.set(o, n), n;
    }
    delete(o) {
      return this.map.delete(o);
    }
    set(o, n) {
      if (!this.delete(o) && n !== void 0) {
        if (this.map.size >= this.max) {
          const r = this.map.keys().next().value;
          this.delete(r);
        }
        this.map.set(o, n);
      }
      return this;
    }
  }
  return Eo = e, Eo;
}
var wo, Xh;
function Dt() {
  if (Xh) return wo;
  Xh = 1;
  const e = /\s+/g;
  class t {
    constructor(F, X) {
      if (X = f(X), F instanceof t)
        return F.loose === !!X.loose && F.includePrerelease === !!X.includePrerelease ? F : new t(F.raw, X);
      if (F instanceof r)
        return this.raw = F.value, this.set = [[F]], this.formatted = void 0, this;
      if (this.options = X, this.loose = !!X.loose, this.includePrerelease = !!X.includePrerelease, this.raw = F.trim().replace(e, " "), this.set = this.raw.split("||").map((B) => this.parseRange(B.trim())).filter((B) => B.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const B = this.set[0];
        if (this.set = this.set.filter((Y) => !v(Y[0])), this.set.length === 0)
          this.set = [B];
        else if (this.set.length > 1) {
          for (const Y of this.set)
            if (Y.length === 1 && h(Y[0])) {
              this.set = [Y];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let F = 0; F < this.set.length; F++) {
          F > 0 && (this.formatted += "||");
          const X = this.set[F];
          for (let B = 0; B < X.length; B++)
            B > 0 && (this.formatted += " "), this.formatted += X[B].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(F) {
      const B = ((this.options.includePrerelease && m) | (this.options.loose && g)) + ":" + F, Y = n.get(B);
      if (Y)
        return Y;
      const Z = this.options.loose, V = Z ? s[u.HYPHENRANGELOOSE] : s[u.HYPHENRANGE];
      F = F.replace(V, M(this.options.includePrerelease)), i("hyphen replace", F), F = F.replace(s[u.COMPARATORTRIM], a), i("comparator trim", F), F = F.replace(s[u.TILDETRIM], d), i("tilde trim", F), F = F.replace(s[u.CARETTRIM], l), i("caret trim", F);
      let C = F.split(" ").map((O) => p(O, this.options)).join(" ").split(/\s+/).map((O) => L(O, this.options));
      Z && (C = C.filter((O) => (i("loose invalid filter", O, this.options), !!O.match(s[u.COMPARATORLOOSE])))), i("range list", C);
      const U = /* @__PURE__ */ new Map(), D = C.map((O) => new r(O, this.options));
      for (const O of D) {
        if (v(O))
          return [O];
        U.set(O.value, O);
      }
      U.size > 1 && U.has("") && U.delete("");
      const R = [...U.values()];
      return n.set(B, R), R;
    }
    intersects(F, X) {
      if (!(F instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((B) => y(B, X) && F.set.some((Y) => y(Y, X) && B.every((Z) => Y.every((V) => Z.intersects(V, X)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(F) {
      if (!F)
        return !1;
      if (typeof F == "string")
        try {
          F = new c(F, this.options);
        } catch {
          return !1;
        }
      for (let X = 0; X < this.set.length; X++)
        if (K(this.set[X], F, this.options))
          return !0;
      return !1;
    }
  }
  wo = t;
  const o = X$(), n = new o(), f = Jc(), r = ds(), i = ls(), c = lt(), {
    safeRe: s,
    t: u,
    comparatorTrimReplace: a,
    tildeTrimReplace: d,
    caretTrimReplace: l
  } = kn(), { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: g } = cs(), v = (k) => k.value === "<0.0.0-0", h = (k) => k.value === "", y = (k, F) => {
    let X = !0;
    const B = k.slice();
    let Y = B.pop();
    for (; X && B.length; )
      X = B.every((Z) => Y.intersects(Z, F)), Y = B.pop();
    return X;
  }, p = (k, F) => (k = k.replace(s[u.BUILD], ""), i("comp", k, F), k = _(k, F), i("caret", k), k = b(k, F), i("tildes", k), k = P(k, F), i("xrange", k), k = G(k, F), i("stars", k), k), E = (k) => !k || k.toLowerCase() === "x" || k === "*", b = (k, F) => k.trim().split(/\s+/).map((X) => $(X, F)).join(" "), $ = (k, F) => {
    const X = F.loose ? s[u.TILDELOOSE] : s[u.TILDE];
    return k.replace(X, (B, Y, Z, V, C) => {
      i("tilde", k, B, Y, Z, V, C);
      let U;
      return E(Y) ? U = "" : E(Z) ? U = `>=${Y}.0.0 <${+Y + 1}.0.0-0` : E(V) ? U = `>=${Y}.${Z}.0 <${Y}.${+Z + 1}.0-0` : C ? (i("replaceTilde pr", C), U = `>=${Y}.${Z}.${V}-${C} <${Y}.${+Z + 1}.0-0`) : U = `>=${Y}.${Z}.${V} <${Y}.${+Z + 1}.0-0`, i("tilde return", U), U;
    });
  }, _ = (k, F) => k.trim().split(/\s+/).map((X) => w(X, F)).join(" "), w = (k, F) => {
    i("caret", k, F);
    const X = F.loose ? s[u.CARETLOOSE] : s[u.CARET], B = F.includePrerelease ? "-0" : "";
    return k.replace(X, (Y, Z, V, C, U) => {
      i("caret", k, Y, Z, V, C, U);
      let D;
      return E(Z) ? D = "" : E(V) ? D = `>=${Z}.0.0${B} <${+Z + 1}.0.0-0` : E(C) ? Z === "0" ? D = `>=${Z}.${V}.0${B} <${Z}.${+V + 1}.0-0` : D = `>=${Z}.${V}.0${B} <${+Z + 1}.0.0-0` : U ? (i("replaceCaret pr", U), Z === "0" ? V === "0" ? D = `>=${Z}.${V}.${C}-${U} <${Z}.${V}.${+C + 1}-0` : D = `>=${Z}.${V}.${C}-${U} <${Z}.${+V + 1}.0-0` : D = `>=${Z}.${V}.${C}-${U} <${+Z + 1}.0.0-0`) : (i("no pr"), Z === "0" ? V === "0" ? D = `>=${Z}.${V}.${C}${B} <${Z}.${V}.${+C + 1}-0` : D = `>=${Z}.${V}.${C}${B} <${Z}.${+V + 1}.0-0` : D = `>=${Z}.${V}.${C} <${+Z + 1}.0.0-0`), i("caret return", D), D;
    });
  }, P = (k, F) => (i("replaceXRanges", k, F), k.split(/\s+/).map((X) => T(X, F)).join(" ")), T = (k, F) => {
    k = k.trim();
    const X = F.loose ? s[u.XRANGELOOSE] : s[u.XRANGE];
    return k.replace(X, (B, Y, Z, V, C, U) => {
      i("xRange", k, B, Y, Z, V, C, U);
      const D = E(Z), R = D || E(V), O = R || E(C), x = O;
      return Y === "=" && x && (Y = ""), U = F.includePrerelease ? "-0" : "", D ? Y === ">" || Y === "<" ? B = "<0.0.0-0" : B = "*" : Y && x ? (R && (V = 0), C = 0, Y === ">" ? (Y = ">=", R ? (Z = +Z + 1, V = 0, C = 0) : (V = +V + 1, C = 0)) : Y === "<=" && (Y = "<", R ? Z = +Z + 1 : V = +V + 1), Y === "<" && (U = "-0"), B = `${Y + Z}.${V}.${C}${U}`) : R ? B = `>=${Z}.0.0${U} <${+Z + 1}.0.0-0` : O && (B = `>=${Z}.${V}.0${U} <${Z}.${+V + 1}.0-0`), i("xRange return", B), B;
    });
  }, G = (k, F) => (i("replaceStars", k, F), k.trim().replace(s[u.STAR], "")), L = (k, F) => (i("replaceGTE0", k, F), k.trim().replace(s[F.includePrerelease ? u.GTE0PRE : u.GTE0], "")), M = (k) => (F, X, B, Y, Z, V, C, U, D, R, O, x) => (E(B) ? X = "" : E(Y) ? X = `>=${B}.0.0${k ? "-0" : ""}` : E(Z) ? X = `>=${B}.${Y}.0${k ? "-0" : ""}` : V ? X = `>=${X}` : X = `>=${X}${k ? "-0" : ""}`, E(D) ? U = "" : E(R) ? U = `<${+D + 1}.0.0-0` : E(O) ? U = `<${D}.${+R + 1}.0-0` : x ? U = `<=${D}.${R}.${O}-${x}` : k ? U = `<${D}.${R}.${+O + 1}-0` : U = `<=${U}`, `${X} ${U}`.trim()), K = (k, F, X) => {
    for (let B = 0; B < k.length; B++)
      if (!k[B].test(F))
        return !1;
    if (F.prerelease.length && !X.includePrerelease) {
      for (let B = 0; B < k.length; B++)
        if (i(k[B].semver), k[B].semver !== r.ANY && k[B].semver.prerelease.length > 0) {
          const Y = k[B].semver;
          if (Y.major === F.major && Y.minor === F.minor && Y.patch === F.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return wo;
}
var $o, Jh;
function ds() {
  if (Jh) return $o;
  Jh = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(a, d) {
      if (d = o(d), a instanceof t) {
        if (a.loose === !!d.loose)
          return a;
        a = a.value;
      }
      a = a.trim().split(/\s+/).join(" "), i("comparator", a, d), this.options = d, this.loose = !!d.loose, this.parse(a), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(a) {
      const d = this.options.loose ? n[f.COMPARATORLOOSE] : n[f.COMPARATOR], l = a.match(d);
      if (!l)
        throw new TypeError(`Invalid comparator: ${a}`);
      this.operator = l[1] !== void 0 ? l[1] : "", this.operator === "=" && (this.operator = ""), l[2] ? this.semver = new c(l[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(a) {
      if (i("Comparator.test", a, this.options.loose), this.semver === e || a === e)
        return !0;
      if (typeof a == "string")
        try {
          a = new c(a, this.options);
        } catch {
          return !1;
        }
      return r(a, this.operator, this.semver, this.options);
    }
    intersects(a, d) {
      if (!(a instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new s(a.value, d).test(this.value) : a.operator === "" ? a.value === "" ? !0 : new s(this.value, d).test(a.semver) : (d = o(d), d.includePrerelease && (this.value === "<0.0.0-0" || a.value === "<0.0.0-0") || !d.includePrerelease && (this.value.startsWith("<0.0.0") || a.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && a.operator.startsWith(">") || this.operator.startsWith("<") && a.operator.startsWith("<") || this.semver.version === a.semver.version && this.operator.includes("=") && a.operator.includes("=") || r(this.semver, "<", a.semver, d) && this.operator.startsWith(">") && a.operator.startsWith("<") || r(this.semver, ">", a.semver, d) && this.operator.startsWith("<") && a.operator.startsWith(">")));
    }
  }
  $o = t;
  const o = Jc(), { safeRe: n, t: f } = kn(), r = W0(), i = ls(), c = lt(), s = Dt();
  return $o;
}
var So, Qh;
function hs() {
  if (Qh) return So;
  Qh = 1;
  const e = Dt();
  return So = (o, n, f) => {
    try {
      n = new e(n, f);
    } catch {
      return !1;
    }
    return n.test(o);
  }, So;
}
var bo, Zh;
function J$() {
  if (Zh) return bo;
  Zh = 1;
  const e = Dt();
  return bo = (o, n) => new e(o, n).set.map((f) => f.map((r) => r.value).join(" ").trim().split(" ")), bo;
}
var Ro, ep;
function Q$() {
  if (ep) return Ro;
  ep = 1;
  const e = lt(), t = Dt();
  return Ro = (n, f, r) => {
    let i = null, c = null, s = null;
    try {
      s = new t(f, r);
    } catch {
      return null;
    }
    return n.forEach((u) => {
      s.test(u) && (!i || c.compare(u) === -1) && (i = u, c = new e(i, r));
    }), i;
  }, Ro;
}
var Po, tp;
function Z$() {
  if (tp) return Po;
  tp = 1;
  const e = lt(), t = Dt();
  return Po = (n, f, r) => {
    let i = null, c = null, s = null;
    try {
      s = new t(f, r);
    } catch {
      return null;
    }
    return n.forEach((u) => {
      s.test(u) && (!i || c.compare(u) === 1) && (i = u, c = new e(i, r));
    }), i;
  }, Po;
}
var To, rp;
function eS() {
  if (rp) return To;
  rp = 1;
  const e = lt(), t = Dt(), o = fs();
  return To = (f, r) => {
    f = new t(f, r);
    let i = new e("0.0.0");
    if (f.test(i) || (i = new e("0.0.0-0"), f.test(i)))
      return i;
    i = null;
    for (let c = 0; c < f.set.length; ++c) {
      const s = f.set[c];
      let u = null;
      s.forEach((a) => {
        const d = new e(a.semver.version);
        switch (a.operator) {
          case ">":
            d.prerelease.length === 0 ? d.patch++ : d.prerelease.push(0), d.raw = d.format();
          /* fallthrough */
          case "":
          case ">=":
            (!u || o(d, u)) && (u = d);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${a.operator}`);
        }
      }), u && (!i || o(i, u)) && (i = u);
    }
    return i && f.test(i) ? i : null;
  }, To;
}
var Oo, np;
function tS() {
  if (np) return Oo;
  np = 1;
  const e = Dt();
  return Oo = (o, n) => {
    try {
      return new e(o, n).range || "*";
    } catch {
      return null;
    }
  }, Oo;
}
var No, ip;
function rl() {
  if (ip) return No;
  ip = 1;
  const e = lt(), t = ds(), { ANY: o } = t, n = Dt(), f = hs(), r = fs(), i = Zc(), c = tl(), s = el();
  return No = (a, d, l, m) => {
    a = new e(a, m), d = new n(d, m);
    let g, v, h, y, p;
    switch (l) {
      case ">":
        g = r, v = c, h = i, y = ">", p = ">=";
        break;
      case "<":
        g = i, v = s, h = r, y = "<", p = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (f(a, d, m))
      return !1;
    for (let E = 0; E < d.set.length; ++E) {
      const b = d.set[E];
      let $ = null, _ = null;
      if (b.forEach((w) => {
        w.semver === o && (w = new t(">=0.0.0")), $ = $ || w, _ = _ || w, g(w.semver, $.semver, m) ? $ = w : h(w.semver, _.semver, m) && (_ = w);
      }), $.operator === y || $.operator === p || (!_.operator || _.operator === y) && v(a, _.semver))
        return !1;
      if (_.operator === p && h(a, _.semver))
        return !1;
    }
    return !0;
  }, No;
}
var Io, ap;
function rS() {
  if (ap) return Io;
  ap = 1;
  const e = rl();
  return Io = (o, n, f) => e(o, n, ">", f), Io;
}
var Ao, sp;
function nS() {
  if (sp) return Ao;
  sp = 1;
  const e = rl();
  return Ao = (o, n, f) => e(o, n, "<", f), Ao;
}
var Co, op;
function iS() {
  if (op) return Co;
  op = 1;
  const e = Dt();
  return Co = (o, n, f) => (o = new e(o, f), n = new e(n, f), o.intersects(n, f)), Co;
}
var Do, up;
function aS() {
  if (up) return Do;
  up = 1;
  const e = hs(), t = Ct();
  return Do = (o, n, f) => {
    const r = [];
    let i = null, c = null;
    const s = o.sort((l, m) => t(l, m, f));
    for (const l of s)
      e(l, n, f) ? (c = l, i || (i = l)) : (c && r.push([i, c]), c = null, i = null);
    i && r.push([i, null]);
    const u = [];
    for (const [l, m] of r)
      l === m ? u.push(l) : !m && l === s[0] ? u.push("*") : m ? l === s[0] ? u.push(`<=${m}`) : u.push(`${l} - ${m}`) : u.push(`>=${l}`);
    const a = u.join(" || "), d = typeof n.raw == "string" ? n.raw : String(n);
    return a.length < d.length ? a : n;
  }, Do;
}
var ko, cp;
function sS() {
  if (cp) return ko;
  cp = 1;
  const e = Dt(), t = ds(), { ANY: o } = t, n = hs(), f = Ct(), r = (d, l, m = {}) => {
    if (d === l)
      return !0;
    d = new e(d, m), l = new e(l, m);
    let g = !1;
    e: for (const v of d.set) {
      for (const h of l.set) {
        const y = s(v, h, m);
        if (g = g || y !== null, y)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, i = [new t(">=0.0.0-0")], c = [new t(">=0.0.0")], s = (d, l, m) => {
    if (d === l)
      return !0;
    if (d.length === 1 && d[0].semver === o) {
      if (l.length === 1 && l[0].semver === o)
        return !0;
      m.includePrerelease ? d = i : d = c;
    }
    if (l.length === 1 && l[0].semver === o) {
      if (m.includePrerelease)
        return !0;
      l = c;
    }
    const g = /* @__PURE__ */ new Set();
    let v, h;
    for (const P of d)
      P.operator === ">" || P.operator === ">=" ? v = u(v, P, m) : P.operator === "<" || P.operator === "<=" ? h = a(h, P, m) : g.add(P.semver);
    if (g.size > 1)
      return null;
    let y;
    if (v && h) {
      if (y = f(v.semver, h.semver, m), y > 0)
        return null;
      if (y === 0 && (v.operator !== ">=" || h.operator !== "<="))
        return null;
    }
    for (const P of g) {
      if (v && !n(P, String(v), m) || h && !n(P, String(h), m))
        return null;
      for (const T of l)
        if (!n(P, String(T), m))
          return !1;
      return !0;
    }
    let p, E, b, $, _ = h && !m.includePrerelease && h.semver.prerelease.length ? h.semver : !1, w = v && !m.includePrerelease && v.semver.prerelease.length ? v.semver : !1;
    _ && _.prerelease.length === 1 && h.operator === "<" && _.prerelease[0] === 0 && (_ = !1);
    for (const P of l) {
      if ($ = $ || P.operator === ">" || P.operator === ">=", b = b || P.operator === "<" || P.operator === "<=", v) {
        if (w && P.semver.prerelease && P.semver.prerelease.length && P.semver.major === w.major && P.semver.minor === w.minor && P.semver.patch === w.patch && (w = !1), P.operator === ">" || P.operator === ">=") {
          if (p = u(v, P, m), p === P && p !== v)
            return !1;
        } else if (v.operator === ">=" && !n(v.semver, String(P), m))
          return !1;
      }
      if (h) {
        if (_ && P.semver.prerelease && P.semver.prerelease.length && P.semver.major === _.major && P.semver.minor === _.minor && P.semver.patch === _.patch && (_ = !1), P.operator === "<" || P.operator === "<=") {
          if (E = a(h, P, m), E === P && E !== h)
            return !1;
        } else if (h.operator === "<=" && !n(h.semver, String(P), m))
          return !1;
      }
      if (!P.operator && (h || v) && y !== 0)
        return !1;
    }
    return !(v && b && !h && y !== 0 || h && $ && !v && y !== 0 || w || _);
  }, u = (d, l, m) => {
    if (!d)
      return l;
    const g = f(d.semver, l.semver, m);
    return g > 0 ? d : g < 0 || l.operator === ">" && d.operator === ">=" ? l : d;
  }, a = (d, l, m) => {
    if (!d)
      return l;
    const g = f(d.semver, l.semver, m);
    return g < 0 ? d : g > 0 || l.operator === "<" && d.operator === "<=" ? l : d;
  };
  return ko = r, ko;
}
var qo, lp;
function oS() {
  if (lp) return qo;
  lp = 1;
  const e = kn(), t = cs(), o = lt(), n = H0(), f = Yr(), r = F$(), i = j$(), c = U$(), s = M$(), u = x$(), a = V$(), d = G$(), l = B$(), m = Ct(), g = H$(), v = z$(), h = Qc(), y = K$(), p = W$(), E = fs(), b = Zc(), $ = z0(), _ = K0(), w = el(), P = tl(), T = W0(), G = Y$(), L = ds(), M = Dt(), K = hs(), k = J$(), F = Q$(), X = Z$(), B = eS(), Y = tS(), Z = rl(), V = rS(), C = nS(), U = iS(), D = aS(), R = sS();
  return qo = {
    parse: f,
    valid: r,
    clean: i,
    inc: c,
    diff: s,
    major: u,
    minor: a,
    patch: d,
    prerelease: l,
    compare: m,
    rcompare: g,
    compareLoose: v,
    compareBuild: h,
    sort: y,
    rsort: p,
    gt: E,
    lt: b,
    eq: $,
    neq: _,
    gte: w,
    lte: P,
    cmp: T,
    coerce: G,
    Comparator: L,
    Range: M,
    satisfies: K,
    toComparators: k,
    maxSatisfying: F,
    minSatisfying: X,
    minVersion: B,
    validRange: Y,
    outside: Z,
    gtr: V,
    ltr: C,
    intersects: U,
    simplifyRange: D,
    subset: R,
    SemVer: o,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: t.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: t.RELEASE_TYPES,
    compareIdentifiers: n.compareIdentifiers,
    rcompareIdentifiers: n.rcompareIdentifiers
  }, qo;
}
var uS = oS();
const xr = /* @__PURE__ */ I0(uS), cS = Object.prototype.toString, lS = "[object Uint8Array]", fS = "[object ArrayBuffer]";
function Y0(e, t, o) {
  return e ? e.constructor === t ? !0 : cS.call(e) === o : !1;
}
function X0(e) {
  return Y0(e, Uint8Array, lS);
}
function dS(e) {
  return Y0(e, ArrayBuffer, fS);
}
function hS(e) {
  return X0(e) || dS(e);
}
function pS(e) {
  if (!X0(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function mS(e) {
  if (!hS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Lo(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ??= e.reduce((f, r) => f + r.length, 0);
  const o = new Uint8Array(t);
  let n = 0;
  for (const f of e)
    pS(f), o.set(f, n), n += f.length;
  return o;
}
const fp = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Oa(e, t = "utf8") {
  return mS(e), fp[t] ??= new globalThis.TextDecoder(t), fp[t].decode(e);
}
function yS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const gS = new globalThis.TextEncoder();
function Na(e) {
  return yS(e), gS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Fo = "aes-256-cbc", nr = () => /* @__PURE__ */ Object.create(null), dp = (e) => e !== void 0, jo = (e, t) => {
  const o = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (o.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, sr = "__internal__", Uo = `${sr}.migrations.version`;
class vS {
  path;
  events;
  #i;
  #r;
  #e;
  #t = {};
  #a = !1;
  #s;
  #o;
  #n;
  constructor(t = {}) {
    const o = this.#u(t);
    this.#e = o, this.#c(o), this.#f(o), this.#d(o), this.events = new EventTarget(), this.#r = o.encryptionKey, this.path = this.#h(o), this.#p(o), o.watch && this._watch();
  }
  get(t, o) {
    if (this.#e.accessPropertiesByDotNotation)
      return this._get(t, o);
    const { store: n } = this;
    return t in n ? n[t] : o;
  }
  set(t, o) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && o === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${sr} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, f = (r, i) => {
      if (jo(r, i), this.#e.accessPropertiesByDotNotation)
        Hn(n, r, i);
      else {
        if (r === "__proto__" || r === "constructor" || r === "prototype")
          return;
        n[r] = i;
      }
    };
    if (typeof t == "object") {
      const r = t;
      for (const [i, c] of Object.entries(r))
        f(i, c);
    } else
      f(t, o);
    this.store = n;
  }
  has(t) {
    return this.#e.accessPropertiesByDotNotation ? bs(this.store, t) : t in this.store;
  }
  appendToArray(t, o) {
    jo(t, o);
    const n = this.#e.accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, o]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const o of t)
      dp(this.#t[o]) && this.set(o, this.#t[o]);
  }
  delete(t) {
    const { store: o } = this;
    this.#e.accessPropertiesByDotNotation ? kv(o, t) : delete o[t], this.store = o;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = nr();
    for (const o of Object.keys(this.#t))
      dp(this.#t[o]) && (jo(o, this.#t[o]), this.#e.accessPropertiesByDotNotation ? Hn(t, o, this.#t[o]) : t[o] = this.#t[o]);
    this.store = t;
  }
  onDidChange(t, o) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof o != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof o}`);
    return this._handleValueChange(() => this.get(t), o);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((o) => !this._isReservedKeyPath(o)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    try {
      const t = Re.readFileSync(this.path, this.#r ? null : "utf8"), o = this._decryptData(t), n = this._deserialize(o);
      return this.#a || this._validate(n), Object.assign(nr(), n);
    } catch (t) {
      if (t?.code === "ENOENT")
        return this._ensureDirectory(), nr();
      if (this.#e.clearInvalidConfig) {
        const o = t;
        if (o.name === "SyntaxError" || o.message?.startsWith("Config schema violation:"))
          return nr();
      }
      throw t;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !bs(t, sr))
      try {
        const o = Re.readFileSync(this.path, this.#r ? null : "utf8"), n = this._decryptData(o), f = this._deserialize(n);
        bs(f, sr) && Hn(t, sr, Il(f, sr));
      } catch {
      }
    this.#a || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, o] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, o]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    this.#s && (this.#s.close(), this.#s = void 0), this.#o && (Re.unwatchFile(this.path), this.#o = !1), this.#n = void 0;
  }
  _decryptData(t) {
    if (!this.#r)
      return typeof t == "string" ? t : Oa(t);
    try {
      const o = t.slice(0, 16), n = yr.pbkdf2Sync(this.#r, o, 1e4, 32, "sha512"), f = yr.createDecipheriv(Fo, n, o), r = t.slice(17), i = typeof r == "string" ? Na(r) : r;
      return Oa(Lo([f.update(i), f.final()]));
    } catch {
      try {
        const o = t.slice(0, 16), n = yr.pbkdf2Sync(this.#r, o.toString(), 1e4, 32, "sha512"), f = yr.createDecipheriv(Fo, n, o), r = t.slice(17), i = typeof r == "string" ? Na(r) : r;
        return Oa(Lo([f.update(i), f.final()]));
      } catch {
      }
    }
    return typeof t == "string" ? t : Oa(t);
  }
  _handleStoreChange(t) {
    let o = this.store;
    const n = () => {
      const f = o, r = this.store;
      Ol(r, f) || (o = r, t.call(this, r, f));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, o) {
    let n = t();
    const f = () => {
      const r = n, i = t();
      Ol(i, r) || (n = i, o.call(this, i, r));
    };
    return this.events.addEventListener("change", f), () => {
      this.events.removeEventListener("change", f);
    };
  }
  _deserialize = (t) => JSON.parse(t);
  _serialize = (t) => JSON.stringify(t, void 0, "	");
  _validate(t) {
    if (!this.#i || this.#i(t) || !this.#i.errors)
      return;
    const n = this.#i.errors.map(({ instancePath: f, message: r = "" }) => `\`${f.slice(1)}\` ${r}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Re.mkdirSync(Ce.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let o = this._serialize(t);
    if (this.#r) {
      const n = yr.randomBytes(16), f = yr.pbkdf2Sync(this.#r, n, 1e4, 32, "sha512"), r = yr.createCipheriv(Fo, f, n);
      o = Lo([n, Na(":"), r.update(Na(o)), r.final()]);
    }
    if (He.env.SNAP)
      Re.writeFileSync(this.path, o, { mode: this.#e.configFileMode });
    else
      try {
        N0(this.path, o, { mode: this.#e.configFileMode });
      } catch (n) {
        if (n?.code === "EXDEV") {
          Re.writeFileSync(this.path, o, { mode: this.#e.configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Re.existsSync(this.path) || this._write(nr()), He.platform === "win32" || He.platform === "darwin") {
      this.#n ??= _h(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 });
      const t = Ce.dirname(this.path), o = Ce.basename(this.path);
      this.#s = Re.watch(t, { persistent: !1, encoding: "utf8" }, (n, f) => {
        f && f !== o || typeof this.#n == "function" && this.#n();
      });
    } else
      this.#n ??= _h(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 }), Re.watchFile(this.path, { persistent: !1 }, (t, o) => {
        typeof this.#n == "function" && this.#n();
      }), this.#o = !0;
  }
  _migrate(t, o, n) {
    let f = this._get(Uo, "0.0.0");
    const r = Object.keys(t).filter((c) => this._shouldPerformMigration(c, f, o));
    let i = structuredClone(this.store);
    for (const c of r)
      try {
        n && n(this, {
          fromVersion: f,
          toVersion: c,
          finalVersion: o,
          versions: r
        });
        const s = t[c];
        s?.(this), this._set(Uo, c), f = c, i = structuredClone(this.store);
      } catch (s) {
        this.store = i;
        try {
          this._write(i);
        } catch {
        }
        const u = s instanceof Error ? s.message : String(s);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(f) || !xr.eq(f, o)) && this._set(Uo, o);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [o, n] of Object.entries(t))
      if (this._isReservedKeyPath(o) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === sr || t.startsWith(`${sr}.`);
  }
  _isVersionInRangeFormat(t) {
    return xr.clean(t) === null;
  }
  _shouldPerformMigration(t, o, n) {
    return this._isVersionInRangeFormat(t) ? o !== "0.0.0" && xr.satisfies(o, t) ? !1 : xr.satisfies(n, t) : !(xr.lte(t, o) || xr.gt(t, n));
  }
  _get(t, o) {
    return Il(this.store, t, o);
  }
  _set(t, o) {
    const { store: n } = this;
    Hn(n, t, o), this.store = n;
  }
  #u(t) {
    const o = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...t
    };
    if (!o.cwd) {
      if (!o.projectName)
        throw new Error("Please specify the `projectName` option.");
      o.cwd = jv(o.projectName, { suffix: o.projectSuffix }).config;
    }
    return typeof o.fileExtension == "string" && (o.fileExtension = o.fileExtension.replace(/^\.+/, "")), o;
  }
  #c(t) {
    if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
      return;
    if (t.schema && typeof t.schema != "object")
      throw new TypeError("The `schema` option must be an object.");
    const o = O$.default, n = new Ew.Ajv2020({
      allErrors: !0,
      useDefaults: !0,
      ...t.ajvOptions
    });
    o(n);
    const f = {
      ...t.rootSchema,
      type: "object",
      properties: t.schema
    };
    this.#i = n.compile(f), this.#l(t.schema);
  }
  #l(t) {
    const o = Object.entries(t ?? {});
    for (const [n, f] of o) {
      if (!f || typeof f != "object" || !Object.hasOwn(f, "default"))
        continue;
      const { default: r } = f;
      r !== void 0 && (this.#t[n] = r);
    }
  }
  #f(t) {
    t.defaults && Object.assign(this.#t, t.defaults);
  }
  #d(t) {
    t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
  }
  #h(t) {
    const o = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = o ? `.${o}` : "";
    return Ce.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
  }
  #p(t) {
    if (t.migrations) {
      this.#m(t), this._validate(this.store);
      return;
    }
    const o = this.store, n = Object.assign(nr(), t.defaults ?? {}, o);
    this._validate(n);
    try {
      Nl.deepEqual(o, n);
    } catch {
      this.store = n;
    }
  }
  #m(t) {
    const { migrations: o, projectVersion: n } = t;
    if (o) {
      if (!n)
        throw new Error("Please specify the `projectVersion` option.");
      this.#a = !0;
      try {
        const f = this.store, r = Object.assign(nr(), t.defaults ?? {}, f);
        try {
          Nl.deepEqual(f, r);
        } catch {
          this._write(r);
        }
        this._migrate(o, n, t.beforeEachMigration);
      } finally {
        this.#a = !1;
      }
    }
  }
}
const { app: Ga, ipcMain: Mc, shell: _S } = Wt;
let hp = !1;
const pp = () => {
  if (!Mc || !Ga)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Ga.getPath("userData"),
    appVersion: Ga.getVersion()
  };
  return hp || (Mc.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), hp = !0), e;
};
class J0 extends vS {
  constructor(t) {
    let o, n;
    if (He.type === "renderer") {
      const f = Wt.ipcRenderer.sendSync("electron-store-get-data");
      if (!f)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: o, appVersion: n } = f);
    } else Mc && Ga && ({ defaultCwd: o, appVersion: n } = pp());
    t = {
      name: "config",
      ...t
    }, t.projectVersion ||= n, t.cwd ? t.cwd = Ce.isAbsolute(t.cwd) ? t.cwd : Ce.join(o, t.cwd) : t.cwd = o, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    pp();
  }
  async openInEditor() {
    const t = await _S.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var Sr = {}, Mo = {}, Ia = {}, mp;
function _t() {
  return mp || (mp = 1, Ia.fromCallback = function(e) {
    return Object.defineProperty(function(...t) {
      if (typeof t[t.length - 1] == "function") e.apply(this, t);
      else
        return new Promise((o, n) => {
          t.push((f, r) => f != null ? n(f) : o(r)), e.apply(this, t);
        });
    }, "name", { value: e.name });
  }, Ia.fromPromise = function(e) {
    return Object.defineProperty(function(...t) {
      const o = t[t.length - 1];
      if (typeof o != "function") return e.apply(this, t);
      t.pop(), e.apply(this, t).then((n) => o(null, n), o);
    }, "name", { value: e.name });
  }), Ia;
}
var xo, yp;
function ES() {
  if (yp) return xo;
  yp = 1;
  var e = Nv, t = process.cwd, o = null, n = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return o || (o = t.call(process)), o;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var f = process.chdir;
    process.chdir = function(i) {
      o = null, f.call(process, i);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, f);
  }
  xo = r;
  function r(i) {
    e.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && c(i), i.lutimes || s(i), i.chown = d(i.chown), i.fchown = d(i.fchown), i.lchown = d(i.lchown), i.chmod = u(i.chmod), i.fchmod = u(i.fchmod), i.lchmod = u(i.lchmod), i.chownSync = l(i.chownSync), i.fchownSync = l(i.fchownSync), i.lchownSync = l(i.lchownSync), i.chmodSync = a(i.chmodSync), i.fchmodSync = a(i.fchmodSync), i.lchmodSync = a(i.lchmodSync), i.stat = m(i.stat), i.fstat = m(i.fstat), i.lstat = m(i.lstat), i.statSync = g(i.statSync), i.fstatSync = g(i.fstatSync), i.lstatSync = g(i.lstatSync), i.chmod && !i.lchmod && (i.lchmod = function(h, y, p) {
      p && process.nextTick(p);
    }, i.lchmodSync = function() {
    }), i.chown && !i.lchown && (i.lchown = function(h, y, p, E) {
      E && process.nextTick(E);
    }, i.lchownSync = function() {
    }), n === "win32" && (i.rename = typeof i.rename != "function" ? i.rename : (function(h) {
      function y(p, E, b) {
        var $ = Date.now(), _ = 0;
        h(p, E, function w(P) {
          if (P && (P.code === "EACCES" || P.code === "EPERM" || P.code === "EBUSY") && Date.now() - $ < 6e4) {
            setTimeout(function() {
              i.stat(E, function(T, G) {
                T && T.code === "ENOENT" ? h(p, E, w) : b(P);
              });
            }, _), _ < 100 && (_ += 10);
            return;
          }
          b && b(P);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(y, h), y;
    })(i.rename)), i.read = typeof i.read != "function" ? i.read : (function(h) {
      function y(p, E, b, $, _, w) {
        var P;
        if (w && typeof w == "function") {
          var T = 0;
          P = function(G, L, M) {
            if (G && G.code === "EAGAIN" && T < 10)
              return T++, h.call(i, p, E, b, $, _, P);
            w.apply(this, arguments);
          };
        }
        return h.call(i, p, E, b, $, _, P);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(y, h), y;
    })(i.read), i.readSync = typeof i.readSync != "function" ? i.readSync : /* @__PURE__ */ (function(h) {
      return function(y, p, E, b, $) {
        for (var _ = 0; ; )
          try {
            return h.call(i, y, p, E, b, $);
          } catch (w) {
            if (w.code === "EAGAIN" && _ < 10) {
              _++;
              continue;
            }
            throw w;
          }
      };
    })(i.readSync);
    function c(h) {
      h.lchmod = function(y, p, E) {
        h.open(
          y,
          e.O_WRONLY | e.O_SYMLINK,
          p,
          function(b, $) {
            if (b) {
              E && E(b);
              return;
            }
            h.fchmod($, p, function(_) {
              h.close($, function(w) {
                E && E(_ || w);
              });
            });
          }
        );
      }, h.lchmodSync = function(y, p) {
        var E = h.openSync(y, e.O_WRONLY | e.O_SYMLINK, p), b = !0, $;
        try {
          $ = h.fchmodSync(E, p), b = !1;
        } finally {
          if (b)
            try {
              h.closeSync(E);
            } catch {
            }
          else
            h.closeSync(E);
        }
        return $;
      };
    }
    function s(h) {
      e.hasOwnProperty("O_SYMLINK") && h.futimes ? (h.lutimes = function(y, p, E, b) {
        h.open(y, e.O_SYMLINK, function($, _) {
          if ($) {
            b && b($);
            return;
          }
          h.futimes(_, p, E, function(w) {
            h.close(_, function(P) {
              b && b(w || P);
            });
          });
        });
      }, h.lutimesSync = function(y, p, E) {
        var b = h.openSync(y, e.O_SYMLINK), $, _ = !0;
        try {
          $ = h.futimesSync(b, p, E), _ = !1;
        } finally {
          if (_)
            try {
              h.closeSync(b);
            } catch {
            }
          else
            h.closeSync(b);
        }
        return $;
      }) : h.futimes && (h.lutimes = function(y, p, E, b) {
        b && process.nextTick(b);
      }, h.lutimesSync = function() {
      });
    }
    function u(h) {
      return h && function(y, p, E) {
        return h.call(i, y, p, function(b) {
          v(b) && (b = null), E && E.apply(this, arguments);
        });
      };
    }
    function a(h) {
      return h && function(y, p) {
        try {
          return h.call(i, y, p);
        } catch (E) {
          if (!v(E)) throw E;
        }
      };
    }
    function d(h) {
      return h && function(y, p, E, b) {
        return h.call(i, y, p, E, function($) {
          v($) && ($ = null), b && b.apply(this, arguments);
        });
      };
    }
    function l(h) {
      return h && function(y, p, E) {
        try {
          return h.call(i, y, p, E);
        } catch (b) {
          if (!v(b)) throw b;
        }
      };
    }
    function m(h) {
      return h && function(y, p, E) {
        typeof p == "function" && (E = p, p = null);
        function b($, _) {
          _ && (_.uid < 0 && (_.uid += 4294967296), _.gid < 0 && (_.gid += 4294967296)), E && E.apply(this, arguments);
        }
        return p ? h.call(i, y, p, b) : h.call(i, y, b);
      };
    }
    function g(h) {
      return h && function(y, p) {
        var E = p ? h.call(i, y, p) : h.call(i, y);
        return E && (E.uid < 0 && (E.uid += 4294967296), E.gid < 0 && (E.gid += 4294967296)), E;
      };
    }
    function v(h) {
      if (!h || h.code === "ENOSYS")
        return !0;
      var y = !process.getuid || process.getuid() !== 0;
      return !!(y && (h.code === "EINVAL" || h.code === "EPERM"));
    }
  }
  return xo;
}
var Vo, gp;
function wS() {
  if (gp) return Vo;
  gp = 1;
  var e = Cn.Stream;
  Vo = t;
  function t(o) {
    return {
      ReadStream: n,
      WriteStream: f
    };
    function n(r, i) {
      if (!(this instanceof n)) return new n(r, i);
      e.call(this);
      var c = this;
      this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
      for (var s = Object.keys(i), u = 0, a = s.length; u < a; u++) {
        var d = s[u];
        this[d] = i[d];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          c._read();
        });
        return;
      }
      o.open(this.path, this.flags, this.mode, function(l, m) {
        if (l) {
          c.emit("error", l), c.readable = !1;
          return;
        }
        c.fd = m, c.emit("open", m), c._read();
      });
    }
    function f(r, i) {
      if (!(this instanceof f)) return new f(r, i);
      e.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
      for (var c = Object.keys(i), s = 0, u = c.length; s < u; s++) {
        var a = c[s];
        this[a] = i[a];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = o.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return Vo;
}
var Go, vp;
function $S() {
  if (vp) return Go;
  vp = 1, Go = t;
  var e = Object.getPrototypeOf || function(o) {
    return o.__proto__;
  };
  function t(o) {
    if (o === null || typeof o != "object")
      return o;
    if (o instanceof Object)
      var n = { __proto__: e(o) };
    else
      var n = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(o).forEach(function(f) {
      Object.defineProperty(n, f, Object.getOwnPropertyDescriptor(o, f));
    }), n;
  }
  return Go;
}
var Aa, _p;
function pt() {
  if (_p) return Aa;
  _p = 1;
  var e = ur, t = ES(), o = wS(), n = $S(), f = xc, r, i;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (r = Symbol.for("graceful-fs.queue"), i = Symbol.for("graceful-fs.previous")) : (r = "___graceful-fs.queue", i = "___graceful-fs.previous");
  function c() {
  }
  function s(h, y) {
    Object.defineProperty(h, r, {
      get: function() {
        return y;
      }
    });
  }
  var u = c;
  if (f.debuglog ? u = f.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (u = function() {
    var h = f.format.apply(f, arguments);
    h = "GFS4: " + h.split(/\n/).join(`
GFS4: `), console.error(h);
  }), !e[r]) {
    var a = Ot[r] || [];
    s(e, a), e.close = (function(h) {
      function y(p, E) {
        return h.call(e, p, function(b) {
          b || g(), typeof E == "function" && E.apply(this, arguments);
        });
      }
      return Object.defineProperty(y, i, {
        value: h
      }), y;
    })(e.close), e.closeSync = (function(h) {
      function y(p) {
        h.apply(e, arguments), g();
      }
      return Object.defineProperty(y, i, {
        value: h
      }), y;
    })(e.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      u(e[r]), w0.equal(e[r].length, 0);
    });
  }
  Ot[r] || s(Ot, e[r]), Aa = d(n(e)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !e.__patched && (Aa = d(e), e.__patched = !0);
  function d(h) {
    t(h), h.gracefulify = d, h.createReadStream = C, h.createWriteStream = U;
    var y = h.readFile;
    h.readFile = p;
    function p(O, x, I) {
      return typeof x == "function" && (I = x, x = null), N(O, x, I);
      function N(Q, H, A, q) {
        return y(Q, H, function(W) {
          W && (W.code === "EMFILE" || W.code === "ENFILE") ? l([N, [Q, H, A], W, q || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
        });
      }
    }
    var E = h.writeFile;
    h.writeFile = b;
    function b(O, x, I, N) {
      return typeof I == "function" && (N = I, I = null), Q(O, x, I, N);
      function Q(H, A, q, W, J) {
        return E(H, A, q, function(re) {
          re && (re.code === "EMFILE" || re.code === "ENFILE") ? l([Q, [H, A, q, W], re, J || Date.now(), Date.now()]) : typeof W == "function" && W.apply(this, arguments);
        });
      }
    }
    var $ = h.appendFile;
    $ && (h.appendFile = _);
    function _(O, x, I, N) {
      return typeof I == "function" && (N = I, I = null), Q(O, x, I, N);
      function Q(H, A, q, W, J) {
        return $(H, A, q, function(re) {
          re && (re.code === "EMFILE" || re.code === "ENFILE") ? l([Q, [H, A, q, W], re, J || Date.now(), Date.now()]) : typeof W == "function" && W.apply(this, arguments);
        });
      }
    }
    var w = h.copyFile;
    w && (h.copyFile = P);
    function P(O, x, I, N) {
      return typeof I == "function" && (N = I, I = 0), Q(O, x, I, N);
      function Q(H, A, q, W, J) {
        return w(H, A, q, function(re) {
          re && (re.code === "EMFILE" || re.code === "ENFILE") ? l([Q, [H, A, q, W], re, J || Date.now(), Date.now()]) : typeof W == "function" && W.apply(this, arguments);
        });
      }
    }
    var T = h.readdir;
    h.readdir = L;
    var G = /^v[0-5]\./;
    function L(O, x, I) {
      typeof x == "function" && (I = x, x = null);
      var N = G.test(process.version) ? function(A, q, W, J) {
        return T(A, Q(
          A,
          q,
          W,
          J
        ));
      } : function(A, q, W, J) {
        return T(A, q, Q(
          A,
          q,
          W,
          J
        ));
      };
      return N(O, x, I);
      function Q(H, A, q, W) {
        return function(J, re) {
          J && (J.code === "EMFILE" || J.code === "ENFILE") ? l([
            N,
            [H, A, q],
            J,
            W || Date.now(),
            Date.now()
          ]) : (re && re.sort && re.sort(), typeof q == "function" && q.call(this, J, re));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var M = o(h);
      B = M.ReadStream, Z = M.WriteStream;
    }
    var K = h.ReadStream;
    K && (B.prototype = Object.create(K.prototype), B.prototype.open = Y);
    var k = h.WriteStream;
    k && (Z.prototype = Object.create(k.prototype), Z.prototype.open = V), Object.defineProperty(h, "ReadStream", {
      get: function() {
        return B;
      },
      set: function(O) {
        B = O;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(h, "WriteStream", {
      get: function() {
        return Z;
      },
      set: function(O) {
        Z = O;
      },
      enumerable: !0,
      configurable: !0
    });
    var F = B;
    Object.defineProperty(h, "FileReadStream", {
      get: function() {
        return F;
      },
      set: function(O) {
        F = O;
      },
      enumerable: !0,
      configurable: !0
    });
    var X = Z;
    Object.defineProperty(h, "FileWriteStream", {
      get: function() {
        return X;
      },
      set: function(O) {
        X = O;
      },
      enumerable: !0,
      configurable: !0
    });
    function B(O, x) {
      return this instanceof B ? (K.apply(this, arguments), this) : B.apply(Object.create(B.prototype), arguments);
    }
    function Y() {
      var O = this;
      R(O.path, O.flags, O.mode, function(x, I) {
        x ? (O.autoClose && O.destroy(), O.emit("error", x)) : (O.fd = I, O.emit("open", I), O.read());
      });
    }
    function Z(O, x) {
      return this instanceof Z ? (k.apply(this, arguments), this) : Z.apply(Object.create(Z.prototype), arguments);
    }
    function V() {
      var O = this;
      R(O.path, O.flags, O.mode, function(x, I) {
        x ? (O.destroy(), O.emit("error", x)) : (O.fd = I, O.emit("open", I));
      });
    }
    function C(O, x) {
      return new h.ReadStream(O, x);
    }
    function U(O, x) {
      return new h.WriteStream(O, x);
    }
    var D = h.open;
    h.open = R;
    function R(O, x, I, N) {
      return typeof I == "function" && (N = I, I = null), Q(O, x, I, N);
      function Q(H, A, q, W, J) {
        return D(H, A, q, function(re, fe) {
          re && (re.code === "EMFILE" || re.code === "ENFILE") ? l([Q, [H, A, q, W], re, J || Date.now(), Date.now()]) : typeof W == "function" && W.apply(this, arguments);
        });
      }
    }
    return h;
  }
  function l(h) {
    u("ENQUEUE", h[0].name, h[1]), e[r].push(h), v();
  }
  var m;
  function g() {
    for (var h = Date.now(), y = 0; y < e[r].length; ++y)
      e[r][y].length > 2 && (e[r][y][3] = h, e[r][y][4] = h);
    v();
  }
  function v() {
    if (clearTimeout(m), m = void 0, e[r].length !== 0) {
      var h = e[r].shift(), y = h[0], p = h[1], E = h[2], b = h[3], $ = h[4];
      if (b === void 0)
        u("RETRY", y.name, p), y.apply(null, p);
      else if (Date.now() - b >= 6e4) {
        u("TIMEOUT", y.name, p);
        var _ = p.pop();
        typeof _ == "function" && _.call(null, E);
      } else {
        var w = Date.now() - $, P = Math.max($ - b, 1), T = Math.min(P * 1.2, 100);
        w >= T ? (u("RETRY", y.name, p), y.apply(null, p.concat([b]))) : e[r].push(h);
      }
      m === void 0 && (m = setTimeout(v, 0));
    }
  }
  return Aa;
}
var Ep;
function Xr() {
  return Ep || (Ep = 1, (function(e) {
    const t = _t().fromCallback, o = pt(), n = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((f) => typeof o[f] == "function");
    Object.assign(e, o), n.forEach((f) => {
      e[f] = t(o[f]);
    }), e.exists = function(f, r) {
      return typeof r == "function" ? o.exists(f, r) : new Promise((i) => o.exists(f, i));
    }, e.read = function(f, r, i, c, s, u) {
      return typeof u == "function" ? o.read(f, r, i, c, s, u) : new Promise((a, d) => {
        o.read(f, r, i, c, s, (l, m, g) => {
          if (l) return d(l);
          a({ bytesRead: m, buffer: g });
        });
      });
    }, e.write = function(f, r, ...i) {
      return typeof i[i.length - 1] == "function" ? o.write(f, r, ...i) : new Promise((c, s) => {
        o.write(f, r, ...i, (u, a, d) => {
          if (u) return s(u);
          c({ bytesWritten: a, buffer: d });
        });
      });
    }, typeof o.writev == "function" && (e.writev = function(f, r, ...i) {
      return typeof i[i.length - 1] == "function" ? o.writev(f, r, ...i) : new Promise((c, s) => {
        o.writev(f, r, ...i, (u, a, d) => {
          if (u) return s(u);
          c({ bytesWritten: a, buffers: d });
        });
      });
    }), typeof o.realpath.native == "function" ? e.realpath.native = t(o.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  })(Mo)), Mo;
}
var Ca = {}, Bo = {}, wp;
function SS() {
  if (wp) return Bo;
  wp = 1;
  const e = Ke;
  return Bo.checkPath = function(o) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(o.replace(e.parse(o).root, ""))) {
      const f = new Error(`Path contains invalid characters: ${o}`);
      throw f.code = "EINVAL", f;
    }
  }, Bo;
}
var $p;
function bS() {
  if ($p) return Ca;
  $p = 1;
  const e = /* @__PURE__ */ Xr(), { checkPath: t } = /* @__PURE__ */ SS(), o = (n) => {
    const f = { mode: 511 };
    return typeof n == "number" ? n : { ...f, ...n }.mode;
  };
  return Ca.makeDir = async (n, f) => (t(n), e.mkdir(n, {
    mode: o(f),
    recursive: !0
  })), Ca.makeDirSync = (n, f) => (t(n), e.mkdirSync(n, {
    mode: o(f),
    recursive: !0
  })), Ca;
}
var Ho, Sp;
function Lt() {
  if (Sp) return Ho;
  Sp = 1;
  const e = _t().fromPromise, { makeDir: t, makeDirSync: o } = /* @__PURE__ */ bS(), n = e(t);
  return Ho = {
    mkdirs: n,
    mkdirsSync: o,
    // alias
    mkdirp: n,
    mkdirpSync: o,
    ensureDir: n,
    ensureDirSync: o
  }, Ho;
}
var zo, bp;
function Nr() {
  if (bp) return zo;
  bp = 1;
  const e = _t().fromPromise, t = /* @__PURE__ */ Xr();
  function o(n) {
    return t.access(n).then(() => !0).catch(() => !1);
  }
  return zo = {
    pathExists: e(o),
    pathExistsSync: t.existsSync
  }, zo;
}
var Ko, Rp;
function Q0() {
  if (Rp) return Ko;
  Rp = 1;
  const e = pt();
  function t(n, f, r, i) {
    e.open(n, "r+", (c, s) => {
      if (c) return i(c);
      e.futimes(s, f, r, (u) => {
        e.close(s, (a) => {
          i && i(u || a);
        });
      });
    });
  }
  function o(n, f, r) {
    const i = e.openSync(n, "r+");
    return e.futimesSync(i, f, r), e.closeSync(i);
  }
  return Ko = {
    utimesMillis: t,
    utimesMillisSync: o
  }, Ko;
}
var Wo, Pp;
function Jr() {
  if (Pp) return Wo;
  Pp = 1;
  const e = /* @__PURE__ */ Xr(), t = Ke, o = xc;
  function n(l, m, g) {
    const v = g.dereference ? (h) => e.stat(h, { bigint: !0 }) : (h) => e.lstat(h, { bigint: !0 });
    return Promise.all([
      v(l),
      v(m).catch((h) => {
        if (h.code === "ENOENT") return null;
        throw h;
      })
    ]).then(([h, y]) => ({ srcStat: h, destStat: y }));
  }
  function f(l, m, g) {
    let v;
    const h = g.dereference ? (p) => e.statSync(p, { bigint: !0 }) : (p) => e.lstatSync(p, { bigint: !0 }), y = h(l);
    try {
      v = h(m);
    } catch (p) {
      if (p.code === "ENOENT") return { srcStat: y, destStat: null };
      throw p;
    }
    return { srcStat: y, destStat: v };
  }
  function r(l, m, g, v, h) {
    o.callbackify(n)(l, m, v, (y, p) => {
      if (y) return h(y);
      const { srcStat: E, destStat: b } = p;
      if (b) {
        if (u(E, b)) {
          const $ = t.basename(l), _ = t.basename(m);
          return g === "move" && $ !== _ && $.toLowerCase() === _.toLowerCase() ? h(null, { srcStat: E, destStat: b, isChangingCase: !0 }) : h(new Error("Source and destination must not be the same."));
        }
        if (E.isDirectory() && !b.isDirectory())
          return h(new Error(`Cannot overwrite non-directory '${m}' with directory '${l}'.`));
        if (!E.isDirectory() && b.isDirectory())
          return h(new Error(`Cannot overwrite directory '${m}' with non-directory '${l}'.`));
      }
      return E.isDirectory() && a(l, m) ? h(new Error(d(l, m, g))) : h(null, { srcStat: E, destStat: b });
    });
  }
  function i(l, m, g, v) {
    const { srcStat: h, destStat: y } = f(l, m, v);
    if (y) {
      if (u(h, y)) {
        const p = t.basename(l), E = t.basename(m);
        if (g === "move" && p !== E && p.toLowerCase() === E.toLowerCase())
          return { srcStat: h, destStat: y, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (h.isDirectory() && !y.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${m}' with directory '${l}'.`);
      if (!h.isDirectory() && y.isDirectory())
        throw new Error(`Cannot overwrite directory '${m}' with non-directory '${l}'.`);
    }
    if (h.isDirectory() && a(l, m))
      throw new Error(d(l, m, g));
    return { srcStat: h, destStat: y };
  }
  function c(l, m, g, v, h) {
    const y = t.resolve(t.dirname(l)), p = t.resolve(t.dirname(g));
    if (p === y || p === t.parse(p).root) return h();
    e.stat(p, { bigint: !0 }, (E, b) => E ? E.code === "ENOENT" ? h() : h(E) : u(m, b) ? h(new Error(d(l, g, v))) : c(l, m, p, v, h));
  }
  function s(l, m, g, v) {
    const h = t.resolve(t.dirname(l)), y = t.resolve(t.dirname(g));
    if (y === h || y === t.parse(y).root) return;
    let p;
    try {
      p = e.statSync(y, { bigint: !0 });
    } catch (E) {
      if (E.code === "ENOENT") return;
      throw E;
    }
    if (u(m, p))
      throw new Error(d(l, g, v));
    return s(l, m, y, v);
  }
  function u(l, m) {
    return m.ino && m.dev && m.ino === l.ino && m.dev === l.dev;
  }
  function a(l, m) {
    const g = t.resolve(l).split(t.sep).filter((h) => h), v = t.resolve(m).split(t.sep).filter((h) => h);
    return g.reduce((h, y, p) => h && v[p] === y, !0);
  }
  function d(l, m, g) {
    return `Cannot ${g} '${l}' to a subdirectory of itself, '${m}'.`;
  }
  return Wo = {
    checkPaths: r,
    checkPathsSync: i,
    checkParentPaths: c,
    checkParentPathsSync: s,
    isSrcSubdir: a,
    areIdentical: u
  }, Wo;
}
var Yo, Tp;
function RS() {
  if (Tp) return Yo;
  Tp = 1;
  const e = pt(), t = Ke, o = Lt().mkdirs, n = Nr().pathExists, f = Q0().utimesMillis, r = /* @__PURE__ */ Jr();
  function i(L, M, K, k) {
    typeof K == "function" && !k ? (k = K, K = {}) : typeof K == "function" && (K = { filter: K }), k = k || function() {
    }, K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), r.checkPaths(L, M, "copy", K, (F, X) => {
      if (F) return k(F);
      const { srcStat: B, destStat: Y } = X;
      r.checkParentPaths(L, B, M, "copy", (Z) => Z ? k(Z) : K.filter ? s(c, Y, L, M, K, k) : c(Y, L, M, K, k));
    });
  }
  function c(L, M, K, k, F) {
    const X = t.dirname(K);
    n(X, (B, Y) => {
      if (B) return F(B);
      if (Y) return a(L, M, K, k, F);
      o(X, (Z) => Z ? F(Z) : a(L, M, K, k, F));
    });
  }
  function s(L, M, K, k, F, X) {
    Promise.resolve(F.filter(K, k)).then((B) => B ? L(M, K, k, F, X) : X(), (B) => X(B));
  }
  function u(L, M, K, k, F) {
    return k.filter ? s(a, L, M, K, k, F) : a(L, M, K, k, F);
  }
  function a(L, M, K, k, F) {
    (k.dereference ? e.stat : e.lstat)(M, (B, Y) => B ? F(B) : Y.isDirectory() ? b(Y, L, M, K, k, F) : Y.isFile() || Y.isCharacterDevice() || Y.isBlockDevice() ? d(Y, L, M, K, k, F) : Y.isSymbolicLink() ? T(L, M, K, k, F) : Y.isSocket() ? F(new Error(`Cannot copy a socket file: ${M}`)) : Y.isFIFO() ? F(new Error(`Cannot copy a FIFO pipe: ${M}`)) : F(new Error(`Unknown file: ${M}`)));
  }
  function d(L, M, K, k, F, X) {
    return M ? l(L, K, k, F, X) : m(L, K, k, F, X);
  }
  function l(L, M, K, k, F) {
    if (k.overwrite)
      e.unlink(K, (X) => X ? F(X) : m(L, M, K, k, F));
    else return k.errorOnExist ? F(new Error(`'${K}' already exists`)) : F();
  }
  function m(L, M, K, k, F) {
    e.copyFile(M, K, (X) => X ? F(X) : k.preserveTimestamps ? g(L.mode, M, K, F) : p(K, L.mode, F));
  }
  function g(L, M, K, k) {
    return v(L) ? h(K, L, (F) => F ? k(F) : y(L, M, K, k)) : y(L, M, K, k);
  }
  function v(L) {
    return (L & 128) === 0;
  }
  function h(L, M, K) {
    return p(L, M | 128, K);
  }
  function y(L, M, K, k) {
    E(M, K, (F) => F ? k(F) : p(K, L, k));
  }
  function p(L, M, K) {
    return e.chmod(L, M, K);
  }
  function E(L, M, K) {
    e.stat(L, (k, F) => k ? K(k) : f(M, F.atime, F.mtime, K));
  }
  function b(L, M, K, k, F, X) {
    return M ? _(K, k, F, X) : $(L.mode, K, k, F, X);
  }
  function $(L, M, K, k, F) {
    e.mkdir(K, (X) => {
      if (X) return F(X);
      _(M, K, k, (B) => B ? F(B) : p(K, L, F));
    });
  }
  function _(L, M, K, k) {
    e.readdir(L, (F, X) => F ? k(F) : w(X, L, M, K, k));
  }
  function w(L, M, K, k, F) {
    const X = L.pop();
    return X ? P(L, X, M, K, k, F) : F();
  }
  function P(L, M, K, k, F, X) {
    const B = t.join(K, M), Y = t.join(k, M);
    r.checkPaths(B, Y, "copy", F, (Z, V) => {
      if (Z) return X(Z);
      const { destStat: C } = V;
      u(C, B, Y, F, (U) => U ? X(U) : w(L, K, k, F, X));
    });
  }
  function T(L, M, K, k, F) {
    e.readlink(M, (X, B) => {
      if (X) return F(X);
      if (k.dereference && (B = t.resolve(process.cwd(), B)), L)
        e.readlink(K, (Y, Z) => Y ? Y.code === "EINVAL" || Y.code === "UNKNOWN" ? e.symlink(B, K, F) : F(Y) : (k.dereference && (Z = t.resolve(process.cwd(), Z)), r.isSrcSubdir(B, Z) ? F(new Error(`Cannot copy '${B}' to a subdirectory of itself, '${Z}'.`)) : L.isDirectory() && r.isSrcSubdir(Z, B) ? F(new Error(`Cannot overwrite '${Z}' with '${B}'.`)) : G(B, K, F)));
      else
        return e.symlink(B, K, F);
    });
  }
  function G(L, M, K) {
    e.unlink(M, (k) => k ? K(k) : e.symlink(L, M, K));
  }
  return Yo = i, Yo;
}
var Xo, Op;
function PS() {
  if (Op) return Xo;
  Op = 1;
  const e = pt(), t = Ke, o = Lt().mkdirsSync, n = Q0().utimesMillisSync, f = /* @__PURE__ */ Jr();
  function r(w, P, T) {
    typeof T == "function" && (T = { filter: T }), T = T || {}, T.clobber = "clobber" in T ? !!T.clobber : !0, T.overwrite = "overwrite" in T ? !!T.overwrite : T.clobber, T.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: G, destStat: L } = f.checkPathsSync(w, P, "copy", T);
    return f.checkParentPathsSync(w, G, P, "copy"), i(L, w, P, T);
  }
  function i(w, P, T, G) {
    if (G.filter && !G.filter(P, T)) return;
    const L = t.dirname(T);
    return e.existsSync(L) || o(L), s(w, P, T, G);
  }
  function c(w, P, T, G) {
    if (!(G.filter && !G.filter(P, T)))
      return s(w, P, T, G);
  }
  function s(w, P, T, G) {
    const M = (G.dereference ? e.statSync : e.lstatSync)(P);
    if (M.isDirectory()) return y(M, w, P, T, G);
    if (M.isFile() || M.isCharacterDevice() || M.isBlockDevice()) return u(M, w, P, T, G);
    if (M.isSymbolicLink()) return $(w, P, T, G);
    throw M.isSocket() ? new Error(`Cannot copy a socket file: ${P}`) : M.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${P}`) : new Error(`Unknown file: ${P}`);
  }
  function u(w, P, T, G, L) {
    return P ? a(w, T, G, L) : d(w, T, G, L);
  }
  function a(w, P, T, G) {
    if (G.overwrite)
      return e.unlinkSync(T), d(w, P, T, G);
    if (G.errorOnExist)
      throw new Error(`'${T}' already exists`);
  }
  function d(w, P, T, G) {
    return e.copyFileSync(P, T), G.preserveTimestamps && l(w.mode, P, T), v(T, w.mode);
  }
  function l(w, P, T) {
    return m(w) && g(T, w), h(P, T);
  }
  function m(w) {
    return (w & 128) === 0;
  }
  function g(w, P) {
    return v(w, P | 128);
  }
  function v(w, P) {
    return e.chmodSync(w, P);
  }
  function h(w, P) {
    const T = e.statSync(w);
    return n(P, T.atime, T.mtime);
  }
  function y(w, P, T, G, L) {
    return P ? E(T, G, L) : p(w.mode, T, G, L);
  }
  function p(w, P, T, G) {
    return e.mkdirSync(T), E(P, T, G), v(T, w);
  }
  function E(w, P, T) {
    e.readdirSync(w).forEach((G) => b(G, w, P, T));
  }
  function b(w, P, T, G) {
    const L = t.join(P, w), M = t.join(T, w), { destStat: K } = f.checkPathsSync(L, M, "copy", G);
    return c(K, L, M, G);
  }
  function $(w, P, T, G) {
    let L = e.readlinkSync(P);
    if (G.dereference && (L = t.resolve(process.cwd(), L)), w) {
      let M;
      try {
        M = e.readlinkSync(T);
      } catch (K) {
        if (K.code === "EINVAL" || K.code === "UNKNOWN") return e.symlinkSync(L, T);
        throw K;
      }
      if (G.dereference && (M = t.resolve(process.cwd(), M)), f.isSrcSubdir(L, M))
        throw new Error(`Cannot copy '${L}' to a subdirectory of itself, '${M}'.`);
      if (e.statSync(T).isDirectory() && f.isSrcSubdir(M, L))
        throw new Error(`Cannot overwrite '${M}' with '${L}'.`);
      return _(L, T);
    } else
      return e.symlinkSync(L, T);
  }
  function _(w, P) {
    return e.unlinkSync(P), e.symlinkSync(w, P);
  }
  return Xo = r, Xo;
}
var Jo, Np;
function nl() {
  if (Np) return Jo;
  Np = 1;
  const e = _t().fromCallback;
  return Jo = {
    copy: e(/* @__PURE__ */ RS()),
    copySync: /* @__PURE__ */ PS()
  }, Jo;
}
var Qo, Ip;
function TS() {
  if (Ip) return Qo;
  Ip = 1;
  const e = pt(), t = Ke, o = w0, n = process.platform === "win32";
  function f(g) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((h) => {
      g[h] = g[h] || e[h], h = h + "Sync", g[h] = g[h] || e[h];
    }), g.maxBusyTries = g.maxBusyTries || 3;
  }
  function r(g, v, h) {
    let y = 0;
    typeof v == "function" && (h = v, v = {}), o(g, "rimraf: missing path"), o.strictEqual(typeof g, "string", "rimraf: path should be a string"), o.strictEqual(typeof h, "function", "rimraf: callback function required"), o(v, "rimraf: invalid options argument provided"), o.strictEqual(typeof v, "object", "rimraf: options should be object"), f(v), i(g, v, function p(E) {
      if (E) {
        if ((E.code === "EBUSY" || E.code === "ENOTEMPTY" || E.code === "EPERM") && y < v.maxBusyTries) {
          y++;
          const b = y * 100;
          return setTimeout(() => i(g, v, p), b);
        }
        E.code === "ENOENT" && (E = null);
      }
      h(E);
    });
  }
  function i(g, v, h) {
    o(g), o(v), o(typeof h == "function"), v.lstat(g, (y, p) => {
      if (y && y.code === "ENOENT")
        return h(null);
      if (y && y.code === "EPERM" && n)
        return c(g, v, y, h);
      if (p && p.isDirectory())
        return u(g, v, y, h);
      v.unlink(g, (E) => {
        if (E) {
          if (E.code === "ENOENT")
            return h(null);
          if (E.code === "EPERM")
            return n ? c(g, v, E, h) : u(g, v, E, h);
          if (E.code === "EISDIR")
            return u(g, v, E, h);
        }
        return h(E);
      });
    });
  }
  function c(g, v, h, y) {
    o(g), o(v), o(typeof y == "function"), v.chmod(g, 438, (p) => {
      p ? y(p.code === "ENOENT" ? null : h) : v.stat(g, (E, b) => {
        E ? y(E.code === "ENOENT" ? null : h) : b.isDirectory() ? u(g, v, h, y) : v.unlink(g, y);
      });
    });
  }
  function s(g, v, h) {
    let y;
    o(g), o(v);
    try {
      v.chmodSync(g, 438);
    } catch (p) {
      if (p.code === "ENOENT")
        return;
      throw h;
    }
    try {
      y = v.statSync(g);
    } catch (p) {
      if (p.code === "ENOENT")
        return;
      throw h;
    }
    y.isDirectory() ? l(g, v, h) : v.unlinkSync(g);
  }
  function u(g, v, h, y) {
    o(g), o(v), o(typeof y == "function"), v.rmdir(g, (p) => {
      p && (p.code === "ENOTEMPTY" || p.code === "EEXIST" || p.code === "EPERM") ? a(g, v, y) : p && p.code === "ENOTDIR" ? y(h) : y(p);
    });
  }
  function a(g, v, h) {
    o(g), o(v), o(typeof h == "function"), v.readdir(g, (y, p) => {
      if (y) return h(y);
      let E = p.length, b;
      if (E === 0) return v.rmdir(g, h);
      p.forEach(($) => {
        r(t.join(g, $), v, (_) => {
          if (!b) {
            if (_) return h(b = _);
            --E === 0 && v.rmdir(g, h);
          }
        });
      });
    });
  }
  function d(g, v) {
    let h;
    v = v || {}, f(v), o(g, "rimraf: missing path"), o.strictEqual(typeof g, "string", "rimraf: path should be a string"), o(v, "rimraf: missing options"), o.strictEqual(typeof v, "object", "rimraf: options should be object");
    try {
      h = v.lstatSync(g);
    } catch (y) {
      if (y.code === "ENOENT")
        return;
      y.code === "EPERM" && n && s(g, v, y);
    }
    try {
      h && h.isDirectory() ? l(g, v, null) : v.unlinkSync(g);
    } catch (y) {
      if (y.code === "ENOENT")
        return;
      if (y.code === "EPERM")
        return n ? s(g, v, y) : l(g, v, y);
      if (y.code !== "EISDIR")
        throw y;
      l(g, v, y);
    }
  }
  function l(g, v, h) {
    o(g), o(v);
    try {
      v.rmdirSync(g);
    } catch (y) {
      if (y.code === "ENOTDIR")
        throw h;
      if (y.code === "ENOTEMPTY" || y.code === "EEXIST" || y.code === "EPERM")
        m(g, v);
      else if (y.code !== "ENOENT")
        throw y;
    }
  }
  function m(g, v) {
    if (o(g), o(v), v.readdirSync(g).forEach((h) => d(t.join(g, h), v)), n) {
      const h = Date.now();
      do
        try {
          return v.rmdirSync(g, v);
        } catch {
        }
      while (Date.now() - h < 500);
    } else
      return v.rmdirSync(g, v);
  }
  return Qo = r, r.sync = d, Qo;
}
var Zo, Ap;
function ps() {
  if (Ap) return Zo;
  Ap = 1;
  const e = pt(), t = _t().fromCallback, o = /* @__PURE__ */ TS();
  function n(r, i) {
    if (e.rm) return e.rm(r, { recursive: !0, force: !0 }, i);
    o(r, i);
  }
  function f(r) {
    if (e.rmSync) return e.rmSync(r, { recursive: !0, force: !0 });
    o.sync(r);
  }
  return Zo = {
    remove: t(n),
    removeSync: f
  }, Zo;
}
var eu, Cp;
function OS() {
  if (Cp) return eu;
  Cp = 1;
  const e = _t().fromPromise, t = /* @__PURE__ */ Xr(), o = Ke, n = /* @__PURE__ */ Lt(), f = /* @__PURE__ */ ps(), r = e(async function(s) {
    let u;
    try {
      u = await t.readdir(s);
    } catch {
      return n.mkdirs(s);
    }
    return Promise.all(u.map((a) => f.remove(o.join(s, a))));
  });
  function i(c) {
    let s;
    try {
      s = t.readdirSync(c);
    } catch {
      return n.mkdirsSync(c);
    }
    s.forEach((u) => {
      u = o.join(c, u), f.removeSync(u);
    });
  }
  return eu = {
    emptyDirSync: i,
    emptydirSync: i,
    emptyDir: r,
    emptydir: r
  }, eu;
}
var tu, Dp;
function NS() {
  if (Dp) return tu;
  Dp = 1;
  const e = _t().fromCallback, t = Ke, o = pt(), n = /* @__PURE__ */ Lt();
  function f(i, c) {
    function s() {
      o.writeFile(i, "", (u) => {
        if (u) return c(u);
        c();
      });
    }
    o.stat(i, (u, a) => {
      if (!u && a.isFile()) return c();
      const d = t.dirname(i);
      o.stat(d, (l, m) => {
        if (l)
          return l.code === "ENOENT" ? n.mkdirs(d, (g) => {
            if (g) return c(g);
            s();
          }) : c(l);
        m.isDirectory() ? s() : o.readdir(d, (g) => {
          if (g) return c(g);
        });
      });
    });
  }
  function r(i) {
    let c;
    try {
      c = o.statSync(i);
    } catch {
    }
    if (c && c.isFile()) return;
    const s = t.dirname(i);
    try {
      o.statSync(s).isDirectory() || o.readdirSync(s);
    } catch (u) {
      if (u && u.code === "ENOENT") n.mkdirsSync(s);
      else throw u;
    }
    o.writeFileSync(i, "");
  }
  return tu = {
    createFile: e(f),
    createFileSync: r
  }, tu;
}
var ru, kp;
function IS() {
  if (kp) return ru;
  kp = 1;
  const e = _t().fromCallback, t = Ke, o = pt(), n = /* @__PURE__ */ Lt(), f = Nr().pathExists, { areIdentical: r } = /* @__PURE__ */ Jr();
  function i(s, u, a) {
    function d(l, m) {
      o.link(l, m, (g) => {
        if (g) return a(g);
        a(null);
      });
    }
    o.lstat(u, (l, m) => {
      o.lstat(s, (g, v) => {
        if (g)
          return g.message = g.message.replace("lstat", "ensureLink"), a(g);
        if (m && r(v, m)) return a(null);
        const h = t.dirname(u);
        f(h, (y, p) => {
          if (y) return a(y);
          if (p) return d(s, u);
          n.mkdirs(h, (E) => {
            if (E) return a(E);
            d(s, u);
          });
        });
      });
    });
  }
  function c(s, u) {
    let a;
    try {
      a = o.lstatSync(u);
    } catch {
    }
    try {
      const m = o.lstatSync(s);
      if (a && r(m, a)) return;
    } catch (m) {
      throw m.message = m.message.replace("lstat", "ensureLink"), m;
    }
    const d = t.dirname(u);
    return o.existsSync(d) || n.mkdirsSync(d), o.linkSync(s, u);
  }
  return ru = {
    createLink: e(i),
    createLinkSync: c
  }, ru;
}
var nu, qp;
function AS() {
  if (qp) return nu;
  qp = 1;
  const e = Ke, t = pt(), o = Nr().pathExists;
  function n(r, i, c) {
    if (e.isAbsolute(r))
      return t.lstat(r, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), c(s)) : c(null, {
        toCwd: r,
        toDst: r
      }));
    {
      const s = e.dirname(i), u = e.join(s, r);
      return o(u, (a, d) => a ? c(a) : d ? c(null, {
        toCwd: u,
        toDst: r
      }) : t.lstat(r, (l) => l ? (l.message = l.message.replace("lstat", "ensureSymlink"), c(l)) : c(null, {
        toCwd: r,
        toDst: e.relative(s, r)
      })));
    }
  }
  function f(r, i) {
    let c;
    if (e.isAbsolute(r)) {
      if (c = t.existsSync(r), !c) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: r,
        toDst: r
      };
    } else {
      const s = e.dirname(i), u = e.join(s, r);
      if (c = t.existsSync(u), c)
        return {
          toCwd: u,
          toDst: r
        };
      if (c = t.existsSync(r), !c) throw new Error("relative srcpath does not exist");
      return {
        toCwd: r,
        toDst: e.relative(s, r)
      };
    }
  }
  return nu = {
    symlinkPaths: n,
    symlinkPathsSync: f
  }, nu;
}
var iu, Lp;
function CS() {
  if (Lp) return iu;
  Lp = 1;
  const e = pt();
  function t(n, f, r) {
    if (r = typeof f == "function" ? f : r, f = typeof f == "function" ? !1 : f, f) return r(null, f);
    e.lstat(n, (i, c) => {
      if (i) return r(null, "file");
      f = c && c.isDirectory() ? "dir" : "file", r(null, f);
    });
  }
  function o(n, f) {
    let r;
    if (f) return f;
    try {
      r = e.lstatSync(n);
    } catch {
      return "file";
    }
    return r && r.isDirectory() ? "dir" : "file";
  }
  return iu = {
    symlinkType: t,
    symlinkTypeSync: o
  }, iu;
}
var au, Fp;
function DS() {
  if (Fp) return au;
  Fp = 1;
  const e = _t().fromCallback, t = Ke, o = /* @__PURE__ */ Xr(), n = /* @__PURE__ */ Lt(), f = n.mkdirs, r = n.mkdirsSync, i = /* @__PURE__ */ AS(), c = i.symlinkPaths, s = i.symlinkPathsSync, u = /* @__PURE__ */ CS(), a = u.symlinkType, d = u.symlinkTypeSync, l = Nr().pathExists, { areIdentical: m } = /* @__PURE__ */ Jr();
  function g(y, p, E, b) {
    b = typeof E == "function" ? E : b, E = typeof E == "function" ? !1 : E, o.lstat(p, ($, _) => {
      !$ && _.isSymbolicLink() ? Promise.all([
        o.stat(y),
        o.stat(p)
      ]).then(([w, P]) => {
        if (m(w, P)) return b(null);
        v(y, p, E, b);
      }) : v(y, p, E, b);
    });
  }
  function v(y, p, E, b) {
    c(y, p, ($, _) => {
      if ($) return b($);
      y = _.toDst, a(_.toCwd, E, (w, P) => {
        if (w) return b(w);
        const T = t.dirname(p);
        l(T, (G, L) => {
          if (G) return b(G);
          if (L) return o.symlink(y, p, P, b);
          f(T, (M) => {
            if (M) return b(M);
            o.symlink(y, p, P, b);
          });
        });
      });
    });
  }
  function h(y, p, E) {
    let b;
    try {
      b = o.lstatSync(p);
    } catch {
    }
    if (b && b.isSymbolicLink()) {
      const P = o.statSync(y), T = o.statSync(p);
      if (m(P, T)) return;
    }
    const $ = s(y, p);
    y = $.toDst, E = d($.toCwd, E);
    const _ = t.dirname(p);
    return o.existsSync(_) || r(_), o.symlinkSync(y, p, E);
  }
  return au = {
    createSymlink: e(g),
    createSymlinkSync: h
  }, au;
}
var su, jp;
function kS() {
  if (jp) return su;
  jp = 1;
  const { createFile: e, createFileSync: t } = /* @__PURE__ */ NS(), { createLink: o, createLinkSync: n } = /* @__PURE__ */ IS(), { createSymlink: f, createSymlinkSync: r } = /* @__PURE__ */ DS();
  return su = {
    // file
    createFile: e,
    createFileSync: t,
    ensureFile: e,
    ensureFileSync: t,
    // link
    createLink: o,
    createLinkSync: n,
    ensureLink: o,
    ensureLinkSync: n,
    // symlink
    createSymlink: f,
    createSymlinkSync: r,
    ensureSymlink: f,
    ensureSymlinkSync: r
  }, su;
}
var ou, Up;
function il() {
  if (Up) return ou;
  Up = 1;
  function e(o, { EOL: n = `
`, finalEOL: f = !0, replacer: r = null, spaces: i } = {}) {
    const c = f ? n : "";
    return JSON.stringify(o, r, i).replace(/\n/g, n) + c;
  }
  function t(o) {
    return Buffer.isBuffer(o) && (o = o.toString("utf8")), o.replace(/^\uFEFF/, "");
  }
  return ou = { stringify: e, stripBom: t }, ou;
}
var uu, Mp;
function qS() {
  if (Mp) return uu;
  Mp = 1;
  let e;
  try {
    e = pt();
  } catch {
    e = ur;
  }
  const t = _t(), { stringify: o, stripBom: n } = il();
  async function f(a, d = {}) {
    typeof d == "string" && (d = { encoding: d });
    const l = d.fs || e, m = "throws" in d ? d.throws : !0;
    let g = await t.fromCallback(l.readFile)(a, d);
    g = n(g);
    let v;
    try {
      v = JSON.parse(g, d ? d.reviver : null);
    } catch (h) {
      if (m)
        throw h.message = `${a}: ${h.message}`, h;
      return null;
    }
    return v;
  }
  const r = t.fromPromise(f);
  function i(a, d = {}) {
    typeof d == "string" && (d = { encoding: d });
    const l = d.fs || e, m = "throws" in d ? d.throws : !0;
    try {
      let g = l.readFileSync(a, d);
      return g = n(g), JSON.parse(g, d.reviver);
    } catch (g) {
      if (m)
        throw g.message = `${a}: ${g.message}`, g;
      return null;
    }
  }
  async function c(a, d, l = {}) {
    const m = l.fs || e, g = o(d, l);
    await t.fromCallback(m.writeFile)(a, g, l);
  }
  const s = t.fromPromise(c);
  function u(a, d, l = {}) {
    const m = l.fs || e, g = o(d, l);
    return m.writeFileSync(a, g, l);
  }
  return uu = {
    readFile: r,
    readFileSync: i,
    writeFile: s,
    writeFileSync: u
  }, uu;
}
var cu, xp;
function LS() {
  if (xp) return cu;
  xp = 1;
  const e = qS();
  return cu = {
    // jsonfile exports
    readJson: e.readFile,
    readJsonSync: e.readFileSync,
    writeJson: e.writeFile,
    writeJsonSync: e.writeFileSync
  }, cu;
}
var lu, Vp;
function al() {
  if (Vp) return lu;
  Vp = 1;
  const e = _t().fromCallback, t = pt(), o = Ke, n = /* @__PURE__ */ Lt(), f = Nr().pathExists;
  function r(c, s, u, a) {
    typeof u == "function" && (a = u, u = "utf8");
    const d = o.dirname(c);
    f(d, (l, m) => {
      if (l) return a(l);
      if (m) return t.writeFile(c, s, u, a);
      n.mkdirs(d, (g) => {
        if (g) return a(g);
        t.writeFile(c, s, u, a);
      });
    });
  }
  function i(c, ...s) {
    const u = o.dirname(c);
    if (t.existsSync(u))
      return t.writeFileSync(c, ...s);
    n.mkdirsSync(u), t.writeFileSync(c, ...s);
  }
  return lu = {
    outputFile: e(r),
    outputFileSync: i
  }, lu;
}
var fu, Gp;
function FS() {
  if (Gp) return fu;
  Gp = 1;
  const { stringify: e } = il(), { outputFile: t } = /* @__PURE__ */ al();
  async function o(n, f, r = {}) {
    const i = e(f, r);
    await t(n, i, r);
  }
  return fu = o, fu;
}
var du, Bp;
function jS() {
  if (Bp) return du;
  Bp = 1;
  const { stringify: e } = il(), { outputFileSync: t } = /* @__PURE__ */ al();
  function o(n, f, r) {
    const i = e(f, r);
    t(n, i, r);
  }
  return du = o, du;
}
var hu, Hp;
function US() {
  if (Hp) return hu;
  Hp = 1;
  const e = _t().fromPromise, t = /* @__PURE__ */ LS();
  return t.outputJson = e(/* @__PURE__ */ FS()), t.outputJsonSync = /* @__PURE__ */ jS(), t.outputJSON = t.outputJson, t.outputJSONSync = t.outputJsonSync, t.writeJSON = t.writeJson, t.writeJSONSync = t.writeJsonSync, t.readJSON = t.readJson, t.readJSONSync = t.readJsonSync, hu = t, hu;
}
var pu, zp;
function MS() {
  if (zp) return pu;
  zp = 1;
  const e = pt(), t = Ke, o = nl().copy, n = ps().remove, f = Lt().mkdirp, r = Nr().pathExists, i = /* @__PURE__ */ Jr();
  function c(l, m, g, v) {
    typeof g == "function" && (v = g, g = {}), g = g || {};
    const h = g.overwrite || g.clobber || !1;
    i.checkPaths(l, m, "move", g, (y, p) => {
      if (y) return v(y);
      const { srcStat: E, isChangingCase: b = !1 } = p;
      i.checkParentPaths(l, E, m, "move", ($) => {
        if ($) return v($);
        if (s(m)) return u(l, m, h, b, v);
        f(t.dirname(m), (_) => _ ? v(_) : u(l, m, h, b, v));
      });
    });
  }
  function s(l) {
    const m = t.dirname(l);
    return t.parse(m).root === m;
  }
  function u(l, m, g, v, h) {
    if (v) return a(l, m, g, h);
    if (g)
      return n(m, (y) => y ? h(y) : a(l, m, g, h));
    r(m, (y, p) => y ? h(y) : p ? h(new Error("dest already exists.")) : a(l, m, g, h));
  }
  function a(l, m, g, v) {
    e.rename(l, m, (h) => h ? h.code !== "EXDEV" ? v(h) : d(l, m, g, v) : v());
  }
  function d(l, m, g, v) {
    o(l, m, {
      overwrite: g,
      errorOnExist: !0
    }, (y) => y ? v(y) : n(l, v));
  }
  return pu = c, pu;
}
var mu, Kp;
function xS() {
  if (Kp) return mu;
  Kp = 1;
  const e = pt(), t = Ke, o = nl().copySync, n = ps().removeSync, f = Lt().mkdirpSync, r = /* @__PURE__ */ Jr();
  function i(d, l, m) {
    m = m || {};
    const g = m.overwrite || m.clobber || !1, { srcStat: v, isChangingCase: h = !1 } = r.checkPathsSync(d, l, "move", m);
    return r.checkParentPathsSync(d, v, l, "move"), c(l) || f(t.dirname(l)), s(d, l, g, h);
  }
  function c(d) {
    const l = t.dirname(d);
    return t.parse(l).root === l;
  }
  function s(d, l, m, g) {
    if (g) return u(d, l, m);
    if (m)
      return n(l), u(d, l, m);
    if (e.existsSync(l)) throw new Error("dest already exists.");
    return u(d, l, m);
  }
  function u(d, l, m) {
    try {
      e.renameSync(d, l);
    } catch (g) {
      if (g.code !== "EXDEV") throw g;
      return a(d, l, m);
    }
  }
  function a(d, l, m) {
    return o(d, l, {
      overwrite: m,
      errorOnExist: !0
    }), n(d);
  }
  return mu = i, mu;
}
var yu, Wp;
function VS() {
  if (Wp) return yu;
  Wp = 1;
  const e = _t().fromCallback;
  return yu = {
    move: e(/* @__PURE__ */ MS()),
    moveSync: /* @__PURE__ */ xS()
  }, yu;
}
var gu, Yp;
function lr() {
  return Yp || (Yp = 1, gu = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ Xr(),
    // Export extra methods:
    .../* @__PURE__ */ nl(),
    .../* @__PURE__ */ OS(),
    .../* @__PURE__ */ kS(),
    .../* @__PURE__ */ US(),
    .../* @__PURE__ */ Lt(),
    .../* @__PURE__ */ VS(),
    .../* @__PURE__ */ al(),
    .../* @__PURE__ */ Nr(),
    .../* @__PURE__ */ ps()
  }), gu;
}
var un = {}, br = {}, vu = {}, Rr = {}, Xp;
function sl() {
  if (Xp) return Rr;
  Xp = 1, Object.defineProperty(Rr, "__esModule", { value: !0 }), Rr.CancellationError = Rr.CancellationToken = void 0;
  const e = $0;
  let t = class extends e.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(f) {
      this.removeParentCancelHandler(), this._parent = f, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(f) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, f != null && (this.parent = f);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(f) {
      this.cancelled ? f() : this.once("cancel", f);
    }
    createPromise(f) {
      if (this.cancelled)
        return Promise.reject(new o());
      const r = () => {
        if (i != null)
          try {
            this.removeListener("cancel", i), i = null;
          } catch {
          }
      };
      let i = null;
      return new Promise((c, s) => {
        let u = null;
        if (i = () => {
          try {
            u != null && (u(), u = null);
          } finally {
            s(new o());
          }
        }, this.cancelled) {
          i();
          return;
        }
        this.onCancel(i), f(c, s, (a) => {
          u = a;
        });
      }).then((c) => (r(), c)).catch((c) => {
        throw r(), c;
      });
    }
    removeParentCancelHandler() {
      const f = this._parent;
      f != null && this.parentCancelHandler != null && (f.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  Rr.CancellationToken = t;
  class o extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return Rr.CancellationError = o, Rr;
}
var Da = {}, Jp;
function ms() {
  if (Jp) return Da;
  Jp = 1, Object.defineProperty(Da, "__esModule", { value: !0 }), Da.newError = e;
  function e(t, o) {
    const n = new Error(t);
    return n.code = o, n;
  }
  return Da;
}
var it = {}, ka = { exports: {} }, qa = { exports: {} }, _u, Qp;
function GS() {
  if (Qp) return _u;
  Qp = 1;
  var e = 1e3, t = e * 60, o = t * 60, n = o * 24, f = n * 7, r = n * 365.25;
  _u = function(a, d) {
    d = d || {};
    var l = typeof a;
    if (l === "string" && a.length > 0)
      return i(a);
    if (l === "number" && isFinite(a))
      return d.long ? s(a) : c(a);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(a)
    );
  };
  function i(a) {
    if (a = String(a), !(a.length > 100)) {
      var d = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        a
      );
      if (d) {
        var l = parseFloat(d[1]), m = (d[2] || "ms").toLowerCase();
        switch (m) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return l * r;
          case "weeks":
          case "week":
          case "w":
            return l * f;
          case "days":
          case "day":
          case "d":
            return l * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return l * o;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return l * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return l * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return l;
          default:
            return;
        }
      }
    }
  }
  function c(a) {
    var d = Math.abs(a);
    return d >= n ? Math.round(a / n) + "d" : d >= o ? Math.round(a / o) + "h" : d >= t ? Math.round(a / t) + "m" : d >= e ? Math.round(a / e) + "s" : a + "ms";
  }
  function s(a) {
    var d = Math.abs(a);
    return d >= n ? u(a, d, n, "day") : d >= o ? u(a, d, o, "hour") : d >= t ? u(a, d, t, "minute") : d >= e ? u(a, d, e, "second") : a + " ms";
  }
  function u(a, d, l, m) {
    var g = d >= l * 1.5;
    return Math.round(a / l) + " " + m + (g ? "s" : "");
  }
  return _u;
}
var Eu, Zp;
function Z0() {
  if (Zp) return Eu;
  Zp = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = u, n.disable = c, n.enable = r, n.enabled = s, n.humanize = GS(), n.destroy = a, Object.keys(t).forEach((d) => {
      n[d] = t[d];
    }), n.names = [], n.skips = [], n.formatters = {};
    function o(d) {
      let l = 0;
      for (let m = 0; m < d.length; m++)
        l = (l << 5) - l + d.charCodeAt(m), l |= 0;
      return n.colors[Math.abs(l) % n.colors.length];
    }
    n.selectColor = o;
    function n(d) {
      let l, m = null, g, v;
      function h(...y) {
        if (!h.enabled)
          return;
        const p = h, E = Number(/* @__PURE__ */ new Date()), b = E - (l || E);
        p.diff = b, p.prev = l, p.curr = E, l = E, y[0] = n.coerce(y[0]), typeof y[0] != "string" && y.unshift("%O");
        let $ = 0;
        y[0] = y[0].replace(/%([a-zA-Z%])/g, (w, P) => {
          if (w === "%%")
            return "%";
          $++;
          const T = n.formatters[P];
          if (typeof T == "function") {
            const G = y[$];
            w = T.call(p, G), y.splice($, 1), $--;
          }
          return w;
        }), n.formatArgs.call(p, y), (p.log || n.log).apply(p, y);
      }
      return h.namespace = d, h.useColors = n.useColors(), h.color = n.selectColor(d), h.extend = f, h.destroy = n.destroy, Object.defineProperty(h, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (g !== n.namespaces && (g = n.namespaces, v = n.enabled(d)), v),
        set: (y) => {
          m = y;
        }
      }), typeof n.init == "function" && n.init(h), h;
    }
    function f(d, l) {
      const m = n(this.namespace + (typeof l > "u" ? ":" : l) + d);
      return m.log = this.log, m;
    }
    function r(d) {
      n.save(d), n.namespaces = d, n.names = [], n.skips = [];
      const l = (typeof d == "string" ? d : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const m of l)
        m[0] === "-" ? n.skips.push(m.slice(1)) : n.names.push(m);
    }
    function i(d, l) {
      let m = 0, g = 0, v = -1, h = 0;
      for (; m < d.length; )
        if (g < l.length && (l[g] === d[m] || l[g] === "*"))
          l[g] === "*" ? (v = g, h = m, g++) : (m++, g++);
        else if (v !== -1)
          g = v + 1, h++, m = h;
        else
          return !1;
      for (; g < l.length && l[g] === "*"; )
        g++;
      return g === l.length;
    }
    function c() {
      const d = [
        ...n.names,
        ...n.skips.map((l) => "-" + l)
      ].join(",");
      return n.enable(""), d;
    }
    function s(d) {
      for (const l of n.skips)
        if (i(d, l))
          return !1;
      for (const l of n.names)
        if (i(d, l))
          return !0;
      return !1;
    }
    function u(d) {
      return d instanceof Error ? d.stack || d.message : d;
    }
    function a() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return Eu = e, Eu;
}
var em;
function BS() {
  return em || (em = 1, (function(e, t) {
    t.formatArgs = n, t.save = f, t.load = r, t.useColors = o, t.storage = i(), t.destroy = /* @__PURE__ */ (() => {
      let s = !1;
      return () => {
        s || (s = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function o() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let s;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (s = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(s[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(s) {
      if (s[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + s[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const u = "color: " + this.color;
      s.splice(1, 0, u, "color: inherit");
      let a = 0, d = 0;
      s[0].replace(/%[a-zA-Z%]/g, (l) => {
        l !== "%%" && (a++, l === "%c" && (d = a));
      }), s.splice(d, 0, u);
    }
    t.log = console.debug || console.log || (() => {
    });
    function f(s) {
      try {
        s ? t.storage.setItem("debug", s) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function r() {
      let s;
      try {
        s = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !s && typeof process < "u" && "env" in process && (s = process.env.DEBUG), s;
    }
    function i() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Z0()(t);
    const { formatters: c } = e.exports;
    c.j = function(s) {
      try {
        return JSON.stringify(s);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  })(qa, qa.exports)), qa.exports;
}
var La = { exports: {} }, wu, tm;
function HS() {
  return tm || (tm = 1, wu = (e, t = process.argv) => {
    const o = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(o + e), f = t.indexOf("--");
    return n !== -1 && (f === -1 || n < f);
  }), wu;
}
var $u, rm;
function zS() {
  if (rm) return $u;
  rm = 1;
  const e = Ja, t = S0, o = HS(), { env: n } = process;
  let f;
  o("no-color") || o("no-colors") || o("color=false") || o("color=never") ? f = 0 : (o("color") || o("colors") || o("color=true") || o("color=always")) && (f = 1);
  function r() {
    if ("FORCE_COLOR" in n)
      return n.FORCE_COLOR === "true" ? 1 : n.FORCE_COLOR === "false" ? 0 : n.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(n.FORCE_COLOR, 10), 3);
  }
  function i(u) {
    return u === 0 ? !1 : {
      level: u,
      hasBasic: !0,
      has256: u >= 2,
      has16m: u >= 3
    };
  }
  function c(u, { streamIsTTY: a, sniffFlags: d = !0 } = {}) {
    const l = r();
    l !== void 0 && (f = l);
    const m = d ? f : l;
    if (m === 0)
      return 0;
    if (d) {
      if (o("color=16m") || o("color=full") || o("color=truecolor"))
        return 3;
      if (o("color=256"))
        return 2;
    }
    if (u && !a && m === void 0)
      return 0;
    const g = m || 0;
    if (n.TERM === "dumb")
      return g;
    if (process.platform === "win32") {
      const v = e.release().split(".");
      return Number(v[0]) >= 10 && Number(v[2]) >= 10586 ? Number(v[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((v) => v in n) || n.CI_NAME === "codeship" ? 1 : g;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const v = Number.parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return v >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : g;
  }
  function s(u, a = {}) {
    const d = c(u, {
      streamIsTTY: u && u.isTTY,
      ...a
    });
    return i(d);
  }
  return $u = {
    supportsColor: s,
    stdout: s({ isTTY: t.isatty(1) }),
    stderr: s({ isTTY: t.isatty(2) })
  }, $u;
}
var nm;
function KS() {
  return nm || (nm = 1, (function(e, t) {
    const o = S0, n = xc;
    t.init = a, t.log = c, t.formatArgs = r, t.save = s, t.load = u, t.useColors = f, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const l = zS();
      l && (l.stderr || l).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((l) => /^debug_/i.test(l)).reduce((l, m) => {
      const g = m.substring(6).toLowerCase().replace(/_([a-z])/g, (h, y) => y.toUpperCase());
      let v = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(v) ? v = !0 : /^(no|off|false|disabled)$/i.test(v) ? v = !1 : v === "null" ? v = null : v = Number(v), l[g] = v, l;
    }, {});
    function f() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : o.isatty(process.stderr.fd);
    }
    function r(l) {
      const { namespace: m, useColors: g } = this;
      if (g) {
        const v = this.color, h = "\x1B[3" + (v < 8 ? v : "8;5;" + v), y = `  ${h};1m${m} \x1B[0m`;
        l[0] = y + l[0].split(`
`).join(`
` + y), l.push(h + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        l[0] = i() + m + " " + l[0];
    }
    function i() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function c(...l) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...l) + `
`);
    }
    function s(l) {
      l ? process.env.DEBUG = l : delete process.env.DEBUG;
    }
    function u() {
      return process.env.DEBUG;
    }
    function a(l) {
      l.inspectOpts = {};
      const m = Object.keys(t.inspectOpts);
      for (let g = 0; g < m.length; g++)
        l.inspectOpts[m[g]] = t.inspectOpts[m[g]];
    }
    e.exports = Z0()(t);
    const { formatters: d } = e.exports;
    d.o = function(l) {
      return this.inspectOpts.colors = this.useColors, n.inspect(l, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, d.O = function(l) {
      return this.inspectOpts.colors = this.useColors, n.inspect(l, this.inspectOpts);
    };
  })(La, La.exports)), La.exports;
}
var im;
function WS() {
  return im || (im = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? ka.exports = BS() : ka.exports = KS()), ka.exports;
}
var cn = {}, am;
function eg() {
  if (am) return cn;
  am = 1, Object.defineProperty(cn, "__esModule", { value: !0 }), cn.ProgressCallbackTransform = void 0;
  const e = Cn;
  let t = class extends e.Transform {
    constructor(n, f, r) {
      super(), this.total = n, this.cancellationToken = f, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(n, f, r) {
      if (this.cancellationToken.cancelled) {
        r(new Error("cancelled"), null);
        return;
      }
      this.transferred += n.length, this.delta += n.length;
      const i = Date.now();
      i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
      }), this.delta = 0), r(null, n);
    }
    _flush(n) {
      if (this.cancellationToken.cancelled) {
        n(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, n(null);
    }
  };
  return cn.ProgressCallbackTransform = t, cn;
}
var sm;
function YS() {
  if (sm) return it;
  sm = 1, Object.defineProperty(it, "__esModule", { value: !0 }), it.DigestTransform = it.HttpExecutor = it.HttpError = void 0, it.createHttpError = u, it.parseJson = l, it.configureRequestOptionsFromUrl = g, it.configureRequestUrl = v, it.safeGetHeader = p, it.configureRequestOptions = b, it.safeStringifyJson = $;
  const e = Dn, t = WS(), o = ur, n = Cn, f = Wr, r = sl(), i = ms(), c = eg(), s = (0, t.default)("electron-builder");
  function u(_, w = null) {
    return new d(_.statusCode || -1, `${_.statusCode} ${_.statusMessage}` + (w == null ? "" : `
` + JSON.stringify(w, null, "  ")) + `
Headers: ` + $(_.headers), w);
  }
  const a = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class d extends Error {
    constructor(w, P = `HTTP error: ${a.get(w) || w}`, T = null) {
      super(P), this.statusCode = w, this.description = T, this.name = "HttpError", this.code = `HTTP_ERROR_${w}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  it.HttpError = d;
  function l(_) {
    return _.then((w) => w == null || w.length === 0 ? null : JSON.parse(w));
  }
  class m {
    constructor() {
      this.maxRedirects = 10;
    }
    request(w, P = new r.CancellationToken(), T) {
      b(w);
      const G = T == null ? void 0 : JSON.stringify(T), L = G ? Buffer.from(G) : void 0;
      if (L != null) {
        s(G);
        const { headers: M, ...K } = w;
        w = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": L.length,
            ...M
          },
          ...K
        };
      }
      return this.doApiRequest(w, P, (M) => M.end(L));
    }
    doApiRequest(w, P, T, G = 0) {
      return s.enabled && s(`Request: ${$(w)}`), P.createPromise((L, M, K) => {
        const k = this.createRequest(w, (F) => {
          try {
            this.handleResponse(F, w, P, L, M, G, T);
          } catch (X) {
            M(X);
          }
        });
        this.addErrorAndTimeoutHandlers(k, M, w.timeout), this.addRedirectHandlers(k, w, M, G, (F) => {
          this.doApiRequest(F, P, T, G).then(L).catch(M);
        }), T(k, M), K(() => k.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(w, P, T, G, L) {
    }
    addErrorAndTimeoutHandlers(w, P, T = 60 * 1e3) {
      this.addTimeOutHandler(w, P, T), w.on("error", P), w.on("aborted", () => {
        P(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(w, P, T, G, L, M, K) {
      var k;
      if (s.enabled && s(`Response: ${w.statusCode} ${w.statusMessage}, request options: ${$(P)}`), w.statusCode === 404) {
        L(u(w, `method: ${P.method || "GET"} url: ${P.protocol || "https:"}//${P.hostname}${P.port ? `:${P.port}` : ""}${P.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (w.statusCode === 204) {
        G();
        return;
      }
      const F = (k = w.statusCode) !== null && k !== void 0 ? k : 0, X = F >= 300 && F < 400, B = p(w, "location");
      if (X && B != null) {
        if (M > this.maxRedirects) {
          L(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(m.prepareRedirectUrlOptions(B, P), T, K, M).then(G).catch(L);
        return;
      }
      w.setEncoding("utf8");
      let Y = "";
      w.on("error", L), w.on("data", (Z) => Y += Z), w.on("end", () => {
        try {
          if (w.statusCode != null && w.statusCode >= 400) {
            const Z = p(w, "content-type"), V = Z != null && (Array.isArray(Z) ? Z.find((C) => C.includes("json")) != null : Z.includes("json"));
            L(u(w, `method: ${P.method || "GET"} url: ${P.protocol || "https:"}//${P.hostname}${P.port ? `:${P.port}` : ""}${P.path}

          Data:
          ${V ? JSON.stringify(JSON.parse(Y)) : Y}
          `));
          } else
            G(Y.length === 0 ? null : Y);
        } catch (Z) {
          L(Z);
        }
      });
    }
    async downloadToBuffer(w, P) {
      return await P.cancellationToken.createPromise((T, G, L) => {
        const M = [], K = {
          headers: P.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        v(w, K), b(K), this.doDownload(K, {
          destination: null,
          options: P,
          onCancel: L,
          callback: (k) => {
            k == null ? T(Buffer.concat(M)) : G(k);
          },
          responseHandler: (k, F) => {
            let X = 0;
            k.on("data", (B) => {
              if (X += B.length, X > 524288e3) {
                F(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              M.push(B);
            }), k.on("end", () => {
              F(null);
            });
          }
        }, 0);
      });
    }
    doDownload(w, P, T) {
      const G = this.createRequest(w, (L) => {
        if (L.statusCode >= 400) {
          P.callback(new Error(`Cannot download "${w.protocol || "https:"}//${w.hostname}${w.path}", status ${L.statusCode}: ${L.statusMessage}`));
          return;
        }
        L.on("error", P.callback);
        const M = p(L, "location");
        if (M != null) {
          T < this.maxRedirects ? this.doDownload(m.prepareRedirectUrlOptions(M, w), P, T++) : P.callback(this.createMaxRedirectError());
          return;
        }
        P.responseHandler == null ? E(P, L) : P.responseHandler(L, P.callback);
      });
      this.addErrorAndTimeoutHandlers(G, P.callback, w.timeout), this.addRedirectHandlers(G, w, P.callback, T, (L) => {
        this.doDownload(L, P, T++);
      }), G.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(w, P, T) {
      w.on("socket", (G) => {
        G.setTimeout(T, () => {
          w.abort(), P(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(w, P) {
      const T = g(w, { ...P }), G = T.headers;
      if (G?.authorization) {
        const L = new f.URL(w);
        (L.hostname.endsWith(".amazonaws.com") || L.searchParams.has("X-Amz-Credential")) && delete G.authorization;
      }
      return T;
    }
    static retryOnServerError(w, P = 3) {
      for (let T = 0; ; T++)
        try {
          return w();
        } catch (G) {
          if (T < P && (G instanceof d && G.isServerError() || G.code === "EPIPE"))
            continue;
          throw G;
        }
    }
  }
  it.HttpExecutor = m;
  function g(_, w) {
    const P = b(w);
    return v(new f.URL(_), P), P;
  }
  function v(_, w) {
    w.protocol = _.protocol, w.hostname = _.hostname, _.port ? w.port = _.port : w.port && delete w.port, w.path = _.pathname + _.search;
  }
  class h extends n.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(w, P = "sha512", T = "base64") {
      super(), this.expected = w, this.algorithm = P, this.encoding = T, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, e.createHash)(P);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(w, P, T) {
      this.digester.update(w), T(null, w);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(w) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (P) {
          w(P);
          return;
        }
      w(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, i.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, i.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  it.DigestTransform = h;
  function y(_, w, P) {
    return _ != null && w != null && _ !== w ? (P(new Error(`checksum mismatch: expected ${w} but got ${_} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function p(_, w) {
    const P = _.headers[w];
    return P == null ? null : Array.isArray(P) ? P.length === 0 ? null : P[P.length - 1] : P;
  }
  function E(_, w) {
    if (!y(p(w, "X-Checksum-Sha2"), _.options.sha2, _.callback))
      return;
    const P = [];
    if (_.options.onProgress != null) {
      const M = p(w, "content-length");
      M != null && P.push(new c.ProgressCallbackTransform(parseInt(M, 10), _.options.cancellationToken, _.options.onProgress));
    }
    const T = _.options.sha512;
    T != null ? P.push(new h(T, "sha512", T.length === 128 && !T.includes("+") && !T.includes("Z") && !T.includes("=") ? "hex" : "base64")) : _.options.sha2 != null && P.push(new h(_.options.sha2, "sha256", "hex"));
    const G = (0, o.createWriteStream)(_.destination);
    P.push(G);
    let L = w;
    for (const M of P)
      M.on("error", (K) => {
        G.close(), _.options.cancellationToken.cancelled || _.callback(K);
      }), L = L.pipe(M);
    G.on("finish", () => {
      G.close(_.callback);
    });
  }
  function b(_, w, P) {
    P != null && (_.method = P), _.headers = { ..._.headers };
    const T = _.headers;
    return w != null && (T.authorization = w.startsWith("Basic") || w.startsWith("Bearer") ? w : `token ${w}`), T["User-Agent"] == null && (T["User-Agent"] = "electron-builder"), (P == null || P === "GET" || T["Cache-Control"] == null) && (T["Cache-Control"] = "no-cache"), _.protocol == null && process.versions.electron != null && (_.protocol = "https:"), _;
  }
  function $(_, w) {
    return JSON.stringify(_, (P, T) => P.endsWith("Authorization") || P.endsWith("authorization") || P.endsWith("Password") || P.endsWith("PASSWORD") || P.endsWith("Token") || P.includes("password") || P.includes("token") || w != null && w.has(P) ? "<stripped sensitive data>" : T, 2);
  }
  return it;
}
var ln = {}, om;
function XS() {
  if (om) return ln;
  om = 1, Object.defineProperty(ln, "__esModule", { value: !0 }), ln.MemoLazy = void 0;
  let e = class {
    constructor(n, f) {
      this.selector = n, this.creator = f, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const n = this.selector();
      if (this._value !== void 0 && t(this.selected, n))
        return this._value;
      this.selected = n;
      const f = this.creator(n);
      return this.value = f, f;
    }
    set value(n) {
      this._value = n;
    }
  };
  ln.MemoLazy = e;
  function t(o, n) {
    if (typeof o == "object" && o !== null && (typeof n == "object" && n !== null)) {
      const i = Object.keys(o), c = Object.keys(n);
      return i.length === c.length && i.every((s) => t(o[s], n[s]));
    }
    return o === n;
  }
  return ln;
}
var fn = {}, um;
function JS() {
  if (um) return fn;
  um = 1, Object.defineProperty(fn, "__esModule", { value: !0 }), fn.githubUrl = e, fn.getS3LikeProviderBaseUrl = t;
  function e(r, i = "github.com") {
    return `${r.protocol || "https"}://${r.host || i}`;
  }
  function t(r) {
    const i = r.provider;
    if (i === "s3")
      return o(r);
    if (i === "spaces")
      return f(r);
    throw new Error(`Not supported provider: ${i}`);
  }
  function o(r) {
    let i;
    if (r.accelerate == !0)
      i = `https://${r.bucket}.s3-accelerate.amazonaws.com`;
    else if (r.endpoint != null)
      i = `${r.endpoint}/${r.bucket}`;
    else if (r.bucket.includes(".")) {
      if (r.region == null)
        throw new Error(`Bucket name "${r.bucket}" includes a dot, but S3 region is missing`);
      r.region === "us-east-1" ? i = `https://s3.amazonaws.com/${r.bucket}` : i = `https://s3-${r.region}.amazonaws.com/${r.bucket}`;
    } else r.region === "cn-north-1" ? i = `https://${r.bucket}.s3.${r.region}.amazonaws.com.cn` : i = `https://${r.bucket}.s3.amazonaws.com`;
    return n(i, r.path);
  }
  function n(r, i) {
    return i != null && i.length > 0 && (i.startsWith("/") || (r += "/"), r += i), r;
  }
  function f(r) {
    if (r.name == null)
      throw new Error("name is missing");
    if (r.region == null)
      throw new Error("region is missing");
    return n(`https://${r.name}.${r.region}.digitaloceanspaces.com`, r.path);
  }
  return fn;
}
var Fa = {}, cm;
function QS() {
  if (cm) return Fa;
  cm = 1, Object.defineProperty(Fa, "__esModule", { value: !0 }), Fa.retry = t;
  const e = sl();
  async function t(o, n, f, r = 0, i = 0, c) {
    var s;
    const u = new e.CancellationToken();
    try {
      return await o();
    } catch (a) {
      if ((!((s = c?.(a)) !== null && s !== void 0) || s) && n > 0 && !u.cancelled)
        return await new Promise((d) => setTimeout(d, f + r * i)), await t(o, n - 1, f, r, i + 1, c);
      throw a;
    }
  }
  return Fa;
}
var ja = {}, lm;
function ZS() {
  if (lm) return ja;
  lm = 1, Object.defineProperty(ja, "__esModule", { value: !0 }), ja.parseDn = e;
  function e(t) {
    let o = !1, n = null, f = "", r = 0;
    t = t.trim();
    const i = /* @__PURE__ */ new Map();
    for (let c = 0; c <= t.length; c++) {
      if (c === t.length) {
        n !== null && i.set(n, f);
        break;
      }
      const s = t[c];
      if (o) {
        if (s === '"') {
          o = !1;
          continue;
        }
      } else {
        if (s === '"') {
          o = !0;
          continue;
        }
        if (s === "\\") {
          c++;
          const u = parseInt(t.slice(c, c + 2), 16);
          Number.isNaN(u) ? f += t[c] : (c++, f += String.fromCharCode(u));
          continue;
        }
        if (n === null && s === "=") {
          n = f, f = "";
          continue;
        }
        if (s === "," || s === ";" || s === "+") {
          n !== null && i.set(n, f), n = null, f = "";
          continue;
        }
      }
      if (s === " " && !o) {
        if (f.length === 0)
          continue;
        if (c > r) {
          let u = c;
          for (; t[u] === " "; )
            u++;
          r = u;
        }
        if (r >= t.length || t[r] === "," || t[r] === ";" || n === null && t[r] === "=" || n !== null && t[r] === "+") {
          c = r - 1;
          continue;
        }
      }
      f += s;
    }
    return i;
  }
  return ja;
}
var Pr = {}, fm;
function eb() {
  if (fm) return Pr;
  fm = 1, Object.defineProperty(Pr, "__esModule", { value: !0 }), Pr.nil = Pr.UUID = void 0;
  const e = Dn, t = ms(), o = "options.name must be either a string or a Buffer", n = (0, e.randomBytes)(16);
  n[0] = n[0] | 1;
  const f = {}, r = [];
  for (let d = 0; d < 256; d++) {
    const l = (d + 256).toString(16).substr(1);
    f[l] = d, r[d] = l;
  }
  class i {
    constructor(l) {
      this.ascii = null, this.binary = null;
      const m = i.check(l);
      if (!m)
        throw new Error("not a UUID");
      this.version = m.version, m.format === "ascii" ? this.ascii = l : this.binary = l;
    }
    static v5(l, m) {
      return u(l, "sha1", 80, m);
    }
    toString() {
      return this.ascii == null && (this.ascii = a(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(l, m = 0) {
      if (typeof l == "string")
        return l = l.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(l) ? l === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (f[l[14] + l[15]] & 240) >> 4,
          variant: c((f[l[19] + l[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(l)) {
        if (l.length < m + 16)
          return !1;
        let g = 0;
        for (; g < 16 && l[m + g] === 0; g++)
          ;
        return g === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (l[m + 6] & 240) >> 4,
          variant: c((l[m + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, t.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(l) {
      const m = Buffer.allocUnsafe(16);
      let g = 0;
      for (let v = 0; v < 16; v++)
        m[v] = f[l[g++] + l[g++]], (v === 3 || v === 5 || v === 7 || v === 9) && (g += 1);
      return m;
    }
  }
  Pr.UUID = i, i.OID = i.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function c(d) {
    switch (d) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var s;
  (function(d) {
    d[d.ASCII = 0] = "ASCII", d[d.BINARY = 1] = "BINARY", d[d.OBJECT = 2] = "OBJECT";
  })(s || (s = {}));
  function u(d, l, m, g, v = s.ASCII) {
    const h = (0, e.createHash)(l);
    if (typeof d != "string" && !Buffer.isBuffer(d))
      throw (0, t.newError)(o, "ERR_INVALID_UUID_NAME");
    h.update(g), h.update(d);
    const p = h.digest();
    let E;
    switch (v) {
      case s.BINARY:
        p[6] = p[6] & 15 | m, p[8] = p[8] & 63 | 128, E = p;
        break;
      case s.OBJECT:
        p[6] = p[6] & 15 | m, p[8] = p[8] & 63 | 128, E = new i(p);
        break;
      default:
        E = r[p[0]] + r[p[1]] + r[p[2]] + r[p[3]] + "-" + r[p[4]] + r[p[5]] + "-" + r[p[6] & 15 | m] + r[p[7]] + "-" + r[p[8] & 63 | 128] + r[p[9]] + "-" + r[p[10]] + r[p[11]] + r[p[12]] + r[p[13]] + r[p[14]] + r[p[15]];
        break;
    }
    return E;
  }
  function a(d) {
    return r[d[0]] + r[d[1]] + r[d[2]] + r[d[3]] + "-" + r[d[4]] + r[d[5]] + "-" + r[d[6]] + r[d[7]] + "-" + r[d[8]] + r[d[9]] + "-" + r[d[10]] + r[d[11]] + r[d[12]] + r[d[13]] + r[d[14]] + r[d[15]];
  }
  return Pr.nil = new i("00000000-0000-0000-0000-000000000000"), Pr;
}
var Vr = {}, Su = {}, dm;
function tb() {
  return dm || (dm = 1, (function(e) {
    (function(t) {
      t.parser = function(I, N) {
        return new n(I, N);
      }, t.SAXParser = n, t.SAXStream = a, t.createStream = u, t.MAX_BUFFER_LENGTH = 64 * 1024;
      var o = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      t.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function n(I, N) {
        if (!(this instanceof n))
          return new n(I, N);
        var Q = this;
        r(Q), Q.q = Q.c = "", Q.bufferCheckPosition = t.MAX_BUFFER_LENGTH, Q.opt = N || {}, Q.opt.lowercase = Q.opt.lowercase || Q.opt.lowercasetags, Q.looseCase = Q.opt.lowercase ? "toLowerCase" : "toUpperCase", Q.tags = [], Q.closed = Q.closedRoot = Q.sawRoot = !1, Q.tag = Q.error = null, Q.strict = !!I, Q.noscript = !!(I || Q.opt.noscript), Q.state = T.BEGIN, Q.strictEntities = Q.opt.strictEntities, Q.ENTITIES = Q.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), Q.attribList = [], Q.opt.xmlns && (Q.ns = Object.create(v)), Q.opt.unquotedAttributeValues === void 0 && (Q.opt.unquotedAttributeValues = !I), Q.trackPosition = Q.opt.position !== !1, Q.trackPosition && (Q.position = Q.line = Q.column = 0), L(Q, "onready");
      }
      Object.create || (Object.create = function(I) {
        function N() {
        }
        N.prototype = I;
        var Q = new N();
        return Q;
      }), Object.keys || (Object.keys = function(I) {
        var N = [];
        for (var Q in I) I.hasOwnProperty(Q) && N.push(Q);
        return N;
      });
      function f(I) {
        for (var N = Math.max(t.MAX_BUFFER_LENGTH, 10), Q = 0, H = 0, A = o.length; H < A; H++) {
          var q = I[o[H]].length;
          if (q > N)
            switch (o[H]) {
              case "textNode":
                K(I);
                break;
              case "cdata":
                M(I, "oncdata", I.cdata), I.cdata = "";
                break;
              case "script":
                M(I, "onscript", I.script), I.script = "";
                break;
              default:
                F(I, "Max buffer length exceeded: " + o[H]);
            }
          Q = Math.max(Q, q);
        }
        var W = t.MAX_BUFFER_LENGTH - Q;
        I.bufferCheckPosition = W + I.position;
      }
      function r(I) {
        for (var N = 0, Q = o.length; N < Q; N++)
          I[o[N]] = "";
      }
      function i(I) {
        K(I), I.cdata !== "" && (M(I, "oncdata", I.cdata), I.cdata = ""), I.script !== "" && (M(I, "onscript", I.script), I.script = "");
      }
      n.prototype = {
        end: function() {
          X(this);
        },
        write: x,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          i(this);
        }
      };
      var c;
      try {
        c = require("stream").Stream;
      } catch {
        c = function() {
        };
      }
      c || (c = function() {
      });
      var s = t.EVENTS.filter(function(I) {
        return I !== "error" && I !== "end";
      });
      function u(I, N) {
        return new a(I, N);
      }
      function a(I, N) {
        if (!(this instanceof a))
          return new a(I, N);
        c.apply(this), this._parser = new n(I, N), this.writable = !0, this.readable = !0;
        var Q = this;
        this._parser.onend = function() {
          Q.emit("end");
        }, this._parser.onerror = function(H) {
          Q.emit("error", H), Q._parser.error = null;
        }, this._decoder = null, s.forEach(function(H) {
          Object.defineProperty(Q, "on" + H, {
            get: function() {
              return Q._parser["on" + H];
            },
            set: function(A) {
              if (!A)
                return Q.removeAllListeners(H), Q._parser["on" + H] = A, A;
              Q.on(H, A);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      a.prototype = Object.create(c.prototype, {
        constructor: {
          value: a
        }
      }), a.prototype.write = function(I) {
        if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(I)) {
          if (!this._decoder) {
            var N = Iv.StringDecoder;
            this._decoder = new N("utf8");
          }
          I = this._decoder.write(I);
        }
        return this._parser.write(I.toString()), this.emit("data", I), !0;
      }, a.prototype.end = function(I) {
        return I && I.length && this.write(I), this._parser.end(), !0;
      }, a.prototype.on = function(I, N) {
        var Q = this;
        return !Q._parser["on" + I] && s.indexOf(I) !== -1 && (Q._parser["on" + I] = function() {
          var H = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          H.splice(0, 0, I), Q.emit.apply(Q, H);
        }), c.prototype.on.call(Q, I, N);
      };
      var d = "[CDATA[", l = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", g = "http://www.w3.org/2000/xmlns/", v = { xml: m, xmlns: g }, h = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, y = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, p = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, E = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function b(I) {
        return I === " " || I === `
` || I === "\r" || I === "	";
      }
      function $(I) {
        return I === '"' || I === "'";
      }
      function _(I) {
        return I === ">" || b(I);
      }
      function w(I, N) {
        return I.test(N);
      }
      function P(I, N) {
        return !w(I, N);
      }
      var T = 0;
      t.STATE = {
        BEGIN: T++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: T++,
        // leading whitespace
        TEXT: T++,
        // general stuff
        TEXT_ENTITY: T++,
        // &amp and such.
        OPEN_WAKA: T++,
        // <
        SGML_DECL: T++,
        // <!BLARG
        SGML_DECL_QUOTED: T++,
        // <!BLARG foo "bar
        DOCTYPE: T++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: T++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: T++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: T++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: T++,
        // <!-
        COMMENT: T++,
        // <!--
        COMMENT_ENDING: T++,
        // <!-- blah -
        COMMENT_ENDED: T++,
        // <!-- blah --
        CDATA: T++,
        // <![CDATA[ something
        CDATA_ENDING: T++,
        // ]
        CDATA_ENDING_2: T++,
        // ]]
        PROC_INST: T++,
        // <?hi
        PROC_INST_BODY: T++,
        // <?hi there
        PROC_INST_ENDING: T++,
        // <?hi "there" ?
        OPEN_TAG: T++,
        // <strong
        OPEN_TAG_SLASH: T++,
        // <strong /
        ATTRIB: T++,
        // <a
        ATTRIB_NAME: T++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: T++,
        // <a foo _
        ATTRIB_VALUE: T++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: T++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: T++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: T++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: T++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: T++,
        // <foo bar=&quot
        CLOSE_TAG: T++,
        // </a
        CLOSE_TAG_SAW_WHITE: T++,
        // </a   >
        SCRIPT: T++,
        // <script> ...
        SCRIPT_ENDING: T++
        // <script> ... <
      }, t.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, t.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }, Object.keys(t.ENTITIES).forEach(function(I) {
        var N = t.ENTITIES[I], Q = typeof N == "number" ? String.fromCharCode(N) : N;
        t.ENTITIES[I] = Q;
      });
      for (var G in t.STATE)
        t.STATE[t.STATE[G]] = G;
      T = t.STATE;
      function L(I, N, Q) {
        I[N] && I[N](Q);
      }
      function M(I, N, Q) {
        I.textNode && K(I), L(I, N, Q);
      }
      function K(I) {
        I.textNode = k(I.opt, I.textNode), I.textNode && L(I, "ontext", I.textNode), I.textNode = "";
      }
      function k(I, N) {
        return I.trim && (N = N.trim()), I.normalize && (N = N.replace(/\s+/g, " ")), N;
      }
      function F(I, N) {
        return K(I), I.trackPosition && (N += `
Line: ` + I.line + `
Column: ` + I.column + `
Char: ` + I.c), N = new Error(N), I.error = N, L(I, "onerror", N), I;
      }
      function X(I) {
        return I.sawRoot && !I.closedRoot && B(I, "Unclosed root tag"), I.state !== T.BEGIN && I.state !== T.BEGIN_WHITESPACE && I.state !== T.TEXT && F(I, "Unexpected end"), K(I), I.c = "", I.closed = !0, L(I, "onend"), n.call(I, I.strict, I.opt), I;
      }
      function B(I, N) {
        if (typeof I != "object" || !(I instanceof n))
          throw new Error("bad call to strictFail");
        I.strict && F(I, N);
      }
      function Y(I) {
        I.strict || (I.tagName = I.tagName[I.looseCase]());
        var N = I.tags[I.tags.length - 1] || I, Q = I.tag = { name: I.tagName, attributes: {} };
        I.opt.xmlns && (Q.ns = N.ns), I.attribList.length = 0, M(I, "onopentagstart", Q);
      }
      function Z(I, N) {
        var Q = I.indexOf(":"), H = Q < 0 ? ["", I] : I.split(":"), A = H[0], q = H[1];
        return N && I === "xmlns" && (A = "xmlns", q = ""), { prefix: A, local: q };
      }
      function V(I) {
        if (I.strict || (I.attribName = I.attribName[I.looseCase]()), I.attribList.indexOf(I.attribName) !== -1 || I.tag.attributes.hasOwnProperty(I.attribName)) {
          I.attribName = I.attribValue = "";
          return;
        }
        if (I.opt.xmlns) {
          var N = Z(I.attribName, !0), Q = N.prefix, H = N.local;
          if (Q === "xmlns")
            if (H === "xml" && I.attribValue !== m)
              B(
                I,
                "xml: prefix must be bound to " + m + `
Actual: ` + I.attribValue
              );
            else if (H === "xmlns" && I.attribValue !== g)
              B(
                I,
                "xmlns: prefix must be bound to " + g + `
Actual: ` + I.attribValue
              );
            else {
              var A = I.tag, q = I.tags[I.tags.length - 1] || I;
              A.ns === q.ns && (A.ns = Object.create(q.ns)), A.ns[H] = I.attribValue;
            }
          I.attribList.push([I.attribName, I.attribValue]);
        } else
          I.tag.attributes[I.attribName] = I.attribValue, M(I, "onattribute", {
            name: I.attribName,
            value: I.attribValue
          });
        I.attribName = I.attribValue = "";
      }
      function C(I, N) {
        if (I.opt.xmlns) {
          var Q = I.tag, H = Z(I.tagName);
          Q.prefix = H.prefix, Q.local = H.local, Q.uri = Q.ns[H.prefix] || "", Q.prefix && !Q.uri && (B(
            I,
            "Unbound namespace prefix: " + JSON.stringify(I.tagName)
          ), Q.uri = H.prefix);
          var A = I.tags[I.tags.length - 1] || I;
          Q.ns && A.ns !== Q.ns && Object.keys(Q.ns).forEach(function(S) {
            M(I, "onopennamespace", {
              prefix: S,
              uri: Q.ns[S]
            });
          });
          for (var q = 0, W = I.attribList.length; q < W; q++) {
            var J = I.attribList[q], re = J[0], fe = J[1], ge = Z(re, !0), Oe = ge.prefix, ke = ge.local, Ne = Oe === "" ? "" : Q.ns[Oe] || "", Se = {
              name: re,
              value: fe,
              prefix: Oe,
              local: ke,
              uri: Ne
            };
            Oe && Oe !== "xmlns" && !Ne && (B(
              I,
              "Unbound namespace prefix: " + JSON.stringify(Oe)
            ), Se.uri = Oe), I.tag.attributes[re] = Se, M(I, "onattribute", Se);
          }
          I.attribList.length = 0;
        }
        I.tag.isSelfClosing = !!N, I.sawRoot = !0, I.tags.push(I.tag), M(I, "onopentag", I.tag), N || (!I.noscript && I.tagName.toLowerCase() === "script" ? I.state = T.SCRIPT : I.state = T.TEXT, I.tag = null, I.tagName = ""), I.attribName = I.attribValue = "", I.attribList.length = 0;
      }
      function U(I) {
        if (!I.tagName) {
          B(I, "Weird empty close tag."), I.textNode += "</>", I.state = T.TEXT;
          return;
        }
        if (I.script) {
          if (I.tagName !== "script") {
            I.script += "</" + I.tagName + ">", I.tagName = "", I.state = T.SCRIPT;
            return;
          }
          M(I, "onscript", I.script), I.script = "";
        }
        var N = I.tags.length, Q = I.tagName;
        I.strict || (Q = Q[I.looseCase]());
        for (var H = Q; N--; ) {
          var A = I.tags[N];
          if (A.name !== H)
            B(I, "Unexpected close tag");
          else
            break;
        }
        if (N < 0) {
          B(I, "Unmatched closing tag: " + I.tagName), I.textNode += "</" + I.tagName + ">", I.state = T.TEXT;
          return;
        }
        I.tagName = Q;
        for (var q = I.tags.length; q-- > N; ) {
          var W = I.tag = I.tags.pop();
          I.tagName = I.tag.name, M(I, "onclosetag", I.tagName);
          var J = {};
          for (var re in W.ns)
            J[re] = W.ns[re];
          var fe = I.tags[I.tags.length - 1] || I;
          I.opt.xmlns && W.ns !== fe.ns && Object.keys(W.ns).forEach(function(ge) {
            var Oe = W.ns[ge];
            M(I, "onclosenamespace", { prefix: ge, uri: Oe });
          });
        }
        N === 0 && (I.closedRoot = !0), I.tagName = I.attribValue = I.attribName = "", I.attribList.length = 0, I.state = T.TEXT;
      }
      function D(I) {
        var N = I.entity, Q = N.toLowerCase(), H, A = "";
        return I.ENTITIES[N] ? I.ENTITIES[N] : I.ENTITIES[Q] ? I.ENTITIES[Q] : (N = Q, N.charAt(0) === "#" && (N.charAt(1) === "x" ? (N = N.slice(2), H = parseInt(N, 16), A = H.toString(16)) : (N = N.slice(1), H = parseInt(N, 10), A = H.toString(10))), N = N.replace(/^0+/, ""), isNaN(H) || A.toLowerCase() !== N || H < 0 || H > 1114111 ? (B(I, "Invalid character entity"), "&" + I.entity + ";") : String.fromCodePoint(H));
      }
      function R(I, N) {
        N === "<" ? (I.state = T.OPEN_WAKA, I.startTagPosition = I.position) : b(N) || (B(I, "Non-whitespace before first tag."), I.textNode = N, I.state = T.TEXT);
      }
      function O(I, N) {
        var Q = "";
        return N < I.length && (Q = I.charAt(N)), Q;
      }
      function x(I) {
        var N = this;
        if (this.error)
          throw this.error;
        if (N.closed)
          return F(
            N,
            "Cannot write after close. Assign an onready handler."
          );
        if (I === null)
          return X(N);
        typeof I == "object" && (I = I.toString());
        for (var Q = 0, H = ""; H = O(I, Q++), N.c = H, !!H; )
          switch (N.trackPosition && (N.position++, H === `
` ? (N.line++, N.column = 0) : N.column++), N.state) {
            case T.BEGIN:
              if (N.state = T.BEGIN_WHITESPACE, H === "\uFEFF")
                continue;
              R(N, H);
              continue;
            case T.BEGIN_WHITESPACE:
              R(N, H);
              continue;
            case T.TEXT:
              if (N.sawRoot && !N.closedRoot) {
                for (var q = Q - 1; H && H !== "<" && H !== "&"; )
                  H = O(I, Q++), H && N.trackPosition && (N.position++, H === `
` ? (N.line++, N.column = 0) : N.column++);
                N.textNode += I.substring(q, Q - 1);
              }
              H === "<" && !(N.sawRoot && N.closedRoot && !N.strict) ? (N.state = T.OPEN_WAKA, N.startTagPosition = N.position) : (!b(H) && (!N.sawRoot || N.closedRoot) && B(N, "Text data outside of root node."), H === "&" ? N.state = T.TEXT_ENTITY : N.textNode += H);
              continue;
            case T.SCRIPT:
              H === "<" ? N.state = T.SCRIPT_ENDING : N.script += H;
              continue;
            case T.SCRIPT_ENDING:
              H === "/" ? N.state = T.CLOSE_TAG : (N.script += "<" + H, N.state = T.SCRIPT);
              continue;
            case T.OPEN_WAKA:
              if (H === "!")
                N.state = T.SGML_DECL, N.sgmlDecl = "";
              else if (!b(H)) if (w(h, H))
                N.state = T.OPEN_TAG, N.tagName = H;
              else if (H === "/")
                N.state = T.CLOSE_TAG, N.tagName = "";
              else if (H === "?")
                N.state = T.PROC_INST, N.procInstName = N.procInstBody = "";
              else {
                if (B(N, "Unencoded <"), N.startTagPosition + 1 < N.position) {
                  var A = N.position - N.startTagPosition;
                  H = new Array(A).join(" ") + H;
                }
                N.textNode += "<" + H, N.state = T.TEXT;
              }
              continue;
            case T.SGML_DECL:
              if (N.sgmlDecl + H === "--") {
                N.state = T.COMMENT, N.comment = "", N.sgmlDecl = "";
                continue;
              }
              N.doctype && N.doctype !== !0 && N.sgmlDecl ? (N.state = T.DOCTYPE_DTD, N.doctype += "<!" + N.sgmlDecl + H, N.sgmlDecl = "") : (N.sgmlDecl + H).toUpperCase() === d ? (M(N, "onopencdata"), N.state = T.CDATA, N.sgmlDecl = "", N.cdata = "") : (N.sgmlDecl + H).toUpperCase() === l ? (N.state = T.DOCTYPE, (N.doctype || N.sawRoot) && B(
                N,
                "Inappropriately located doctype declaration"
              ), N.doctype = "", N.sgmlDecl = "") : H === ">" ? (M(N, "onsgmldeclaration", N.sgmlDecl), N.sgmlDecl = "", N.state = T.TEXT) : ($(H) && (N.state = T.SGML_DECL_QUOTED), N.sgmlDecl += H);
              continue;
            case T.SGML_DECL_QUOTED:
              H === N.q && (N.state = T.SGML_DECL, N.q = ""), N.sgmlDecl += H;
              continue;
            case T.DOCTYPE:
              H === ">" ? (N.state = T.TEXT, M(N, "ondoctype", N.doctype), N.doctype = !0) : (N.doctype += H, H === "[" ? N.state = T.DOCTYPE_DTD : $(H) && (N.state = T.DOCTYPE_QUOTED, N.q = H));
              continue;
            case T.DOCTYPE_QUOTED:
              N.doctype += H, H === N.q && (N.q = "", N.state = T.DOCTYPE);
              continue;
            case T.DOCTYPE_DTD:
              H === "]" ? (N.doctype += H, N.state = T.DOCTYPE) : H === "<" ? (N.state = T.OPEN_WAKA, N.startTagPosition = N.position) : $(H) ? (N.doctype += H, N.state = T.DOCTYPE_DTD_QUOTED, N.q = H) : N.doctype += H;
              continue;
            case T.DOCTYPE_DTD_QUOTED:
              N.doctype += H, H === N.q && (N.state = T.DOCTYPE_DTD, N.q = "");
              continue;
            case T.COMMENT:
              H === "-" ? N.state = T.COMMENT_ENDING : N.comment += H;
              continue;
            case T.COMMENT_ENDING:
              H === "-" ? (N.state = T.COMMENT_ENDED, N.comment = k(N.opt, N.comment), N.comment && M(N, "oncomment", N.comment), N.comment = "") : (N.comment += "-" + H, N.state = T.COMMENT);
              continue;
            case T.COMMENT_ENDED:
              H !== ">" ? (B(N, "Malformed comment"), N.comment += "--" + H, N.state = T.COMMENT) : N.doctype && N.doctype !== !0 ? N.state = T.DOCTYPE_DTD : N.state = T.TEXT;
              continue;
            case T.CDATA:
              for (var q = Q - 1; H && H !== "]"; )
                H = O(I, Q++), H && N.trackPosition && (N.position++, H === `
` ? (N.line++, N.column = 0) : N.column++);
              N.cdata += I.substring(q, Q - 1), H === "]" && (N.state = T.CDATA_ENDING);
              continue;
            case T.CDATA_ENDING:
              H === "]" ? N.state = T.CDATA_ENDING_2 : (N.cdata += "]" + H, N.state = T.CDATA);
              continue;
            case T.CDATA_ENDING_2:
              H === ">" ? (N.cdata && M(N, "oncdata", N.cdata), M(N, "onclosecdata"), N.cdata = "", N.state = T.TEXT) : H === "]" ? N.cdata += "]" : (N.cdata += "]]" + H, N.state = T.CDATA);
              continue;
            case T.PROC_INST:
              H === "?" ? N.state = T.PROC_INST_ENDING : b(H) ? N.state = T.PROC_INST_BODY : N.procInstName += H;
              continue;
            case T.PROC_INST_BODY:
              if (!N.procInstBody && b(H))
                continue;
              H === "?" ? N.state = T.PROC_INST_ENDING : N.procInstBody += H;
              continue;
            case T.PROC_INST_ENDING:
              H === ">" ? (M(N, "onprocessinginstruction", {
                name: N.procInstName,
                body: N.procInstBody
              }), N.procInstName = N.procInstBody = "", N.state = T.TEXT) : (N.procInstBody += "?" + H, N.state = T.PROC_INST_BODY);
              continue;
            case T.OPEN_TAG:
              w(y, H) ? N.tagName += H : (Y(N), H === ">" ? C(N) : H === "/" ? N.state = T.OPEN_TAG_SLASH : (b(H) || B(N, "Invalid character in tag name"), N.state = T.ATTRIB));
              continue;
            case T.OPEN_TAG_SLASH:
              H === ">" ? (C(N, !0), U(N)) : (B(
                N,
                "Forward-slash in opening tag not followed by >"
              ), N.state = T.ATTRIB);
              continue;
            case T.ATTRIB:
              if (b(H))
                continue;
              H === ">" ? C(N) : H === "/" ? N.state = T.OPEN_TAG_SLASH : w(h, H) ? (N.attribName = H, N.attribValue = "", N.state = T.ATTRIB_NAME) : B(N, "Invalid attribute name");
              continue;
            case T.ATTRIB_NAME:
              H === "=" ? N.state = T.ATTRIB_VALUE : H === ">" ? (B(N, "Attribute without value"), N.attribValue = N.attribName, V(N), C(N)) : b(H) ? N.state = T.ATTRIB_NAME_SAW_WHITE : w(y, H) ? N.attribName += H : B(N, "Invalid attribute name");
              continue;
            case T.ATTRIB_NAME_SAW_WHITE:
              if (H === "=")
                N.state = T.ATTRIB_VALUE;
              else {
                if (b(H))
                  continue;
                B(N, "Attribute without value"), N.tag.attributes[N.attribName] = "", N.attribValue = "", M(N, "onattribute", {
                  name: N.attribName,
                  value: ""
                }), N.attribName = "", H === ">" ? C(N) : w(h, H) ? (N.attribName = H, N.state = T.ATTRIB_NAME) : (B(N, "Invalid attribute name"), N.state = T.ATTRIB);
              }
              continue;
            case T.ATTRIB_VALUE:
              if (b(H))
                continue;
              $(H) ? (N.q = H, N.state = T.ATTRIB_VALUE_QUOTED) : (N.opt.unquotedAttributeValues || F(N, "Unquoted attribute value"), N.state = T.ATTRIB_VALUE_UNQUOTED, N.attribValue = H);
              continue;
            case T.ATTRIB_VALUE_QUOTED:
              if (H !== N.q) {
                H === "&" ? N.state = T.ATTRIB_VALUE_ENTITY_Q : N.attribValue += H;
                continue;
              }
              V(N), N.q = "", N.state = T.ATTRIB_VALUE_CLOSED;
              continue;
            case T.ATTRIB_VALUE_CLOSED:
              b(H) ? N.state = T.ATTRIB : H === ">" ? C(N) : H === "/" ? N.state = T.OPEN_TAG_SLASH : w(h, H) ? (B(N, "No whitespace between attributes"), N.attribName = H, N.attribValue = "", N.state = T.ATTRIB_NAME) : B(N, "Invalid attribute name");
              continue;
            case T.ATTRIB_VALUE_UNQUOTED:
              if (!_(H)) {
                H === "&" ? N.state = T.ATTRIB_VALUE_ENTITY_U : N.attribValue += H;
                continue;
              }
              V(N), H === ">" ? C(N) : N.state = T.ATTRIB;
              continue;
            case T.CLOSE_TAG:
              if (N.tagName)
                H === ">" ? U(N) : w(y, H) ? N.tagName += H : N.script ? (N.script += "</" + N.tagName, N.tagName = "", N.state = T.SCRIPT) : (b(H) || B(N, "Invalid tagname in closing tag"), N.state = T.CLOSE_TAG_SAW_WHITE);
              else {
                if (b(H))
                  continue;
                P(h, H) ? N.script ? (N.script += "</" + H, N.state = T.SCRIPT) : B(N, "Invalid tagname in closing tag.") : N.tagName = H;
              }
              continue;
            case T.CLOSE_TAG_SAW_WHITE:
              if (b(H))
                continue;
              H === ">" ? U(N) : B(N, "Invalid characters in closing tag");
              continue;
            case T.TEXT_ENTITY:
            case T.ATTRIB_VALUE_ENTITY_Q:
            case T.ATTRIB_VALUE_ENTITY_U:
              var W, J;
              switch (N.state) {
                case T.TEXT_ENTITY:
                  W = T.TEXT, J = "textNode";
                  break;
                case T.ATTRIB_VALUE_ENTITY_Q:
                  W = T.ATTRIB_VALUE_QUOTED, J = "attribValue";
                  break;
                case T.ATTRIB_VALUE_ENTITY_U:
                  W = T.ATTRIB_VALUE_UNQUOTED, J = "attribValue";
                  break;
              }
              if (H === ";") {
                var re = D(N);
                N.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(re) ? (N.entity = "", N.state = W, N.write(re)) : (N[J] += re, N.entity = "", N.state = W);
              } else w(N.entity.length ? E : p, H) ? N.entity += H : (B(N, "Invalid character in entity name"), N[J] += "&" + N.entity + H, N.entity = "", N.state = W);
              continue;
            default:
              throw new Error(N, "Unknown state: " + N.state);
          }
        return N.position >= N.bufferCheckPosition && f(N), N;
      }
      String.fromCodePoint || (function() {
        var I = String.fromCharCode, N = Math.floor, Q = function() {
          var H = 16384, A = [], q, W, J = -1, re = arguments.length;
          if (!re)
            return "";
          for (var fe = ""; ++J < re; ) {
            var ge = Number(arguments[J]);
            if (!isFinite(ge) || // `NaN`, `+Infinity`, or `-Infinity`
            ge < 0 || // not a valid Unicode code point
            ge > 1114111 || // not a valid Unicode code point
            N(ge) !== ge)
              throw RangeError("Invalid code point: " + ge);
            ge <= 65535 ? A.push(ge) : (ge -= 65536, q = (ge >> 10) + 55296, W = ge % 1024 + 56320, A.push(q, W)), (J + 1 === re || A.length > H) && (fe += I.apply(null, A), A.length = 0);
          }
          return fe;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: Q,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = Q;
      })();
    })(e);
  })(Su)), Su;
}
var hm;
function rb() {
  if (hm) return Vr;
  hm = 1, Object.defineProperty(Vr, "__esModule", { value: !0 }), Vr.XElement = void 0, Vr.parseXml = i;
  const e = tb(), t = ms();
  class o {
    constructor(s) {
      if (this.name = s, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !s)
        throw (0, t.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!f(s))
        throw (0, t.newError)(`Invalid element name: ${s}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(s) {
      const u = this.attributes === null ? null : this.attributes[s];
      if (u == null)
        throw (0, t.newError)(`No attribute "${s}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return u;
    }
    removeAttribute(s) {
      this.attributes !== null && delete this.attributes[s];
    }
    element(s, u = !1, a = null) {
      const d = this.elementOrNull(s, u);
      if (d === null)
        throw (0, t.newError)(a || `No element "${s}"`, "ERR_XML_MISSED_ELEMENT");
      return d;
    }
    elementOrNull(s, u = !1) {
      if (this.elements === null)
        return null;
      for (const a of this.elements)
        if (r(a, s, u))
          return a;
      return null;
    }
    getElements(s, u = !1) {
      return this.elements === null ? [] : this.elements.filter((a) => r(a, s, u));
    }
    elementValueOrEmpty(s, u = !1) {
      const a = this.elementOrNull(s, u);
      return a === null ? "" : a.value;
    }
  }
  Vr.XElement = o;
  const n = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function f(c) {
    return n.test(c);
  }
  function r(c, s, u) {
    const a = c.name;
    return a === s || u === !0 && a.length === s.length && a.toLowerCase() === s.toLowerCase();
  }
  function i(c) {
    let s = null;
    const u = e.parser(!0, {}), a = [];
    return u.onopentag = (d) => {
      const l = new o(d.name);
      if (l.attributes = d.attributes, s === null)
        s = l;
      else {
        const m = a[a.length - 1];
        m.elements == null && (m.elements = []), m.elements.push(l);
      }
      a.push(l);
    }, u.onclosetag = () => {
      a.pop();
    }, u.ontext = (d) => {
      a.length > 0 && (a[a.length - 1].value = d);
    }, u.oncdata = (d) => {
      const l = a[a.length - 1];
      l.value = d, l.isCData = !0;
    }, u.onerror = (d) => {
      throw d;
    }, u.write(c), s;
  }
  return Vr;
}
var pm;
function et() {
  return pm || (pm = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = d;
    var t = sl();
    Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
      return t.CancellationError;
    } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return t.CancellationToken;
    } });
    var o = ms();
    Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
      return o.newError;
    } });
    var n = YS();
    Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
      return n.configureRequestOptions;
    } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return n.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
      return n.configureRequestUrl;
    } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
      return n.createHttpError;
    } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
      return n.DigestTransform;
    } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
      return n.HttpError;
    } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
      return n.HttpExecutor;
    } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
      return n.parseJson;
    } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
      return n.safeGetHeader;
    } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
      return n.safeStringifyJson;
    } });
    var f = XS();
    Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
      return f.MemoLazy;
    } });
    var r = eg();
    Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return r.ProgressCallbackTransform;
    } });
    var i = JS();
    Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return i.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
      return i.githubUrl;
    } });
    var c = QS();
    Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
      return c.retry;
    } });
    var s = ZS();
    Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
      return s.parseDn;
    } });
    var u = eb();
    Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
      return u.UUID;
    } });
    var a = rb();
    Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
      return a.parseXml;
    } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
      return a.XElement;
    } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
    function d(l) {
      return l == null ? [] : Array.isArray(l) ? l : [l];
    }
  })(vu)), vu;
}
var at = {}, Ua = {}, ir = {}, mm;
function qn() {
  if (mm) return ir;
  mm = 1;
  function e(i) {
    return typeof i > "u" || i === null;
  }
  function t(i) {
    return typeof i == "object" && i !== null;
  }
  function o(i) {
    return Array.isArray(i) ? i : e(i) ? [] : [i];
  }
  function n(i, c) {
    var s, u, a, d;
    if (c)
      for (d = Object.keys(c), s = 0, u = d.length; s < u; s += 1)
        a = d[s], i[a] = c[a];
    return i;
  }
  function f(i, c) {
    var s = "", u;
    for (u = 0; u < c; u += 1)
      s += i;
    return s;
  }
  function r(i) {
    return i === 0 && Number.NEGATIVE_INFINITY === 1 / i;
  }
  return ir.isNothing = e, ir.isObject = t, ir.toArray = o, ir.repeat = f, ir.isNegativeZero = r, ir.extend = n, ir;
}
var bu, ym;
function Ln() {
  if (ym) return bu;
  ym = 1;
  function e(o, n) {
    var f = "", r = o.reason || "(unknown reason)";
    return o.mark ? (o.mark.name && (f += 'in "' + o.mark.name + '" '), f += "(" + (o.mark.line + 1) + ":" + (o.mark.column + 1) + ")", !n && o.mark.snippet && (f += `

` + o.mark.snippet), r + " " + f) : r;
  }
  function t(o, n) {
    Error.call(this), this.name = "YAMLException", this.reason = o, this.mark = n, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t.prototype.toString = function(n) {
    return this.name + ": " + e(this, n);
  }, bu = t, bu;
}
var Ru, gm;
function nb() {
  if (gm) return Ru;
  gm = 1;
  var e = qn();
  function t(f, r, i, c, s) {
    var u = "", a = "", d = Math.floor(s / 2) - 1;
    return c - r > d && (u = " ... ", r = c - d + u.length), i - c > d && (a = " ...", i = c + d - a.length), {
      str: u + f.slice(r, i).replace(/\t/g, "→") + a,
      pos: c - r + u.length
      // relative position
    };
  }
  function o(f, r) {
    return e.repeat(" ", r - f.length) + f;
  }
  function n(f, r) {
    if (r = Object.create(r || null), !f.buffer) return null;
    r.maxLength || (r.maxLength = 79), typeof r.indent != "number" && (r.indent = 1), typeof r.linesBefore != "number" && (r.linesBefore = 3), typeof r.linesAfter != "number" && (r.linesAfter = 2);
    for (var i = /\r?\n|\r|\0/g, c = [0], s = [], u, a = -1; u = i.exec(f.buffer); )
      s.push(u.index), c.push(u.index + u[0].length), f.position <= u.index && a < 0 && (a = c.length - 2);
    a < 0 && (a = c.length - 1);
    var d = "", l, m, g = Math.min(f.line + r.linesAfter, s.length).toString().length, v = r.maxLength - (r.indent + g + 3);
    for (l = 1; l <= r.linesBefore && !(a - l < 0); l++)
      m = t(
        f.buffer,
        c[a - l],
        s[a - l],
        f.position - (c[a] - c[a - l]),
        v
      ), d = e.repeat(" ", r.indent) + o((f.line - l + 1).toString(), g) + " | " + m.str + `
` + d;
    for (m = t(f.buffer, c[a], s[a], f.position, v), d += e.repeat(" ", r.indent) + o((f.line + 1).toString(), g) + " | " + m.str + `
`, d += e.repeat("-", r.indent + g + 3 + m.pos) + `^
`, l = 1; l <= r.linesAfter && !(a + l >= s.length); l++)
      m = t(
        f.buffer,
        c[a + l],
        s[a + l],
        f.position - (c[a] - c[a + l]),
        v
      ), d += e.repeat(" ", r.indent) + o((f.line + l + 1).toString(), g) + " | " + m.str + `
`;
    return d.replace(/\n$/, "");
  }
  return Ru = n, Ru;
}
var Pu, vm;
function ft() {
  if (vm) return Pu;
  vm = 1;
  var e = Ln(), t = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], o = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function n(r) {
    var i = {};
    return r !== null && Object.keys(r).forEach(function(c) {
      r[c].forEach(function(s) {
        i[String(s)] = c;
      });
    }), i;
  }
  function f(r, i) {
    if (i = i || {}, Object.keys(i).forEach(function(c) {
      if (t.indexOf(c) === -1)
        throw new e('Unknown option "' + c + '" is met in definition of "' + r + '" YAML type.');
    }), this.options = i, this.tag = r, this.kind = i.kind || null, this.resolve = i.resolve || function() {
      return !0;
    }, this.construct = i.construct || function(c) {
      return c;
    }, this.instanceOf = i.instanceOf || null, this.predicate = i.predicate || null, this.represent = i.represent || null, this.representName = i.representName || null, this.defaultStyle = i.defaultStyle || null, this.multi = i.multi || !1, this.styleAliases = n(i.styleAliases || null), o.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + r + '" YAML type.');
  }
  return Pu = f, Pu;
}
var Tu, _m;
function tg() {
  if (_m) return Tu;
  _m = 1;
  var e = Ln(), t = ft();
  function o(r, i) {
    var c = [];
    return r[i].forEach(function(s) {
      var u = c.length;
      c.forEach(function(a, d) {
        a.tag === s.tag && a.kind === s.kind && a.multi === s.multi && (u = d);
      }), c[u] = s;
    }), c;
  }
  function n() {
    var r = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, i, c;
    function s(u) {
      u.multi ? (r.multi[u.kind].push(u), r.multi.fallback.push(u)) : r[u.kind][u.tag] = r.fallback[u.tag] = u;
    }
    for (i = 0, c = arguments.length; i < c; i += 1)
      arguments[i].forEach(s);
    return r;
  }
  function f(r) {
    return this.extend(r);
  }
  return f.prototype.extend = function(i) {
    var c = [], s = [];
    if (i instanceof t)
      s.push(i);
    else if (Array.isArray(i))
      s = s.concat(i);
    else if (i && (Array.isArray(i.implicit) || Array.isArray(i.explicit)))
      i.implicit && (c = c.concat(i.implicit)), i.explicit && (s = s.concat(i.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    c.forEach(function(a) {
      if (!(a instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (a.loadKind && a.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (a.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), s.forEach(function(a) {
      if (!(a instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    var u = Object.create(f.prototype);
    return u.implicit = (this.implicit || []).concat(c), u.explicit = (this.explicit || []).concat(s), u.compiledImplicit = o(u, "implicit"), u.compiledExplicit = o(u, "explicit"), u.compiledTypeMap = n(u.compiledImplicit, u.compiledExplicit), u;
  }, Tu = f, Tu;
}
var Ou, Em;
function rg() {
  if (Em) return Ou;
  Em = 1;
  var e = ft();
  return Ou = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(t) {
      return t !== null ? t : "";
    }
  }), Ou;
}
var Nu, wm;
function ng() {
  if (wm) return Nu;
  wm = 1;
  var e = ft();
  return Nu = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(t) {
      return t !== null ? t : [];
    }
  }), Nu;
}
var Iu, $m;
function ig() {
  if ($m) return Iu;
  $m = 1;
  var e = ft();
  return Iu = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(t) {
      return t !== null ? t : {};
    }
  }), Iu;
}
var Au, Sm;
function ag() {
  if (Sm) return Au;
  Sm = 1;
  var e = tg();
  return Au = new e({
    explicit: [
      rg(),
      ng(),
      ig()
    ]
  }), Au;
}
var Cu, bm;
function sg() {
  if (bm) return Cu;
  bm = 1;
  var e = ft();
  function t(f) {
    if (f === null) return !0;
    var r = f.length;
    return r === 1 && f === "~" || r === 4 && (f === "null" || f === "Null" || f === "NULL");
  }
  function o() {
    return null;
  }
  function n(f) {
    return f === null;
  }
  return Cu = new e("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: t,
    construct: o,
    predicate: n,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), Cu;
}
var Du, Rm;
function og() {
  if (Rm) return Du;
  Rm = 1;
  var e = ft();
  function t(f) {
    if (f === null) return !1;
    var r = f.length;
    return r === 4 && (f === "true" || f === "True" || f === "TRUE") || r === 5 && (f === "false" || f === "False" || f === "FALSE");
  }
  function o(f) {
    return f === "true" || f === "True" || f === "TRUE";
  }
  function n(f) {
    return Object.prototype.toString.call(f) === "[object Boolean]";
  }
  return Du = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: t,
    construct: o,
    predicate: n,
    represent: {
      lowercase: function(f) {
        return f ? "true" : "false";
      },
      uppercase: function(f) {
        return f ? "TRUE" : "FALSE";
      },
      camelcase: function(f) {
        return f ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), Du;
}
var ku, Pm;
function ug() {
  if (Pm) return ku;
  Pm = 1;
  var e = qn(), t = ft();
  function o(s) {
    return 48 <= s && s <= 57 || 65 <= s && s <= 70 || 97 <= s && s <= 102;
  }
  function n(s) {
    return 48 <= s && s <= 55;
  }
  function f(s) {
    return 48 <= s && s <= 57;
  }
  function r(s) {
    if (s === null) return !1;
    var u = s.length, a = 0, d = !1, l;
    if (!u) return !1;
    if (l = s[a], (l === "-" || l === "+") && (l = s[++a]), l === "0") {
      if (a + 1 === u) return !0;
      if (l = s[++a], l === "b") {
        for (a++; a < u; a++)
          if (l = s[a], l !== "_") {
            if (l !== "0" && l !== "1") return !1;
            d = !0;
          }
        return d && l !== "_";
      }
      if (l === "x") {
        for (a++; a < u; a++)
          if (l = s[a], l !== "_") {
            if (!o(s.charCodeAt(a))) return !1;
            d = !0;
          }
        return d && l !== "_";
      }
      if (l === "o") {
        for (a++; a < u; a++)
          if (l = s[a], l !== "_") {
            if (!n(s.charCodeAt(a))) return !1;
            d = !0;
          }
        return d && l !== "_";
      }
    }
    if (l === "_") return !1;
    for (; a < u; a++)
      if (l = s[a], l !== "_") {
        if (!f(s.charCodeAt(a)))
          return !1;
        d = !0;
      }
    return !(!d || l === "_");
  }
  function i(s) {
    var u = s, a = 1, d;
    if (u.indexOf("_") !== -1 && (u = u.replace(/_/g, "")), d = u[0], (d === "-" || d === "+") && (d === "-" && (a = -1), u = u.slice(1), d = u[0]), u === "0") return 0;
    if (d === "0") {
      if (u[1] === "b") return a * parseInt(u.slice(2), 2);
      if (u[1] === "x") return a * parseInt(u.slice(2), 16);
      if (u[1] === "o") return a * parseInt(u.slice(2), 8);
    }
    return a * parseInt(u, 10);
  }
  function c(s) {
    return Object.prototype.toString.call(s) === "[object Number]" && s % 1 === 0 && !e.isNegativeZero(s);
  }
  return ku = new t("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: r,
    construct: i,
    predicate: c,
    represent: {
      binary: function(s) {
        return s >= 0 ? "0b" + s.toString(2) : "-0b" + s.toString(2).slice(1);
      },
      octal: function(s) {
        return s >= 0 ? "0o" + s.toString(8) : "-0o" + s.toString(8).slice(1);
      },
      decimal: function(s) {
        return s.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(s) {
        return s >= 0 ? "0x" + s.toString(16).toUpperCase() : "-0x" + s.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), ku;
}
var qu, Tm;
function cg() {
  if (Tm) return qu;
  Tm = 1;
  var e = qn(), t = ft(), o = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function n(s) {
    return !(s === null || !o.test(s) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    s[s.length - 1] === "_");
  }
  function f(s) {
    var u, a;
    return u = s.replace(/_/g, "").toLowerCase(), a = u[0] === "-" ? -1 : 1, "+-".indexOf(u[0]) >= 0 && (u = u.slice(1)), u === ".inf" ? a === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : u === ".nan" ? NaN : a * parseFloat(u, 10);
  }
  var r = /^[-+]?[0-9]+e/;
  function i(s, u) {
    var a;
    if (isNaN(s))
      switch (u) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === s)
      switch (u) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === s)
      switch (u) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (e.isNegativeZero(s))
      return "-0.0";
    return a = s.toString(10), r.test(a) ? a.replace("e", ".e") : a;
  }
  function c(s) {
    return Object.prototype.toString.call(s) === "[object Number]" && (s % 1 !== 0 || e.isNegativeZero(s));
  }
  return qu = new t("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: n,
    construct: f,
    predicate: c,
    represent: i,
    defaultStyle: "lowercase"
  }), qu;
}
var Lu, Om;
function lg() {
  return Om || (Om = 1, Lu = ag().extend({
    implicit: [
      sg(),
      og(),
      ug(),
      cg()
    ]
  })), Lu;
}
var Fu, Nm;
function fg() {
  return Nm || (Nm = 1, Fu = lg()), Fu;
}
var ju, Im;
function dg() {
  if (Im) return ju;
  Im = 1;
  var e = ft(), t = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), o = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function n(i) {
    return i === null ? !1 : t.exec(i) !== null || o.exec(i) !== null;
  }
  function f(i) {
    var c, s, u, a, d, l, m, g = 0, v = null, h, y, p;
    if (c = t.exec(i), c === null && (c = o.exec(i)), c === null) throw new Error("Date resolve error");
    if (s = +c[1], u = +c[2] - 1, a = +c[3], !c[4])
      return new Date(Date.UTC(s, u, a));
    if (d = +c[4], l = +c[5], m = +c[6], c[7]) {
      for (g = c[7].slice(0, 3); g.length < 3; )
        g += "0";
      g = +g;
    }
    return c[9] && (h = +c[10], y = +(c[11] || 0), v = (h * 60 + y) * 6e4, c[9] === "-" && (v = -v)), p = new Date(Date.UTC(s, u, a, d, l, m, g)), v && p.setTime(p.getTime() - v), p;
  }
  function r(i) {
    return i.toISOString();
  }
  return ju = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: n,
    construct: f,
    instanceOf: Date,
    represent: r
  }), ju;
}
var Uu, Am;
function hg() {
  if (Am) return Uu;
  Am = 1;
  var e = ft();
  function t(o) {
    return o === "<<" || o === null;
  }
  return Uu = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: t
  }), Uu;
}
var Mu, Cm;
function pg() {
  if (Cm) return Mu;
  Cm = 1;
  var e = ft(), t = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function o(i) {
    if (i === null) return !1;
    var c, s, u = 0, a = i.length, d = t;
    for (s = 0; s < a; s++)
      if (c = d.indexOf(i.charAt(s)), !(c > 64)) {
        if (c < 0) return !1;
        u += 6;
      }
    return u % 8 === 0;
  }
  function n(i) {
    var c, s, u = i.replace(/[\r\n=]/g, ""), a = u.length, d = t, l = 0, m = [];
    for (c = 0; c < a; c++)
      c % 4 === 0 && c && (m.push(l >> 16 & 255), m.push(l >> 8 & 255), m.push(l & 255)), l = l << 6 | d.indexOf(u.charAt(c));
    return s = a % 4 * 6, s === 0 ? (m.push(l >> 16 & 255), m.push(l >> 8 & 255), m.push(l & 255)) : s === 18 ? (m.push(l >> 10 & 255), m.push(l >> 2 & 255)) : s === 12 && m.push(l >> 4 & 255), new Uint8Array(m);
  }
  function f(i) {
    var c = "", s = 0, u, a, d = i.length, l = t;
    for (u = 0; u < d; u++)
      u % 3 === 0 && u && (c += l[s >> 18 & 63], c += l[s >> 12 & 63], c += l[s >> 6 & 63], c += l[s & 63]), s = (s << 8) + i[u];
    return a = d % 3, a === 0 ? (c += l[s >> 18 & 63], c += l[s >> 12 & 63], c += l[s >> 6 & 63], c += l[s & 63]) : a === 2 ? (c += l[s >> 10 & 63], c += l[s >> 4 & 63], c += l[s << 2 & 63], c += l[64]) : a === 1 && (c += l[s >> 2 & 63], c += l[s << 4 & 63], c += l[64], c += l[64]), c;
  }
  function r(i) {
    return Object.prototype.toString.call(i) === "[object Uint8Array]";
  }
  return Mu = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: o,
    construct: n,
    predicate: r,
    represent: f
  }), Mu;
}
var xu, Dm;
function mg() {
  if (Dm) return xu;
  Dm = 1;
  var e = ft(), t = Object.prototype.hasOwnProperty, o = Object.prototype.toString;
  function n(r) {
    if (r === null) return !0;
    var i = [], c, s, u, a, d, l = r;
    for (c = 0, s = l.length; c < s; c += 1) {
      if (u = l[c], d = !1, o.call(u) !== "[object Object]") return !1;
      for (a in u)
        if (t.call(u, a))
          if (!d) d = !0;
          else return !1;
      if (!d) return !1;
      if (i.indexOf(a) === -1) i.push(a);
      else return !1;
    }
    return !0;
  }
  function f(r) {
    return r !== null ? r : [];
  }
  return xu = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: n,
    construct: f
  }), xu;
}
var Vu, km;
function yg() {
  if (km) return Vu;
  km = 1;
  var e = ft(), t = Object.prototype.toString;
  function o(f) {
    if (f === null) return !0;
    var r, i, c, s, u, a = f;
    for (u = new Array(a.length), r = 0, i = a.length; r < i; r += 1) {
      if (c = a[r], t.call(c) !== "[object Object]" || (s = Object.keys(c), s.length !== 1)) return !1;
      u[r] = [s[0], c[s[0]]];
    }
    return !0;
  }
  function n(f) {
    if (f === null) return [];
    var r, i, c, s, u, a = f;
    for (u = new Array(a.length), r = 0, i = a.length; r < i; r += 1)
      c = a[r], s = Object.keys(c), u[r] = [s[0], c[s[0]]];
    return u;
  }
  return Vu = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: o,
    construct: n
  }), Vu;
}
var Gu, qm;
function gg() {
  if (qm) return Gu;
  qm = 1;
  var e = ft(), t = Object.prototype.hasOwnProperty;
  function o(f) {
    if (f === null) return !0;
    var r, i = f;
    for (r in i)
      if (t.call(i, r) && i[r] !== null)
        return !1;
    return !0;
  }
  function n(f) {
    return f !== null ? f : {};
  }
  return Gu = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: o,
    construct: n
  }), Gu;
}
var Bu, Lm;
function ol() {
  return Lm || (Lm = 1, Bu = fg().extend({
    implicit: [
      dg(),
      hg()
    ],
    explicit: [
      pg(),
      mg(),
      yg(),
      gg()
    ]
  })), Bu;
}
var Fm;
function ib() {
  if (Fm) return Ua;
  Fm = 1;
  var e = qn(), t = Ln(), o = nb(), n = ol(), f = Object.prototype.hasOwnProperty, r = 1, i = 2, c = 3, s = 4, u = 1, a = 2, d = 3, l = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, m = /[\x85\u2028\u2029]/, g = /[,\[\]\{\}]/, v = /^(?:!|!!|![a-z\-]+!)$/i, h = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function y(S) {
    return Object.prototype.toString.call(S);
  }
  function p(S) {
    return S === 10 || S === 13;
  }
  function E(S) {
    return S === 9 || S === 32;
  }
  function b(S) {
    return S === 9 || S === 32 || S === 10 || S === 13;
  }
  function $(S) {
    return S === 44 || S === 91 || S === 93 || S === 123 || S === 125;
  }
  function _(S) {
    var te;
    return 48 <= S && S <= 57 ? S - 48 : (te = S | 32, 97 <= te && te <= 102 ? te - 97 + 10 : -1);
  }
  function w(S) {
    return S === 120 ? 2 : S === 117 ? 4 : S === 85 ? 8 : 0;
  }
  function P(S) {
    return 48 <= S && S <= 57 ? S - 48 : -1;
  }
  function T(S) {
    return S === 48 ? "\0" : S === 97 ? "\x07" : S === 98 ? "\b" : S === 116 || S === 9 ? "	" : S === 110 ? `
` : S === 118 ? "\v" : S === 102 ? "\f" : S === 114 ? "\r" : S === 101 ? "\x1B" : S === 32 ? " " : S === 34 ? '"' : S === 47 ? "/" : S === 92 ? "\\" : S === 78 ? "" : S === 95 ? " " : S === 76 ? "\u2028" : S === 80 ? "\u2029" : "";
  }
  function G(S) {
    return S <= 65535 ? String.fromCharCode(S) : String.fromCharCode(
      (S - 65536 >> 10) + 55296,
      (S - 65536 & 1023) + 56320
    );
  }
  function L(S, te, ie) {
    te === "__proto__" ? Object.defineProperty(S, te, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: ie
    }) : S[te] = ie;
  }
  for (var M = new Array(256), K = new Array(256), k = 0; k < 256; k++)
    M[k] = T(k) ? 1 : 0, K[k] = T(k);
  function F(S, te) {
    this.input = S, this.filename = te.filename || null, this.schema = te.schema || n, this.onWarning = te.onWarning || null, this.legacy = te.legacy || !1, this.json = te.json || !1, this.listener = te.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = S.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
  }
  function X(S, te) {
    var ie = {
      name: S.filename,
      buffer: S.input.slice(0, -1),
      // omit trailing \0
      position: S.position,
      line: S.line,
      column: S.position - S.lineStart
    };
    return ie.snippet = o(ie), new t(te, ie);
  }
  function B(S, te) {
    throw X(S, te);
  }
  function Y(S, te) {
    S.onWarning && S.onWarning.call(null, X(S, te));
  }
  var Z = {
    YAML: function(te, ie, pe) {
      var ae, de, le;
      te.version !== null && B(te, "duplication of %YAML directive"), pe.length !== 1 && B(te, "YAML directive accepts exactly one argument"), ae = /^([0-9]+)\.([0-9]+)$/.exec(pe[0]), ae === null && B(te, "ill-formed argument of the YAML directive"), de = parseInt(ae[1], 10), le = parseInt(ae[2], 10), de !== 1 && B(te, "unacceptable YAML version of the document"), te.version = pe[0], te.checkLineBreaks = le < 2, le !== 1 && le !== 2 && Y(te, "unsupported YAML version of the document");
    },
    TAG: function(te, ie, pe) {
      var ae, de;
      pe.length !== 2 && B(te, "TAG directive accepts exactly two arguments"), ae = pe[0], de = pe[1], v.test(ae) || B(te, "ill-formed tag handle (first argument) of the TAG directive"), f.call(te.tagMap, ae) && B(te, 'there is a previously declared suffix for "' + ae + '" tag handle'), h.test(de) || B(te, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        de = decodeURIComponent(de);
      } catch {
        B(te, "tag prefix is malformed: " + de);
      }
      te.tagMap[ae] = de;
    }
  };
  function V(S, te, ie, pe) {
    var ae, de, le, me;
    if (te < ie) {
      if (me = S.input.slice(te, ie), pe)
        for (ae = 0, de = me.length; ae < de; ae += 1)
          le = me.charCodeAt(ae), le === 9 || 32 <= le && le <= 1114111 || B(S, "expected valid JSON character");
      else l.test(me) && B(S, "the stream contains non-printable characters");
      S.result += me;
    }
  }
  function C(S, te, ie, pe) {
    var ae, de, le, me;
    for (e.isObject(ie) || B(S, "cannot merge mappings; the provided source object is unacceptable"), ae = Object.keys(ie), le = 0, me = ae.length; le < me; le += 1)
      de = ae[le], f.call(te, de) || (L(te, de, ie[de]), pe[de] = !0);
  }
  function U(S, te, ie, pe, ae, de, le, me, ve) {
    var Fe, je;
    if (Array.isArray(ae))
      for (ae = Array.prototype.slice.call(ae), Fe = 0, je = ae.length; Fe < je; Fe += 1)
        Array.isArray(ae[Fe]) && B(S, "nested arrays are not supported inside keys"), typeof ae == "object" && y(ae[Fe]) === "[object Object]" && (ae[Fe] = "[object Object]");
    if (typeof ae == "object" && y(ae) === "[object Object]" && (ae = "[object Object]"), ae = String(ae), te === null && (te = {}), pe === "tag:yaml.org,2002:merge")
      if (Array.isArray(de))
        for (Fe = 0, je = de.length; Fe < je; Fe += 1)
          C(S, te, de[Fe], ie);
      else
        C(S, te, de, ie);
    else
      !S.json && !f.call(ie, ae) && f.call(te, ae) && (S.line = le || S.line, S.lineStart = me || S.lineStart, S.position = ve || S.position, B(S, "duplicated mapping key")), L(te, ae, de), delete ie[ae];
    return te;
  }
  function D(S) {
    var te;
    te = S.input.charCodeAt(S.position), te === 10 ? S.position++ : te === 13 ? (S.position++, S.input.charCodeAt(S.position) === 10 && S.position++) : B(S, "a line break is expected"), S.line += 1, S.lineStart = S.position, S.firstTabInLine = -1;
  }
  function R(S, te, ie) {
    for (var pe = 0, ae = S.input.charCodeAt(S.position); ae !== 0; ) {
      for (; E(ae); )
        ae === 9 && S.firstTabInLine === -1 && (S.firstTabInLine = S.position), ae = S.input.charCodeAt(++S.position);
      if (te && ae === 35)
        do
          ae = S.input.charCodeAt(++S.position);
        while (ae !== 10 && ae !== 13 && ae !== 0);
      if (p(ae))
        for (D(S), ae = S.input.charCodeAt(S.position), pe++, S.lineIndent = 0; ae === 32; )
          S.lineIndent++, ae = S.input.charCodeAt(++S.position);
      else
        break;
    }
    return ie !== -1 && pe !== 0 && S.lineIndent < ie && Y(S, "deficient indentation"), pe;
  }
  function O(S) {
    var te = S.position, ie;
    return ie = S.input.charCodeAt(te), !!((ie === 45 || ie === 46) && ie === S.input.charCodeAt(te + 1) && ie === S.input.charCodeAt(te + 2) && (te += 3, ie = S.input.charCodeAt(te), ie === 0 || b(ie)));
  }
  function x(S, te) {
    te === 1 ? S.result += " " : te > 1 && (S.result += e.repeat(`
`, te - 1));
  }
  function I(S, te, ie) {
    var pe, ae, de, le, me, ve, Fe, je, $e = S.kind, j = S.result, ne;
    if (ne = S.input.charCodeAt(S.position), b(ne) || $(ne) || ne === 35 || ne === 38 || ne === 42 || ne === 33 || ne === 124 || ne === 62 || ne === 39 || ne === 34 || ne === 37 || ne === 64 || ne === 96 || (ne === 63 || ne === 45) && (ae = S.input.charCodeAt(S.position + 1), b(ae) || ie && $(ae)))
      return !1;
    for (S.kind = "scalar", S.result = "", de = le = S.position, me = !1; ne !== 0; ) {
      if (ne === 58) {
        if (ae = S.input.charCodeAt(S.position + 1), b(ae) || ie && $(ae))
          break;
      } else if (ne === 35) {
        if (pe = S.input.charCodeAt(S.position - 1), b(pe))
          break;
      } else {
        if (S.position === S.lineStart && O(S) || ie && $(ne))
          break;
        if (p(ne))
          if (ve = S.line, Fe = S.lineStart, je = S.lineIndent, R(S, !1, -1), S.lineIndent >= te) {
            me = !0, ne = S.input.charCodeAt(S.position);
            continue;
          } else {
            S.position = le, S.line = ve, S.lineStart = Fe, S.lineIndent = je;
            break;
          }
      }
      me && (V(S, de, le, !1), x(S, S.line - ve), de = le = S.position, me = !1), E(ne) || (le = S.position + 1), ne = S.input.charCodeAt(++S.position);
    }
    return V(S, de, le, !1), S.result ? !0 : (S.kind = $e, S.result = j, !1);
  }
  function N(S, te) {
    var ie, pe, ae;
    if (ie = S.input.charCodeAt(S.position), ie !== 39)
      return !1;
    for (S.kind = "scalar", S.result = "", S.position++, pe = ae = S.position; (ie = S.input.charCodeAt(S.position)) !== 0; )
      if (ie === 39)
        if (V(S, pe, S.position, !0), ie = S.input.charCodeAt(++S.position), ie === 39)
          pe = S.position, S.position++, ae = S.position;
        else
          return !0;
      else p(ie) ? (V(S, pe, ae, !0), x(S, R(S, !1, te)), pe = ae = S.position) : S.position === S.lineStart && O(S) ? B(S, "unexpected end of the document within a single quoted scalar") : (S.position++, ae = S.position);
    B(S, "unexpected end of the stream within a single quoted scalar");
  }
  function Q(S, te) {
    var ie, pe, ae, de, le, me;
    if (me = S.input.charCodeAt(S.position), me !== 34)
      return !1;
    for (S.kind = "scalar", S.result = "", S.position++, ie = pe = S.position; (me = S.input.charCodeAt(S.position)) !== 0; ) {
      if (me === 34)
        return V(S, ie, S.position, !0), S.position++, !0;
      if (me === 92) {
        if (V(S, ie, S.position, !0), me = S.input.charCodeAt(++S.position), p(me))
          R(S, !1, te);
        else if (me < 256 && M[me])
          S.result += K[me], S.position++;
        else if ((le = w(me)) > 0) {
          for (ae = le, de = 0; ae > 0; ae--)
            me = S.input.charCodeAt(++S.position), (le = _(me)) >= 0 ? de = (de << 4) + le : B(S, "expected hexadecimal character");
          S.result += G(de), S.position++;
        } else
          B(S, "unknown escape sequence");
        ie = pe = S.position;
      } else p(me) ? (V(S, ie, pe, !0), x(S, R(S, !1, te)), ie = pe = S.position) : S.position === S.lineStart && O(S) ? B(S, "unexpected end of the document within a double quoted scalar") : (S.position++, pe = S.position);
    }
    B(S, "unexpected end of the stream within a double quoted scalar");
  }
  function H(S, te) {
    var ie = !0, pe, ae, de, le = S.tag, me, ve = S.anchor, Fe, je, $e, j, ne, se = /* @__PURE__ */ Object.create(null), oe, ue, ye, he;
    if (he = S.input.charCodeAt(S.position), he === 91)
      je = 93, ne = !1, me = [];
    else if (he === 123)
      je = 125, ne = !0, me = {};
    else
      return !1;
    for (S.anchor !== null && (S.anchorMap[S.anchor] = me), he = S.input.charCodeAt(++S.position); he !== 0; ) {
      if (R(S, !0, te), he = S.input.charCodeAt(S.position), he === je)
        return S.position++, S.tag = le, S.anchor = ve, S.kind = ne ? "mapping" : "sequence", S.result = me, !0;
      ie ? he === 44 && B(S, "expected the node content, but found ','") : B(S, "missed comma between flow collection entries"), ue = oe = ye = null, $e = j = !1, he === 63 && (Fe = S.input.charCodeAt(S.position + 1), b(Fe) && ($e = j = !0, S.position++, R(S, !0, te))), pe = S.line, ae = S.lineStart, de = S.position, ge(S, te, r, !1, !0), ue = S.tag, oe = S.result, R(S, !0, te), he = S.input.charCodeAt(S.position), (j || S.line === pe) && he === 58 && ($e = !0, he = S.input.charCodeAt(++S.position), R(S, !0, te), ge(S, te, r, !1, !0), ye = S.result), ne ? U(S, me, se, ue, oe, ye, pe, ae, de) : $e ? me.push(U(S, null, se, ue, oe, ye, pe, ae, de)) : me.push(oe), R(S, !0, te), he = S.input.charCodeAt(S.position), he === 44 ? (ie = !0, he = S.input.charCodeAt(++S.position)) : ie = !1;
    }
    B(S, "unexpected end of the stream within a flow collection");
  }
  function A(S, te) {
    var ie, pe, ae = u, de = !1, le = !1, me = te, ve = 0, Fe = !1, je, $e;
    if ($e = S.input.charCodeAt(S.position), $e === 124)
      pe = !1;
    else if ($e === 62)
      pe = !0;
    else
      return !1;
    for (S.kind = "scalar", S.result = ""; $e !== 0; )
      if ($e = S.input.charCodeAt(++S.position), $e === 43 || $e === 45)
        u === ae ? ae = $e === 43 ? d : a : B(S, "repeat of a chomping mode identifier");
      else if ((je = P($e)) >= 0)
        je === 0 ? B(S, "bad explicit indentation width of a block scalar; it cannot be less than one") : le ? B(S, "repeat of an indentation width identifier") : (me = te + je - 1, le = !0);
      else
        break;
    if (E($e)) {
      do
        $e = S.input.charCodeAt(++S.position);
      while (E($e));
      if ($e === 35)
        do
          $e = S.input.charCodeAt(++S.position);
        while (!p($e) && $e !== 0);
    }
    for (; $e !== 0; ) {
      for (D(S), S.lineIndent = 0, $e = S.input.charCodeAt(S.position); (!le || S.lineIndent < me) && $e === 32; )
        S.lineIndent++, $e = S.input.charCodeAt(++S.position);
      if (!le && S.lineIndent > me && (me = S.lineIndent), p($e)) {
        ve++;
        continue;
      }
      if (S.lineIndent < me) {
        ae === d ? S.result += e.repeat(`
`, de ? 1 + ve : ve) : ae === u && de && (S.result += `
`);
        break;
      }
      for (pe ? E($e) ? (Fe = !0, S.result += e.repeat(`
`, de ? 1 + ve : ve)) : Fe ? (Fe = !1, S.result += e.repeat(`
`, ve + 1)) : ve === 0 ? de && (S.result += " ") : S.result += e.repeat(`
`, ve) : S.result += e.repeat(`
`, de ? 1 + ve : ve), de = !0, le = !0, ve = 0, ie = S.position; !p($e) && $e !== 0; )
        $e = S.input.charCodeAt(++S.position);
      V(S, ie, S.position, !1);
    }
    return !0;
  }
  function q(S, te) {
    var ie, pe = S.tag, ae = S.anchor, de = [], le, me = !1, ve;
    if (S.firstTabInLine !== -1) return !1;
    for (S.anchor !== null && (S.anchorMap[S.anchor] = de), ve = S.input.charCodeAt(S.position); ve !== 0 && (S.firstTabInLine !== -1 && (S.position = S.firstTabInLine, B(S, "tab characters must not be used in indentation")), !(ve !== 45 || (le = S.input.charCodeAt(S.position + 1), !b(le)))); ) {
      if (me = !0, S.position++, R(S, !0, -1) && S.lineIndent <= te) {
        de.push(null), ve = S.input.charCodeAt(S.position);
        continue;
      }
      if (ie = S.line, ge(S, te, c, !1, !0), de.push(S.result), R(S, !0, -1), ve = S.input.charCodeAt(S.position), (S.line === ie || S.lineIndent > te) && ve !== 0)
        B(S, "bad indentation of a sequence entry");
      else if (S.lineIndent < te)
        break;
    }
    return me ? (S.tag = pe, S.anchor = ae, S.kind = "sequence", S.result = de, !0) : !1;
  }
  function W(S, te, ie) {
    var pe, ae, de, le, me, ve, Fe = S.tag, je = S.anchor, $e = {}, j = /* @__PURE__ */ Object.create(null), ne = null, se = null, oe = null, ue = !1, ye = !1, he;
    if (S.firstTabInLine !== -1) return !1;
    for (S.anchor !== null && (S.anchorMap[S.anchor] = $e), he = S.input.charCodeAt(S.position); he !== 0; ) {
      if (!ue && S.firstTabInLine !== -1 && (S.position = S.firstTabInLine, B(S, "tab characters must not be used in indentation")), pe = S.input.charCodeAt(S.position + 1), de = S.line, (he === 63 || he === 58) && b(pe))
        he === 63 ? (ue && (U(S, $e, j, ne, se, null, le, me, ve), ne = se = oe = null), ye = !0, ue = !0, ae = !0) : ue ? (ue = !1, ae = !0) : B(S, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), S.position += 1, he = pe;
      else {
        if (le = S.line, me = S.lineStart, ve = S.position, !ge(S, ie, i, !1, !0))
          break;
        if (S.line === de) {
          for (he = S.input.charCodeAt(S.position); E(he); )
            he = S.input.charCodeAt(++S.position);
          if (he === 58)
            he = S.input.charCodeAt(++S.position), b(he) || B(S, "a whitespace character is expected after the key-value separator within a block mapping"), ue && (U(S, $e, j, ne, se, null, le, me, ve), ne = se = oe = null), ye = !0, ue = !1, ae = !1, ne = S.tag, se = S.result;
          else if (ye)
            B(S, "can not read an implicit mapping pair; a colon is missed");
          else
            return S.tag = Fe, S.anchor = je, !0;
        } else if (ye)
          B(S, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return S.tag = Fe, S.anchor = je, !0;
      }
      if ((S.line === de || S.lineIndent > te) && (ue && (le = S.line, me = S.lineStart, ve = S.position), ge(S, te, s, !0, ae) && (ue ? se = S.result : oe = S.result), ue || (U(S, $e, j, ne, se, oe, le, me, ve), ne = se = oe = null), R(S, !0, -1), he = S.input.charCodeAt(S.position)), (S.line === de || S.lineIndent > te) && he !== 0)
        B(S, "bad indentation of a mapping entry");
      else if (S.lineIndent < te)
        break;
    }
    return ue && U(S, $e, j, ne, se, null, le, me, ve), ye && (S.tag = Fe, S.anchor = je, S.kind = "mapping", S.result = $e), ye;
  }
  function J(S) {
    var te, ie = !1, pe = !1, ae, de, le;
    if (le = S.input.charCodeAt(S.position), le !== 33) return !1;
    if (S.tag !== null && B(S, "duplication of a tag property"), le = S.input.charCodeAt(++S.position), le === 60 ? (ie = !0, le = S.input.charCodeAt(++S.position)) : le === 33 ? (pe = !0, ae = "!!", le = S.input.charCodeAt(++S.position)) : ae = "!", te = S.position, ie) {
      do
        le = S.input.charCodeAt(++S.position);
      while (le !== 0 && le !== 62);
      S.position < S.length ? (de = S.input.slice(te, S.position), le = S.input.charCodeAt(++S.position)) : B(S, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; le !== 0 && !b(le); )
        le === 33 && (pe ? B(S, "tag suffix cannot contain exclamation marks") : (ae = S.input.slice(te - 1, S.position + 1), v.test(ae) || B(S, "named tag handle cannot contain such characters"), pe = !0, te = S.position + 1)), le = S.input.charCodeAt(++S.position);
      de = S.input.slice(te, S.position), g.test(de) && B(S, "tag suffix cannot contain flow indicator characters");
    }
    de && !h.test(de) && B(S, "tag name cannot contain such characters: " + de);
    try {
      de = decodeURIComponent(de);
    } catch {
      B(S, "tag name is malformed: " + de);
    }
    return ie ? S.tag = de : f.call(S.tagMap, ae) ? S.tag = S.tagMap[ae] + de : ae === "!" ? S.tag = "!" + de : ae === "!!" ? S.tag = "tag:yaml.org,2002:" + de : B(S, 'undeclared tag handle "' + ae + '"'), !0;
  }
  function re(S) {
    var te, ie;
    if (ie = S.input.charCodeAt(S.position), ie !== 38) return !1;
    for (S.anchor !== null && B(S, "duplication of an anchor property"), ie = S.input.charCodeAt(++S.position), te = S.position; ie !== 0 && !b(ie) && !$(ie); )
      ie = S.input.charCodeAt(++S.position);
    return S.position === te && B(S, "name of an anchor node must contain at least one character"), S.anchor = S.input.slice(te, S.position), !0;
  }
  function fe(S) {
    var te, ie, pe;
    if (pe = S.input.charCodeAt(S.position), pe !== 42) return !1;
    for (pe = S.input.charCodeAt(++S.position), te = S.position; pe !== 0 && !b(pe) && !$(pe); )
      pe = S.input.charCodeAt(++S.position);
    return S.position === te && B(S, "name of an alias node must contain at least one character"), ie = S.input.slice(te, S.position), f.call(S.anchorMap, ie) || B(S, 'unidentified alias "' + ie + '"'), S.result = S.anchorMap[ie], R(S, !0, -1), !0;
  }
  function ge(S, te, ie, pe, ae) {
    var de, le, me, ve = 1, Fe = !1, je = !1, $e, j, ne, se, oe, ue;
    if (S.listener !== null && S.listener("open", S), S.tag = null, S.anchor = null, S.kind = null, S.result = null, de = le = me = s === ie || c === ie, pe && R(S, !0, -1) && (Fe = !0, S.lineIndent > te ? ve = 1 : S.lineIndent === te ? ve = 0 : S.lineIndent < te && (ve = -1)), ve === 1)
      for (; J(S) || re(S); )
        R(S, !0, -1) ? (Fe = !0, me = de, S.lineIndent > te ? ve = 1 : S.lineIndent === te ? ve = 0 : S.lineIndent < te && (ve = -1)) : me = !1;
    if (me && (me = Fe || ae), (ve === 1 || s === ie) && (r === ie || i === ie ? oe = te : oe = te + 1, ue = S.position - S.lineStart, ve === 1 ? me && (q(S, ue) || W(S, ue, oe)) || H(S, oe) ? je = !0 : (le && A(S, oe) || N(S, oe) || Q(S, oe) ? je = !0 : fe(S) ? (je = !0, (S.tag !== null || S.anchor !== null) && B(S, "alias node should not have any properties")) : I(S, oe, r === ie) && (je = !0, S.tag === null && (S.tag = "?")), S.anchor !== null && (S.anchorMap[S.anchor] = S.result)) : ve === 0 && (je = me && q(S, ue))), S.tag === null)
      S.anchor !== null && (S.anchorMap[S.anchor] = S.result);
    else if (S.tag === "?") {
      for (S.result !== null && S.kind !== "scalar" && B(S, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + S.kind + '"'), $e = 0, j = S.implicitTypes.length; $e < j; $e += 1)
        if (se = S.implicitTypes[$e], se.resolve(S.result)) {
          S.result = se.construct(S.result), S.tag = se.tag, S.anchor !== null && (S.anchorMap[S.anchor] = S.result);
          break;
        }
    } else if (S.tag !== "!") {
      if (f.call(S.typeMap[S.kind || "fallback"], S.tag))
        se = S.typeMap[S.kind || "fallback"][S.tag];
      else
        for (se = null, ne = S.typeMap.multi[S.kind || "fallback"], $e = 0, j = ne.length; $e < j; $e += 1)
          if (S.tag.slice(0, ne[$e].tag.length) === ne[$e].tag) {
            se = ne[$e];
            break;
          }
      se || B(S, "unknown tag !<" + S.tag + ">"), S.result !== null && se.kind !== S.kind && B(S, "unacceptable node kind for !<" + S.tag + '> tag; it should be "' + se.kind + '", not "' + S.kind + '"'), se.resolve(S.result, S.tag) ? (S.result = se.construct(S.result, S.tag), S.anchor !== null && (S.anchorMap[S.anchor] = S.result)) : B(S, "cannot resolve a node with !<" + S.tag + "> explicit tag");
    }
    return S.listener !== null && S.listener("close", S), S.tag !== null || S.anchor !== null || je;
  }
  function Oe(S) {
    var te = S.position, ie, pe, ae, de = !1, le;
    for (S.version = null, S.checkLineBreaks = S.legacy, S.tagMap = /* @__PURE__ */ Object.create(null), S.anchorMap = /* @__PURE__ */ Object.create(null); (le = S.input.charCodeAt(S.position)) !== 0 && (R(S, !0, -1), le = S.input.charCodeAt(S.position), !(S.lineIndent > 0 || le !== 37)); ) {
      for (de = !0, le = S.input.charCodeAt(++S.position), ie = S.position; le !== 0 && !b(le); )
        le = S.input.charCodeAt(++S.position);
      for (pe = S.input.slice(ie, S.position), ae = [], pe.length < 1 && B(S, "directive name must not be less than one character in length"); le !== 0; ) {
        for (; E(le); )
          le = S.input.charCodeAt(++S.position);
        if (le === 35) {
          do
            le = S.input.charCodeAt(++S.position);
          while (le !== 0 && !p(le));
          break;
        }
        if (p(le)) break;
        for (ie = S.position; le !== 0 && !b(le); )
          le = S.input.charCodeAt(++S.position);
        ae.push(S.input.slice(ie, S.position));
      }
      le !== 0 && D(S), f.call(Z, pe) ? Z[pe](S, pe, ae) : Y(S, 'unknown document directive "' + pe + '"');
    }
    if (R(S, !0, -1), S.lineIndent === 0 && S.input.charCodeAt(S.position) === 45 && S.input.charCodeAt(S.position + 1) === 45 && S.input.charCodeAt(S.position + 2) === 45 ? (S.position += 3, R(S, !0, -1)) : de && B(S, "directives end mark is expected"), ge(S, S.lineIndent - 1, s, !1, !0), R(S, !0, -1), S.checkLineBreaks && m.test(S.input.slice(te, S.position)) && Y(S, "non-ASCII line breaks are interpreted as content"), S.documents.push(S.result), S.position === S.lineStart && O(S)) {
      S.input.charCodeAt(S.position) === 46 && (S.position += 3, R(S, !0, -1));
      return;
    }
    if (S.position < S.length - 1)
      B(S, "end of the stream or a document separator is expected");
    else
      return;
  }
  function ke(S, te) {
    S = String(S), te = te || {}, S.length !== 0 && (S.charCodeAt(S.length - 1) !== 10 && S.charCodeAt(S.length - 1) !== 13 && (S += `
`), S.charCodeAt(0) === 65279 && (S = S.slice(1)));
    var ie = new F(S, te), pe = S.indexOf("\0");
    for (pe !== -1 && (ie.position = pe, B(ie, "null byte is not allowed in input")), ie.input += "\0"; ie.input.charCodeAt(ie.position) === 32; )
      ie.lineIndent += 1, ie.position += 1;
    for (; ie.position < ie.length - 1; )
      Oe(ie);
    return ie.documents;
  }
  function Ne(S, te, ie) {
    te !== null && typeof te == "object" && typeof ie > "u" && (ie = te, te = null);
    var pe = ke(S, ie);
    if (typeof te != "function")
      return pe;
    for (var ae = 0, de = pe.length; ae < de; ae += 1)
      te(pe[ae]);
  }
  function Se(S, te) {
    var ie = ke(S, te);
    if (ie.length !== 0) {
      if (ie.length === 1)
        return ie[0];
      throw new t("expected a single document in the stream, but found more");
    }
  }
  return Ua.loadAll = Ne, Ua.load = Se, Ua;
}
var Hu = {}, jm;
function ab() {
  if (jm) return Hu;
  jm = 1;
  var e = qn(), t = Ln(), o = ol(), n = Object.prototype.toString, f = Object.prototype.hasOwnProperty, r = 65279, i = 9, c = 10, s = 13, u = 32, a = 33, d = 34, l = 35, m = 37, g = 38, v = 39, h = 42, y = 44, p = 45, E = 58, b = 61, $ = 62, _ = 63, w = 64, P = 91, T = 93, G = 96, L = 123, M = 124, K = 125, k = {};
  k[0] = "\\0", k[7] = "\\a", k[8] = "\\b", k[9] = "\\t", k[10] = "\\n", k[11] = "\\v", k[12] = "\\f", k[13] = "\\r", k[27] = "\\e", k[34] = '\\"', k[92] = "\\\\", k[133] = "\\N", k[160] = "\\_", k[8232] = "\\L", k[8233] = "\\P";
  var F = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], X = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function B(j, ne) {
    var se, oe, ue, ye, he, _e, we;
    if (ne === null) return {};
    for (se = {}, oe = Object.keys(ne), ue = 0, ye = oe.length; ue < ye; ue += 1)
      he = oe[ue], _e = String(ne[he]), he.slice(0, 2) === "!!" && (he = "tag:yaml.org,2002:" + he.slice(2)), we = j.compiledTypeMap.fallback[he], we && f.call(we.styleAliases, _e) && (_e = we.styleAliases[_e]), se[he] = _e;
    return se;
  }
  function Y(j) {
    var ne, se, oe;
    if (ne = j.toString(16).toUpperCase(), j <= 255)
      se = "x", oe = 2;
    else if (j <= 65535)
      se = "u", oe = 4;
    else if (j <= 4294967295)
      se = "U", oe = 8;
    else
      throw new t("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + se + e.repeat("0", oe - ne.length) + ne;
  }
  var Z = 1, V = 2;
  function C(j) {
    this.schema = j.schema || o, this.indent = Math.max(1, j.indent || 2), this.noArrayIndent = j.noArrayIndent || !1, this.skipInvalid = j.skipInvalid || !1, this.flowLevel = e.isNothing(j.flowLevel) ? -1 : j.flowLevel, this.styleMap = B(this.schema, j.styles || null), this.sortKeys = j.sortKeys || !1, this.lineWidth = j.lineWidth || 80, this.noRefs = j.noRefs || !1, this.noCompatMode = j.noCompatMode || !1, this.condenseFlow = j.condenseFlow || !1, this.quotingType = j.quotingType === '"' ? V : Z, this.forceQuotes = j.forceQuotes || !1, this.replacer = typeof j.replacer == "function" ? j.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function U(j, ne) {
    for (var se = e.repeat(" ", ne), oe = 0, ue = -1, ye = "", he, _e = j.length; oe < _e; )
      ue = j.indexOf(`
`, oe), ue === -1 ? (he = j.slice(oe), oe = _e) : (he = j.slice(oe, ue + 1), oe = ue + 1), he.length && he !== `
` && (ye += se), ye += he;
    return ye;
  }
  function D(j, ne) {
    return `
` + e.repeat(" ", j.indent * ne);
  }
  function R(j, ne) {
    var se, oe, ue;
    for (se = 0, oe = j.implicitTypes.length; se < oe; se += 1)
      if (ue = j.implicitTypes[se], ue.resolve(ne))
        return !0;
    return !1;
  }
  function O(j) {
    return j === u || j === i;
  }
  function x(j) {
    return 32 <= j && j <= 126 || 161 <= j && j <= 55295 && j !== 8232 && j !== 8233 || 57344 <= j && j <= 65533 && j !== r || 65536 <= j && j <= 1114111;
  }
  function I(j) {
    return x(j) && j !== r && j !== s && j !== c;
  }
  function N(j, ne, se) {
    var oe = I(j), ue = oe && !O(j);
    return (
      // ns-plain-safe
      (se ? (
        // c = flow-in
        oe
      ) : oe && j !== y && j !== P && j !== T && j !== L && j !== K) && j !== l && !(ne === E && !ue) || I(ne) && !O(ne) && j === l || ne === E && ue
    );
  }
  function Q(j) {
    return x(j) && j !== r && !O(j) && j !== p && j !== _ && j !== E && j !== y && j !== P && j !== T && j !== L && j !== K && j !== l && j !== g && j !== h && j !== a && j !== M && j !== b && j !== $ && j !== v && j !== d && j !== m && j !== w && j !== G;
  }
  function H(j) {
    return !O(j) && j !== E;
  }
  function A(j, ne) {
    var se = j.charCodeAt(ne), oe;
    return se >= 55296 && se <= 56319 && ne + 1 < j.length && (oe = j.charCodeAt(ne + 1), oe >= 56320 && oe <= 57343) ? (se - 55296) * 1024 + oe - 56320 + 65536 : se;
  }
  function q(j) {
    var ne = /^\n* /;
    return ne.test(j);
  }
  var W = 1, J = 2, re = 3, fe = 4, ge = 5;
  function Oe(j, ne, se, oe, ue, ye, he, _e) {
    var we, be = 0, Ge = null, We = !1, Me = !1, Dr = oe !== -1, bt = -1, fr = Q(A(j, 0)) && H(A(j, j.length - 1));
    if (ne || he)
      for (we = 0; we < j.length; be >= 65536 ? we += 2 : we++) {
        if (be = A(j, we), !x(be))
          return ge;
        fr = fr && N(be, Ge, _e), Ge = be;
      }
    else {
      for (we = 0; we < j.length; be >= 65536 ? we += 2 : we++) {
        if (be = A(j, we), be === c)
          We = !0, Dr && (Me = Me || // Foldable line = too long, and not more-indented.
          we - bt - 1 > oe && j[bt + 1] !== " ", bt = we);
        else if (!x(be))
          return ge;
        fr = fr && N(be, Ge, _e), Ge = be;
      }
      Me = Me || Dr && we - bt - 1 > oe && j[bt + 1] !== " ";
    }
    return !We && !Me ? fr && !he && !ue(j) ? W : ye === V ? ge : J : se > 9 && q(j) ? ge : he ? ye === V ? ge : J : Me ? fe : re;
  }
  function ke(j, ne, se, oe, ue) {
    j.dump = (function() {
      if (ne.length === 0)
        return j.quotingType === V ? '""' : "''";
      if (!j.noCompatMode && (F.indexOf(ne) !== -1 || X.test(ne)))
        return j.quotingType === V ? '"' + ne + '"' : "'" + ne + "'";
      var ye = j.indent * Math.max(1, se), he = j.lineWidth === -1 ? -1 : Math.max(Math.min(j.lineWidth, 40), j.lineWidth - ye), _e = oe || j.flowLevel > -1 && se >= j.flowLevel;
      function we(be) {
        return R(j, be);
      }
      switch (Oe(
        ne,
        _e,
        j.indent,
        he,
        we,
        j.quotingType,
        j.forceQuotes && !oe,
        ue
      )) {
        case W:
          return ne;
        case J:
          return "'" + ne.replace(/'/g, "''") + "'";
        case re:
          return "|" + Ne(ne, j.indent) + Se(U(ne, ye));
        case fe:
          return ">" + Ne(ne, j.indent) + Se(U(S(ne, he), ye));
        case ge:
          return '"' + ie(ne) + '"';
        default:
          throw new t("impossible error: invalid scalar style");
      }
    })();
  }
  function Ne(j, ne) {
    var se = q(j) ? String(ne) : "", oe = j[j.length - 1] === `
`, ue = oe && (j[j.length - 2] === `
` || j === `
`), ye = ue ? "+" : oe ? "" : "-";
    return se + ye + `
`;
  }
  function Se(j) {
    return j[j.length - 1] === `
` ? j.slice(0, -1) : j;
  }
  function S(j, ne) {
    for (var se = /(\n+)([^\n]*)/g, oe = (function() {
      var be = j.indexOf(`
`);
      return be = be !== -1 ? be : j.length, se.lastIndex = be, te(j.slice(0, be), ne);
    })(), ue = j[0] === `
` || j[0] === " ", ye, he; he = se.exec(j); ) {
      var _e = he[1], we = he[2];
      ye = we[0] === " ", oe += _e + (!ue && !ye && we !== "" ? `
` : "") + te(we, ne), ue = ye;
    }
    return oe;
  }
  function te(j, ne) {
    if (j === "" || j[0] === " ") return j;
    for (var se = / [^ ]/g, oe, ue = 0, ye, he = 0, _e = 0, we = ""; oe = se.exec(j); )
      _e = oe.index, _e - ue > ne && (ye = he > ue ? he : _e, we += `
` + j.slice(ue, ye), ue = ye + 1), he = _e;
    return we += `
`, j.length - ue > ne && he > ue ? we += j.slice(ue, he) + `
` + j.slice(he + 1) : we += j.slice(ue), we.slice(1);
  }
  function ie(j) {
    for (var ne = "", se = 0, oe, ue = 0; ue < j.length; se >= 65536 ? ue += 2 : ue++)
      se = A(j, ue), oe = k[se], !oe && x(se) ? (ne += j[ue], se >= 65536 && (ne += j[ue + 1])) : ne += oe || Y(se);
    return ne;
  }
  function pe(j, ne, se) {
    var oe = "", ue = j.tag, ye, he, _e;
    for (ye = 0, he = se.length; ye < he; ye += 1)
      _e = se[ye], j.replacer && (_e = j.replacer.call(se, String(ye), _e)), (ve(j, ne, _e, !1, !1) || typeof _e > "u" && ve(j, ne, null, !1, !1)) && (oe !== "" && (oe += "," + (j.condenseFlow ? "" : " ")), oe += j.dump);
    j.tag = ue, j.dump = "[" + oe + "]";
  }
  function ae(j, ne, se, oe) {
    var ue = "", ye = j.tag, he, _e, we;
    for (he = 0, _e = se.length; he < _e; he += 1)
      we = se[he], j.replacer && (we = j.replacer.call(se, String(he), we)), (ve(j, ne + 1, we, !0, !0, !1, !0) || typeof we > "u" && ve(j, ne + 1, null, !0, !0, !1, !0)) && ((!oe || ue !== "") && (ue += D(j, ne)), j.dump && c === j.dump.charCodeAt(0) ? ue += "-" : ue += "- ", ue += j.dump);
    j.tag = ye, j.dump = ue || "[]";
  }
  function de(j, ne, se) {
    var oe = "", ue = j.tag, ye = Object.keys(se), he, _e, we, be, Ge;
    for (he = 0, _e = ye.length; he < _e; he += 1)
      Ge = "", oe !== "" && (Ge += ", "), j.condenseFlow && (Ge += '"'), we = ye[he], be = se[we], j.replacer && (be = j.replacer.call(se, we, be)), ve(j, ne, we, !1, !1) && (j.dump.length > 1024 && (Ge += "? "), Ge += j.dump + (j.condenseFlow ? '"' : "") + ":" + (j.condenseFlow ? "" : " "), ve(j, ne, be, !1, !1) && (Ge += j.dump, oe += Ge));
    j.tag = ue, j.dump = "{" + oe + "}";
  }
  function le(j, ne, se, oe) {
    var ue = "", ye = j.tag, he = Object.keys(se), _e, we, be, Ge, We, Me;
    if (j.sortKeys === !0)
      he.sort();
    else if (typeof j.sortKeys == "function")
      he.sort(j.sortKeys);
    else if (j.sortKeys)
      throw new t("sortKeys must be a boolean or a function");
    for (_e = 0, we = he.length; _e < we; _e += 1)
      Me = "", (!oe || ue !== "") && (Me += D(j, ne)), be = he[_e], Ge = se[be], j.replacer && (Ge = j.replacer.call(se, be, Ge)), ve(j, ne + 1, be, !0, !0, !0) && (We = j.tag !== null && j.tag !== "?" || j.dump && j.dump.length > 1024, We && (j.dump && c === j.dump.charCodeAt(0) ? Me += "?" : Me += "? "), Me += j.dump, We && (Me += D(j, ne)), ve(j, ne + 1, Ge, !0, We) && (j.dump && c === j.dump.charCodeAt(0) ? Me += ":" : Me += ": ", Me += j.dump, ue += Me));
    j.tag = ye, j.dump = ue || "{}";
  }
  function me(j, ne, se) {
    var oe, ue, ye, he, _e, we;
    for (ue = se ? j.explicitTypes : j.implicitTypes, ye = 0, he = ue.length; ye < he; ye += 1)
      if (_e = ue[ye], (_e.instanceOf || _e.predicate) && (!_e.instanceOf || typeof ne == "object" && ne instanceof _e.instanceOf) && (!_e.predicate || _e.predicate(ne))) {
        if (se ? _e.multi && _e.representName ? j.tag = _e.representName(ne) : j.tag = _e.tag : j.tag = "?", _e.represent) {
          if (we = j.styleMap[_e.tag] || _e.defaultStyle, n.call(_e.represent) === "[object Function]")
            oe = _e.represent(ne, we);
          else if (f.call(_e.represent, we))
            oe = _e.represent[we](ne, we);
          else
            throw new t("!<" + _e.tag + '> tag resolver accepts not "' + we + '" style');
          j.dump = oe;
        }
        return !0;
      }
    return !1;
  }
  function ve(j, ne, se, oe, ue, ye, he) {
    j.tag = null, j.dump = se, me(j, se, !1) || me(j, se, !0);
    var _e = n.call(j.dump), we = oe, be;
    oe && (oe = j.flowLevel < 0 || j.flowLevel > ne);
    var Ge = _e === "[object Object]" || _e === "[object Array]", We, Me;
    if (Ge && (We = j.duplicates.indexOf(se), Me = We !== -1), (j.tag !== null && j.tag !== "?" || Me || j.indent !== 2 && ne > 0) && (ue = !1), Me && j.usedDuplicates[We])
      j.dump = "*ref_" + We;
    else {
      if (Ge && Me && !j.usedDuplicates[We] && (j.usedDuplicates[We] = !0), _e === "[object Object]")
        oe && Object.keys(j.dump).length !== 0 ? (le(j, ne, j.dump, ue), Me && (j.dump = "&ref_" + We + j.dump)) : (de(j, ne, j.dump), Me && (j.dump = "&ref_" + We + " " + j.dump));
      else if (_e === "[object Array]")
        oe && j.dump.length !== 0 ? (j.noArrayIndent && !he && ne > 0 ? ae(j, ne - 1, j.dump, ue) : ae(j, ne, j.dump, ue), Me && (j.dump = "&ref_" + We + j.dump)) : (pe(j, ne, j.dump), Me && (j.dump = "&ref_" + We + " " + j.dump));
      else if (_e === "[object String]")
        j.tag !== "?" && ke(j, j.dump, ne, ye, we);
      else {
        if (_e === "[object Undefined]")
          return !1;
        if (j.skipInvalid) return !1;
        throw new t("unacceptable kind of an object to dump " + _e);
      }
      j.tag !== null && j.tag !== "?" && (be = encodeURI(
        j.tag[0] === "!" ? j.tag.slice(1) : j.tag
      ).replace(/!/g, "%21"), j.tag[0] === "!" ? be = "!" + be : be.slice(0, 18) === "tag:yaml.org,2002:" ? be = "!!" + be.slice(18) : be = "!<" + be + ">", j.dump = be + " " + j.dump);
    }
    return !0;
  }
  function Fe(j, ne) {
    var se = [], oe = [], ue, ye;
    for (je(j, se, oe), ue = 0, ye = oe.length; ue < ye; ue += 1)
      ne.duplicates.push(se[oe[ue]]);
    ne.usedDuplicates = new Array(ye);
  }
  function je(j, ne, se) {
    var oe, ue, ye;
    if (j !== null && typeof j == "object")
      if (ue = ne.indexOf(j), ue !== -1)
        se.indexOf(ue) === -1 && se.push(ue);
      else if (ne.push(j), Array.isArray(j))
        for (ue = 0, ye = j.length; ue < ye; ue += 1)
          je(j[ue], ne, se);
      else
        for (oe = Object.keys(j), ue = 0, ye = oe.length; ue < ye; ue += 1)
          je(j[oe[ue]], ne, se);
  }
  function $e(j, ne) {
    ne = ne || {};
    var se = new C(ne);
    se.noRefs || Fe(j, se);
    var oe = j;
    return se.replacer && (oe = se.replacer.call({ "": oe }, "", oe)), ve(se, 0, oe, !0, !0) ? se.dump + `
` : "";
  }
  return Hu.dump = $e, Hu;
}
var Um;
function ul() {
  if (Um) return at;
  Um = 1;
  var e = ib(), t = ab();
  function o(n, f) {
    return function() {
      throw new Error("Function yaml." + n + " is removed in js-yaml 4. Use yaml." + f + " instead, which is now safe by default.");
    };
  }
  return at.Type = ft(), at.Schema = tg(), at.FAILSAFE_SCHEMA = ag(), at.JSON_SCHEMA = lg(), at.CORE_SCHEMA = fg(), at.DEFAULT_SCHEMA = ol(), at.load = e.load, at.loadAll = e.loadAll, at.dump = t.dump, at.YAMLException = Ln(), at.types = {
    binary: pg(),
    float: cg(),
    map: ig(),
    null: sg(),
    pairs: yg(),
    set: gg(),
    timestamp: dg(),
    bool: og(),
    int: ug(),
    merge: hg(),
    omap: mg(),
    seq: ng(),
    str: rg()
  }, at.safeLoad = o("safeLoad", "load"), at.safeLoadAll = o("safeLoadAll", "loadAll"), at.safeDump = o("safeDump", "dump"), at;
}
var dn = {}, Mm;
function sb() {
  if (Mm) return dn;
  Mm = 1, Object.defineProperty(dn, "__esModule", { value: !0 }), dn.Lazy = void 0;
  class e {
    constructor(o) {
      this._value = null, this.creator = o;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const o = this.creator();
      return this.value = o, o;
    }
    set value(o) {
      this._value = o, this.creator = null;
    }
  }
  return dn.Lazy = e, dn;
}
var Ma = { exports: {} }, zu, xm;
function ys() {
  if (xm) return zu;
  xm = 1;
  const e = "2.0.0", t = 256, o = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, n = 16, f = t - 6;
  return zu = {
    MAX_LENGTH: t,
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: f,
    MAX_SAFE_INTEGER: o,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, zu;
}
var Ku, Vm;
function gs() {
  return Vm || (Vm = 1, Ku = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
  }), Ku;
}
var Gm;
function Fn() {
  return Gm || (Gm = 1, (function(e, t) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: o,
      MAX_SAFE_BUILD_LENGTH: n,
      MAX_LENGTH: f
    } = ys(), r = gs();
    t = e.exports = {};
    const i = t.re = [], c = t.safeRe = [], s = t.src = [], u = t.safeSrc = [], a = t.t = {};
    let d = 0;
    const l = "[a-zA-Z0-9-]", m = [
      ["\\s", 1],
      ["\\d", f],
      [l, n]
    ], g = (h) => {
      for (const [y, p] of m)
        h = h.split(`${y}*`).join(`${y}{0,${p}}`).split(`${y}+`).join(`${y}{1,${p}}`);
      return h;
    }, v = (h, y, p) => {
      const E = g(y), b = d++;
      r(h, b, y), a[h] = b, s[b] = y, u[b] = E, i[b] = new RegExp(y, p ? "g" : void 0), c[b] = new RegExp(E, p ? "g" : void 0);
    };
    v("NUMERICIDENTIFIER", "0|[1-9]\\d*"), v("NUMERICIDENTIFIERLOOSE", "\\d+"), v("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${l}*`), v("MAINVERSION", `(${s[a.NUMERICIDENTIFIER]})\\.(${s[a.NUMERICIDENTIFIER]})\\.(${s[a.NUMERICIDENTIFIER]})`), v("MAINVERSIONLOOSE", `(${s[a.NUMERICIDENTIFIERLOOSE]})\\.(${s[a.NUMERICIDENTIFIERLOOSE]})\\.(${s[a.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASEIDENTIFIER", `(?:${s[a.NONNUMERICIDENTIFIER]}|${s[a.NUMERICIDENTIFIER]})`), v("PRERELEASEIDENTIFIERLOOSE", `(?:${s[a.NONNUMERICIDENTIFIER]}|${s[a.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASE", `(?:-(${s[a.PRERELEASEIDENTIFIER]}(?:\\.${s[a.PRERELEASEIDENTIFIER]})*))`), v("PRERELEASELOOSE", `(?:-?(${s[a.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${s[a.PRERELEASEIDENTIFIERLOOSE]})*))`), v("BUILDIDENTIFIER", `${l}+`), v("BUILD", `(?:\\+(${s[a.BUILDIDENTIFIER]}(?:\\.${s[a.BUILDIDENTIFIER]})*))`), v("FULLPLAIN", `v?${s[a.MAINVERSION]}${s[a.PRERELEASE]}?${s[a.BUILD]}?`), v("FULL", `^${s[a.FULLPLAIN]}$`), v("LOOSEPLAIN", `[v=\\s]*${s[a.MAINVERSIONLOOSE]}${s[a.PRERELEASELOOSE]}?${s[a.BUILD]}?`), v("LOOSE", `^${s[a.LOOSEPLAIN]}$`), v("GTLT", "((?:<|>)?=?)"), v("XRANGEIDENTIFIERLOOSE", `${s[a.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), v("XRANGEIDENTIFIER", `${s[a.NUMERICIDENTIFIER]}|x|X|\\*`), v("XRANGEPLAIN", `[v=\\s]*(${s[a.XRANGEIDENTIFIER]})(?:\\.(${s[a.XRANGEIDENTIFIER]})(?:\\.(${s[a.XRANGEIDENTIFIER]})(?:${s[a.PRERELEASE]})?${s[a.BUILD]}?)?)?`), v("XRANGEPLAINLOOSE", `[v=\\s]*(${s[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[a.XRANGEIDENTIFIERLOOSE]})(?:${s[a.PRERELEASELOOSE]})?${s[a.BUILD]}?)?)?`), v("XRANGE", `^${s[a.GTLT]}\\s*${s[a.XRANGEPLAIN]}$`), v("XRANGELOOSE", `^${s[a.GTLT]}\\s*${s[a.XRANGEPLAINLOOSE]}$`), v("COERCEPLAIN", `(^|[^\\d])(\\d{1,${o}})(?:\\.(\\d{1,${o}}))?(?:\\.(\\d{1,${o}}))?`), v("COERCE", `${s[a.COERCEPLAIN]}(?:$|[^\\d])`), v("COERCEFULL", s[a.COERCEPLAIN] + `(?:${s[a.PRERELEASE]})?(?:${s[a.BUILD]})?(?:$|[^\\d])`), v("COERCERTL", s[a.COERCE], !0), v("COERCERTLFULL", s[a.COERCEFULL], !0), v("LONETILDE", "(?:~>?)"), v("TILDETRIM", `(\\s*)${s[a.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", v("TILDE", `^${s[a.LONETILDE]}${s[a.XRANGEPLAIN]}$`), v("TILDELOOSE", `^${s[a.LONETILDE]}${s[a.XRANGEPLAINLOOSE]}$`), v("LONECARET", "(?:\\^)"), v("CARETTRIM", `(\\s*)${s[a.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", v("CARET", `^${s[a.LONECARET]}${s[a.XRANGEPLAIN]}$`), v("CARETLOOSE", `^${s[a.LONECARET]}${s[a.XRANGEPLAINLOOSE]}$`), v("COMPARATORLOOSE", `^${s[a.GTLT]}\\s*(${s[a.LOOSEPLAIN]})$|^$`), v("COMPARATOR", `^${s[a.GTLT]}\\s*(${s[a.FULLPLAIN]})$|^$`), v("COMPARATORTRIM", `(\\s*)${s[a.GTLT]}\\s*(${s[a.LOOSEPLAIN]}|${s[a.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", v("HYPHENRANGE", `^\\s*(${s[a.XRANGEPLAIN]})\\s+-\\s+(${s[a.XRANGEPLAIN]})\\s*$`), v("HYPHENRANGELOOSE", `^\\s*(${s[a.XRANGEPLAINLOOSE]})\\s+-\\s+(${s[a.XRANGEPLAINLOOSE]})\\s*$`), v("STAR", "(<|>)?=?\\s*\\*"), v("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), v("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Ma, Ma.exports)), Ma.exports;
}
var Wu, Bm;
function cl() {
  if (Bm) return Wu;
  Bm = 1;
  const e = Object.freeze({ loose: !0 }), t = Object.freeze({});
  return Wu = (n) => n ? typeof n != "object" ? e : n : t, Wu;
}
var Yu, Hm;
function vg() {
  if (Hm) return Yu;
  Hm = 1;
  const e = /^[0-9]+$/, t = (n, f) => {
    if (typeof n == "number" && typeof f == "number")
      return n === f ? 0 : n < f ? -1 : 1;
    const r = e.test(n), i = e.test(f);
    return r && i && (n = +n, f = +f), n === f ? 0 : r && !i ? -1 : i && !r ? 1 : n < f ? -1 : 1;
  };
  return Yu = {
    compareIdentifiers: t,
    rcompareIdentifiers: (n, f) => t(f, n)
  }, Yu;
}
var Xu, zm;
function dt() {
  if (zm) return Xu;
  zm = 1;
  const e = gs(), { MAX_LENGTH: t, MAX_SAFE_INTEGER: o } = ys(), { safeRe: n, t: f } = Fn(), r = cl(), { compareIdentifiers: i } = vg();
  class c {
    constructor(u, a) {
      if (a = r(a), u instanceof c) {
        if (u.loose === !!a.loose && u.includePrerelease === !!a.includePrerelease)
          return u;
        u = u.version;
      } else if (typeof u != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof u}".`);
      if (u.length > t)
        throw new TypeError(
          `version is longer than ${t} characters`
        );
      e("SemVer", u, a), this.options = a, this.loose = !!a.loose, this.includePrerelease = !!a.includePrerelease;
      const d = u.trim().match(a.loose ? n[f.LOOSE] : n[f.FULL]);
      if (!d)
        throw new TypeError(`Invalid Version: ${u}`);
      if (this.raw = u, this.major = +d[1], this.minor = +d[2], this.patch = +d[3], this.major > o || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > o || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > o || this.patch < 0)
        throw new TypeError("Invalid patch version");
      d[4] ? this.prerelease = d[4].split(".").map((l) => {
        if (/^[0-9]+$/.test(l)) {
          const m = +l;
          if (m >= 0 && m < o)
            return m;
        }
        return l;
      }) : this.prerelease = [], this.build = d[5] ? d[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(u) {
      if (e("SemVer.compare", this.version, this.options, u), !(u instanceof c)) {
        if (typeof u == "string" && u === this.version)
          return 0;
        u = new c(u, this.options);
      }
      return u.version === this.version ? 0 : this.compareMain(u) || this.comparePre(u);
    }
    compareMain(u) {
      return u instanceof c || (u = new c(u, this.options)), this.major < u.major ? -1 : this.major > u.major ? 1 : this.minor < u.minor ? -1 : this.minor > u.minor ? 1 : this.patch < u.patch ? -1 : this.patch > u.patch ? 1 : 0;
    }
    comparePre(u) {
      if (u instanceof c || (u = new c(u, this.options)), this.prerelease.length && !u.prerelease.length)
        return -1;
      if (!this.prerelease.length && u.prerelease.length)
        return 1;
      if (!this.prerelease.length && !u.prerelease.length)
        return 0;
      let a = 0;
      do {
        const d = this.prerelease[a], l = u.prerelease[a];
        if (e("prerelease compare", a, d, l), d === void 0 && l === void 0)
          return 0;
        if (l === void 0)
          return 1;
        if (d === void 0)
          return -1;
        if (d === l)
          continue;
        return i(d, l);
      } while (++a);
    }
    compareBuild(u) {
      u instanceof c || (u = new c(u, this.options));
      let a = 0;
      do {
        const d = this.build[a], l = u.build[a];
        if (e("build compare", a, d, l), d === void 0 && l === void 0)
          return 0;
        if (l === void 0)
          return 1;
        if (d === void 0)
          return -1;
        if (d === l)
          continue;
        return i(d, l);
      } while (++a);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(u, a, d) {
      if (u.startsWith("pre")) {
        if (!a && d === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (a) {
          const l = `-${a}`.match(this.options.loose ? n[f.PRERELEASELOOSE] : n[f.PRERELEASE]);
          if (!l || l[1] !== a)
            throw new Error(`invalid identifier: ${a}`);
        }
      }
      switch (u) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", a, d);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", a, d);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", a, d), this.inc("pre", a, d);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", a, d), this.inc("pre", a, d);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const l = Number(d) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [l];
          else {
            let m = this.prerelease.length;
            for (; --m >= 0; )
              typeof this.prerelease[m] == "number" && (this.prerelease[m]++, m = -2);
            if (m === -1) {
              if (a === this.prerelease.join(".") && d === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(l);
            }
          }
          if (a) {
            let m = [a, l];
            d === !1 && (m = [a]), i(this.prerelease[0], a) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = m) : this.prerelease = m;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${u}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return Xu = c, Xu;
}
var Ju, Km;
function Qr() {
  if (Km) return Ju;
  Km = 1;
  const e = dt();
  return Ju = (o, n, f = !1) => {
    if (o instanceof e)
      return o;
    try {
      return new e(o, n);
    } catch (r) {
      if (!f)
        return null;
      throw r;
    }
  }, Ju;
}
var Qu, Wm;
function ob() {
  if (Wm) return Qu;
  Wm = 1;
  const e = Qr();
  return Qu = (o, n) => {
    const f = e(o, n);
    return f ? f.version : null;
  }, Qu;
}
var Zu, Ym;
function ub() {
  if (Ym) return Zu;
  Ym = 1;
  const e = Qr();
  return Zu = (o, n) => {
    const f = e(o.trim().replace(/^[=v]+/, ""), n);
    return f ? f.version : null;
  }, Zu;
}
var ec, Xm;
function cb() {
  if (Xm) return ec;
  Xm = 1;
  const e = dt();
  return ec = (o, n, f, r, i) => {
    typeof f == "string" && (i = r, r = f, f = void 0);
    try {
      return new e(
        o instanceof e ? o.version : o,
        f
      ).inc(n, r, i).version;
    } catch {
      return null;
    }
  }, ec;
}
var tc, Jm;
function lb() {
  if (Jm) return tc;
  Jm = 1;
  const e = Qr();
  return tc = (o, n) => {
    const f = e(o, null, !0), r = e(n, null, !0), i = f.compare(r);
    if (i === 0)
      return null;
    const c = i > 0, s = c ? f : r, u = c ? r : f, a = !!s.prerelease.length;
    if (!!u.prerelease.length && !a) {
      if (!u.patch && !u.minor)
        return "major";
      if (u.compareMain(s) === 0)
        return u.minor && !u.patch ? "minor" : "patch";
    }
    const l = a ? "pre" : "";
    return f.major !== r.major ? l + "major" : f.minor !== r.minor ? l + "minor" : f.patch !== r.patch ? l + "patch" : "prerelease";
  }, tc;
}
var rc, Qm;
function fb() {
  if (Qm) return rc;
  Qm = 1;
  const e = dt();
  return rc = (o, n) => new e(o, n).major, rc;
}
var nc, Zm;
function db() {
  if (Zm) return nc;
  Zm = 1;
  const e = dt();
  return nc = (o, n) => new e(o, n).minor, nc;
}
var ic, ey;
function hb() {
  if (ey) return ic;
  ey = 1;
  const e = dt();
  return ic = (o, n) => new e(o, n).patch, ic;
}
var ac, ty;
function pb() {
  if (ty) return ac;
  ty = 1;
  const e = Qr();
  return ac = (o, n) => {
    const f = e(o, n);
    return f && f.prerelease.length ? f.prerelease : null;
  }, ac;
}
var sc, ry;
function kt() {
  if (ry) return sc;
  ry = 1;
  const e = dt();
  return sc = (o, n, f) => new e(o, f).compare(new e(n, f)), sc;
}
var oc, ny;
function mb() {
  if (ny) return oc;
  ny = 1;
  const e = kt();
  return oc = (o, n, f) => e(n, o, f), oc;
}
var uc, iy;
function yb() {
  if (iy) return uc;
  iy = 1;
  const e = kt();
  return uc = (o, n) => e(o, n, !0), uc;
}
var cc, ay;
function ll() {
  if (ay) return cc;
  ay = 1;
  const e = dt();
  return cc = (o, n, f) => {
    const r = new e(o, f), i = new e(n, f);
    return r.compare(i) || r.compareBuild(i);
  }, cc;
}
var lc, sy;
function gb() {
  if (sy) return lc;
  sy = 1;
  const e = ll();
  return lc = (o, n) => o.sort((f, r) => e(f, r, n)), lc;
}
var fc, oy;
function vb() {
  if (oy) return fc;
  oy = 1;
  const e = ll();
  return fc = (o, n) => o.sort((f, r) => e(r, f, n)), fc;
}
var dc, uy;
function vs() {
  if (uy) return dc;
  uy = 1;
  const e = kt();
  return dc = (o, n, f) => e(o, n, f) > 0, dc;
}
var hc, cy;
function fl() {
  if (cy) return hc;
  cy = 1;
  const e = kt();
  return hc = (o, n, f) => e(o, n, f) < 0, hc;
}
var pc, ly;
function _g() {
  if (ly) return pc;
  ly = 1;
  const e = kt();
  return pc = (o, n, f) => e(o, n, f) === 0, pc;
}
var mc, fy;
function Eg() {
  if (fy) return mc;
  fy = 1;
  const e = kt();
  return mc = (o, n, f) => e(o, n, f) !== 0, mc;
}
var yc, dy;
function dl() {
  if (dy) return yc;
  dy = 1;
  const e = kt();
  return yc = (o, n, f) => e(o, n, f) >= 0, yc;
}
var gc, hy;
function hl() {
  if (hy) return gc;
  hy = 1;
  const e = kt();
  return gc = (o, n, f) => e(o, n, f) <= 0, gc;
}
var vc, py;
function wg() {
  if (py) return vc;
  py = 1;
  const e = _g(), t = Eg(), o = vs(), n = dl(), f = fl(), r = hl();
  return vc = (c, s, u, a) => {
    switch (s) {
      case "===":
        return typeof c == "object" && (c = c.version), typeof u == "object" && (u = u.version), c === u;
      case "!==":
        return typeof c == "object" && (c = c.version), typeof u == "object" && (u = u.version), c !== u;
      case "":
      case "=":
      case "==":
        return e(c, u, a);
      case "!=":
        return t(c, u, a);
      case ">":
        return o(c, u, a);
      case ">=":
        return n(c, u, a);
      case "<":
        return f(c, u, a);
      case "<=":
        return r(c, u, a);
      default:
        throw new TypeError(`Invalid operator: ${s}`);
    }
  }, vc;
}
var _c, my;
function _b() {
  if (my) return _c;
  my = 1;
  const e = dt(), t = Qr(), { safeRe: o, t: n } = Fn();
  return _c = (r, i) => {
    if (r instanceof e)
      return r;
    if (typeof r == "number" && (r = String(r)), typeof r != "string")
      return null;
    i = i || {};
    let c = null;
    if (!i.rtl)
      c = r.match(i.includePrerelease ? o[n.COERCEFULL] : o[n.COERCE]);
    else {
      const m = i.includePrerelease ? o[n.COERCERTLFULL] : o[n.COERCERTL];
      let g;
      for (; (g = m.exec(r)) && (!c || c.index + c[0].length !== r.length); )
        (!c || g.index + g[0].length !== c.index + c[0].length) && (c = g), m.lastIndex = g.index + g[1].length + g[2].length;
      m.lastIndex = -1;
    }
    if (c === null)
      return null;
    const s = c[2], u = c[3] || "0", a = c[4] || "0", d = i.includePrerelease && c[5] ? `-${c[5]}` : "", l = i.includePrerelease && c[6] ? `+${c[6]}` : "";
    return t(`${s}.${u}.${a}${d}${l}`, i);
  }, _c;
}
var Ec, yy;
function Eb() {
  if (yy) return Ec;
  yy = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(o) {
      const n = this.map.get(o);
      if (n !== void 0)
        return this.map.delete(o), this.map.set(o, n), n;
    }
    delete(o) {
      return this.map.delete(o);
    }
    set(o, n) {
      if (!this.delete(o) && n !== void 0) {
        if (this.map.size >= this.max) {
          const r = this.map.keys().next().value;
          this.delete(r);
        }
        this.map.set(o, n);
      }
      return this;
    }
  }
  return Ec = e, Ec;
}
var wc, gy;
function qt() {
  if (gy) return wc;
  gy = 1;
  const e = /\s+/g;
  class t {
    constructor(F, X) {
      if (X = f(X), F instanceof t)
        return F.loose === !!X.loose && F.includePrerelease === !!X.includePrerelease ? F : new t(F.raw, X);
      if (F instanceof r)
        return this.raw = F.value, this.set = [[F]], this.formatted = void 0, this;
      if (this.options = X, this.loose = !!X.loose, this.includePrerelease = !!X.includePrerelease, this.raw = F.trim().replace(e, " "), this.set = this.raw.split("||").map((B) => this.parseRange(B.trim())).filter((B) => B.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const B = this.set[0];
        if (this.set = this.set.filter((Y) => !v(Y[0])), this.set.length === 0)
          this.set = [B];
        else if (this.set.length > 1) {
          for (const Y of this.set)
            if (Y.length === 1 && h(Y[0])) {
              this.set = [Y];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let F = 0; F < this.set.length; F++) {
          F > 0 && (this.formatted += "||");
          const X = this.set[F];
          for (let B = 0; B < X.length; B++)
            B > 0 && (this.formatted += " "), this.formatted += X[B].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(F) {
      const B = ((this.options.includePrerelease && m) | (this.options.loose && g)) + ":" + F, Y = n.get(B);
      if (Y)
        return Y;
      const Z = this.options.loose, V = Z ? s[u.HYPHENRANGELOOSE] : s[u.HYPHENRANGE];
      F = F.replace(V, M(this.options.includePrerelease)), i("hyphen replace", F), F = F.replace(s[u.COMPARATORTRIM], a), i("comparator trim", F), F = F.replace(s[u.TILDETRIM], d), i("tilde trim", F), F = F.replace(s[u.CARETTRIM], l), i("caret trim", F);
      let C = F.split(" ").map((O) => p(O, this.options)).join(" ").split(/\s+/).map((O) => L(O, this.options));
      Z && (C = C.filter((O) => (i("loose invalid filter", O, this.options), !!O.match(s[u.COMPARATORLOOSE])))), i("range list", C);
      const U = /* @__PURE__ */ new Map(), D = C.map((O) => new r(O, this.options));
      for (const O of D) {
        if (v(O))
          return [O];
        U.set(O.value, O);
      }
      U.size > 1 && U.has("") && U.delete("");
      const R = [...U.values()];
      return n.set(B, R), R;
    }
    intersects(F, X) {
      if (!(F instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((B) => y(B, X) && F.set.some((Y) => y(Y, X) && B.every((Z) => Y.every((V) => Z.intersects(V, X)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(F) {
      if (!F)
        return !1;
      if (typeof F == "string")
        try {
          F = new c(F, this.options);
        } catch {
          return !1;
        }
      for (let X = 0; X < this.set.length; X++)
        if (K(this.set[X], F, this.options))
          return !0;
      return !1;
    }
  }
  wc = t;
  const o = Eb(), n = new o(), f = cl(), r = _s(), i = gs(), c = dt(), {
    safeRe: s,
    t: u,
    comparatorTrimReplace: a,
    tildeTrimReplace: d,
    caretTrimReplace: l
  } = Fn(), { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: g } = ys(), v = (k) => k.value === "<0.0.0-0", h = (k) => k.value === "", y = (k, F) => {
    let X = !0;
    const B = k.slice();
    let Y = B.pop();
    for (; X && B.length; )
      X = B.every((Z) => Y.intersects(Z, F)), Y = B.pop();
    return X;
  }, p = (k, F) => (k = k.replace(s[u.BUILD], ""), i("comp", k, F), k = _(k, F), i("caret", k), k = b(k, F), i("tildes", k), k = P(k, F), i("xrange", k), k = G(k, F), i("stars", k), k), E = (k) => !k || k.toLowerCase() === "x" || k === "*", b = (k, F) => k.trim().split(/\s+/).map((X) => $(X, F)).join(" "), $ = (k, F) => {
    const X = F.loose ? s[u.TILDELOOSE] : s[u.TILDE];
    return k.replace(X, (B, Y, Z, V, C) => {
      i("tilde", k, B, Y, Z, V, C);
      let U;
      return E(Y) ? U = "" : E(Z) ? U = `>=${Y}.0.0 <${+Y + 1}.0.0-0` : E(V) ? U = `>=${Y}.${Z}.0 <${Y}.${+Z + 1}.0-0` : C ? (i("replaceTilde pr", C), U = `>=${Y}.${Z}.${V}-${C} <${Y}.${+Z + 1}.0-0`) : U = `>=${Y}.${Z}.${V} <${Y}.${+Z + 1}.0-0`, i("tilde return", U), U;
    });
  }, _ = (k, F) => k.trim().split(/\s+/).map((X) => w(X, F)).join(" "), w = (k, F) => {
    i("caret", k, F);
    const X = F.loose ? s[u.CARETLOOSE] : s[u.CARET], B = F.includePrerelease ? "-0" : "";
    return k.replace(X, (Y, Z, V, C, U) => {
      i("caret", k, Y, Z, V, C, U);
      let D;
      return E(Z) ? D = "" : E(V) ? D = `>=${Z}.0.0${B} <${+Z + 1}.0.0-0` : E(C) ? Z === "0" ? D = `>=${Z}.${V}.0${B} <${Z}.${+V + 1}.0-0` : D = `>=${Z}.${V}.0${B} <${+Z + 1}.0.0-0` : U ? (i("replaceCaret pr", U), Z === "0" ? V === "0" ? D = `>=${Z}.${V}.${C}-${U} <${Z}.${V}.${+C + 1}-0` : D = `>=${Z}.${V}.${C}-${U} <${Z}.${+V + 1}.0-0` : D = `>=${Z}.${V}.${C}-${U} <${+Z + 1}.0.0-0`) : (i("no pr"), Z === "0" ? V === "0" ? D = `>=${Z}.${V}.${C}${B} <${Z}.${V}.${+C + 1}-0` : D = `>=${Z}.${V}.${C}${B} <${Z}.${+V + 1}.0-0` : D = `>=${Z}.${V}.${C} <${+Z + 1}.0.0-0`), i("caret return", D), D;
    });
  }, P = (k, F) => (i("replaceXRanges", k, F), k.split(/\s+/).map((X) => T(X, F)).join(" ")), T = (k, F) => {
    k = k.trim();
    const X = F.loose ? s[u.XRANGELOOSE] : s[u.XRANGE];
    return k.replace(X, (B, Y, Z, V, C, U) => {
      i("xRange", k, B, Y, Z, V, C, U);
      const D = E(Z), R = D || E(V), O = R || E(C), x = O;
      return Y === "=" && x && (Y = ""), U = F.includePrerelease ? "-0" : "", D ? Y === ">" || Y === "<" ? B = "<0.0.0-0" : B = "*" : Y && x ? (R && (V = 0), C = 0, Y === ">" ? (Y = ">=", R ? (Z = +Z + 1, V = 0, C = 0) : (V = +V + 1, C = 0)) : Y === "<=" && (Y = "<", R ? Z = +Z + 1 : V = +V + 1), Y === "<" && (U = "-0"), B = `${Y + Z}.${V}.${C}${U}`) : R ? B = `>=${Z}.0.0${U} <${+Z + 1}.0.0-0` : O && (B = `>=${Z}.${V}.0${U} <${Z}.${+V + 1}.0-0`), i("xRange return", B), B;
    });
  }, G = (k, F) => (i("replaceStars", k, F), k.trim().replace(s[u.STAR], "")), L = (k, F) => (i("replaceGTE0", k, F), k.trim().replace(s[F.includePrerelease ? u.GTE0PRE : u.GTE0], "")), M = (k) => (F, X, B, Y, Z, V, C, U, D, R, O, x) => (E(B) ? X = "" : E(Y) ? X = `>=${B}.0.0${k ? "-0" : ""}` : E(Z) ? X = `>=${B}.${Y}.0${k ? "-0" : ""}` : V ? X = `>=${X}` : X = `>=${X}${k ? "-0" : ""}`, E(D) ? U = "" : E(R) ? U = `<${+D + 1}.0.0-0` : E(O) ? U = `<${D}.${+R + 1}.0-0` : x ? U = `<=${D}.${R}.${O}-${x}` : k ? U = `<${D}.${R}.${+O + 1}-0` : U = `<=${U}`, `${X} ${U}`.trim()), K = (k, F, X) => {
    for (let B = 0; B < k.length; B++)
      if (!k[B].test(F))
        return !1;
    if (F.prerelease.length && !X.includePrerelease) {
      for (let B = 0; B < k.length; B++)
        if (i(k[B].semver), k[B].semver !== r.ANY && k[B].semver.prerelease.length > 0) {
          const Y = k[B].semver;
          if (Y.major === F.major && Y.minor === F.minor && Y.patch === F.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return wc;
}
var $c, vy;
function _s() {
  if (vy) return $c;
  vy = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(a, d) {
      if (d = o(d), a instanceof t) {
        if (a.loose === !!d.loose)
          return a;
        a = a.value;
      }
      a = a.trim().split(/\s+/).join(" "), i("comparator", a, d), this.options = d, this.loose = !!d.loose, this.parse(a), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(a) {
      const d = this.options.loose ? n[f.COMPARATORLOOSE] : n[f.COMPARATOR], l = a.match(d);
      if (!l)
        throw new TypeError(`Invalid comparator: ${a}`);
      this.operator = l[1] !== void 0 ? l[1] : "", this.operator === "=" && (this.operator = ""), l[2] ? this.semver = new c(l[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(a) {
      if (i("Comparator.test", a, this.options.loose), this.semver === e || a === e)
        return !0;
      if (typeof a == "string")
        try {
          a = new c(a, this.options);
        } catch {
          return !1;
        }
      return r(a, this.operator, this.semver, this.options);
    }
    intersects(a, d) {
      if (!(a instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new s(a.value, d).test(this.value) : a.operator === "" ? a.value === "" ? !0 : new s(this.value, d).test(a.semver) : (d = o(d), d.includePrerelease && (this.value === "<0.0.0-0" || a.value === "<0.0.0-0") || !d.includePrerelease && (this.value.startsWith("<0.0.0") || a.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && a.operator.startsWith(">") || this.operator.startsWith("<") && a.operator.startsWith("<") || this.semver.version === a.semver.version && this.operator.includes("=") && a.operator.includes("=") || r(this.semver, "<", a.semver, d) && this.operator.startsWith(">") && a.operator.startsWith("<") || r(this.semver, ">", a.semver, d) && this.operator.startsWith("<") && a.operator.startsWith(">")));
    }
  }
  $c = t;
  const o = cl(), { safeRe: n, t: f } = Fn(), r = wg(), i = gs(), c = dt(), s = qt();
  return $c;
}
var Sc, _y;
function Es() {
  if (_y) return Sc;
  _y = 1;
  const e = qt();
  return Sc = (o, n, f) => {
    try {
      n = new e(n, f);
    } catch {
      return !1;
    }
    return n.test(o);
  }, Sc;
}
var bc, Ey;
function wb() {
  if (Ey) return bc;
  Ey = 1;
  const e = qt();
  return bc = (o, n) => new e(o, n).set.map((f) => f.map((r) => r.value).join(" ").trim().split(" ")), bc;
}
var Rc, wy;
function $b() {
  if (wy) return Rc;
  wy = 1;
  const e = dt(), t = qt();
  return Rc = (n, f, r) => {
    let i = null, c = null, s = null;
    try {
      s = new t(f, r);
    } catch {
      return null;
    }
    return n.forEach((u) => {
      s.test(u) && (!i || c.compare(u) === -1) && (i = u, c = new e(i, r));
    }), i;
  }, Rc;
}
var Pc, $y;
function Sb() {
  if ($y) return Pc;
  $y = 1;
  const e = dt(), t = qt();
  return Pc = (n, f, r) => {
    let i = null, c = null, s = null;
    try {
      s = new t(f, r);
    } catch {
      return null;
    }
    return n.forEach((u) => {
      s.test(u) && (!i || c.compare(u) === 1) && (i = u, c = new e(i, r));
    }), i;
  }, Pc;
}
var Tc, Sy;
function bb() {
  if (Sy) return Tc;
  Sy = 1;
  const e = dt(), t = qt(), o = vs();
  return Tc = (f, r) => {
    f = new t(f, r);
    let i = new e("0.0.0");
    if (f.test(i) || (i = new e("0.0.0-0"), f.test(i)))
      return i;
    i = null;
    for (let c = 0; c < f.set.length; ++c) {
      const s = f.set[c];
      let u = null;
      s.forEach((a) => {
        const d = new e(a.semver.version);
        switch (a.operator) {
          case ">":
            d.prerelease.length === 0 ? d.patch++ : d.prerelease.push(0), d.raw = d.format();
          /* fallthrough */
          case "":
          case ">=":
            (!u || o(d, u)) && (u = d);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${a.operator}`);
        }
      }), u && (!i || o(i, u)) && (i = u);
    }
    return i && f.test(i) ? i : null;
  }, Tc;
}
var Oc, by;
function Rb() {
  if (by) return Oc;
  by = 1;
  const e = qt();
  return Oc = (o, n) => {
    try {
      return new e(o, n).range || "*";
    } catch {
      return null;
    }
  }, Oc;
}
var Nc, Ry;
function pl() {
  if (Ry) return Nc;
  Ry = 1;
  const e = dt(), t = _s(), { ANY: o } = t, n = qt(), f = Es(), r = vs(), i = fl(), c = hl(), s = dl();
  return Nc = (a, d, l, m) => {
    a = new e(a, m), d = new n(d, m);
    let g, v, h, y, p;
    switch (l) {
      case ">":
        g = r, v = c, h = i, y = ">", p = ">=";
        break;
      case "<":
        g = i, v = s, h = r, y = "<", p = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (f(a, d, m))
      return !1;
    for (let E = 0; E < d.set.length; ++E) {
      const b = d.set[E];
      let $ = null, _ = null;
      if (b.forEach((w) => {
        w.semver === o && (w = new t(">=0.0.0")), $ = $ || w, _ = _ || w, g(w.semver, $.semver, m) ? $ = w : h(w.semver, _.semver, m) && (_ = w);
      }), $.operator === y || $.operator === p || (!_.operator || _.operator === y) && v(a, _.semver))
        return !1;
      if (_.operator === p && h(a, _.semver))
        return !1;
    }
    return !0;
  }, Nc;
}
var Ic, Py;
function Pb() {
  if (Py) return Ic;
  Py = 1;
  const e = pl();
  return Ic = (o, n, f) => e(o, n, ">", f), Ic;
}
var Ac, Ty;
function Tb() {
  if (Ty) return Ac;
  Ty = 1;
  const e = pl();
  return Ac = (o, n, f) => e(o, n, "<", f), Ac;
}
var Cc, Oy;
function Ob() {
  if (Oy) return Cc;
  Oy = 1;
  const e = qt();
  return Cc = (o, n, f) => (o = new e(o, f), n = new e(n, f), o.intersects(n, f)), Cc;
}
var Dc, Ny;
function Nb() {
  if (Ny) return Dc;
  Ny = 1;
  const e = Es(), t = kt();
  return Dc = (o, n, f) => {
    const r = [];
    let i = null, c = null;
    const s = o.sort((l, m) => t(l, m, f));
    for (const l of s)
      e(l, n, f) ? (c = l, i || (i = l)) : (c && r.push([i, c]), c = null, i = null);
    i && r.push([i, null]);
    const u = [];
    for (const [l, m] of r)
      l === m ? u.push(l) : !m && l === s[0] ? u.push("*") : m ? l === s[0] ? u.push(`<=${m}`) : u.push(`${l} - ${m}`) : u.push(`>=${l}`);
    const a = u.join(" || "), d = typeof n.raw == "string" ? n.raw : String(n);
    return a.length < d.length ? a : n;
  }, Dc;
}
var kc, Iy;
function Ib() {
  if (Iy) return kc;
  Iy = 1;
  const e = qt(), t = _s(), { ANY: o } = t, n = Es(), f = kt(), r = (d, l, m = {}) => {
    if (d === l)
      return !0;
    d = new e(d, m), l = new e(l, m);
    let g = !1;
    e: for (const v of d.set) {
      for (const h of l.set) {
        const y = s(v, h, m);
        if (g = g || y !== null, y)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, i = [new t(">=0.0.0-0")], c = [new t(">=0.0.0")], s = (d, l, m) => {
    if (d === l)
      return !0;
    if (d.length === 1 && d[0].semver === o) {
      if (l.length === 1 && l[0].semver === o)
        return !0;
      m.includePrerelease ? d = i : d = c;
    }
    if (l.length === 1 && l[0].semver === o) {
      if (m.includePrerelease)
        return !0;
      l = c;
    }
    const g = /* @__PURE__ */ new Set();
    let v, h;
    for (const P of d)
      P.operator === ">" || P.operator === ">=" ? v = u(v, P, m) : P.operator === "<" || P.operator === "<=" ? h = a(h, P, m) : g.add(P.semver);
    if (g.size > 1)
      return null;
    let y;
    if (v && h) {
      if (y = f(v.semver, h.semver, m), y > 0)
        return null;
      if (y === 0 && (v.operator !== ">=" || h.operator !== "<="))
        return null;
    }
    for (const P of g) {
      if (v && !n(P, String(v), m) || h && !n(P, String(h), m))
        return null;
      for (const T of l)
        if (!n(P, String(T), m))
          return !1;
      return !0;
    }
    let p, E, b, $, _ = h && !m.includePrerelease && h.semver.prerelease.length ? h.semver : !1, w = v && !m.includePrerelease && v.semver.prerelease.length ? v.semver : !1;
    _ && _.prerelease.length === 1 && h.operator === "<" && _.prerelease[0] === 0 && (_ = !1);
    for (const P of l) {
      if ($ = $ || P.operator === ">" || P.operator === ">=", b = b || P.operator === "<" || P.operator === "<=", v) {
        if (w && P.semver.prerelease && P.semver.prerelease.length && P.semver.major === w.major && P.semver.minor === w.minor && P.semver.patch === w.patch && (w = !1), P.operator === ">" || P.operator === ">=") {
          if (p = u(v, P, m), p === P && p !== v)
            return !1;
        } else if (v.operator === ">=" && !n(v.semver, String(P), m))
          return !1;
      }
      if (h) {
        if (_ && P.semver.prerelease && P.semver.prerelease.length && P.semver.major === _.major && P.semver.minor === _.minor && P.semver.patch === _.patch && (_ = !1), P.operator === "<" || P.operator === "<=") {
          if (E = a(h, P, m), E === P && E !== h)
            return !1;
        } else if (h.operator === "<=" && !n(h.semver, String(P), m))
          return !1;
      }
      if (!P.operator && (h || v) && y !== 0)
        return !1;
    }
    return !(v && b && !h && y !== 0 || h && $ && !v && y !== 0 || w || _);
  }, u = (d, l, m) => {
    if (!d)
      return l;
    const g = f(d.semver, l.semver, m);
    return g > 0 ? d : g < 0 || l.operator === ">" && d.operator === ">=" ? l : d;
  }, a = (d, l, m) => {
    if (!d)
      return l;
    const g = f(d.semver, l.semver, m);
    return g < 0 ? d : g > 0 || l.operator === "<" && d.operator === "<=" ? l : d;
  };
  return kc = r, kc;
}
var qc, Ay;
function $g() {
  if (Ay) return qc;
  Ay = 1;
  const e = Fn(), t = ys(), o = dt(), n = vg(), f = Qr(), r = ob(), i = ub(), c = cb(), s = lb(), u = fb(), a = db(), d = hb(), l = pb(), m = kt(), g = mb(), v = yb(), h = ll(), y = gb(), p = vb(), E = vs(), b = fl(), $ = _g(), _ = Eg(), w = dl(), P = hl(), T = wg(), G = _b(), L = _s(), M = qt(), K = Es(), k = wb(), F = $b(), X = Sb(), B = bb(), Y = Rb(), Z = pl(), V = Pb(), C = Tb(), U = Ob(), D = Nb(), R = Ib();
  return qc = {
    parse: f,
    valid: r,
    clean: i,
    inc: c,
    diff: s,
    major: u,
    minor: a,
    patch: d,
    prerelease: l,
    compare: m,
    rcompare: g,
    compareLoose: v,
    compareBuild: h,
    sort: y,
    rsort: p,
    gt: E,
    lt: b,
    eq: $,
    neq: _,
    gte: w,
    lte: P,
    cmp: T,
    coerce: G,
    Comparator: L,
    Range: M,
    satisfies: K,
    toComparators: k,
    maxSatisfying: F,
    minSatisfying: X,
    minVersion: B,
    validRange: Y,
    outside: Z,
    gtr: V,
    ltr: C,
    intersects: U,
    simplifyRange: D,
    subset: R,
    SemVer: o,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: t.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: t.RELEASE_TYPES,
    compareIdentifiers: n.compareIdentifiers,
    rcompareIdentifiers: n.rcompareIdentifiers
  }, qc;
}
var Gr = {}, An = { exports: {} };
An.exports;
var Cy;
function Ab() {
  return Cy || (Cy = 1, (function(e, t) {
    var o = 200, n = "__lodash_hash_undefined__", f = 1, r = 2, i = 9007199254740991, c = "[object Arguments]", s = "[object Array]", u = "[object AsyncFunction]", a = "[object Boolean]", d = "[object Date]", l = "[object Error]", m = "[object Function]", g = "[object GeneratorFunction]", v = "[object Map]", h = "[object Number]", y = "[object Null]", p = "[object Object]", E = "[object Promise]", b = "[object Proxy]", $ = "[object RegExp]", _ = "[object Set]", w = "[object String]", P = "[object Symbol]", T = "[object Undefined]", G = "[object WeakMap]", L = "[object ArrayBuffer]", M = "[object DataView]", K = "[object Float32Array]", k = "[object Float64Array]", F = "[object Int8Array]", X = "[object Int16Array]", B = "[object Int32Array]", Y = "[object Uint8Array]", Z = "[object Uint8ClampedArray]", V = "[object Uint16Array]", C = "[object Uint32Array]", U = /[\\^$.*+?()[\]{}|]/g, D = /^\[object .+?Constructor\]$/, R = /^(?:0|[1-9]\d*)$/, O = {};
    O[K] = O[k] = O[F] = O[X] = O[B] = O[Y] = O[Z] = O[V] = O[C] = !0, O[c] = O[s] = O[L] = O[a] = O[M] = O[d] = O[l] = O[m] = O[v] = O[h] = O[p] = O[$] = O[_] = O[w] = O[G] = !1;
    var x = typeof Ot == "object" && Ot && Ot.Object === Object && Ot, I = typeof self == "object" && self && self.Object === Object && self, N = x || I || Function("return this")(), Q = t && !t.nodeType && t, H = Q && !0 && e && !e.nodeType && e, A = H && H.exports === Q, q = A && x.process, W = (function() {
      try {
        return q && q.binding && q.binding("util");
      } catch {
      }
    })(), J = W && W.isTypedArray;
    function re(z, ee) {
      for (var ce = -1, Ee = z == null ? 0 : z.length, Be = 0, Pe = []; ++ce < Ee; ) {
        var Ye = z[ce];
        ee(Ye, ce, z) && (Pe[Be++] = Ye);
      }
      return Pe;
    }
    function fe(z, ee) {
      for (var ce = -1, Ee = ee.length, Be = z.length; ++ce < Ee; )
        z[Be + ce] = ee[ce];
      return z;
    }
    function ge(z, ee) {
      for (var ce = -1, Ee = z == null ? 0 : z.length; ++ce < Ee; )
        if (ee(z[ce], ce, z))
          return !0;
      return !1;
    }
    function Oe(z, ee) {
      for (var ce = -1, Ee = Array(z); ++ce < z; )
        Ee[ce] = ee(ce);
      return Ee;
    }
    function ke(z) {
      return function(ee) {
        return z(ee);
      };
    }
    function Ne(z, ee) {
      return z.has(ee);
    }
    function Se(z, ee) {
      return z?.[ee];
    }
    function S(z) {
      var ee = -1, ce = Array(z.size);
      return z.forEach(function(Ee, Be) {
        ce[++ee] = [Be, Ee];
      }), ce;
    }
    function te(z, ee) {
      return function(ce) {
        return z(ee(ce));
      };
    }
    function ie(z) {
      var ee = -1, ce = Array(z.size);
      return z.forEach(function(Ee) {
        ce[++ee] = Ee;
      }), ce;
    }
    var pe = Array.prototype, ae = Function.prototype, de = Object.prototype, le = N["__core-js_shared__"], me = ae.toString, ve = de.hasOwnProperty, Fe = (function() {
      var z = /[^.]+$/.exec(le && le.keys && le.keys.IE_PROTO || "");
      return z ? "Symbol(src)_1." + z : "";
    })(), je = de.toString, $e = RegExp(
      "^" + me.call(ve).replace(U, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), j = A ? N.Buffer : void 0, ne = N.Symbol, se = N.Uint8Array, oe = de.propertyIsEnumerable, ue = pe.splice, ye = ne ? ne.toStringTag : void 0, he = Object.getOwnPropertySymbols, _e = j ? j.isBuffer : void 0, we = te(Object.keys, Object), be = kr(N, "DataView"), Ge = kr(N, "Map"), We = kr(N, "Promise"), Me = kr(N, "Set"), Dr = kr(N, "WeakMap"), bt = kr(Object, "create"), fr = pr(be), Cg = pr(Ge), Dg = pr(We), kg = pr(Me), qg = pr(Dr), gl = ne ? ne.prototype : void 0, ws = gl ? gl.valueOf : void 0;
    function dr(z) {
      var ee = -1, ce = z == null ? 0 : z.length;
      for (this.clear(); ++ee < ce; ) {
        var Ee = z[ee];
        this.set(Ee[0], Ee[1]);
      }
    }
    function Lg() {
      this.__data__ = bt ? bt(null) : {}, this.size = 0;
    }
    function Fg(z) {
      var ee = this.has(z) && delete this.__data__[z];
      return this.size -= ee ? 1 : 0, ee;
    }
    function jg(z) {
      var ee = this.__data__;
      if (bt) {
        var ce = ee[z];
        return ce === n ? void 0 : ce;
      }
      return ve.call(ee, z) ? ee[z] : void 0;
    }
    function Ug(z) {
      var ee = this.__data__;
      return bt ? ee[z] !== void 0 : ve.call(ee, z);
    }
    function Mg(z, ee) {
      var ce = this.__data__;
      return this.size += this.has(z) ? 0 : 1, ce[z] = bt && ee === void 0 ? n : ee, this;
    }
    dr.prototype.clear = Lg, dr.prototype.delete = Fg, dr.prototype.get = jg, dr.prototype.has = Ug, dr.prototype.set = Mg;
    function Ft(z) {
      var ee = -1, ce = z == null ? 0 : z.length;
      for (this.clear(); ++ee < ce; ) {
        var Ee = z[ee];
        this.set(Ee[0], Ee[1]);
      }
    }
    function xg() {
      this.__data__ = [], this.size = 0;
    }
    function Vg(z) {
      var ee = this.__data__, ce = Mn(ee, z);
      if (ce < 0)
        return !1;
      var Ee = ee.length - 1;
      return ce == Ee ? ee.pop() : ue.call(ee, ce, 1), --this.size, !0;
    }
    function Gg(z) {
      var ee = this.__data__, ce = Mn(ee, z);
      return ce < 0 ? void 0 : ee[ce][1];
    }
    function Bg(z) {
      return Mn(this.__data__, z) > -1;
    }
    function Hg(z, ee) {
      var ce = this.__data__, Ee = Mn(ce, z);
      return Ee < 0 ? (++this.size, ce.push([z, ee])) : ce[Ee][1] = ee, this;
    }
    Ft.prototype.clear = xg, Ft.prototype.delete = Vg, Ft.prototype.get = Gg, Ft.prototype.has = Bg, Ft.prototype.set = Hg;
    function hr(z) {
      var ee = -1, ce = z == null ? 0 : z.length;
      for (this.clear(); ++ee < ce; ) {
        var Ee = z[ee];
        this.set(Ee[0], Ee[1]);
      }
    }
    function zg() {
      this.size = 0, this.__data__ = {
        hash: new dr(),
        map: new (Ge || Ft)(),
        string: new dr()
      };
    }
    function Kg(z) {
      var ee = xn(this, z).delete(z);
      return this.size -= ee ? 1 : 0, ee;
    }
    function Wg(z) {
      return xn(this, z).get(z);
    }
    function Yg(z) {
      return xn(this, z).has(z);
    }
    function Xg(z, ee) {
      var ce = xn(this, z), Ee = ce.size;
      return ce.set(z, ee), this.size += ce.size == Ee ? 0 : 1, this;
    }
    hr.prototype.clear = zg, hr.prototype.delete = Kg, hr.prototype.get = Wg, hr.prototype.has = Yg, hr.prototype.set = Xg;
    function Un(z) {
      var ee = -1, ce = z == null ? 0 : z.length;
      for (this.__data__ = new hr(); ++ee < ce; )
        this.add(z[ee]);
    }
    function Jg(z) {
      return this.__data__.set(z, n), this;
    }
    function Qg(z) {
      return this.__data__.has(z);
    }
    Un.prototype.add = Un.prototype.push = Jg, Un.prototype.has = Qg;
    function Yt(z) {
      var ee = this.__data__ = new Ft(z);
      this.size = ee.size;
    }
    function Zg() {
      this.__data__ = new Ft(), this.size = 0;
    }
    function ev(z) {
      var ee = this.__data__, ce = ee.delete(z);
      return this.size = ee.size, ce;
    }
    function tv(z) {
      return this.__data__.get(z);
    }
    function rv(z) {
      return this.__data__.has(z);
    }
    function nv(z, ee) {
      var ce = this.__data__;
      if (ce instanceof Ft) {
        var Ee = ce.__data__;
        if (!Ge || Ee.length < o - 1)
          return Ee.push([z, ee]), this.size = ++ce.size, this;
        ce = this.__data__ = new hr(Ee);
      }
      return ce.set(z, ee), this.size = ce.size, this;
    }
    Yt.prototype.clear = Zg, Yt.prototype.delete = ev, Yt.prototype.get = tv, Yt.prototype.has = rv, Yt.prototype.set = nv;
    function iv(z, ee) {
      var ce = Vn(z), Ee = !ce && _v(z), Be = !ce && !Ee && $s(z), Pe = !ce && !Ee && !Be && Pl(z), Ye = ce || Ee || Be || Pe, Xe = Ye ? Oe(z.length, String) : [], Je = Xe.length;
      for (var ze in z)
        ve.call(z, ze) && !(Ye && // Safari 9 has enumerable `arguments.length` in strict mode.
        (ze == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        Be && (ze == "offset" || ze == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Pe && (ze == "buffer" || ze == "byteLength" || ze == "byteOffset") || // Skip index properties.
        pv(ze, Je))) && Xe.push(ze);
      return Xe;
    }
    function Mn(z, ee) {
      for (var ce = z.length; ce--; )
        if ($l(z[ce][0], ee))
          return ce;
      return -1;
    }
    function av(z, ee, ce) {
      var Ee = ee(z);
      return Vn(z) ? Ee : fe(Ee, ce(z));
    }
    function en(z) {
      return z == null ? z === void 0 ? T : y : ye && ye in Object(z) ? dv(z) : vv(z);
    }
    function vl(z) {
      return tn(z) && en(z) == c;
    }
    function _l(z, ee, ce, Ee, Be) {
      return z === ee ? !0 : z == null || ee == null || !tn(z) && !tn(ee) ? z !== z && ee !== ee : sv(z, ee, ce, Ee, _l, Be);
    }
    function sv(z, ee, ce, Ee, Be, Pe) {
      var Ye = Vn(z), Xe = Vn(ee), Je = Ye ? s : Xt(z), ze = Xe ? s : Xt(ee);
      Je = Je == c ? p : Je, ze = ze == c ? p : ze;
      var mt = Je == p, Rt = ze == p, tt = Je == ze;
      if (tt && $s(z)) {
        if (!$s(ee))
          return !1;
        Ye = !0, mt = !1;
      }
      if (tt && !mt)
        return Pe || (Pe = new Yt()), Ye || Pl(z) ? El(z, ee, ce, Ee, Be, Pe) : lv(z, ee, Je, ce, Ee, Be, Pe);
      if (!(ce & f)) {
        var Et = mt && ve.call(z, "__wrapped__"), wt = Rt && ve.call(ee, "__wrapped__");
        if (Et || wt) {
          var Jt = Et ? z.value() : z, jt = wt ? ee.value() : ee;
          return Pe || (Pe = new Yt()), Be(Jt, jt, ce, Ee, Pe);
        }
      }
      return tt ? (Pe || (Pe = new Yt()), fv(z, ee, ce, Ee, Be, Pe)) : !1;
    }
    function ov(z) {
      if (!Rl(z) || yv(z))
        return !1;
      var ee = Sl(z) ? $e : D;
      return ee.test(pr(z));
    }
    function uv(z) {
      return tn(z) && bl(z.length) && !!O[en(z)];
    }
    function cv(z) {
      if (!gv(z))
        return we(z);
      var ee = [];
      for (var ce in Object(z))
        ve.call(z, ce) && ce != "constructor" && ee.push(ce);
      return ee;
    }
    function El(z, ee, ce, Ee, Be, Pe) {
      var Ye = ce & f, Xe = z.length, Je = ee.length;
      if (Xe != Je && !(Ye && Je > Xe))
        return !1;
      var ze = Pe.get(z);
      if (ze && Pe.get(ee))
        return ze == ee;
      var mt = -1, Rt = !0, tt = ce & r ? new Un() : void 0;
      for (Pe.set(z, ee), Pe.set(ee, z); ++mt < Xe; ) {
        var Et = z[mt], wt = ee[mt];
        if (Ee)
          var Jt = Ye ? Ee(wt, Et, mt, ee, z, Pe) : Ee(Et, wt, mt, z, ee, Pe);
        if (Jt !== void 0) {
          if (Jt)
            continue;
          Rt = !1;
          break;
        }
        if (tt) {
          if (!ge(ee, function(jt, mr) {
            if (!Ne(tt, mr) && (Et === jt || Be(Et, jt, ce, Ee, Pe)))
              return tt.push(mr);
          })) {
            Rt = !1;
            break;
          }
        } else if (!(Et === wt || Be(Et, wt, ce, Ee, Pe))) {
          Rt = !1;
          break;
        }
      }
      return Pe.delete(z), Pe.delete(ee), Rt;
    }
    function lv(z, ee, ce, Ee, Be, Pe, Ye) {
      switch (ce) {
        case M:
          if (z.byteLength != ee.byteLength || z.byteOffset != ee.byteOffset)
            return !1;
          z = z.buffer, ee = ee.buffer;
        case L:
          return !(z.byteLength != ee.byteLength || !Pe(new se(z), new se(ee)));
        case a:
        case d:
        case h:
          return $l(+z, +ee);
        case l:
          return z.name == ee.name && z.message == ee.message;
        case $:
        case w:
          return z == ee + "";
        case v:
          var Xe = S;
        case _:
          var Je = Ee & f;
          if (Xe || (Xe = ie), z.size != ee.size && !Je)
            return !1;
          var ze = Ye.get(z);
          if (ze)
            return ze == ee;
          Ee |= r, Ye.set(z, ee);
          var mt = El(Xe(z), Xe(ee), Ee, Be, Pe, Ye);
          return Ye.delete(z), mt;
        case P:
          if (ws)
            return ws.call(z) == ws.call(ee);
      }
      return !1;
    }
    function fv(z, ee, ce, Ee, Be, Pe) {
      var Ye = ce & f, Xe = wl(z), Je = Xe.length, ze = wl(ee), mt = ze.length;
      if (Je != mt && !Ye)
        return !1;
      for (var Rt = Je; Rt--; ) {
        var tt = Xe[Rt];
        if (!(Ye ? tt in ee : ve.call(ee, tt)))
          return !1;
      }
      var Et = Pe.get(z);
      if (Et && Pe.get(ee))
        return Et == ee;
      var wt = !0;
      Pe.set(z, ee), Pe.set(ee, z);
      for (var Jt = Ye; ++Rt < Je; ) {
        tt = Xe[Rt];
        var jt = z[tt], mr = ee[tt];
        if (Ee)
          var Tl = Ye ? Ee(mr, jt, tt, ee, z, Pe) : Ee(jt, mr, tt, z, ee, Pe);
        if (!(Tl === void 0 ? jt === mr || Be(jt, mr, ce, Ee, Pe) : Tl)) {
          wt = !1;
          break;
        }
        Jt || (Jt = tt == "constructor");
      }
      if (wt && !Jt) {
        var Gn = z.constructor, Bn = ee.constructor;
        Gn != Bn && "constructor" in z && "constructor" in ee && !(typeof Gn == "function" && Gn instanceof Gn && typeof Bn == "function" && Bn instanceof Bn) && (wt = !1);
      }
      return Pe.delete(z), Pe.delete(ee), wt;
    }
    function wl(z) {
      return av(z, $v, hv);
    }
    function xn(z, ee) {
      var ce = z.__data__;
      return mv(ee) ? ce[typeof ee == "string" ? "string" : "hash"] : ce.map;
    }
    function kr(z, ee) {
      var ce = Se(z, ee);
      return ov(ce) ? ce : void 0;
    }
    function dv(z) {
      var ee = ve.call(z, ye), ce = z[ye];
      try {
        z[ye] = void 0;
        var Ee = !0;
      } catch {
      }
      var Be = je.call(z);
      return Ee && (ee ? z[ye] = ce : delete z[ye]), Be;
    }
    var hv = he ? function(z) {
      return z == null ? [] : (z = Object(z), re(he(z), function(ee) {
        return oe.call(z, ee);
      }));
    } : Sv, Xt = en;
    (be && Xt(new be(new ArrayBuffer(1))) != M || Ge && Xt(new Ge()) != v || We && Xt(We.resolve()) != E || Me && Xt(new Me()) != _ || Dr && Xt(new Dr()) != G) && (Xt = function(z) {
      var ee = en(z), ce = ee == p ? z.constructor : void 0, Ee = ce ? pr(ce) : "";
      if (Ee)
        switch (Ee) {
          case fr:
            return M;
          case Cg:
            return v;
          case Dg:
            return E;
          case kg:
            return _;
          case qg:
            return G;
        }
      return ee;
    });
    function pv(z, ee) {
      return ee = ee ?? i, !!ee && (typeof z == "number" || R.test(z)) && z > -1 && z % 1 == 0 && z < ee;
    }
    function mv(z) {
      var ee = typeof z;
      return ee == "string" || ee == "number" || ee == "symbol" || ee == "boolean" ? z !== "__proto__" : z === null;
    }
    function yv(z) {
      return !!Fe && Fe in z;
    }
    function gv(z) {
      var ee = z && z.constructor, ce = typeof ee == "function" && ee.prototype || de;
      return z === ce;
    }
    function vv(z) {
      return je.call(z);
    }
    function pr(z) {
      if (z != null) {
        try {
          return me.call(z);
        } catch {
        }
        try {
          return z + "";
        } catch {
        }
      }
      return "";
    }
    function $l(z, ee) {
      return z === ee || z !== z && ee !== ee;
    }
    var _v = vl(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? vl : function(z) {
      return tn(z) && ve.call(z, "callee") && !oe.call(z, "callee");
    }, Vn = Array.isArray;
    function Ev(z) {
      return z != null && bl(z.length) && !Sl(z);
    }
    var $s = _e || bv;
    function wv(z, ee) {
      return _l(z, ee);
    }
    function Sl(z) {
      if (!Rl(z))
        return !1;
      var ee = en(z);
      return ee == m || ee == g || ee == u || ee == b;
    }
    function bl(z) {
      return typeof z == "number" && z > -1 && z % 1 == 0 && z <= i;
    }
    function Rl(z) {
      var ee = typeof z;
      return z != null && (ee == "object" || ee == "function");
    }
    function tn(z) {
      return z != null && typeof z == "object";
    }
    var Pl = J ? ke(J) : uv;
    function $v(z) {
      return Ev(z) ? iv(z) : cv(z);
    }
    function Sv() {
      return [];
    }
    function bv() {
      return !1;
    }
    e.exports = wv;
  })(An, An.exports)), An.exports;
}
var Dy;
function Cb() {
  if (Dy) return Gr;
  Dy = 1, Object.defineProperty(Gr, "__esModule", { value: !0 }), Gr.DownloadedUpdateHelper = void 0, Gr.createTempUpdateFile = c;
  const e = Dn, t = ur, o = Ab(), n = /* @__PURE__ */ lr(), f = Ke;
  let r = class {
    constructor(u) {
      this.cacheDir = u, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return f.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(u, a, d, l) {
      if (this.versionInfo != null && this.file === u && this.fileInfo != null)
        return o(this.versionInfo, a) && o(this.fileInfo.info, d.info) && await (0, n.pathExists)(u) ? u : null;
      const m = await this.getValidCachedUpdateFile(d, l);
      return m === null ? null : (l.info(`Update has already been downloaded to ${u}).`), this._file = m, m);
    }
    async setDownloadedFile(u, a, d, l, m, g) {
      this._file = u, this._packageFile = a, this.versionInfo = d, this.fileInfo = l, this._downloadedFileInfo = {
        fileName: m,
        sha512: l.info.sha512,
        isAdminRightsRequired: l.info.isAdminRightsRequired === !0
      }, g && await (0, n.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, n.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(u, a) {
      const d = this.getUpdateInfoFile();
      if (!await (0, n.pathExists)(d))
        return null;
      let m;
      try {
        m = await (0, n.readJson)(d);
      } catch (y) {
        let p = "No cached update info available";
        return y.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), p += ` (error on read: ${y.message})`), a.info(p), null;
      }
      if (!(m?.fileName !== null))
        return a.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (u.info.sha512 !== m.sha512)
        return a.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m.sha512}, expected: ${u.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const v = f.join(this.cacheDirForPendingUpdate, m.fileName);
      if (!await (0, n.pathExists)(v))
        return a.info("Cached update file doesn't exist"), null;
      const h = await i(v);
      return u.info.sha512 !== h ? (a.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${h}, expected: ${u.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = m, v);
    }
    getUpdateInfoFile() {
      return f.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  Gr.DownloadedUpdateHelper = r;
  function i(s, u = "sha512", a = "base64", d) {
    return new Promise((l, m) => {
      const g = (0, e.createHash)(u);
      g.on("error", m).setEncoding(a), (0, t.createReadStream)(s, {
        ...d,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", m).on("end", () => {
        g.end(), l(g.read());
      }).pipe(g, { end: !1 });
    });
  }
  async function c(s, u, a) {
    let d = 0, l = f.join(u, s);
    for (let m = 0; m < 3; m++)
      try {
        return await (0, n.unlink)(l), l;
      } catch (g) {
        if (g.code === "ENOENT")
          return l;
        a.warn(`Error on remove temp update file: ${g}`), l = f.join(u, `${d++}-${s}`);
      }
    return l;
  }
  return Gr;
}
var hn = {}, xa = {}, ky;
function Db() {
  if (ky) return xa;
  ky = 1, Object.defineProperty(xa, "__esModule", { value: !0 }), xa.getAppCacheDir = o;
  const e = Ke, t = Ja;
  function o() {
    const n = (0, t.homedir)();
    let f;
    return process.platform === "win32" ? f = process.env.LOCALAPPDATA || e.join(n, "AppData", "Local") : process.platform === "darwin" ? f = e.join(n, "Library", "Caches") : f = process.env.XDG_CACHE_HOME || e.join(n, ".cache"), f;
  }
  return xa;
}
var qy;
function kb() {
  if (qy) return hn;
  qy = 1, Object.defineProperty(hn, "__esModule", { value: !0 }), hn.ElectronAppAdapter = void 0;
  const e = Ke, t = Db();
  let o = class {
    constructor(f = Wt.app) {
      this.app = f;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? e.join(process.resourcesPath, "app-update.yml") : e.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, t.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(f) {
      this.app.once("quit", (r, i) => f(i));
    }
  };
  return hn.ElectronAppAdapter = o, hn;
}
var Lc = {}, Ly;
function qb() {
  return Ly || (Ly = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = o;
    const t = et();
    e.NET_SESSION_NAME = "electron-updater";
    function o() {
      return Wt.session.fromPartition(e.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class n extends t.HttpExecutor {
      constructor(r) {
        super(), this.proxyLoginCallback = r, this.cachedSession = null;
      }
      async download(r, i, c) {
        return await c.cancellationToken.createPromise((s, u, a) => {
          const d = {
            headers: c.headers || void 0,
            redirect: "manual"
          };
          (0, t.configureRequestUrl)(r, d), (0, t.configureRequestOptions)(d), this.doDownload(d, {
            destination: i,
            options: c,
            onCancel: a,
            callback: (l) => {
              l == null ? s(i) : u(l);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(r, i) {
        r.headers && r.headers.Host && (r.host = r.headers.Host, delete r.headers.Host), this.cachedSession == null && (this.cachedSession = o());
        const c = Wt.net.request({
          ...r,
          session: this.cachedSession
        });
        return c.on("response", i), this.proxyLoginCallback != null && c.on("login", this.proxyLoginCallback), c;
      }
      addRedirectHandlers(r, i, c, s, u) {
        r.on("redirect", (a, d, l) => {
          r.abort(), s > this.maxRedirects ? c(this.createMaxRedirectError()) : u(t.HttpExecutor.prepareRedirectUrlOptions(l, i));
        });
      }
    }
    e.ElectronHttpExecutor = n;
  })(Lc)), Lc;
}
var pn = {}, Tr = {}, Fc, Fy;
function Lb() {
  if (Fy) return Fc;
  Fy = 1;
  var e = "[object Symbol]", t = /[\\^$.*+?()[\]{}|]/g, o = RegExp(t.source), n = typeof Ot == "object" && Ot && Ot.Object === Object && Ot, f = typeof self == "object" && self && self.Object === Object && self, r = n || f || Function("return this")(), i = Object.prototype, c = i.toString, s = r.Symbol, u = s ? s.prototype : void 0, a = u ? u.toString : void 0;
  function d(h) {
    if (typeof h == "string")
      return h;
    if (m(h))
      return a ? a.call(h) : "";
    var y = h + "";
    return y == "0" && 1 / h == -1 / 0 ? "-0" : y;
  }
  function l(h) {
    return !!h && typeof h == "object";
  }
  function m(h) {
    return typeof h == "symbol" || l(h) && c.call(h) == e;
  }
  function g(h) {
    return h == null ? "" : d(h);
  }
  function v(h) {
    return h = g(h), h && o.test(h) ? h.replace(t, "\\$&") : h;
  }
  return Fc = v, Fc;
}
var jy;
function Ir() {
  if (jy) return Tr;
  jy = 1, Object.defineProperty(Tr, "__esModule", { value: !0 }), Tr.newBaseUrl = o, Tr.newUrlFromBase = n, Tr.getChannelFilename = f, Tr.blockmapFiles = r;
  const e = Wr, t = Lb();
  function o(i) {
    const c = new e.URL(i);
    return c.pathname.endsWith("/") || (c.pathname += "/"), c;
  }
  function n(i, c, s = !1) {
    const u = new e.URL(i, c), a = c.search;
    return a != null && a.length !== 0 ? u.search = a : s && (u.search = `noCache=${Date.now().toString(32)}`), u;
  }
  function f(i) {
    return `${i}.yml`;
  }
  function r(i, c, s) {
    const u = n(`${i.pathname}.blockmap`, i);
    return [n(`${i.pathname.replace(new RegExp(t(s), "g"), c)}.blockmap`, i), u];
  }
  return Tr;
}
var zt = {}, Uy;
function St() {
  if (Uy) return zt;
  Uy = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.Provider = void 0, zt.findFile = f, zt.parseUpdateInfo = r, zt.getFileList = i, zt.resolveFiles = c;
  const e = et(), t = ul(), o = Ir();
  let n = class {
    constructor(u) {
      this.runtimeOptions = u, this.requestHeaders = null, this.executor = u.executor;
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const u = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (u === "x64" ? "" : `-${u}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(u) {
      return `${u}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(u) {
      this.requestHeaders = u;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(u, a, d) {
      return this.executor.request(this.createRequestOptions(u, a), d);
    }
    createRequestOptions(u, a) {
      const d = {};
      return this.requestHeaders == null ? a != null && (d.headers = a) : d.headers = a == null ? this.requestHeaders : { ...this.requestHeaders, ...a }, (0, e.configureRequestUrl)(u, d), d;
    }
  };
  zt.Provider = n;
  function f(s, u, a) {
    if (s.length === 0)
      throw (0, e.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const d = s.find((l) => l.url.pathname.toLowerCase().endsWith(`.${u}`));
    return d ?? (a == null ? s[0] : s.find((l) => !a.some((m) => l.url.pathname.toLowerCase().endsWith(`.${m}`))));
  }
  function r(s, u, a) {
    if (s == null)
      throw (0, e.newError)(`Cannot parse update info from ${u} in the latest release artifacts (${a}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let d;
    try {
      d = (0, t.load)(s);
    } catch (l) {
      throw (0, e.newError)(`Cannot parse update info from ${u} in the latest release artifacts (${a}): ${l.stack || l.message}, rawData: ${s}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return d;
  }
  function i(s) {
    const u = s.files;
    if (u != null && u.length > 0)
      return u;
    if (s.path != null)
      return [
        {
          url: s.path,
          sha2: s.sha2,
          sha512: s.sha512
        }
      ];
    throw (0, e.newError)(`No files provided: ${(0, e.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function c(s, u, a = (d) => d) {
    const l = i(s).map((v) => {
      if (v.sha2 == null && v.sha512 == null)
        throw (0, e.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, e.safeStringifyJson)(v)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, o.newUrlFromBase)(a(v.url), u),
        info: v
      };
    }), m = s.packages, g = m == null ? null : m[process.arch] || m.ia32;
    return g != null && (l[0].packageInfo = {
      ...g,
      path: (0, o.newUrlFromBase)(a(g.path), u).href
    }), l;
  }
  return zt;
}
var My;
function Sg() {
  if (My) return pn;
  My = 1, Object.defineProperty(pn, "__esModule", { value: !0 }), pn.GenericProvider = void 0;
  const e = et(), t = Ir(), o = St();
  let n = class extends o.Provider {
    constructor(r, i, c) {
      super(c), this.configuration = r, this.updater = i, this.baseUrl = (0, t.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const r = this.updater.channel || this.configuration.channel;
      return r == null ? this.getDefaultChannelName() : this.getCustomChannelName(r);
    }
    async getLatestVersion() {
      const r = (0, t.getChannelFilename)(this.channel), i = (0, t.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let c = 0; ; c++)
        try {
          return (0, o.parseUpdateInfo)(await this.httpRequest(i), r, i);
        } catch (s) {
          if (s instanceof e.HttpError && s.statusCode === 404)
            throw (0, e.newError)(`Cannot find channel "${r}" update info: ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (s.code === "ECONNREFUSED" && c < 3) {
            await new Promise((u, a) => {
              try {
                setTimeout(u, 1e3 * c);
              } catch (d) {
                a(d);
              }
            });
            continue;
          }
          throw s;
        }
    }
    resolveFiles(r) {
      return (0, o.resolveFiles)(r, this.baseUrl);
    }
  };
  return pn.GenericProvider = n, pn;
}
var mn = {}, yn = {}, xy;
function Fb() {
  if (xy) return yn;
  xy = 1, Object.defineProperty(yn, "__esModule", { value: !0 }), yn.BitbucketProvider = void 0;
  const e = et(), t = Ir(), o = St();
  let n = class extends o.Provider {
    constructor(r, i, c) {
      super({
        ...c,
        isUseMultipleRangeRequest: !1
      }), this.configuration = r, this.updater = i;
      const { owner: s, slug: u } = r;
      this.baseUrl = (0, t.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${s}/${u}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const r = new e.CancellationToken(), i = (0, t.getChannelFilename)(this.getCustomChannelName(this.channel)), c = (0, t.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const s = await this.httpRequest(c, void 0, r);
        return (0, o.parseUpdateInfo)(s, i, c);
      } catch (s) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(r) {
      return (0, o.resolveFiles)(r, this.baseUrl);
    }
    toString() {
      const { owner: r, slug: i } = this.configuration;
      return `Bitbucket (owner: ${r}, slug: ${i}, channel: ${this.channel})`;
    }
  };
  return yn.BitbucketProvider = n, yn;
}
var ar = {}, Vy;
function bg() {
  if (Vy) return ar;
  Vy = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.GitHubProvider = ar.BaseGitHubProvider = void 0, ar.computeReleaseNotes = u;
  const e = et(), t = $g(), o = Wr, n = Ir(), f = St(), r = /\/tag\/([^/]+)$/;
  class i extends f.Provider {
    constructor(d, l, m) {
      super({
        ...m,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = d, this.baseUrl = (0, n.newBaseUrl)((0, e.githubUrl)(d, l));
      const g = l === "github.com" ? "api.github.com" : l;
      this.baseApiUrl = (0, n.newBaseUrl)((0, e.githubUrl)(d, g));
    }
    computeGithubBasePath(d) {
      const l = this.options.host;
      return l && !["github.com", "api.github.com"].includes(l) ? `/api/v3${d}` : d;
    }
  }
  ar.BaseGitHubProvider = i;
  let c = class extends i {
    constructor(d, l, m) {
      super(d, "github.com", m), this.options = d, this.updater = l;
    }
    get channel() {
      const d = this.updater.channel || this.options.channel;
      return d == null ? this.getDefaultChannelName() : this.getCustomChannelName(d);
    }
    async getLatestVersion() {
      var d, l, m, g, v;
      const h = new e.CancellationToken(), y = await this.httpRequest((0, n.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, h), p = (0, e.parseXml)(y);
      let E = p.element("entry", !1, "No published versions on GitHub"), b = null;
      try {
        if (this.updater.allowPrerelease) {
          const G = ((d = this.updater) === null || d === void 0 ? void 0 : d.channel) || ((l = t.prerelease(this.updater.currentVersion)) === null || l === void 0 ? void 0 : l[0]) || null;
          if (G === null)
            b = r.exec(E.element("link").attribute("href"))[1];
          else
            for (const L of p.getElements("entry")) {
              const M = r.exec(L.element("link").attribute("href"));
              if (M === null)
                continue;
              const K = M[1], k = ((m = t.prerelease(K)) === null || m === void 0 ? void 0 : m[0]) || null, F = !G || ["alpha", "beta"].includes(G), X = k !== null && !["alpha", "beta"].includes(String(k));
              if (F && !X && !(G === "beta" && k === "alpha")) {
                b = K;
                break;
              }
              if (k && k === G) {
                b = K;
                break;
              }
            }
        } else {
          b = await this.getLatestTagName(h);
          for (const G of p.getElements("entry"))
            if (r.exec(G.element("link").attribute("href"))[1] === b) {
              E = G;
              break;
            }
        }
      } catch (G) {
        throw (0, e.newError)(`Cannot parse releases feed: ${G.stack || G.message},
XML:
${y}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (b == null)
        throw (0, e.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let $, _ = "", w = "";
      const P = async (G) => {
        _ = (0, n.getChannelFilename)(G), w = (0, n.newUrlFromBase)(this.getBaseDownloadPath(String(b), _), this.baseUrl);
        const L = this.createRequestOptions(w);
        try {
          return await this.executor.request(L, h);
        } catch (M) {
          throw M instanceof e.HttpError && M.statusCode === 404 ? (0, e.newError)(`Cannot find ${_} in the latest release artifacts (${w}): ${M.stack || M.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : M;
        }
      };
      try {
        let G = this.channel;
        this.updater.allowPrerelease && (!((g = t.prerelease(b)) === null || g === void 0) && g[0]) && (G = this.getCustomChannelName(String((v = t.prerelease(b)) === null || v === void 0 ? void 0 : v[0]))), $ = await P(G);
      } catch (G) {
        if (this.updater.allowPrerelease)
          $ = await P(this.getDefaultChannelName());
        else
          throw G;
      }
      const T = (0, f.parseUpdateInfo)($, _, w);
      return T.releaseName == null && (T.releaseName = E.elementValueOrEmpty("title")), T.releaseNotes == null && (T.releaseNotes = u(this.updater.currentVersion, this.updater.fullChangelog, p, E)), {
        tag: b,
        ...T
      };
    }
    async getLatestTagName(d) {
      const l = this.options, m = l.host == null || l.host === "github.com" ? (0, n.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new o.URL(`${this.computeGithubBasePath(`/repos/${l.owner}/${l.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const g = await this.httpRequest(m, { Accept: "application/json" }, d);
        return g == null ? null : JSON.parse(g).tag_name;
      } catch (g) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${m}), please ensure a production release exists: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(d) {
      return (0, f.resolveFiles)(d, this.baseUrl, (l) => this.getBaseDownloadPath(d.tag, l.replace(/ /g, "-")));
    }
    getBaseDownloadPath(d, l) {
      return `${this.basePath}/download/${d}/${l}`;
    }
  };
  ar.GitHubProvider = c;
  function s(a) {
    const d = a.elementValueOrEmpty("content");
    return d === "No content." ? "" : d;
  }
  function u(a, d, l, m) {
    if (!d)
      return s(m);
    const g = [];
    for (const v of l.getElements("entry")) {
      const h = /\/tag\/v?([^/]+)$/.exec(v.element("link").attribute("href"))[1];
      t.lt(a, h) && g.push({
        version: h,
        note: s(v)
      });
    }
    return g.sort((v, h) => t.rcompare(v.version, h.version));
  }
  return ar;
}
var gn = {}, Gy;
function jb() {
  if (Gy) return gn;
  Gy = 1, Object.defineProperty(gn, "__esModule", { value: !0 }), gn.KeygenProvider = void 0;
  const e = et(), t = Ir(), o = St();
  let n = class extends o.Provider {
    constructor(r, i, c) {
      super({
        ...c,
        isUseMultipleRangeRequest: !1
      }), this.configuration = r, this.updater = i, this.defaultHostname = "api.keygen.sh";
      const s = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, t.newBaseUrl)(`https://${s}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const r = new e.CancellationToken(), i = (0, t.getChannelFilename)(this.getCustomChannelName(this.channel)), c = (0, t.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const s = await this.httpRequest(c, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, r);
        return (0, o.parseUpdateInfo)(s, i, c);
      } catch (s) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(r) {
      return (0, o.resolveFiles)(r, this.baseUrl);
    }
    toString() {
      const { account: r, product: i, platform: c } = this.configuration;
      return `Keygen (account: ${r}, product: ${i}, platform: ${c}, channel: ${this.channel})`;
    }
  };
  return gn.KeygenProvider = n, gn;
}
var vn = {}, By;
function Ub() {
  if (By) return vn;
  By = 1, Object.defineProperty(vn, "__esModule", { value: !0 }), vn.PrivateGitHubProvider = void 0;
  const e = et(), t = ul(), o = Ke, n = Wr, f = Ir(), r = bg(), i = St();
  let c = class extends r.BaseGitHubProvider {
    constructor(u, a, d, l) {
      super(u, "api.github.com", l), this.updater = a, this.token = d;
    }
    createRequestOptions(u, a) {
      const d = super.createRequestOptions(u, a);
      return d.redirect = "manual", d;
    }
    async getLatestVersion() {
      const u = new e.CancellationToken(), a = (0, f.getChannelFilename)(this.getDefaultChannelName()), d = await this.getLatestVersionInfo(u), l = d.assets.find((v) => v.name === a);
      if (l == null)
        throw (0, e.newError)(`Cannot find ${a} in the release ${d.html_url || d.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const m = new n.URL(l.url);
      let g;
      try {
        g = (0, t.load)(await this.httpRequest(m, this.configureHeaders("application/octet-stream"), u));
      } catch (v) {
        throw v instanceof e.HttpError && v.statusCode === 404 ? (0, e.newError)(`Cannot find ${a} in the latest release artifacts (${m}): ${v.stack || v.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : v;
      }
      return g.assets = d.assets, g;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(u) {
      return {
        accept: u,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(u) {
      const a = this.updater.allowPrerelease;
      let d = this.basePath;
      a || (d = `${d}/latest`);
      const l = (0, f.newUrlFromBase)(d, this.baseUrl);
      try {
        const m = JSON.parse(await this.httpRequest(l, this.configureHeaders("application/vnd.github.v3+json"), u));
        return a ? m.find((g) => g.prerelease) || m[0] : m;
      } catch (m) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${l}), please ensure a production release exists: ${m.stack || m.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(u) {
      return (0, i.getFileList)(u).map((a) => {
        const d = o.posix.basename(a.url).replace(/ /g, "-"), l = u.assets.find((m) => m != null && m.name === d);
        if (l == null)
          throw (0, e.newError)(`Cannot find asset "${d}" in: ${JSON.stringify(u.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new n.URL(l.url),
          info: a
        };
      });
    }
  };
  return vn.PrivateGitHubProvider = c, vn;
}
var Hy;
function Mb() {
  if (Hy) return mn;
  Hy = 1, Object.defineProperty(mn, "__esModule", { value: !0 }), mn.isUrlProbablySupportMultiRangeRequests = i, mn.createClient = c;
  const e = et(), t = Fb(), o = Sg(), n = bg(), f = jb(), r = Ub();
  function i(s) {
    return !s.includes("s3.amazonaws.com");
  }
  function c(s, u, a) {
    if (typeof s == "string")
      throw (0, e.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const d = s.provider;
    switch (d) {
      case "github": {
        const l = s, m = (l.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || l.token;
        return m == null ? new n.GitHubProvider(l, u, a) : new r.PrivateGitHubProvider(l, u, m, a);
      }
      case "bitbucket":
        return new t.BitbucketProvider(s, u, a);
      case "keygen":
        return new f.KeygenProvider(s, u, a);
      case "s3":
      case "spaces":
        return new o.GenericProvider({
          provider: "generic",
          url: (0, e.getS3LikeProviderBaseUrl)(s),
          channel: s.channel || null
        }, u, {
          ...a,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const l = s;
        return new o.GenericProvider(l, u, {
          ...a,
          isUseMultipleRangeRequest: l.useMultipleRangeRequest !== !1 && i(l.url)
        });
      }
      case "custom": {
        const l = s, m = l.updateProvider;
        if (!m)
          throw (0, e.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new m(l, u, a);
      }
      default:
        throw (0, e.newError)(`Unsupported provider: ${d}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return mn;
}
var _n = {}, En = {}, Br = {}, Hr = {}, zy;
function ml() {
  if (zy) return Hr;
  zy = 1, Object.defineProperty(Hr, "__esModule", { value: !0 }), Hr.OperationKind = void 0, Hr.computeOperations = t;
  var e;
  (function(i) {
    i[i.COPY = 0] = "COPY", i[i.DOWNLOAD = 1] = "DOWNLOAD";
  })(e || (Hr.OperationKind = e = {}));
  function t(i, c, s) {
    const u = r(i.files), a = r(c.files);
    let d = null;
    const l = c.files[0], m = [], g = l.name, v = u.get(g);
    if (v == null)
      throw new Error(`no file ${g} in old blockmap`);
    const h = a.get(g);
    let y = 0;
    const { checksumToOffset: p, checksumToOldSize: E } = f(u.get(g), v.offset, s);
    let b = l.offset;
    for (let $ = 0; $ < h.checksums.length; b += h.sizes[$], $++) {
      const _ = h.sizes[$], w = h.checksums[$];
      let P = p.get(w);
      P != null && E.get(w) !== _ && (s.warn(`Checksum ("${w}") matches, but size differs (old: ${E.get(w)}, new: ${_})`), P = void 0), P === void 0 ? (y++, d != null && d.kind === e.DOWNLOAD && d.end === b ? d.end += _ : (d = {
        kind: e.DOWNLOAD,
        start: b,
        end: b + _
        // oldBlocks: null,
      }, n(d, m, w, $))) : d != null && d.kind === e.COPY && d.end === P ? d.end += _ : (d = {
        kind: e.COPY,
        start: P,
        end: P + _
        // oldBlocks: [checksum]
      }, n(d, m, w, $));
    }
    return y > 0 && s.info(`File${l.name === "file" ? "" : " " + l.name} has ${y} changed blocks`), m;
  }
  const o = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function n(i, c, s, u) {
    if (o && c.length !== 0) {
      const a = c[c.length - 1];
      if (a.kind === i.kind && i.start < a.end && i.start > a.start) {
        const d = [a.start, a.end, i.start, i.end].reduce((l, m) => l < m ? l : m);
        throw new Error(`operation (block index: ${u}, checksum: ${s}, kind: ${e[i.kind]}) overlaps previous operation (checksum: ${s}):
abs: ${a.start} until ${a.end} and ${i.start} until ${i.end}
rel: ${a.start - d} until ${a.end - d} and ${i.start - d} until ${i.end - d}`);
      }
    }
    c.push(i);
  }
  function f(i, c, s) {
    const u = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
    let d = c;
    for (let l = 0; l < i.checksums.length; l++) {
      const m = i.checksums[l], g = i.sizes[l], v = a.get(m);
      if (v === void 0)
        u.set(m, d), a.set(m, g);
      else if (s.debug != null) {
        const h = v === g ? "(same size)" : `(size: ${v}, this size: ${g})`;
        s.debug(`${m} duplicated in blockmap ${h}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      d += g;
    }
    return { checksumToOffset: u, checksumToOldSize: a };
  }
  function r(i) {
    const c = /* @__PURE__ */ new Map();
    for (const s of i)
      c.set(s.name, s);
    return c;
  }
  return Hr;
}
var Ky;
function Rg() {
  if (Ky) return Br;
  Ky = 1, Object.defineProperty(Br, "__esModule", { value: !0 }), Br.DataSplitter = void 0, Br.copyData = i;
  const e = et(), t = ur, o = Cn, n = ml(), f = Buffer.from(`\r
\r
`);
  var r;
  (function(s) {
    s[s.INIT = 0] = "INIT", s[s.HEADER = 1] = "HEADER", s[s.BODY = 2] = "BODY";
  })(r || (r = {}));
  function i(s, u, a, d, l) {
    const m = (0, t.createReadStream)("", {
      fd: a,
      autoClose: !1,
      start: s.start,
      // end is inclusive
      end: s.end - 1
    });
    m.on("error", d), m.once("end", l), m.pipe(u, {
      end: !1
    });
  }
  let c = class extends o.Writable {
    constructor(u, a, d, l, m, g) {
      super(), this.out = u, this.options = a, this.partIndexToTaskIndex = d, this.partIndexToLength = m, this.finishHandler = g, this.partIndex = -1, this.headerListBuffer = null, this.readState = r.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = l.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(u, a, d) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${u.length} bytes`);
        return;
      }
      this.handleData(u).then(d).catch(d);
    }
    async handleData(u) {
      let a = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, e.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const d = Math.min(this.ignoreByteCount, u.length);
        this.ignoreByteCount -= d, a = d;
      } else if (this.remainingPartDataCount > 0) {
        const d = Math.min(this.remainingPartDataCount, u.length);
        this.remainingPartDataCount -= d, await this.processPartData(u, 0, d), a = d;
      }
      if (a !== u.length) {
        if (this.readState === r.HEADER) {
          const d = this.searchHeaderListEnd(u, a);
          if (d === -1)
            return;
          a = d, this.readState = r.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === r.BODY)
            this.readState = r.INIT;
          else {
            this.partIndex++;
            let g = this.partIndexToTaskIndex.get(this.partIndex);
            if (g == null)
              if (this.isFinished)
                g = this.options.end;
              else
                throw (0, e.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const v = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (v < g)
              await this.copyExistingData(v, g);
            else if (v > g)
              throw (0, e.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (a = this.searchHeaderListEnd(u, a), a === -1) {
              this.readState = r.HEADER;
              return;
            }
          }
          const d = this.partIndexToLength[this.partIndex], l = a + d, m = Math.min(l, u.length);
          if (await this.processPartStarted(u, a, m), this.remainingPartDataCount = d - (m - a), this.remainingPartDataCount > 0)
            return;
          if (a = l + this.boundaryLength, a >= u.length) {
            this.ignoreByteCount = this.boundaryLength - (u.length - l);
            return;
          }
        }
      }
    }
    copyExistingData(u, a) {
      return new Promise((d, l) => {
        const m = () => {
          if (u === a) {
            d();
            return;
          }
          const g = this.options.tasks[u];
          if (g.kind !== n.OperationKind.COPY) {
            l(new Error("Task kind must be COPY"));
            return;
          }
          i(g, this.out, this.options.oldFileFd, l, () => {
            u++, m();
          });
        };
        m();
      });
    }
    searchHeaderListEnd(u, a) {
      const d = u.indexOf(f, a);
      if (d !== -1)
        return d + f.length;
      const l = a === 0 ? u : u.slice(a);
      return this.headerListBuffer == null ? this.headerListBuffer = l : this.headerListBuffer = Buffer.concat([this.headerListBuffer, l]), -1;
    }
    onPartEnd() {
      const u = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== u)
        throw (0, e.newError)(`Expected length: ${u} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(u, a, d) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(u, a, d);
    }
    processPartData(u, a, d) {
      this.actualPartLength += d - a;
      const l = this.out;
      return l.write(a === 0 && u.length === d ? u : u.slice(a, d)) ? Promise.resolve() : new Promise((m, g) => {
        l.on("error", g), l.once("drain", () => {
          l.removeListener("error", g), m();
        });
      });
    }
  };
  return Br.DataSplitter = c, Br;
}
var wn = {}, Wy;
function xb() {
  if (Wy) return wn;
  Wy = 1, Object.defineProperty(wn, "__esModule", { value: !0 }), wn.executeTasksUsingMultipleRangeRequests = n, wn.checkIsRangesSupported = r;
  const e = et(), t = Rg(), o = ml();
  function n(i, c, s, u, a) {
    const d = (l) => {
      if (l >= c.length) {
        i.fileMetadataBuffer != null && s.write(i.fileMetadataBuffer), s.end();
        return;
      }
      const m = l + 1e3;
      f(i, {
        tasks: c,
        start: l,
        end: Math.min(c.length, m),
        oldFileFd: u
      }, s, () => d(m), a);
    };
    return d;
  }
  function f(i, c, s, u, a) {
    let d = "bytes=", l = 0;
    const m = /* @__PURE__ */ new Map(), g = [];
    for (let y = c.start; y < c.end; y++) {
      const p = c.tasks[y];
      p.kind === o.OperationKind.DOWNLOAD && (d += `${p.start}-${p.end - 1}, `, m.set(l, y), l++, g.push(p.end - p.start));
    }
    if (l <= 1) {
      const y = (p) => {
        if (p >= c.end) {
          u();
          return;
        }
        const E = c.tasks[p++];
        if (E.kind === o.OperationKind.COPY)
          (0, t.copyData)(E, s, c.oldFileFd, a, () => y(p));
        else {
          const b = i.createRequestOptions();
          b.headers.Range = `bytes=${E.start}-${E.end - 1}`;
          const $ = i.httpExecutor.createRequest(b, (_) => {
            r(_, a) && (_.pipe(s, {
              end: !1
            }), _.once("end", () => y(p)));
          });
          i.httpExecutor.addErrorAndTimeoutHandlers($, a), $.end();
        }
      };
      y(c.start);
      return;
    }
    const v = i.createRequestOptions();
    v.headers.Range = d.substring(0, d.length - 2);
    const h = i.httpExecutor.createRequest(v, (y) => {
      if (!r(y, a))
        return;
      const p = (0, e.safeGetHeader)(y, "content-type"), E = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(p);
      if (E == null) {
        a(new Error(`Content-Type "multipart/byteranges" is expected, but got "${p}"`));
        return;
      }
      const b = new t.DataSplitter(s, c, m, E[1] || E[2], g, u);
      b.on("error", a), y.pipe(b), y.on("end", () => {
        setTimeout(() => {
          h.abort(), a(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    i.httpExecutor.addErrorAndTimeoutHandlers(h, a), h.end();
  }
  function r(i, c) {
    if (i.statusCode >= 400)
      return c((0, e.createHttpError)(i)), !1;
    if (i.statusCode !== 206) {
      const s = (0, e.safeGetHeader)(i, "accept-ranges");
      if (s == null || s === "none")
        return c(new Error(`Server doesn't support Accept-Ranges (response code ${i.statusCode})`)), !1;
    }
    return !0;
  }
  return wn;
}
var $n = {}, Yy;
function Vb() {
  if (Yy) return $n;
  Yy = 1, Object.defineProperty($n, "__esModule", { value: !0 }), $n.ProgressDifferentialDownloadCallbackTransform = void 0;
  const e = Cn;
  var t;
  (function(n) {
    n[n.COPY = 0] = "COPY", n[n.DOWNLOAD = 1] = "DOWNLOAD";
  })(t || (t = {}));
  let o = class extends e.Transform {
    constructor(f, r, i) {
      super(), this.progressDifferentialDownloadInfo = f, this.cancellationToken = r, this.onProgress = i, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = t.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(f, r, i) {
      if (this.cancellationToken.cancelled) {
        i(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == t.COPY) {
        i(null, f);
        return;
      }
      this.transferred += f.length, this.delta += f.length;
      const c = Date.now();
      c >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = c + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((c - this.start) / 1e3))
      }), this.delta = 0), i(null, f);
    }
    beginFileCopy() {
      this.operationType = t.COPY;
    }
    beginRangeDownload() {
      this.operationType = t.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(f) {
      if (this.cancellationToken.cancelled) {
        f(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, f(null);
    }
  };
  return $n.ProgressDifferentialDownloadCallbackTransform = o, $n;
}
var Xy;
function Pg() {
  if (Xy) return En;
  Xy = 1, Object.defineProperty(En, "__esModule", { value: !0 }), En.DifferentialDownloader = void 0;
  const e = et(), t = /* @__PURE__ */ lr(), o = ur, n = Rg(), f = Wr, r = ml(), i = xb(), c = Vb();
  let s = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(l, m, g) {
      this.blockAwareFileInfo = l, this.httpExecutor = m, this.options = g, this.fileMetadataBuffer = null, this.logger = g.logger;
    }
    createRequestOptions() {
      const l = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, e.configureRequestUrl)(this.options.newUrl, l), (0, e.configureRequestOptions)(l), l;
    }
    doDownload(l, m) {
      if (l.version !== m.version)
        throw new Error(`version is different (${l.version} - ${m.version}), full download is required`);
      const g = this.logger, v = (0, r.computeOperations)(l, m, g);
      g.debug != null && g.debug(JSON.stringify(v, null, 2));
      let h = 0, y = 0;
      for (const E of v) {
        const b = E.end - E.start;
        E.kind === r.OperationKind.DOWNLOAD ? h += b : y += b;
      }
      const p = this.blockAwareFileInfo.size;
      if (h + y + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== p)
        throw new Error(`Internal error, size mismatch: downloadSize: ${h}, copySize: ${y}, newSize: ${p}`);
      return g.info(`Full: ${u(p)}, To download: ${u(h)} (${Math.round(h / (p / 100))}%)`), this.downloadFile(v);
    }
    downloadFile(l) {
      const m = [], g = () => Promise.all(m.map((v) => (0, t.close)(v.descriptor).catch((h) => {
        this.logger.error(`cannot close file "${v.path}": ${h}`);
      })));
      return this.doDownloadFile(l, m).then(g).catch((v) => g().catch((h) => {
        try {
          this.logger.error(`cannot close files: ${h}`);
        } catch (y) {
          try {
            console.error(y);
          } catch {
          }
        }
        throw v;
      }).then(() => {
        throw v;
      }));
    }
    async doDownloadFile(l, m) {
      const g = await (0, t.open)(this.options.oldFile, "r");
      m.push({ descriptor: g, path: this.options.oldFile });
      const v = await (0, t.open)(this.options.newFile, "w");
      m.push({ descriptor: v, path: this.options.newFile });
      const h = (0, o.createWriteStream)(this.options.newFile, { fd: v });
      await new Promise((y, p) => {
        const E = [];
        let b;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const M = [];
          let K = 0;
          for (const F of l)
            F.kind === r.OperationKind.DOWNLOAD && (M.push(F.end - F.start), K += F.end - F.start);
          const k = {
            expectedByteCounts: M,
            grandTotal: K
          };
          b = new c.ProgressDifferentialDownloadCallbackTransform(k, this.options.cancellationToken, this.options.onProgress), E.push(b);
        }
        const $ = new e.DigestTransform(this.blockAwareFileInfo.sha512);
        $.isValidateOnEnd = !1, E.push($), h.on("finish", () => {
          h.close(() => {
            m.splice(1, 1);
            try {
              $.validate();
            } catch (M) {
              p(M);
              return;
            }
            y(void 0);
          });
        }), E.push(h);
        let _ = null;
        for (const M of E)
          M.on("error", p), _ == null ? _ = M : _ = _.pipe(M);
        const w = E[0];
        let P;
        if (this.options.isUseMultipleRangeRequest) {
          P = (0, i.executeTasksUsingMultipleRangeRequests)(this, l, w, g, p), P(0);
          return;
        }
        let T = 0, G = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const L = this.createRequestOptions();
        L.redirect = "manual", P = (M) => {
          var K, k;
          if (M >= l.length) {
            this.fileMetadataBuffer != null && w.write(this.fileMetadataBuffer), w.end();
            return;
          }
          const F = l[M++];
          if (F.kind === r.OperationKind.COPY) {
            b && b.beginFileCopy(), (0, n.copyData)(F, w, g, p, () => P(M));
            return;
          }
          const X = `bytes=${F.start}-${F.end - 1}`;
          L.headers.range = X, (k = (K = this.logger) === null || K === void 0 ? void 0 : K.debug) === null || k === void 0 || k.call(K, `download range: ${X}`), b && b.beginRangeDownload();
          const B = this.httpExecutor.createRequest(L, (Y) => {
            Y.on("error", p), Y.on("aborted", () => {
              p(new Error("response has been aborted by the server"));
            }), Y.statusCode >= 400 && p((0, e.createHttpError)(Y)), Y.pipe(w, {
              end: !1
            }), Y.once("end", () => {
              b && b.endRangeDownload(), ++T === 100 ? (T = 0, setTimeout(() => P(M), 1e3)) : P(M);
            });
          });
          B.on("redirect", (Y, Z, V) => {
            this.logger.info(`Redirect to ${a(V)}`), G = V, (0, e.configureRequestUrl)(new f.URL(G), L), B.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(B, p), B.end();
        }, P(0);
      });
    }
    async readRemoteBytes(l, m) {
      const g = Buffer.allocUnsafe(m + 1 - l), v = this.createRequestOptions();
      v.headers.range = `bytes=${l}-${m}`;
      let h = 0;
      if (await this.request(v, (y) => {
        y.copy(g, h), h += y.length;
      }), h !== g.length)
        throw new Error(`Received data length ${h} is not equal to expected ${g.length}`);
      return g;
    }
    request(l, m) {
      return new Promise((g, v) => {
        const h = this.httpExecutor.createRequest(l, (y) => {
          (0, i.checkIsRangesSupported)(y, v) && (y.on("error", v), y.on("aborted", () => {
            v(new Error("response has been aborted by the server"));
          }), y.on("data", m), y.on("end", () => g()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(h, v), h.end();
      });
    }
  };
  En.DifferentialDownloader = s;
  function u(d, l = " KB") {
    return new Intl.NumberFormat("en").format((d / 1024).toFixed(2)) + l;
  }
  function a(d) {
    const l = d.indexOf("?");
    return l < 0 ? d : d.substring(0, l);
  }
  return En;
}
var Jy;
function Gb() {
  if (Jy) return _n;
  Jy = 1, Object.defineProperty(_n, "__esModule", { value: !0 }), _n.GenericDifferentialDownloader = void 0;
  const e = Pg();
  let t = class extends e.DifferentialDownloader {
    download(n, f) {
      return this.doDownload(n, f);
    }
  };
  return _n.GenericDifferentialDownloader = t, _n;
}
var jc = {}, Qy;
function Ar() {
  return Qy || (Qy = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
    const t = et();
    Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return t.CancellationToken;
    } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
    class o {
      constructor(r) {
        this.emitter = r;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(r) {
        n(this.emitter, "login", r);
      }
      progress(r) {
        n(this.emitter, e.DOWNLOAD_PROGRESS, r);
      }
      updateDownloaded(r) {
        n(this.emitter, e.UPDATE_DOWNLOADED, r);
      }
      updateCancelled(r) {
        n(this.emitter, "update-cancelled", r);
      }
    }
    e.UpdaterSignal = o;
    function n(f, r, i) {
      f.on(r, i);
    }
  })(jc)), jc;
}
var Zy;
function yl() {
  if (Zy) return br;
  Zy = 1, Object.defineProperty(br, "__esModule", { value: !0 }), br.NoOpLogger = br.AppUpdater = void 0;
  const e = et(), t = Dn, o = Ja, n = $0, f = /* @__PURE__ */ lr(), r = ul(), i = sb(), c = Ke, s = $g(), u = Cb(), a = kb(), d = qb(), l = Sg(), m = Mb(), g = b0, v = Ir(), h = Gb(), y = Ar();
  let p = class Tg extends n.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(_) {
      if (this._channel != null) {
        if (typeof _ != "string")
          throw (0, e.newError)(`Channel must be a string, but got: ${_}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (_.length === 0)
          throw (0, e.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = _, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(_) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: _
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, d.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(_) {
      this._logger = _ ?? new b();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(_) {
      this.clientPromise = null, this._appUpdateConfigPath = _, this.configOnDisk = new i.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(_) {
      _ && (this._isUpdateSupported = _);
    }
    constructor(_, w) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new y.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (G) => this.checkIfUpdateSupported(G), this.clientPromise = null, this.stagingUserIdPromise = new i.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new i.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (G) => {
        this._logger.error(`Error: ${G.stack || G.message}`);
      }), w == null ? (this.app = new a.ElectronAppAdapter(), this.httpExecutor = new d.ElectronHttpExecutor((G, L) => this.emit("login", G, L))) : (this.app = w, this.httpExecutor = null);
      const P = this.app.version, T = (0, s.parse)(P);
      if (T == null)
        throw (0, e.newError)(`App version is not a valid semver version: "${P}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = T, this.allowPrerelease = E(T), _ != null && (this.setFeedURL(_), typeof _ != "string" && _.requestHeaders && (this.requestHeaders = _.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(_) {
      const w = this.createProviderRuntimeOptions();
      let P;
      typeof _ == "string" ? P = new l.GenericProvider({ provider: "generic", url: _ }, this, {
        ...w,
        isUseMultipleRangeRequest: (0, m.isUrlProbablySupportMultiRangeRequests)(_)
      }) : P = (0, m.createClient)(_, this, w), this.clientPromise = Promise.resolve(P);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let _ = this.checkForUpdatesPromise;
      if (_ != null)
        return this._logger.info("Checking for update (already in progress)"), _;
      const w = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), _ = this.doCheckForUpdates().then((P) => (w(), P)).catch((P) => {
        throw w(), this.emit("error", P, `Cannot check for updates: ${(P.stack || P).toString()}`), P;
      }), this.checkForUpdatesPromise = _, _;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(_) {
      return this.checkForUpdates().then((w) => w?.downloadPromise ? (w.downloadPromise.then(() => {
        const P = Tg.formatDownloadNotification(w.updateInfo.version, this.app.name, _);
        new Wt.Notification(P).show();
      }), w) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), w));
    }
    static formatDownloadNotification(_, w, P) {
      return P == null && (P = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), P = {
        title: P.title.replace("{appName}", w).replace("{version}", _),
        body: P.body.replace("{appName}", w).replace("{version}", _)
      }, P;
    }
    async isStagingMatch(_) {
      const w = _.stagingPercentage;
      let P = w;
      if (P == null)
        return !0;
      if (P = parseInt(P, 10), isNaN(P))
        return this._logger.warn(`Staging percentage is NaN: ${w}`), !0;
      P = P / 100;
      const T = await this.stagingUserIdPromise.value, L = e.UUID.parse(T).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${P}, percentage: ${L}, user id: ${T}`), L < P;
    }
    computeFinalHeaders(_) {
      return this.requestHeaders != null && Object.assign(_, this.requestHeaders), _;
    }
    async isUpdateAvailable(_) {
      const w = (0, s.parse)(_.version);
      if (w == null)
        throw (0, e.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${_.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const P = this.currentVersion;
      if ((0, s.eq)(w, P) || !await Promise.resolve(this.isUpdateSupported(_)) || !await this.isStagingMatch(_))
        return !1;
      const G = (0, s.gt)(w, P), L = (0, s.lt)(w, P);
      return G ? !0 : this.allowDowngrade && L;
    }
    checkIfUpdateSupported(_) {
      const w = _?.minimumSystemVersion, P = (0, o.release)();
      if (w)
        try {
          if ((0, s.lt)(P, w))
            return this._logger.info(`Current OS version ${P} is less than the minimum OS version required ${w} for version ${P}`), !1;
        } catch (T) {
          this._logger.warn(`Failed to compare current OS version(${P}) with minimum OS version(${w}): ${(T.message || T).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((P) => (0, m.createClient)(P, this, this.createProviderRuntimeOptions())));
      const _ = await this.clientPromise, w = await this.stagingUserIdPromise.value;
      return _.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": w })), {
        info: await _.getLatestVersion(),
        provider: _
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const _ = await this.getUpdateInfoAndProvider(), w = _.info;
      if (!await this.isUpdateAvailable(w))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${w.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", w), {
          isUpdateAvailable: !1,
          versionInfo: w,
          updateInfo: w
        };
      this.updateInfoAndProvider = _, this.onUpdateAvailable(w);
      const P = new e.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: w,
        updateInfo: w,
        cancellationToken: P,
        downloadPromise: this.autoDownload ? this.downloadUpdate(P) : null
      };
    }
    onUpdateAvailable(_) {
      this._logger.info(`Found version ${_.version} (url: ${(0, e.asArray)(_.files).map((w) => w.url).join(", ")})`), this.emit("update-available", _);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(_ = new e.CancellationToken()) {
      const w = this.updateInfoAndProvider;
      if (w == null) {
        const T = new Error("Please check update first");
        return this.dispatchError(T), Promise.reject(T);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, e.asArray)(w.info.files).map((T) => T.url).join(", ")}`);
      const P = (T) => {
        if (!(T instanceof e.CancellationError))
          try {
            this.dispatchError(T);
          } catch (G) {
            this._logger.warn(`Cannot dispatch error event: ${G.stack || G}`);
          }
        return T;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: w,
        requestHeaders: this.computeRequestHeaders(w.provider),
        cancellationToken: _,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((T) => {
        throw P(T);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(_) {
      this.emit("error", _, (_.stack || _).toString());
    }
    dispatchUpdateDownloaded(_) {
      this.emit(y.UPDATE_DOWNLOADED, _);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, r.load)(await (0, f.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(_) {
      const w = _.fileExtraDownloadHeaders;
      if (w != null) {
        const P = this.requestHeaders;
        return P == null ? w : {
          ...w,
          ...P
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const _ = c.join(this.app.userDataPath, ".updaterId");
      try {
        const P = await (0, f.readFile)(_, "utf-8");
        if (e.UUID.check(P))
          return P;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${P}`);
      } catch (P) {
        P.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${P}`);
      }
      const w = e.UUID.v5((0, t.randomBytes)(4096), e.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${w}`);
      try {
        await (0, f.outputFile)(_, w);
      } catch (P) {
        this._logger.warn(`Couldn't write out staging user ID: ${P}`);
      }
      return w;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const _ = this.requestHeaders;
      if (_ == null)
        return !0;
      for (const w of Object.keys(_)) {
        const P = w.toLowerCase();
        if (P === "authorization" || P === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let _ = this.downloadedUpdateHelper;
      if (_ == null) {
        const w = (await this.configOnDisk.value).updaterCacheDirName, P = this._logger;
        w == null && P.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const T = c.join(this.app.baseCachePath, w || this.app.name);
        P.debug != null && P.debug(`updater cache dir: ${T}`), _ = new u.DownloadedUpdateHelper(T), this.downloadedUpdateHelper = _;
      }
      return _;
    }
    async executeDownload(_) {
      const w = _.fileInfo, P = {
        headers: _.downloadUpdateOptions.requestHeaders,
        cancellationToken: _.downloadUpdateOptions.cancellationToken,
        sha2: w.info.sha2,
        sha512: w.info.sha512
      };
      this.listenerCount(y.DOWNLOAD_PROGRESS) > 0 && (P.onProgress = (D) => this.emit(y.DOWNLOAD_PROGRESS, D));
      const T = _.downloadUpdateOptions.updateInfoAndProvider.info, G = T.version, L = w.packageInfo;
      function M() {
        const D = decodeURIComponent(_.fileInfo.url.pathname);
        return D.endsWith(`.${_.fileExtension}`) ? c.basename(D) : _.fileInfo.info.url;
      }
      const K = await this.getOrCreateDownloadHelper(), k = K.cacheDirForPendingUpdate;
      await (0, f.mkdir)(k, { recursive: !0 });
      const F = M();
      let X = c.join(k, F);
      const B = L == null ? null : c.join(k, `package-${G}${c.extname(L.path) || ".7z"}`), Y = async (D) => (await K.setDownloadedFile(X, B, T, w, F, D), await _.done({
        ...T,
        downloadedFile: X
      }), B == null ? [X] : [X, B]), Z = this._logger, V = await K.validateDownloadedPath(X, T, w, Z);
      if (V != null)
        return X = V, await Y(!1);
      const C = async () => (await K.clear().catch(() => {
      }), await (0, f.unlink)(X).catch(() => {
      })), U = await (0, u.createTempUpdateFile)(`temp-${F}`, k, Z);
      try {
        await _.task(U, P, B, C), await (0, e.retry)(() => (0, f.rename)(U, X), 60, 500, 0, 0, (D) => D instanceof Error && /^EBUSY:/.test(D.message));
      } catch (D) {
        throw await C(), D instanceof e.CancellationError && (Z.info("cancelled"), this.emit("update-cancelled", T)), D;
      }
      return Z.info(`New version ${G} has been downloaded to ${X}`), await Y(!0);
    }
    async differentialDownloadInstaller(_, w, P, T, G) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const L = (0, v.blockmapFiles)(_.url, this.app.version, w.updateInfoAndProvider.info.version);
        this._logger.info(`Download block maps (old: "${L[0]}", new: ${L[1]})`);
        const M = async (F) => {
          const X = await this.httpExecutor.downloadToBuffer(F, {
            headers: w.requestHeaders,
            cancellationToken: w.cancellationToken
          });
          if (X == null || X.length === 0)
            throw new Error(`Blockmap "${F.href}" is empty`);
          try {
            return JSON.parse((0, g.gunzipSync)(X).toString());
          } catch (B) {
            throw new Error(`Cannot parse blockmap "${F.href}", error: ${B}`);
          }
        }, K = {
          newUrl: _.url,
          oldFile: c.join(this.downloadedUpdateHelper.cacheDir, G),
          logger: this._logger,
          newFile: P,
          isUseMultipleRangeRequest: T.isUseMultipleRangeRequest,
          requestHeaders: w.requestHeaders,
          cancellationToken: w.cancellationToken
        };
        this.listenerCount(y.DOWNLOAD_PROGRESS) > 0 && (K.onProgress = (F) => this.emit(y.DOWNLOAD_PROGRESS, F));
        const k = await Promise.all(L.map((F) => M(F)));
        return await new h.GenericDifferentialDownloader(_.info, this.httpExecutor, K).download(k[0], k[1]), !1;
      } catch (L) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${L.stack || L}`), this._testOnlyOptions != null)
          throw L;
        return !0;
      }
    }
  };
  br.AppUpdater = p;
  function E($) {
    const _ = (0, s.prerelease)($);
    return _ != null && _.length > 0;
  }
  class b {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(_) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(_) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(_) {
    }
  }
  return br.NoOpLogger = b, br;
}
var e0;
function Zr() {
  if (e0) return un;
  e0 = 1, Object.defineProperty(un, "__esModule", { value: !0 }), un.BaseUpdater = void 0;
  const e = Xa, t = yl();
  let o = class extends t.AppUpdater {
    constructor(f, r) {
      super(f, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(f = !1, r = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(f, f ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
        Wt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(f) {
      return super.executeDownload({
        ...f,
        done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(f = !1, r = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const i = this.downloadedUpdateHelper, c = this.installerPath, s = i == null ? null : i.downloadedFileInfo;
      if (c == null || s == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${f}, isForceRunAfter: ${r}`), this.doInstall({
          isSilent: f,
          isForceRunAfter: r,
          isAdminRightsRequired: s.isAdminRightsRequired
        });
      } catch (u) {
        return this.dispatchError(u), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((f) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (f !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${f}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    wrapSudo() {
      const { name: f } = this.app, r = `"${f} would like to update"`, i = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), c = [i];
      return /kdesudo/i.test(i) ? (c.push("--comment", r), c.push("-c")) : /gksudo/i.test(i) ? c.push("--message", r) : /pkexec/i.test(i) && c.push("--disable-internal-agent"), c.join(" ");
    }
    spawnSyncLog(f, r = [], i = {}) {
      this._logger.info(`Executing: ${f} with args: ${r}`);
      const c = (0, e.spawnSync)(f, r, {
        env: { ...process.env, ...i },
        encoding: "utf-8",
        shell: !0
      }), { error: s, status: u, stdout: a, stderr: d } = c;
      if (s != null)
        throw this._logger.error(d), s;
      if (u != null && u !== 0)
        throw this._logger.error(d), new Error(`Command ${f} exited with code ${u}`);
      return a.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(f, r = [], i = void 0, c = "ignore") {
      return this._logger.info(`Executing: ${f} with args: ${r}`), new Promise((s, u) => {
        try {
          const a = { stdio: c, env: i, detached: !0 }, d = (0, e.spawn)(f, r, a);
          d.on("error", (l) => {
            u(l);
          }), d.unref(), d.pid !== void 0 && s(!0);
        } catch (a) {
          u(a);
        }
      });
    }
  };
  return un.BaseUpdater = o, un;
}
var Sn = {}, bn = {}, t0;
function Og() {
  if (t0) return bn;
  t0 = 1, Object.defineProperty(bn, "__esModule", { value: !0 }), bn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const e = /* @__PURE__ */ lr(), t = Pg(), o = b0;
  let n = class extends t.DifferentialDownloader {
    async download() {
      const c = this.blockAwareFileInfo, s = c.size, u = s - (c.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(u, s - 1);
      const a = f(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await r(this.options.oldFile), a);
    }
  };
  bn.FileWithEmbeddedBlockMapDifferentialDownloader = n;
  function f(i) {
    return JSON.parse((0, o.inflateRawSync)(i).toString());
  }
  async function r(i) {
    const c = await (0, e.open)(i, "r");
    try {
      const s = (await (0, e.fstat)(c)).size, u = Buffer.allocUnsafe(4);
      await (0, e.read)(c, u, 0, u.length, s - u.length);
      const a = Buffer.allocUnsafe(u.readUInt32BE(0));
      return await (0, e.read)(c, a, 0, a.length, s - u.length - a.length), await (0, e.close)(c), f(a);
    } catch (s) {
      throw await (0, e.close)(c), s;
    }
  }
  return bn;
}
var r0;
function n0() {
  if (r0) return Sn;
  r0 = 1, Object.defineProperty(Sn, "__esModule", { value: !0 }), Sn.AppImageUpdater = void 0;
  const e = et(), t = Xa, o = /* @__PURE__ */ lr(), n = ur, f = Ke, r = Zr(), i = Og(), c = St(), s = Ar();
  let u = class extends r.BaseUpdater {
    constructor(d, l) {
      super(d, l);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(d) {
      const l = d.updateInfoAndProvider.provider, m = (0, c.findFile)(l.resolveFiles(d.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: m,
        downloadUpdateOptions: d,
        task: async (g, v) => {
          const h = process.env.APPIMAGE;
          if (h == null)
            throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (d.disableDifferentialDownload || await this.downloadDifferential(m, h, g, l, d)) && await this.httpExecutor.download(m.url, g, v), await (0, o.chmod)(g, 493);
        }
      });
    }
    async downloadDifferential(d, l, m, g, v) {
      try {
        const h = {
          newUrl: d.url,
          oldFile: l,
          logger: this._logger,
          newFile: m,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          requestHeaders: v.requestHeaders,
          cancellationToken: v.cancellationToken
        };
        return this.listenerCount(s.DOWNLOAD_PROGRESS) > 0 && (h.onProgress = (y) => this.emit(s.DOWNLOAD_PROGRESS, y)), await new i.FileWithEmbeddedBlockMapDifferentialDownloader(d.info, this.httpExecutor, h).download(), !1;
      } catch (h) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${h.stack || h}`), process.platform === "linux";
      }
    }
    doInstall(d) {
      const l = process.env.APPIMAGE;
      if (l == null)
        throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, n.unlinkSync)(l);
      let m;
      const g = f.basename(l), v = this.installerPath;
      if (v == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      f.basename(v) === g || !/\d+\.\d+\.\d+/.test(g) ? m = l : m = f.join(f.dirname(l), f.basename(v)), (0, t.execFileSync)("mv", ["-f", v, m]), m !== l && this.emit("appimage-filename-updated", m);
      const h = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return d.isForceRunAfter ? this.spawnLog(m, [], h) : (h.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, t.execFileSync)(m, [], { env: h })), !0;
    }
  };
  return Sn.AppImageUpdater = u, Sn;
}
var Rn = {}, i0;
function a0() {
  if (i0) return Rn;
  i0 = 1, Object.defineProperty(Rn, "__esModule", { value: !0 }), Rn.DebUpdater = void 0;
  const e = Zr(), t = St(), o = Ar();
  let n = class extends e.BaseUpdater {
    constructor(r, i) {
      super(r, i);
    }
    /*** @private */
    doDownloadUpdate(r) {
      const i = r.updateInfoAndProvider.provider, c = (0, t.findFile)(i.resolveFiles(r.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: c,
        downloadUpdateOptions: r,
        task: async (s, u) => {
          this.listenerCount(o.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (a) => this.emit(o.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(c.url, s, u);
        }
      });
    }
    get installerPath() {
      var r, i;
      return (i = (r = super.installerPath) === null || r === void 0 ? void 0 : r.replace(/ /g, "\\ ")) !== null && i !== void 0 ? i : null;
    }
    doInstall(r) {
      const i = this.wrapSudo(), c = /pkexec/i.test(i) ? "" : '"', s = this.installerPath;
      if (s == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const u = ["dpkg", "-i", s, "||", "apt-get", "install", "-f", "-y"];
      return this.spawnSyncLog(i, [`${c}/bin/bash`, "-c", `'${u.join(" ")}'${c}`]), r.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return Rn.DebUpdater = n, Rn;
}
var Pn = {}, s0;
function o0() {
  if (s0) return Pn;
  s0 = 1, Object.defineProperty(Pn, "__esModule", { value: !0 }), Pn.PacmanUpdater = void 0;
  const e = Zr(), t = Ar(), o = St();
  let n = class extends e.BaseUpdater {
    constructor(r, i) {
      super(r, i);
    }
    /*** @private */
    doDownloadUpdate(r) {
      const i = r.updateInfoAndProvider.provider, c = (0, o.findFile)(i.resolveFiles(r.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: c,
        downloadUpdateOptions: r,
        task: async (s, u) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (a) => this.emit(t.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(c.url, s, u);
        }
      });
    }
    get installerPath() {
      var r, i;
      return (i = (r = super.installerPath) === null || r === void 0 ? void 0 : r.replace(/ /g, "\\ ")) !== null && i !== void 0 ? i : null;
    }
    doInstall(r) {
      const i = this.wrapSudo(), c = /pkexec/i.test(i) ? "" : '"', s = this.installerPath;
      if (s == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const u = ["pacman", "-U", "--noconfirm", s];
      return this.spawnSyncLog(i, [`${c}/bin/bash`, "-c", `'${u.join(" ")}'${c}`]), r.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return Pn.PacmanUpdater = n, Pn;
}
var Tn = {}, u0;
function c0() {
  if (u0) return Tn;
  u0 = 1, Object.defineProperty(Tn, "__esModule", { value: !0 }), Tn.RpmUpdater = void 0;
  const e = Zr(), t = Ar(), o = St();
  let n = class extends e.BaseUpdater {
    constructor(r, i) {
      super(r, i);
    }
    /*** @private */
    doDownloadUpdate(r) {
      const i = r.updateInfoAndProvider.provider, c = (0, o.findFile)(i.resolveFiles(r.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: c,
        downloadUpdateOptions: r,
        task: async (s, u) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (a) => this.emit(t.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(c.url, s, u);
        }
      });
    }
    get installerPath() {
      var r, i;
      return (i = (r = super.installerPath) === null || r === void 0 ? void 0 : r.replace(/ /g, "\\ ")) !== null && i !== void 0 ? i : null;
    }
    doInstall(r) {
      const i = this.wrapSudo(), c = /pkexec/i.test(i) ? "" : '"', s = this.spawnSyncLog("which zypper"), u = this.installerPath;
      if (u == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      let a;
      return s ? a = [s, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", u] : a = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", u], this.spawnSyncLog(i, [`${c}/bin/bash`, "-c", `'${a.join(" ")}'${c}`]), r.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return Tn.RpmUpdater = n, Tn;
}
var On = {}, l0;
function f0() {
  if (l0) return On;
  l0 = 1, Object.defineProperty(On, "__esModule", { value: !0 }), On.MacUpdater = void 0;
  const e = et(), t = /* @__PURE__ */ lr(), o = ur, n = Ke, f = Av, r = yl(), i = St(), c = Xa, s = Dn;
  let u = class extends r.AppUpdater {
    constructor(d, l) {
      super(d, l), this.nativeUpdater = Wt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (m) => {
        this._logger.warn(m), this.emit("error", m);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(d) {
      this._logger.debug != null && this._logger.debug(d);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((d) => {
        d && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(d) {
      let l = d.updateInfoAndProvider.provider.resolveFiles(d.updateInfoAndProvider.info);
      const m = this._logger, g = "sysctl.proc_translated";
      let v = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), v = (0, c.execFileSync)("sysctl", [g], { encoding: "utf8" }).includes(`${g}: 1`), m.info(`Checked for macOS Rosetta environment (isRosetta=${v})`);
      } catch ($) {
        m.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${$}`);
      }
      let h = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const _ = (0, c.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        m.info(`Checked 'uname -a': arm64=${_}`), h = h || _;
      } catch ($) {
        m.warn(`uname shell command to check for arm64 failed: ${$}`);
      }
      h = h || process.arch === "arm64" || v;
      const y = ($) => {
        var _;
        return $.url.pathname.includes("arm64") || ((_ = $.info.url) === null || _ === void 0 ? void 0 : _.includes("arm64"));
      };
      h && l.some(y) ? l = l.filter(($) => h === y($)) : l = l.filter(($) => !y($));
      const p = (0, i.findFile)(l, "zip", ["pkg", "dmg"]);
      if (p == null)
        throw (0, e.newError)(`ZIP file not provided: ${(0, e.safeStringifyJson)(l)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const E = d.updateInfoAndProvider.provider, b = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: p,
        downloadUpdateOptions: d,
        task: async ($, _) => {
          const w = n.join(this.downloadedUpdateHelper.cacheDir, b), P = () => (0, t.pathExistsSync)(w) ? !d.disableDifferentialDownload : (m.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let T = !0;
          P() && (T = await this.differentialDownloadInstaller(p, d, $, E, b)), T && await this.httpExecutor.download(p.url, $, _);
        },
        done: async ($) => {
          if (!d.disableDifferentialDownload)
            try {
              const _ = n.join(this.downloadedUpdateHelper.cacheDir, b);
              await (0, t.copyFile)($.downloadedFile, _);
            } catch (_) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${_.message}`);
            }
          return this.updateDownloaded(p, $);
        }
      });
    }
    async updateDownloaded(d, l) {
      var m;
      const g = l.downloadedFile, v = (m = d.info.size) !== null && m !== void 0 ? m : (await (0, t.stat)(g)).size, h = this._logger, y = `fileToProxy=${d.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${y})`), this.server = (0, f.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${y})`), this.server.on("close", () => {
        h.info(`Proxy server for native Squirrel.Mac is closed (${y})`);
      });
      const p = (E) => {
        const b = E.address();
        return typeof b == "string" ? b : `http://127.0.0.1:${b?.port}`;
      };
      return await new Promise((E, b) => {
        const $ = (0, s.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), _ = Buffer.from(`autoupdater:${$}`, "ascii"), w = `/${(0, s.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (P, T) => {
          const G = P.url;
          if (h.info(`${G} requested`), G === "/") {
            if (!P.headers.authorization || P.headers.authorization.indexOf("Basic ") === -1) {
              T.statusCode = 401, T.statusMessage = "Invalid Authentication Credentials", T.end(), h.warn("No authenthication info");
              return;
            }
            const K = P.headers.authorization.split(" ")[1], k = Buffer.from(K, "base64").toString("ascii"), [F, X] = k.split(":");
            if (F !== "autoupdater" || X !== $) {
              T.statusCode = 401, T.statusMessage = "Invalid Authentication Credentials", T.end(), h.warn("Invalid authenthication credentials");
              return;
            }
            const B = Buffer.from(`{ "url": "${p(this.server)}${w}" }`);
            T.writeHead(200, { "Content-Type": "application/json", "Content-Length": B.length }), T.end(B);
            return;
          }
          if (!G.startsWith(w)) {
            h.warn(`${G} requested, but not supported`), T.writeHead(404), T.end();
            return;
          }
          h.info(`${w} requested by Squirrel.Mac, pipe ${g}`);
          let L = !1;
          T.on("finish", () => {
            L || (this.nativeUpdater.removeListener("error", b), E([]));
          });
          const M = (0, o.createReadStream)(g);
          M.on("error", (K) => {
            try {
              T.end();
            } catch (k) {
              h.warn(`cannot end response: ${k}`);
            }
            L = !0, this.nativeUpdater.removeListener("error", b), b(new Error(`Cannot pipe "${g}": ${K}`));
          }), T.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": v
          }), M.pipe(T);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${y})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${p(this.server)}, ${y})`), this.nativeUpdater.setFeedURL({
            url: p(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${_.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(l), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", b), this.nativeUpdater.checkForUpdates()) : E([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return On.MacUpdater = u, On;
}
var Nn = {}, Va = {}, d0;
function Bb() {
  if (d0) return Va;
  d0 = 1, Object.defineProperty(Va, "__esModule", { value: !0 }), Va.verifySignature = f;
  const e = et(), t = Xa, o = Ja, n = Ke;
  function f(s, u, a) {
    return new Promise((d, l) => {
      const m = u.replace(/'/g, "''");
      a.info(`Verifying signature ${m}`), (0, t.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${m}' | ConvertTo-Json -Compress"`], {
        shell: !0,
        timeout: 20 * 1e3
      }, (g, v, h) => {
        var y;
        try {
          if (g != null || h) {
            i(a, g, h, l), d(null);
            return;
          }
          const p = r(v);
          if (p.Status === 0) {
            try {
              const _ = n.normalize(p.Path), w = n.normalize(u);
              if (a.info(`LiteralPath: ${_}. Update Path: ${w}`), _ !== w) {
                i(a, new Error(`LiteralPath of ${_} is different than ${w}`), h, l), d(null);
                return;
              }
            } catch (_) {
              a.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(y = _.message) !== null && y !== void 0 ? y : _.stack}`);
            }
            const b = (0, e.parseDn)(p.SignerCertificate.Subject);
            let $ = !1;
            for (const _ of s) {
              const w = (0, e.parseDn)(_);
              if (w.size ? $ = Array.from(w.keys()).every((T) => w.get(T) === b.get(T)) : _ === b.get("CN") && (a.warn(`Signature validated using only CN ${_}. Please add your full Distinguished Name (DN) to publisherNames configuration`), $ = !0), $) {
                d(null);
                return;
              }
            }
          }
          const E = `publisherNames: ${s.join(" | ")}, raw info: ` + JSON.stringify(p, (b, $) => b === "RawData" ? void 0 : $, 2);
          a.warn(`Sign verification failed, installer signed with incorrect certificate: ${E}`), d(E);
        } catch (p) {
          i(a, p, null, l), d(null);
          return;
        }
      });
    });
  }
  function r(s) {
    const u = JSON.parse(s);
    delete u.PrivateKey, delete u.IsOSBinary, delete u.SignatureType;
    const a = u.SignerCertificate;
    return a != null && (delete a.Archived, delete a.Extensions, delete a.Handle, delete a.HasPrivateKey, delete a.SubjectName), u;
  }
  function i(s, u, a, d) {
    if (c()) {
      s.warn(`Cannot execute Get-AuthenticodeSignature: ${u || a}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, t.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
    } catch (l) {
      s.warn(`Cannot execute ConvertTo-Json: ${l.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    u != null && d(u), a && d(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${a}. Failing signature validation due to unknown stderr.`));
  }
  function c() {
    const s = o.release();
    return s.startsWith("6.") && !s.startsWith("6.3");
  }
  return Va;
}
var h0;
function p0() {
  if (h0) return Nn;
  h0 = 1, Object.defineProperty(Nn, "__esModule", { value: !0 }), Nn.NsisUpdater = void 0;
  const e = et(), t = Ke, o = Zr(), n = Og(), f = Ar(), r = St(), i = /* @__PURE__ */ lr(), c = Bb(), s = Wr;
  let u = class extends o.BaseUpdater {
    constructor(d, l) {
      super(d, l), this._verifyUpdateCodeSignature = (m, g) => (0, c.verifySignature)(m, g, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(d) {
      d && (this._verifyUpdateCodeSignature = d);
    }
    /*** @private */
    doDownloadUpdate(d) {
      const l = d.updateInfoAndProvider.provider, m = (0, r.findFile)(l.resolveFiles(d.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: d,
        fileInfo: m,
        task: async (g, v, h, y) => {
          const p = m.packageInfo, E = p != null && h != null;
          if (E && d.disableWebInstaller)
            throw (0, e.newError)(`Unable to download new version ${d.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !E && !d.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (E || d.disableDifferentialDownload || await this.differentialDownloadInstaller(m, d, g, l, e.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(m.url, g, v);
          const b = await this.verifySignature(g);
          if (b != null)
            throw await y(), (0, e.newError)(`New version ${d.updateInfoAndProvider.info.version} is not signed by the application owner: ${b}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (E && await this.differentialDownloadWebPackage(d, p, h, l))
            try {
              await this.httpExecutor.download(new s.URL(p.path), h, {
                headers: d.requestHeaders,
                cancellationToken: d.cancellationToken,
                sha512: p.sha512
              });
            } catch ($) {
              try {
                await (0, i.unlink)(h);
              } catch {
              }
              throw $;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(d) {
      let l;
      try {
        if (l = (await this.configOnDisk.value).publisherName, l == null)
          return null;
      } catch (m) {
        if (m.code === "ENOENT")
          return null;
        throw m;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(l) ? l : [l], d);
    }
    doInstall(d) {
      const l = this.installerPath;
      if (l == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const m = ["--updated"];
      d.isSilent && m.push("/S"), d.isForceRunAfter && m.push("--force-run"), this.installDirectory && m.push(`/D=${this.installDirectory}`);
      const g = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      g != null && m.push(`--package-file=${g}`);
      const v = () => {
        this.spawnLog(t.join(process.resourcesPath, "elevate.exe"), [l].concat(m)).catch((h) => this.dispatchError(h));
      };
      return d.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), v(), !0) : (this.spawnLog(l, m).catch((h) => {
        const y = h.code;
        this._logger.info(`Cannot run installer: error code: ${y}, error message: "${h.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), y === "UNKNOWN" || y === "EACCES" ? v() : y === "ENOENT" ? Wt.shell.openPath(l).catch((p) => this.dispatchError(p)) : this.dispatchError(h);
      }), !0);
    }
    async differentialDownloadWebPackage(d, l, m, g) {
      if (l.blockMapSize == null)
        return !0;
      try {
        const v = {
          newUrl: new s.URL(l.path),
          oldFile: t.join(this.downloadedUpdateHelper.cacheDir, e.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: m,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          cancellationToken: d.cancellationToken
        };
        this.listenerCount(f.DOWNLOAD_PROGRESS) > 0 && (v.onProgress = (h) => this.emit(f.DOWNLOAD_PROGRESS, h)), await new n.FileWithEmbeddedBlockMapDifferentialDownloader(l, this.httpExecutor, v).download();
      } catch (v) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${v.stack || v}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return Nn.NsisUpdater = u, Nn;
}
var m0;
function Hb() {
  return m0 || (m0 = 1, (function(e) {
    var t = Sr && Sr.__createBinding || (Object.create ? (function(h, y, p, E) {
      E === void 0 && (E = p);
      var b = Object.getOwnPropertyDescriptor(y, p);
      (!b || ("get" in b ? !y.__esModule : b.writable || b.configurable)) && (b = { enumerable: !0, get: function() {
        return y[p];
      } }), Object.defineProperty(h, E, b);
    }) : (function(h, y, p, E) {
      E === void 0 && (E = p), h[E] = y[p];
    })), o = Sr && Sr.__exportStar || function(h, y) {
      for (var p in h) p !== "default" && !Object.prototype.hasOwnProperty.call(y, p) && t(y, h, p);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
    const n = /* @__PURE__ */ lr(), f = Ke;
    var r = Zr();
    Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
      return r.BaseUpdater;
    } });
    var i = yl();
    Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
      return i.AppUpdater;
    } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
      return i.NoOpLogger;
    } });
    var c = St();
    Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
      return c.Provider;
    } });
    var s = n0();
    Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
      return s.AppImageUpdater;
    } });
    var u = a0();
    Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
      return u.DebUpdater;
    } });
    var a = o0();
    Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
      return a.PacmanUpdater;
    } });
    var d = c0();
    Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
      return d.RpmUpdater;
    } });
    var l = f0();
    Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
      return l.MacUpdater;
    } });
    var m = p0();
    Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
      return m.NsisUpdater;
    } }), o(Ar(), e);
    let g;
    function v() {
      if (process.platform === "win32")
        g = new (p0()).NsisUpdater();
      else if (process.platform === "darwin")
        g = new (f0()).MacUpdater();
      else {
        g = new (n0()).AppImageUpdater();
        try {
          const h = f.join(process.resourcesPath, "package-type");
          if (!(0, n.existsSync)(h))
            return g;
          console.info("Checking for beta autoupdate feature for deb/rpm distributions");
          const y = (0, n.readFileSync)(h).toString().trim();
          switch (console.info("Found package-type:", y), y) {
            case "deb":
              g = new (a0()).DebUpdater();
              break;
            case "rpm":
              g = new (c0()).RpmUpdater();
              break;
            case "pacman":
              g = new (o0()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (h) {
          console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", h.message);
        }
      }
      return g;
    }
    Object.defineProperty(e, "autoUpdater", {
      enumerable: !0,
      get: () => g || v()
    });
  })(Sr)), Sr;
}
var Cr = Hb();
const zb = "G-JHJ6L73YNP", Kb = "ffMA3nPYSQy8hjxNehcvJA", y0 = new J0({
  name: "analytics",
  defaults: {
    clientId: ""
  }
});
class Wb {
  clientId;
  constructor() {
    this.clientId = y0.get("clientId"), this.clientId || (this.clientId = Ov(), y0.set("clientId", this.clientId));
  }
  /**
   * Track an event to Google Analytics 4
   * @param eventName Name of the event (e.g., 'app_launch')
   * @param params Additional parameters
   */
  track(t, o = {}) {
    const n = {
      client_id: this.clientId,
      events: [{
        name: t,
        params: {
          ...o,
          engagement_time_msec: 100,
          session_id: Date.now().toString()
        }
      }]
    }, f = `https://www.google-analytics.com/mp/collect?measurement_id=${zb}&api_secret=${Kb}`, r = Pv.request({
      method: "POST",
      url: f,
      useSessionCookies: !1
    });
    r.setHeader("Content-Type", "application/json"), r.on("error", (i) => {
      console.error("Analytics Error:", i);
    }), r.write(JSON.stringify(n)), r.end();
  }
}
const jn = new Wb(), Ng = Ce.dirname(Rv(import.meta.url)), Yb = ht.getAppPath(), Ig = Ce.join(Yb, "dist-electron", "preload.cjs");
process.env.DIST_ELECTRON = Ce.join(Ng, "../dist-electron");
process.env.DIST = Ce.join(Ng, "../dist");
process.env.VITE_PUBLIC = ht.isPackaged ? process.env.DIST : Ce.join(process.env.DIST, "../public");
ht.setName("Messenger Neo");
const Xb = ht.requestSingleInstanceLock();
Xb || (ht.quit(), process.exit(0));
const Kt = new J0({
  defaults: {
    windowBounds: { width: 1200, height: 800 },
    settings: {
      hideReadReceipts: !0,
      hideTypingIndicator: !0,
      blockTracking: !0,
      startAtLogin: !0,
      minimizeToTray: !0
    }
  }
});
let qe, $t, In = null, Ya = Kt.get("settings");
const g0 = process.env.VITE_DEV_SERVER_URL;
function Jb() {
  if (In) return;
  const e = process.platform === "darwin" ? "TrayTemplate.png" : "icon.png", t = Ce.join(process.env.VITE_PUBLIC || "", `icons/${e}`);
  In = new Tv(t);
  const o = Uc.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        qe?.show();
      }
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        ht.isQuitting = !0, ht.quit();
      }
    }
  ]);
  In.setToolTip("Messenger Neo"), In.setContextMenu(o), In.on("click", () => {
    qe?.isVisible() ? qe.isFocused() ? qe.hide() : qe.focus() : qe?.show();
  });
}
function Qb() {
  qe = new _0({
    minWidth: 400,
    minHeight: 500,
    center: !0,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: Ig,
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !0
      // STRICT SECURITY COMPLIANCE
    },
    show: !1,
    icon: Ce.join(process.env.VITE_PUBLIC || "", "icons/128x128.png"),
    x: Kt.get("windowBounds.x"),
    y: Kt.get("windowBounds.y"),
    width: Kt.get("windowBounds.width") || 1200,
    height: Kt.get("windowBounds.height") || 800
  }), qe.on("resize", () => {
    if (!qe) return;
    const { width: e, height: t } = qe.getBounds();
    Kt.set("windowBounds.width", e), Kt.set("windowBounds.height", t);
  }), qe.on("move", () => {
    if (!qe) return;
    const { x: e, y: t } = qe.getBounds();
    Kt.set("windowBounds.x", e), Kt.set("windowBounds.y", t);
  }), qe.loadURL("https://www.messenger.com"), qe.webContents.session.setPermissionRequestHandler((e, t, o) => {
    ["notifications", "media"].includes(t) ? o(!0) : o(!1);
  }), qe.once("ready-to-show", () => {
    qe?.show();
  }), qe.webContents.setWindowOpenHandler(({ url: e }) => (e.startsWith("https:") && Ba.openExternal(e), { action: "deny" })), qe.webContents.on("will-navigate", (e, t) => {
    const o = new URL(t);
    ["messenger.com", "www.messenger.com", "facebook.com", "www.facebook.com", "login.facebook.com"].includes(o.hostname) || o.hostname.endsWith(".messenger.com") || o.hostname.endsWith(".facebook.com") || (e.preventDefault(), Ba.openExternal(t));
  }), qe.webContents.on("dom-ready", () => {
    Zb();
  }), qe.on("close", (e) => {
    if (!ht.isQuitting && Ya.minimizeToTray && process.platform !== "darwin")
      return e.preventDefault(), qe?.hide(), !1;
  });
}
function Ag() {
  if ($t)
    if ($t.isDestroyed())
      $t = null;
    else {
      $t.focus();
      return;
    }
  const e = qe && !qe.isDestroyed() && qe.isVisible();
  $t = new _0({
    width: 500,
    height: 850,
    resizable: !1,
    title: "Settings",
    titleBarStyle: "hiddenInset",
    vibrancy: "sidebar",
    parent: e ? qe : void 0,
    modal: !1,
    webPreferences: {
      preload: Ig,
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !0
    },
    autoHideMenuBar: !0,
    show: !1
  }), $t.once("ready-to-show", () => {
    $t?.show();
  }), g0 ? $t.loadURL(g0) : $t.loadFile(Ce.join(process.env.DIST || "", "index.html")), $t.webContents.setWindowOpenHandler(({ url: t }) => (t.startsWith("https:") && Ba.openExternal(t), { action: "deny" })), $t.on("closed", () => {
    $t = null;
  });
}
function Zb() {
  qe && (Ya.hideReadReceipts && qe.webContents.insertCSS('[aria-label*="Seen"], [aria-label*="Đã xem"], svg[aria-label*="Seen"] { display: none !important; opacity: 0 !important; }'), Ya.hideTypingIndicator && qe.webContents.insertCSS('[role="presentation"][class*="typing"], [aria-label*="Typing"], [aria-label*="Đang nhập"] { display: none !important; opacity: 0 !important; transform: scale(0); }'));
}
v0.handle("open-settings", () => {
  Ag();
});
v0.handle("get-settings", () => Ya);
Cr.autoUpdater.autoDownload = !1;
Cr.autoUpdater.autoInstallOnAppQuit = !0;
Cr.autoUpdater.on("checking-for-update", () => {
  qe?.webContents.send("update-message", "Checking for updates..."), jn.track("app_update_check");
});
Cr.autoUpdater.on("update-available", (e) => {
  qe?.webContents.send("update-message", "Update available."), qe?.webContents.send("update-available", e), jn.track("app_update_available", { version: e.version });
});
Cr.autoUpdater.on("update-not-available", (e) => {
  qe?.webContents.send("update-message", "Update not available."), qe?.webContents.send("update-not-available");
});
Cr.autoUpdater.on("error", (e) => {
  qe?.webContents.send("update-message", "Error in auto-updater. " + e), qe?.webContents.send("update-error", e.toString()), jn.track("app_update_error", { error: e.toString() });
});
Cr.autoUpdater.on("update-downloaded", (e) => {
  qe?.webContents.send("update-message", "Update downloaded"), qe?.webContents.send("update-downloaded"), jn.track("app_update_downloaded");
});
ht.whenReady().then(() => {
  Qb(), jn.track("app_launch", {
    version: ht.getVersion(),
    platform: process.platform,
    arch: process.arch
  }), process.platform !== "darwin" && Jb(), eR();
});
ht.isQuitting = !1;
ht.on("before-quit", () => {
  ht.isQuitting = !0;
});
function eR() {
  const e = process.platform === "darwin", t = [
    ...e ? [{
      label: ht.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Preferences...",
          accelerator: "CmdOrCtrl+,",
          click: () => Ag()
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    }] : [],
    {
      label: "File",
      submenu: [
        e ? { role: "close" } : { role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...e ? [
          { role: "pasteAndMatchStyle" },
          { role: "delete" },
          { role: "selectAll" },
          { type: "separator" },
          {
            label: "Speech",
            submenu: [
              { role: "startSpeaking" },
              { role: "stopSpeaking" }
            ]
          }
        ] : [
          { role: "delete" },
          { type: "separator" },
          { role: "selectAll" }
        ]
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...e ? [
          { type: "separator" },
          { role: "front" },
          { type: "separator" },
          { role: "window" }
        ] : [
          { role: "close" }
        ]
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            await Ba.openExternal("https://electronjs.org");
          }
        }
      ]
    }
  ], o = Uc.buildFromTemplate(t);
  Uc.setApplicationMenu(o);
}
