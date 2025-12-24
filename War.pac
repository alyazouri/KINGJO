// ===================================================
//  PUBG — JO THEN GULF (BLOCK EUROPE) | FINAL | NO DIRECT 100%
//  - PUBG ONLY (Tournament/Squad Lock)
//  - Match ports: 20001 → 20005
//  - Destination IP must be:
//      1) Jordan (JO_V4)  OR
//      2) Gulf (AWS me-south-1 + me-central-1 IPv4 prefixes)  => “خليجي” عملياً
//    Otherwise: BLOCK (أوروبا تُحجب ضمنياً)
//  - iOS internet check allowed via PROXY (NOT DIRECT)
// ===================================================

// =============== PROXIES ===============
var PM_1="PROXY 212.35.66.45:20001";
var PM_2="PROXY 212.35.66.45:20002";
var PM_3="PROXY 212.35.66.45:20003";
var PM_4="PROXY 212.35.66.45:20004";
var PM_5="PROXY 212.35.66.45:20005";
var PM_FB="PROXY 46.185.131.218:20001";

var PL_1="PROXY 212.35.66.45:443";
var PL_2="PROXY 46.185.131.218:443";

var PW_1="PROXY 212.35.66.45:8080";
var PW_2="PROXY 46.185.131.218:8080";
var PW_3="PROXY 212.35.66.45:3128";
var PW_4="PROXY 46.185.131.218:3128";

var PB="PROXY 0.0.0.0:0";

// =============== JO IPv4 (Broad Jordan) ===============
var JO_V4=[
  ["5.45.128.0",21],
  ["37.202.64.0",18],
  ["37.202.128.0",17],
  ["46.32.96.0",19],
  ["46.185.128.0",17],
  ["77.245.0.0",16],
  ["79.173.192.0",18],
  ["176.28.128.0",17],
  ["176.29.0.0",16],
  ["188.247.64.0",18],
  ["212.35.64.0",19],
  ["212.118.0.0",20]
];

// =============== GULF IPv4 (AWS Middle East Regions) ===============
// me-south-1 (Bahrain) + me-central-1 (UAE) — IPv4 prefixes (curated subset)
var GULF_V4=[
  // me-south-1 (Bahrain)
  ["13.152.0.0",16],
  ["15.184.0.0",16],
  ["15.185.0.0",16],
  ["16.24.0.0",16],
  ["16.25.0.0",16],
  ["18.99.224.0",20],
  ["3.43.192.0",18],
  ["56.184.0.0",16],
  ["56.185.0.0",16],
  ["56.186.0.0",16],
  ["56.187.0.0",16],
  ["99.82.128.0",20],
  ["99.82.144.0",21],
  ["99.82.152.0",22],
  ["99.78.220.0",22],
  ["99.77.147.0",24],
  ["99.77.236.0",24],
  ["157.175.0.0",16],
  ["157.241.0.0",16],
  ["150.247.40.0",24],
  ["150.222.7.0",24],

  // me-central-1 (UAE)
  ["3.28.0.0",15],
  ["40.172.0.0",16],
  ["40.173.0.0",16],
  ["40.174.0.0",15],
  ["51.112.0.0",16],
  ["54.136.0.0",16],
  ["54.137.0.0",16],
  ["99.77.0.0",20],
  ["99.77.16.0",21],
  ["99.77.24.0",22],
  ["99.150.120.0",21],
  ["18.96.96.0",19]
];

// =============== HELPERS ===============
function chain(){var r="";for(var i=0;i<arguments.length;i++){var s=arguments[i];if(s&&s.length)r+=(r?"; ":"")+s;}return r.length?r:PB;}
function getPort(h){var i=h.lastIndexOf(":");if(i>-1&&h.indexOf("]")===-1){var p=parseInt(h.substring(i+1),10);if(!isNaN(p))return p;}return -1;}
function hostIsIP(h){return /^(\d{1,3}\.){3}\d{1,3}$/.test(h);}
function ipToInt(ip){var p=ip.split(".");return((+p[0]<<24)>>>0)+((+p[1]<<16)>>>0)+((+p[2]<<8)>>>0)+(+p[3]>>>0);}
function inCIDR(ip,base,mask){var ipi=ipToInt(ip),bi=ipToInt(base),m=(0xFFFFFFFF<<(32-mask))>>>0;return((ipi&m)===(bi&m));}
function inListCIDR(ip,list){for(var i=0;i<list.length;i++){if(inCIDR(ip,list[i][0],list[i][1]))return true;}return false;}
function isJO(ip){return inListCIDR(ip,JO_V4);}
function isGULF(ip){return inListCIDR(ip,GULF_V4);}

// =============== DOMAIN FIRST ===============
function isPUBG(h){
  h=(h||"").toLowerCase();
  return shExpMatch(h,"*.igamecj.com") ||
         shExpMatch(h,"*.tencent.com") ||
         shExpMatch(h,"*.qq.com") ||
         shExpMatch(h,"*.qcloud.com") ||
         shExpMatch(h,"*.myqcloud.com") ||
         shExpMatch(h,"*.gcloudcs.com") ||
         shExpMatch(h,"*.gcloud.com") ||
         shExpMatch(h,"*.tencent-cloud.net") ||
         shExpMatch(h,"*pubg*") || shExpMatch(h,"*igame*");
}

// iOS “No Internet” checks (still via PROXY)
function isIOSCheck(h){
  h=(h||"").toLowerCase();
  return dnsDomainIs(h,"captive.apple.com") ||
         dnsDomainIs(h,"apple.com") || shExpMatch(h,"*.apple.com") ||
         dnsDomainIs(h,"icloud.com") || shExpMatch(h,"*.icloud.com") ||
         dnsDomainIs(h,"mzstatic.com") || shExpMatch(h,"*.mzstatic.com");
}

// =============== MAIN (NO DIRECT EVER) ===============
function FindProxyForURL(url, host){
  if(!host||!host.length) return PB;
  host=host.toLowerCase();

  // iOS checks through WEB proxy (NOT DIRECT)
  if(isIOSCheck(host)){
    return chain(PW_1,PW_2,PW_3,PW_4,PL_1,PL_2,PB);
  }

  // PUBG ONLY (Tournament/Squad Lock)
  if(!isPUBG(host)) return PB;

  // Resolve only for PUBG
  var ip = hostIsIP(host) ? host : dnsResolve(host);
  if(!ip) return PB;

  // Allow only JO or GULF => blocks Europe implicitly
  if(!(isJO(ip) || isGULF(ip))) return PB;

  var port=getPort(host);

  // Match ports 20001-20005
  if(port>=20001 && port<=20005){
    return chain(PM_1,PM_2,PM_3,PM_4,PM_5,PM_FB,PL_1,PL_2,PW_1,PW_2,PB);
  }

  // Lobby/Login
  if(port===443 || port===80){
    return chain(PL_1,PL_2,PM_1,PM_FB,PW_1,PW_2,PW_3,PW_4,PB);
  }

  // Unknown PUBG port
  return chain(PM_1,PM_FB,PL_1,PL_2,PW_1,PW_2,PB);
}
