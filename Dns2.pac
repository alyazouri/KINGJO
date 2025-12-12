// ===================================================
//  PUBG Mobile — JO ULTRA PAC (Umniah) — FINAL
//  GOAL: Lobby FAST + Match STRONG + NO DIRECT + Low Diffusion
//  - Lobby/Recruit: ثابت سريع على 443 (مع fallback)
//  - Match: يفضّل JO (IPv4/IPv6) ويستخدم primary ثم fallback
//  - IPv6 NARROW to avoid diffusion
//  - Works even if dnsResolveEx isn't available (falls back safely)
// ===================================================

// ================== PROXIES (JO ONLY) ==================
var PROXY_MATCH_PRIMARY = "PROXY 212.35.66.45:20001";
var PROXY_LOBBY_PRIMARY = "PROXY 212.35.66.45:443";
var PROXY_FALLBACK      = "PROXY 46.185.131.218:443";

// لا DIRECT أبداً
var NO_DIRECT_DEFAULT   = PROXY_FALLBACK;

// ================== PORT LOGIC ==================
var PORT_MATCH  = [20001, 10012];
var PORT_LOBBY  = [443];
var PORT_UPDATE = [80];

// ================== JO PURE IPv4 (FOCUSED / LOW DIFFUSION) ==================
var JO_V4 = [
  "37.202.64.0/18",    // Umniah Core
  "79.173.192.0/18",   // Umniah Mobile
  "46.185.128.0/18",   // Zain Core (cleaner than /17)
  "82.212.64.0/18",    // JO Backbone
  "46.32.96.0/21",     // JO DC low-latency (tighter than /19)
  "77.245.4.0/22",     // Gaming/NAT (tighter than /20)
  "62.72.160.0/19",    // Orange backbone (cleaner alt)
  "5.45.128.0/20"      // Zain backup
];

// ================== JO PURE IPv6 (NARROW / NO DIFFUSION) ==================
// ملاحظة: إذا محرك الـ PAC ما بدعم dnsResolveEx، تأثير IPv6 بيكون أقل.
// خليتها ضيّقة عشان ما تلتقط أي شي مش JO.
var JO_V6 = [
  // Umniah (narrow)
  "2a03:6b00::/32",
  "2a03:6b10::/32",

  // Orange (narrow)
  "2a00:18d8::/32",
  "2a00:18d9::/32",

  // Zain (narrower slices)
  "2a03:b640::/36",
  "2a03:b640:1000::/36",

  // Extra narrow JO slice (optional, safe)
  "2001:32c1::/32"
];

// ================== FAST EXCEPTIONS (NO DIRECT) ==================
function isFastException(host) {
  return dnsDomainIs(host, "youtube.com") ||
         dnsDomainIs(host, "googlevideo.com") ||
         dnsDomainIs(host, "github.com") ||
         dnsDomainIs(host, "raw.githubusercontent.com");
}

// ================== HELPERS: PORT ==================
function portMatch(port, list) {
  for (var i = 0; i < list.length; i++) if (port == list[i]) return true;
  return false;
}
function getPort(url) {
  var s = url;
  var p = s.indexOf("://");
  if (p >= 0) s = s.substring(p + 3);

  var slash = s.indexOf("/");
  if (slash >= 0) s = s.substring(0, slash);

  // IPv6 URL: [..]:port
  if (s.length && s.charAt(0) === "[") {
    var rb = s.indexOf("]");
    if (rb >= 0) {
      var rest = s.substring(rb + 1);
      if (rest.length && rest.charAt(0) === ":") {
        var vp = parseInt(rest.substring(1), 10);
        if (vp > 0) return vp;
      }
    }
  }

  // host:port
  var colon = s.lastIndexOf(":");
  if (colon > 0) {
    var maybePort = parseInt(s.substring(colon + 1), 10);
    if (maybePort > 0) return maybePort;
  }

  // protocol default
  if (shExpMatch(url, "https:*")) return 443;
  if (shExpMatch(url, "http:*"))  return 80;

  return 443;
}

// ================== HELPERS: IPv4 ==================
function ipToLong(ip) {
  var p = ip.split(".");
  return ((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + (+p[3]);
}
function isInCIDR(ip, cidr) {
  var parts = cidr.split("/");
  var base = ipToLong(parts[0]);
  var bits = parseInt(parts[1], 10);
  var mask = (bits === 0) ? 0 : (-1 << (32 - bits));
  return (ipToLong(ip) & mask) === (base & mask);
}
function isJOv4(ip) {
  if (!ip || ip.indexOf(".") < 0) return false;
  for (var i = 0; i < JO_V4.length; i++) {
    if (isInCIDR(ip, JO_V4[i])) return true;
  }
  return false;
}

// ================== HELPERS: IPv6 ==================
function isIPv6(addr) { return addr && addr.indexOf(":") >= 0; }

function expandIPv6(address) {
  var addr = (address || "").toLowerCase();
  var z = addr.indexOf("%"); // strip zone id
  if (z >= 0) addr = addr.substring(0, z);

  var parts = addr.split("::");
  var head = parts[0] ? parts[0].split(":") : [];
  var tail = (parts.length > 1 && parts[1]) ? parts[1].split(":") : [];

  // no ::
  if (parts.length === 1) {
    var full = addr.split(":");
    while (full.length < 8) full.push("0");
    var out = [];
    for (var i=0;i<8;i++) out.push(parseInt(full[i] || "0", 16) || 0);
    return out;
  }

  var missing = 8 - (head.length + tail.length);
  var out2 = [];
  for (var i2=0;i2<head.length;i2++) out2.push(parseInt(head[i2] || "0", 16) || 0);
  for (var m=0;m<missing;m++) out2.push(0);
  for (var j=0;j<tail.length;j++) out2.push(parseInt(tail[j] || "0", 16) || 0);
  while (out2.length < 8) out2.push(0);
  return out2;
}

function ip6ToBigInt(parts) {
  var v = 0n;
  for (var i=0;i<8;i++) v = (v << 16n) + BigInt(parts[i] & 0xffff);
  return v;
}

function ip6InPrefix(ip6, prefix) {
  var sp = prefix.split("/");
  var base = sp[0];
  var bits = parseInt(sp[1], 10);
  if (isNaN(bits) || bits < 0 || bits > 128) return false;

  var ipV = ip6ToBigInt(expandIPv6(ip6));
  var baseV = ip6ToBigInt(expandIPv6(base));

  var shift = BigInt(128 - bits);
  var ipN = (shift === 128n) ? 0n : (ipV >> shift);
  var baseN = (shift === 128n) ? 0n : (baseV >> shift);
  return ipN === baseN;
}

function isJOv6(ip6) {
  if (!ip6 || !isIPv6(ip6)) return false;
  for (var i=0;i<JO_V6.length;i++) {
    if (ip6InPrefix(ip6, JO_V6[i])) return true;
  }
  return false;
}

// ================== RESOLVE (v4 + best-effort v6) ==================
function resolveAll(host) {
  var out = { v4: "", v6: "" };

  // try dnsResolveEx if available
  try {
    if (typeof dnsResolveEx === "function") {
      var r = dnsResolveEx(host);
      var arr = [];
      if (typeof r === "string") arr = [r];
      else if (r && r.length) arr = r;

      for (var i=0;i<arr.length;i++) {
        var a = arr[i];
        if (!a) continue;
        if (!out.v4 && a.indexOf(".") >= 0) out.v4 = a;
        if (!out.v6 && a.indexOf(":") >= 0) out.v6 = a;
      }
      if (out.v4 || out.v6) return out;
    }
  } catch(e) {}

  // fallback dnsResolve (usually IPv4)
  var ip = dnsResolve(host);
  if (ip) {
    if (ip.indexOf(":") >= 0) out.v6 = ip;
    else out.v4 = ip;
  }
  return out;
}

// ================== MAIN ==================
function FindProxyForURL(url, host) {

  // fast exceptions still NO DIRECT (keep stable + no block)
  if (isFastException(host)) {
    return PROXY_LOBBY_PRIMARY + "; " + PROXY_FALLBACK;
  }

  var port = getPort(url);

  var r = resolveAll(host);
  var isJO = false;

  if (r.v4 && isJOv4(r.v4)) isJO = true;
  else if (r.v6 && isJOv6(r.v6)) isJO = true;

  // ---- LOBBY FAST (Umniah tuned) ----
  // ثابت جداً على 443 لتجنب أي تعليق
  if (portMatch(port, PORT_LOBBY)) {
    return PROXY_LOBBY_PRIMARY + "; " + PROXY_FALLBACK;
  }

  // ---- MATCH STRONG (prefer JO) ----
  if (portMatch(port, PORT_MATCH)) {
    // إذا JO: استخدم primary مباشرة
    if (isJO) return PROXY_MATCH_PRIMARY;

    // إذا مش JO: خلّيها قوية لكن بدون قطع (failover سريع)
    return PROXY_MATCH_PRIMARY + "; " + PROXY_FALLBACK;
  }

  // ---- UPDATES ----
  if (portMatch(port, PORT_UPDATE)) {
    return PROXY_FALLBACK;
  }

  // ---- DEFAULT (NO DIRECT) ----
  return NO_DIRECT_DEFAULT;
}
