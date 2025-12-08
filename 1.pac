// ======================================================================
// PUBG-JO PAC — FINAL (No DIRECT + YouTube/GitHub Exception)
// - لا يوجد أي DIRECT في السكربت (فقط PROXY أو BLOCK).
// - PUBG: يمر حصريًا عبر بروكسيات أردنية (SOCKS5 للماتش + HTTP للباقي).
// - YouTube / GitHub: مستثناة من البلوك ومنطق JO، لكنها تمر عبر HTTP proxy فقط.
// ======================================================================

// ======================= CONFIG =======================

// تقسيم البورتات حسب وظيفة PUBG
var PORTS = {
  LOBBY:  [443],                                  // Login / Lobby
  MATCH:  [20001, 20002, 20003, 20004, 20005],   // Game / Match (UDP+TCP عبر SOCKS5)
  UPDATE: [8080, 3128]                            // تحديثات / تحميل
};

// بروكسيات داخل الأردن
var PROXIES_CFG = [
  {
    ip: "176.29.154.39",                           // بروكسي رئيسي (JO)
    socksPorts: PORTS.MATCH,
    httpPorts:  PORTS.UPDATE.concat(PORTS.LOBBY)
  },
  {
    ip: "176.29.200.179",                         // بروكسي احتياطي (JO)
    socksPorts: PORTS.MATCH,
    httpPorts:  PORTS.UPDATE.concat(PORTS.LOBBY)
  }
];

// لو FORCE_ALL = true → أي ترافيك (غير المستثنى) يمشي على البروكسي
var FORCE_ALL     = true;
// حظر صريح لأي دومين ينتهي بـ .ir
var BLOCK_IR      = true;
// أي IP أردني (من JO_V4_CIDR) → BLOCK (لأنك ما بدك DIRECT نهائيًا)
var FORBID_DIRECT = true;

// ======================= PUBG DOMAINS =======================
var GAME_DOMAINS = [
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","qcloudcdn.com","tencentyun.com","qcloud.com",
  "gtimg.com","game.qq.com","gameloop.com","proximabeta.net",
  "cdn-ota.qq.com","cdngame.tencentyun.com",

  // Google services مرتبطة بـ PUBG
  "googleapis.com","gstatic.com","googleusercontent.com",
  "play.googleapis.com","firebaseinstallations.googleapis.com",
  "mtalk.google.com","android.clients.google.com",

  // Apple services
  "apple.com","icloud.com","gamecenter.apple.com",
  "gamekit.apple.com","apps.apple.com",

  // Social login
  "x.com","twitter.com","api.x.com",
  "abs.twimg.com","pbs.twimg.com","t.co"
];

var KEYWORDS = [
  "pubg","tencent","igame","proximabeta","qcloud","tencentyun",
  "gcloud","gameloop","match","squad","party","team","rank"
];

// ======================= YOUTUBE / GITHUB EXCEPTIONS =======================

var YT_DOMAINS = [
  "youtube.com","youtu.be","ytimg.com","googlevideo.com",
  "yt3.ggpht.com","youtube-nocookie.com"
];

var GIT_DOMAINS = [
  "github.com","gist.github.com",
  "raw.githubusercontent.com","githubusercontent.com"
];

function isYouTubeHost(host) {
  for (var i = 0; i < YT_DOMAINS.length; i++) {
    if (shExpMatch(host, "*" + YT_DOMAINS[i] + "*")) return true;
  }
  return false;
}

function isGitHubHost(host) {
  for (var i = 0; i < GIT_DOMAINS.length; i++) {
    if (shExpMatch(host, "*" + GIT_DOMAINS[i] + "*")) return true;
  }
  return false;
}

// ======================= Helpers =======================

function isIPv6Literal(h) {
  return h && h.indexOf(":") !== -1;
}

// IPv4 → رقم 32-bit
function ipToLong(ip) {
  var parts = ip.split('.');
  return (((+parts[0] << 24) >>> 0) +
          ((+parts[1] << 16) >>> 0) +
          ((+parts[2] <<  8) >>> 0) +
          ((+parts[3]      ) >>> 0)) >>> 0;
}

// هل هو دومين/هوست له علاقة بـ PUBG؟
function isPubgHost(host) {
  // دومينات PUBG المعروفة
  for (var i = 0; i < GAME_DOMAINS.length; i++) {
    if (shExpMatch(host, "*" + GAME_DOMAINS[i] + "*")) {
      return true;
    }
  }
  // كلمات مفتاحية
  for (var k = 0; k < KEYWORDS.length; k++) {
    if (host.indexOf(KEYWORDS[k]) !== -1) {
      return true;
    }
  }
  return false;
}

// بناء قائمة البروكسيات (SOCKS5 للماتش + HTTP للتحديث/اللوجن)
function proxyTokensFor(ip, socksPorts, httpPorts) {
  var host = isIPv6Literal(ip) ? "[" + ip + "]" : ip;
  var out  = [];

  // الماتش → SOCKS5 (يدعم UDP)
  for (var i = 0; i < socksPorts.length; i++) {
    out.push("SOCKS5 " + host + ":" + socksPorts[i]);
  }

  // التحديث + اللوجن → HTTP(S)
  for (var j = 0; j < httpPorts.length; j++) {
    out.push("PROXY " + host + ":" + httpPorts[j]);
  }

  return out;
}

// قائمة نهائية كاملة (PUBG chain)
var PROXY_LIST = (function () {
  var list = [];
  for (var i = 0; i < PROXIES_CFG.length; i++) {
    var p    = PROXIES_CFG[i];
    var toks = proxyTokensFor(p.ip, p.socksPorts || [], p.httpPorts || []);
    for (var k = 0; k < toks.length; k++) {
      list.push(toks[k]);
    }
  }
  return list;
})();

// Chain خاص لـ YouTube / GitHub (HTTP فقط)
var YT_GH_PROXY_LIST = (function () {
  var list = [];
  for (var i = 0; i < PROXIES_CFG.length; i++) {
    var p    = PROXIES_CFG[i];
    var host = isIPv6Literal(p.ip) ? "[" + p.ip + "]" : p.ip;
    var httpPorts = p.httpPorts || [];
    for (var j = 0; j < httpPorts.length; j++) {
      list.push("PROXY " + host + ":" + httpPorts[j]);
    }
  }
  return list;
})();

function buildProxyChain() {
  // بدون DIRECT متعمّدًا، عشان كل PUBG يطلع من IP أردني عن طريق البروكسي
  return PROXY_LIST.join("; ");
}

function buildYTGitProxyChain() {
  // YouTube / GitHub عبر HTTP فقط
  return YT_GH_PROXY_LIST.join("; ");
}

// ======================= Jordan IPv4 CIDR =======================
var JO_V4_CIDR = [
  { base: "176.29.0.0", mask: 16 },
  { base: "46.185.128.0", mask: 17 },
  { base: "86.108.0.0", mask: 17 },
  { base: "92.253.0.0", mask: 17 },
  { base: "94.249.0.0", mask: 17 },
  { base: "149.200.128.0", mask: 17 },
  { base: "176.28.128.0", mask: 17 },
  { base: "37.202.64.0", mask: 18 },
  { base: "79.173.192.0", mask: 18 },
  { base: "82.212.64.0", mask: 18 },
  { base: "178.77.128.0", mask: 18 },
  { base: "37.123.64.0", mask: 19 },
  { base: "46.32.96.0", mask: 19 },
  { base: "46.248.192.0", mask: 19 },
  { base: "62.72.160.0", mask: 19 },
  { base: "79.134.128.0", mask: 19 },
  { base: "84.18.32.0", mask: 19 },
  { base: "84.18.64.0", mask: 19 },
  { base: "91.186.224.0", mask: 19 },
  { base: "92.241.32.0", mask: 19 },
  { base: "94.142.32.0", mask: 19 },
  { base: "95.172.192.0", mask: 19 },
  { base: "109.107.224.0", mask: 19 },
  { base: "176.57.0.0", mask: 19 },
  { base: "188.123.160.0", mask: 19 },
  { base: "188.247.64.0", mask: 19 },
  { base: "193.188.64.0", mask: 19 },
  { base: "194.165.128.0", mask: 19 },
  { base: "212.34.0.0", mask: 19 },
  { base: "212.35.64.0", mask: 19 },
  { base: "212.118.0.0", mask: 19 },
  { base: "213.139.32.0", mask: 19 },
  { base: "213.186.160.0", mask: 19 },
  { base: "5.45.128.0", mask: 20 },
  { base: "37.17.192.0", mask: 20 },
  { base: "37.220.112.0", mask: 20 },
  { base: "46.23.112.0", mask: 20 },
  { base: "77.245.0.0", mask: 20 },
  { base: "80.90.160.0", mask: 20 },
  { base: "81.21.0.0", mask: 20 },
  { base: "81.28.112.0", mask: 20 },
  { base: "91.106.96.0", mask: 20 },
  { base: "95.141.208.0", mask: 20 },
  { base: "109.237.192.0", mask: 20 },
  { base: "176.57.48.0", mask: 20 },
  { base: "178.238.176.0", mask: 20 },
  { base: "217.23.32.0", mask: 20 },
  { base: "217.29.240.0", mask: 20 },
  { base: "217.144.0.0", mask: 20 },
  { base: "5.198.240.0", mask: 21 },
  { base: "37.44.32.0", mask: 21 },
  { base: "37.75.144.0", mask: 21 },
  { base: "37.152.0.0", mask: 21 },
  { base: "85.159.216.0", mask: 21 },
  { base: "87.236.232.0", mask: 21 },
  { base: "87.238.128.0", mask: 21 },
  { base: "89.28.216.0", mask: 21 },
  { base: "93.93.144.0", mask: 21 },
  { base: "93.95.200.0", mask: 21 },
  { base: "93.191.176.0", mask: 21 },
  { base: "94.127.208.0", mask: 21 },
  { base: "141.0.0.0", mask: 21 },
  { base: "141.105.56.0", mask: 21 },
  { base: "176.241.64.0", mask: 21 },
  { base: "178.20.184.0", mask: 21 },
  { base: "2.59.52.0", mask: 22 },
  { base: "5.199.184.0", mask: 22 },
  { base: "45.142.196.0", mask: 22 },
  { base: "141.98.64.0", mask: 22 },
  { base: "185.10.216.0", mask: 22 },
  { base: "185.12.244.0", mask: 22 },
  { base: "185.14.132.0", mask: 22 },
  { base: "185.19.112.0", mask: 22 },
  { base: "185.24.128.0", mask: 22 },
  { base: "185.30.248.0", mask: 22 },
  { base: "185.33.28.0", mask: 22 },
  { base: "185.51.212.0", mask: 22 },
  { base: "185.57.120.0", mask: 22 },
  { base: "185.80.24.0", mask: 22 },
  { base: "185.80.104.0", mask: 22 },
  { base: "185.98.220.0", mask: 22 },
  { base: "185.98.224.0", mask: 22 },
  { base: "185.109.120.0", mask: 22 },
  { base: "185.109.192.0", mask: 22 },
  { base: "185.135.200.0", mask: 22 },
  { base: "185.139.220.0", mask: 22 },
  { base: "185.159.180.0", mask: 22 },
  { base: "185.160.236.0", mask: 22 },
  { base: "185.173.56.0", mask: 22 },
  { base: "185.175.248.0", mask: 22 },
  { base: "185.176.44.0", mask: 22 },
  { base: "185.180.80.0", mask: 22 },
  { base: "185.182.136.0", mask: 22 },
  { base: "185.193.176.0", mask: 22 },
  { base: "185.197.176.0", mask: 22 },
  { base: "185.200.128.0", mask: 22 },
  { base: "185.253.112.0", mask: 22 },
  { base: "89.38.152.0", mask: 23 },
  { base: "193.203.24.0", mask: 23 },
  { base: "193.203.110.0", mask: 23 },
  { base: "193.108.134.0", mask: 23 },
  { base: "37.252.222.0", mask: 24 },
  { base: "84.252.106.0", mask: 24 },
  { base: "89.20.49.0", mask: 24 },
  { base: "91.132.100.0", mask: 24 },
  { base: "91.212.0.0", mask: 24 },
  { base: "91.223.202.0", mask: 24 },
  { base: "93.115.2.0", mask: 24 },
  { base: "93.115.3.0", mask: 24 },
  { base: "93.115.15.0", mask: 24 },
  { base: "146.19.239.0", mask: 24 },
  { base: "146.19.246.0", mask: 24 },
  { base: "176.118.39.0", mask: 24 },
  { base: "185.40.19.0", mask: 24 },
  { base: "185.43.146.0", mask: 24 },
  { base: "185.163.205.0", mask: 24 },
  { base: "185.234.111.0", mask: 24 },
  { base: "185.241.62.0", mask: 24 },
  { base: "194.104.95.0", mask: 24 },
  { base: "195.18.9.0", mask: 24 },
  { base: "91.209.248.0", mask: 24 },
  { base: "91.220.195.0", mask: 24 },
  { base: "193.17.53.0", mask: 24 },
  { base: "193.111.29.0", mask: 24 },
  { base: "193.189.148.0", mask: 24 },
  { base: "194.110.236.0", mask: 24 }
];

// فحص ما إذا كان IPv4 ضمن أحد النطاقات الأردنية
function isInJordanIPRange(ip) {
  if (!ip || isIPv6Literal(ip)) return false;
  var ipNum = ipToLong(ip);

  for (var i = 0; i < JO_V4_CIDR.length; i++) {
    var c       = JO_V4_CIDR[i];
    var baseNum = ipToLong(c.base);
    var maskLen = c.mask;
    var mask    = (maskLen === 0) ? 0 : ((~0 << (32 - maskLen)) >>> 0);

    if ((ipNum & mask) === (baseNum & mask)) {
      return true;
    }
  }
  return false;
}

// ======================= Main PAC Function =======================
function FindProxyForURL(url, host) {
  host = host.toLowerCase();

  // 0) استثناء YouTube / GitHub: لا بلوك ولا منطق JO، لكن عبر HTTP proxy فقط
  if (isYouTubeHost(host) || isGitHubHost(host)) {
    return buildYTGitProxyChain();
  }

  // 1) حظر .ir لو مفعّل
  if (BLOCK_IR && (shExpMatch(host, "*.ir") || host.endsWith(".ir"))) {
    return "BLOCK";
  }

  // 2) PUBG وكل ما يتعلق بها → حصريًا عبر بروكسيات الأردن (SOCKS5 + HTTP)
  if (isPubgHost(host)) {
    return buildProxyChain();
  }

  // 3) لو الـ IP أردني (من JO_V4_CIDR) و FORBID_DIRECT = true → BLOCK
  try {
    var ip = dnsResolve(host);
    if (ip && isInJordanIPRange(ip) && FORBID_DIRECT) {
      return "BLOCK";
    }
  } catch (e) {
    // لو فشل DNS نكمّل بالقواعد التالية
  }

  // 4) لو FORCE_ALL → كل شي (غير مستثنى) يمر عبر البروكسي
  if (FORCE_ALL) {
    return buildProxyChain();
  }

  // 5) لا يوجد DIRECT أبدًا، fallback دايمًا بروكسي
  return buildProxyChain();
}
