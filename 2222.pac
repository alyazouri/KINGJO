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
  "5.45.128.0/21","37.17.192.0/20","37.123.64.0/19","37.202.64.0/18",
  "37.220.112.0/20","46.23.112.0/20","46.32.96.0/19","46.185.128.0/17",
  "62.72.160.0/19","77.245.0.0/20","79.134.128.0/19",
  "79.173.192.0/18","82.212.64.0/18","91.106.108.0/22",
  "212.35.64.0/19","212.118.0.0/19","212.118.32.0/19"
];

// ================= JO IPv6 =================

var JO_V6_INTERVALS = [
  { start: "2a03:b640::", end: "2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a03:6b00::", end: "2a03:6b07:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a02:c000::", end: "2a02:c000:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a00:18d8::", end: "2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2001:32c0::", end: "2001:32c1:ffff:ffff:ffff:ffff:ffff:ffff" }
];

// ================= IPv4 TOOLS =================

function ipv4ToLong(ip){var p=ip.split('.'),n=0;for(var i=0;i<4;i++)n=(n<<8)+parseInt(p[i]);return n>>>0;}
function parseCIDR(c){var a=c.split('/'),b=ipv4ToLong(a[0]),m=~((1<<(32-a[1]))-1)>>>0;return{net:(b&m)>>>0,mask:m};}
function isIpInCidr(ip,c){var o=parseCIDR(c),i=ipv4ToLong(ip);return (i&o.mask)>>>0===o.net;}
function isJOIPv4(ip){for(var i=0;i<JO_V4_CIDR.length;i++) if(isIpInCidr(ip,JO_V4_CIDR[i])) return true; return false;}

// ================= IPv6 TOOLS =================

function expandIPv6(a){
  var p=[];
  if(a.indexOf("::")!==-1){
    var s=a.split("::"),l=s[0]?s[0].split(":"):[],r=s[1]?s[1].split(":"):[];
    for(var i=0;i<l.length;i++)p.push(l[i]);
    for(var j=0;j<8-(l.length+r.length);j++)p.push("0");
    for(var k=0;k<r.length;k++)p.push(r[k]);
  } else p=a.split(":");
  while(p.length<8)p.push("0");
  return p.map(x=>parseInt(x||"0",16));
}
function ipv6ToBigInt(ip){var p=expandIPv6(ip),v=0n;for(var i=0;i<8;i++)v=(v<<16n)+BigInt(p[i]);return v;}
function isIp6InRange(ip,s,e){var v=ipv6ToBigInt(ip),a=ipv6ToBigInt(s),b=ipv6ToBigInt(e);return v>=a&&v<=b;}
function isJOIPv6(ip){for(var i=0;i<JO_V6_INTERVALS.length;i++){var r=JO_V6_INTERVALS[i];if(isIp6InRange(ip,r.start,r.end)) return true;}return false;}
function isJOIP(ip){ if(!ip) return false; return ip.indexOf(":")!==-1?isJOIPv6(ip):isJOIPv4(ip); }

// ================= PUBG =================

function proxyFor(role){ return "PROXY "+PROXY_IP+":"+FIXED_PORT[role]+";"; }

function isPUBGHost(h){
  h=h.toLowerCase();
  return h.indexOf("pubg")!==-1 || h.indexOf("tencent")!==-1 || h.indexOf("qcloud")!==-1;
}

function classifyPUBG(url){
  var u=url.toLowerCase();
  if(u.indexOf("recruit")!==-1||u.indexOf("squad")!==-1) return "RECRUIT_SEARCH";
  if(u.indexOf("lobby")!==-1||u.indexOf("friend")!==-1) return "LOBBY";
  if(u.indexOf("update")!==-1||u.indexOf("patch")!==-1) return "UPDATES";
  if(u.indexOf("cdn")!==-1||u.indexOf(".obb")!==-1) return "CDN";
  return "MATCH";
}

// ================= MAIN =================

function FindProxyForURL(url, host){
  if(!host) return "DIRECT";
  host=host.toLowerCase();

  if(isPUBGHost(host)){
    var role = classifyPUBG(url);
    var ip = dnsResolve(host);

    // ✅ UPDATES / CDN مسموحين دائماً
    if(role==="UPDATES"||role==="CDN"){
      return proxyFor(role);
    }

    // ✅ أي شيء غير أردني = BLOCK
    if(!isJOIP(ip)){
      return "PROXY 0.0.0.0:0;";
    }

    // ✅ JO ONLY
    return proxyFor(role);
  }

  return "DIRECT";
}
