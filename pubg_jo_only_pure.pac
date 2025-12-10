// ======================================================================
//  PUBG-JO-ONLY-ABSOLUTE PAC — JO ONLY HARD MODE
//  - LOBBY / MATCH / RECRUIT = فقط IP أردني (JO_V4 + JO_V6)
//  - أي سيرفر مش أردني → BLOCK مباشر
//  - UPDATES / CDN فقط مسموح لهم خارج الفلترة
//  - بروكسي أردني ثابت
// ======================================================================

var PROXY_IP = "46.32.102.152";

var FIXED_PORT = {
  LOBBY:          443,
  MATCH:          20001,
  RECRUIT_SEARCH: 443,
  UPDATES:        8080,
  CDN:            8080
};

// ================= JO IPv4 =================

var JO_V4_CIDR = [
  // Zain / Orange / Umniah / Dawri 
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

// ================= JO IPv6 =================

var JO_V6_INTERVALS = [
  // Zain Jordan 2a03:b640::/32
  { start: "2a03:b640::", end: "2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff" },
  // Umniah / Orange ranges
  { start: "2a03:6b00::", end: "2a03:6b07:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a02:c000::", end: "2a02:c000:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a02:aa80::", end: "2a02:aa80:ffff:ffff:ffff:ffff:ffff:ffff" },
  // Regional ranges used by Jordan providers
  { start: "2a00:18d8::", end: "2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a00:18d9::", end: "2a00:18d9:ffff:ffff:ffff:ffff:ffff:ffff" },
  // Government / Academic networks
  { start: "2001:32c0::", end: "2001:32c0:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2001:32c1::", end: "2001:32c1:ffff:ffff:ffff:ffff:ffff:ffff" },
  // Sample regional / Middle East block close to Jordan
  { start: "2001:67c:27c0::", end: "2001:67c:27c1:ffff:ffff:ffff:ffff:ffff" }
];

// ================= IPv4 TOOLS =================

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

function parseCIDR(c) {
  var a = c.split('/');
  var base = a[0];
  var bits = a.length > 1 ? parseInt(a[1], 10) : 32;
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

// ================= IPv6 TOOLS =================

function expandIPv6(a) {
  var p = [];
  if (a.indexOf("::") !== -1) {
    var s = a.split("::");
    var left = s[0].length ? s[0].split(":") : [];
    var right = s[1].length ? s[1].split(":") : [];
    var missing = 8 - (left.length + right.length);
    for (var i = 0; i < left.length; i++) p.push(left[i]);
    for (var j = 0; j < missing; j++) p.push("0");
    for (var k = 0; k < right.length; k++) p.push(right[k]);
  } else {
    p = a.split(":");
  }
  while (p.length < 8) p.push("0");
  var nums = [];
  for (var h = 0; h < 8; h++) {
    var v = parseInt(p[h] || "0", 16);
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

function isIp6InRange(ip, s, e) {
  try {
    var v = ipv6ToBigInt(ip);
    var a = ipv6ToBigInt(s);
    var b = ipv6ToBigInt(e);
    return v >= a && v <= b;
  } catch (err) {
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

// ================= PUBG DETECTION =================

function proxyFor(role) {
  var port = FIXED_PORT[role] || 443;
  return "PROXY " + PROXY_IP + ":" + port + ";";
}

function isPUBGHost(host) {
  host = host.toLowerCase();
  return host.indexOf("pubg") !== -1 ||
         host.indexOf("tencent") !== -1 ||
         host.indexOf("igamecj") !== -1 ||
         host.indexOf("proximabeta") !== -1 ||
         host.indexOf("qcloud") !== -1;
}

function classifyPUBG(url) {
  var u = url.toLowerCase();
  // RECRUIT / TEAM
  if (u.indexOf("recruit") !== -1 ||
      u.indexOf("squad")   !== -1 ||
      u.indexOf("team")    !== -1 ||
      u.indexOf("search")  !== -1 ||
      u.indexOf("invite")  !== -1 ||
      u.indexOf("room")    !== -1) {
    return "RECRUIT_SEARCH";
  }
  // LOBBY / FRIENDS / SOCIAL
  if (u.indexOf("lobby")   !== -1 ||
      u.indexOf("friend")  !== -1 ||
      u.indexOf("social")  !== -1 ||
      u.indexOf("profile") !== -1 ||
      u.indexOf("chat")    !== -1) {
    return "LOBBY";
  }
  // UPDATES / PATCH / CONFIG
  if (u.indexOf("update")  !== -1 ||
      u.indexOf("patch")   !== -1 ||
      u.indexOf("version") !== -1 ||
      u.indexOf("config")  !== -1 ||
      u.indexOf("api")     !== -1 ||
      u.indexOf("login")   !== -1 ||
      u.indexOf("auth")    !== -1) {
    return "UPDATES";
  }
  // CDN / DOWNLOAD
  if (u.indexOf("cdn")      !== -1 ||
      u.indexOf("download") !== -1 ||
      u.indexOf("dl-")      !== -1 ||
      u.indexOf(".obb")     !== -1 ||
      u.indexOf(".pak")     !== -1) {
    return "CDN";
  }
  // Default = MATCH (gameplay)
  return "MATCH";
}

// ================= MAIN FUNCTION =================

function FindProxyForURL(url, host) {
  if (!host) return "DIRECT";
  host = host.toLowerCase();

  // Only handle PUBG traffic specially
  if (isPUBGHost(host)) {
    var role = classifyPUBG(url);

    // Resolve IP to check if it's Jordanian
    var ip = null;
    try {
      ip = dnsResolve(host);
    } catch (err) {
      ip = null;
    }
    var isJO = isJOIP(ip);

    // UPDATES and CDN: always allowed via proxy (no blocking)
    if (role === "UPDATES" || role === "CDN") {
      return proxyFor(role);
    }

    // For LOBBY/MATCH/RECRUIT: Only allow Jordanian IPs; block others
    if (!isJO) {
      return "PROXY 0.0.0.0:0;";
    }
    return proxyFor(role);
  }

  // Non-PUBG traffic: go direct
  return "DIRECT";
}
