// ======================================================================
//  PUBG-JO-ULTRA-ALLTIME PAC — v1
//  - شغّال بكل الأوقات، بدون أي توقيت أو مود معيّن
//  - LOBBY / MATCH / RECRUIT = منطق Erangel الأردني (JO-First)
//  - UPDATES / CDN = مسموحة دائماً عشان التحديثات
//  - بروكسي أردني: 46.32.102.152
// ======================================================================

// ------------------------- إعدادات البروكسي ------------------------- //

var PROXY_IP = "46.32.102.152";

var FIXED_PORT = {
  LOBBY:          443,
  MATCH:          20001,
  RECRUIT_SEARCH: 443,
  UPDATES:        8080,
  CDN:            8080
};

// ======================================================================
//                     نطاقات IPv4 الأردنية (JO_V4)
// ======================================================================

var JO_V4_CIDR = [
  "5.45.128.0/21",
  "37.17.192.0/20",
  "37.123.64.0/19",
  "37.202.64.0/18",
  "37.220.112.0/20",

  "46.23.112.0/20",
  "46.32.96.0/19",
  "46.185.128.0/17",
  "46.248.192.0/19",

  "62.72.160.0/19",
  "62.72.176.0/20",

  "77.245.0.0/20",
  "79.134.128.0/19",
  "79.173.192.0/18",

  "80.90.160.0/20",
  "81.21.0.0/20",
  "81.28.112.0/20",

  "82.212.64.0/18",
  "84.18.32.0/20",

  "87.236.232.0/21",
  "91.106.108.0/22",
  "91.106.248.0/22",

  "92.253.0.0/17",
  "93.185.80.0/21",

  "94.142.0.0/18",
  "94.249.0.0/18",

  "95.141.24.0/21",
  "95.178.128.0/19",

  "176.29.0.0/16",
  "178.77.128.0/17",

  "185.5.16.0/22",
  "188.247.64.0/18",
  "188.247.128.0/18",

  "193.188.64.0/19",
  "194.165.160.0/19",
  "195.189.96.0/19",
  "212.35.64.0/19",
  "212.118.0.0/19",
  "212.118.32.0/19"
];


// ======================================================================
//                     نطاقات IPv6 الأردنية (JO_V6)
// ======================================================================

var JO_V6_INTERVALS = [

  // Zain Jordan 2a03:b640::/32
  {
    start: "2a03:b640::",
    end:   "2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff"
  },

  // أمثلة لبلوكات Umniah / Orange
  {
    start: "2a03:6b00::",
    end:   "2a03:6b07:ffff:ffff:ffff:ffff:ffff:ffff"
  },
  {
    start: "2a02:c000::",
    end:   "2a02:c000:ffff:ffff:ffff:ffff:ffff:ffff"
  },
  {
    start: "2a02:aa80::",
    end:   "2a02:aa80:ffff:ffff:ffff:ffff:ffff:ffff"
  },

  // 2a00:18d8 و 18d9
  {
    start: "2a00:18d8::",
    end:   "2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff"
  },
  {
    start: "2a00:18d9::",
    end:   "2a00:18d9:ffff:ffff:ffff:ffff:ffff:ffff"
  },

  // 2001:32c0 / 32c1 (JO gov / NREN ومحيطها)
  {
    start: "2001:32c0::",
    end:   "2001:32c0:ffff:ffff:ffff:ffff:ffff:ffff"
  },
  {
    start: "2001:32c1::",
    end:   "2001:32c1:ffff:ffff:ffff:ffff:ffff:ffff"
  },

  // 2001:67c:27c0::/48 مثال قريب من المنطقة
  {
    start: "2001:67c:27c0::",
    end:   "2001:67c:27c1:ffff:ffff:ffff:ffff:ffff"
  }
];


// ======================================================================
//                      دوال IPv4 / IPv6 للمسار الأردني
// ======================================================================

function ipv4ToLong(ip) {
  var p = ip.split('.');
  if (p.length !== 4) return 0;
  var n = 0;
  for (var i = 0; i < 4; i++) {
    var x = parseInt(p[i], 10);
    if (isNaN(x)) return 0;
    n = (n << 8) + x;
  }
  return n >>> 0;
}

function parseCIDR(cidr) {
  var parts = cidr.split('/');
  var base = parts[0];
  var bits = parts.length > 1 ? parseInt(parts[1], 10) : 32;
  if (isNaN(bits)) bits = 32;
  var baseLong = ipv4ToLong(base);
  var mask = bits === 0 ? 0 : (~((1 << (32 - bits)) - 1)) >>> 0;
  return { net: (baseLong & mask) >>> 0, mask: mask >>> 0 };
}

function isIpInCidr(ip, cidr) {
  var info = parseCIDR(cidr);
  var ipLong = ipv4ToLong(ip);
  return (ipLong & info.mask) >>> 0 === info.net;
}

function isJOIPv4(ip) {
  for (var i = 0; i < JO_V4_CIDR.length; i++) {
    if (isIpInCidr(ip, JO_V4_CIDR[i])) return true;
  }
  return false;
}

function expandIPv6(address) {
  var parts = [];
  if (address.indexOf("::") !== -1) {
    var sides = address.split("::");
    var left  = sides[0].length ? sides[0].split(":") : [];
    var right = sides[1].length ? sides[1].split(":") : [];
    var missing = 8 - (left.length + right.length);
    for (var i = 0; i < left.length; i++) parts.push(left[i]);
    for (var j = 0; j < missing; j++) parts.push("0");
    for (var k = 0; k < right.length; k++) parts.push(right[k]);
  } else {
    parts = address.split(":");
  }
  while (parts.length < 8) parts.push("0");
  var nums = [];
  for (var h = 0; h < 8; h++) {
    var v = parseInt(parts[h] || "0", 16);
    if (isNaN(v)) v = 0;
    nums.push(v);
  }
  return nums;
}

function ipv6ToBigInt(ip) {
  var parts = expandIPv6(ip);
  var v = 0n;
  for (var i = 0; i < 8; i++) {
    v = (v << 16n) + BigInt(parts[i]);
  }
  return v;
}

function isIp6InRange(ip, start, end) {
  try {
    var v = ipv6ToBigInt(ip);
    var s = ipv6ToBigInt(start);
    var e = ipv6ToBigInt(end);
    return v >= s && v <= e;
  } catch (e) {
    return false;
  }
}

function isJOIPv6(ip) {
  for (var i = 0; i < JO_V6_INTERVALS.length; i++) {
    var r = JO_V6_INTERVALS[i];
    if (isIp6InRange(ip, r.start, r.end)) return true;
  }
  return false;
}

function isJOIP(ip) {
  if (!ip) return false;
  if (ip.indexOf(":") !== -1) {
    return isJOIPv6(ip);
  } else {
    return isJOIPv4(ip);
  }
}


// ======================================================================
//                        PUBG + REGION LOGIC
// ======================================================================

function proxyFor(role) {
  var port = FIXED_PORT[role] || 443;
  return "PROXY " + PROXY_IP + ":" + port + ";";
}

function isPUBGHost(host) {
  host = host.toLowerCase();

  if (dnsDomainIs(host, "pubgmobile.com") ||
      shExpMatch(host, "*.pubgmobile.com") ||
      shExpMatch(host, "*.igamecj.com") ||
      shExpMatch(host, "*.proximabeta.com") ||
      shExpMatch(host, "*.tencentgames.com") ||
      shExpMatch(host, "*.tencent.com") ||
      shExpMatch(host, "*.gcloud.qq.com") ||
      shExpMatch(host, "*.qcloud.com") ||
      shExpMatch(host, "*.gamedownload.qcloud.com")) {
    return true;
  }

  if (host.indexOf("pubg") !== -1) return true;

  return false;
}

function classifyPUBGTraffic(url, host) {
  var u = url.toLowerCase();
  var h = host.toLowerCase();

  // LOBBY
  if (u.indexOf("lobby")   !== -1 ||
      u.indexOf("friend")  !== -1 ||
      u.indexOf("social")  !== -1 ||
      u.indexOf("profile") !== -1 ||
      u.indexOf("chat")    !== -1 ||
      h.indexOf("social")  !== -1) {
    return "LOBBY";
  }

  // MATCH
  if (u.indexOf("match")  !== -1 ||
      u.indexOf("battle") !== -1 ||
      u.indexOf("game")   !== -1 ||
      u.indexOf("play")   !== -1 ||
      u.indexOf("fight")  !== -1 ||
      h.indexOf("match")  !== -1 ||
      h.indexOf("battle") !== -1) {
    return "MATCH";
  }

  // RECRUIT
  if (u.indexOf("recruit") !== -1 ||
      u.indexOf("team")    !== -1 ||
      u.indexOf("squad")   !== -1 ||
      u.indexOf("search")  !== -1 ||
      u.indexOf("room")    !== -1 ||
      u.indexOf("invite")  !== -1 ||
      h.indexOf("squad")   !== -1) {
    return "RECRUIT_SEARCH";
  }

  // UPDATES
  if (u.indexOf("update")  !== -1 ||
      u.indexOf("patch")   !== -1 ||
      u.indexOf("version") !== -1 ||
      u.indexOf("config")  !== -1 ||
      u.indexOf("api")     !== -1 ||
      u.indexOf("login")   !== -1 ||
      u.indexOf("auth")    !== -1) {
    return "UPDATES";
  }

  // CDN
  if (u.indexOf("cdn")      !== -1 ||
      u.indexOf("download") !== -1 ||
      u.indexOf("dl-")      !== -1 ||
      u.indexOf(".obb")     !== -1 ||
      u.indexOf(".pak")     !== -1 ||
      u.indexOf("/res/")    !== -1) {
    return "CDN";
  }

  return "MATCH";
}

function looksLikeForeignRegion(host, url) {
  host = host.toLowerCase();
  url  = url.toLowerCase();

  var foreignHints = [
    "eu-", ".eu.", "-eu", "europe",
    "na-", ".na.", "-na", "northamerica", "usa", "us-",
    "br-", ".br.", "brazil",
    "kr-", ".kr.", "korea",
    "jp-", ".jp.", "japan",
    "ru-", ".ru.", "russia",
    "sea-", "sea_", "sea.",
    "ap-", "asia-", ".asia",
    "oc-", "oce-", "oceania"
  ];

  for (var i = 0; i < foreignHints.length; i++) {
    var h = foreignHints[i];
    if (host.indexOf(h) !== -1 || url.indexOf(h) !== -1) {
      return true;
    }
  }

  var menaHints = [
    "me-", ".me.", "middleeast",
    "mena", "arab", "arabia",
    "sa-", "ksa", "ae-", "dubai", "jo-", "jordan"
  ];

  for (var j = 0; j < menaHints.length; j++) {
    var m = menaHints[j];
    if (host.indexOf(m) !== -1 || url.indexOf(m) !== -1) {
      return false;
    }
  }

  return false;
}


// ======================================================================
//                          MAIN PAC FUNCTION
// ======================================================================

function FindProxyForURL(url, host) {
  if (!host) return "DIRECT";
  host = host.toLowerCase();

  // DNS → IP عشان نعرف إذا JO أو لا
  var ip = null;
  try {
    ip = dnsResolve(host);
  } catch (e) {
    ip = null;
  }
  var isJO = isJOIP(ip);

  // ========== 1) PUBG TRAFFIC ========== //
  if (isPUBGHost(host)) {
    var role = classifyPUBGTraffic(url, host);

    // LOBBY / MATCH / RECRUIT → نفس منطق Erangel الأردني
    if (role === "LOBBY" || role === "MATCH" || role === "RECRUIT_SEARCH") {

      // لو السيرفر أردني صريحاً → مرّره فوراً
      if (isJO) {
        return proxyFor(role);
      }

      // لو واضح إنه سيرفر أوروبي / بعيد → BLOCK عشان اللعبة تعيد البحث
      if (looksLikeForeignRegion(host, url)) {
        return "PROXY 0.0.0.0:0;";
      }

      // مش JO بس مش واضح إنه بعيد (ممكن مينا/خليجي) → مرّره
      return proxyFor(role);
    }

    // UPDATES / CDN → مررها دايماً عبر البروكسي عشان كل شيء يشتغل
    if (role === "UPDATES" || role === "CDN") {
      return proxyFor(role);
    }

    // أي شيء باقي من PUBG → مرّره بروكسي
    return proxyFor(role);
  }

  // ========== 2) باقي الترافيك (مش PUBG) ========== //
  // نخليه DIRECT عشان ما نخنق البروكسي والبنق
  return "DIRECT";
}
