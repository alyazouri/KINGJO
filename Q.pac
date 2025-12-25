var JO_STRONG = [
  ["212.35.64.0",19], ["46.185.128.0",17], ["77.245.0.0",16],
  ["176.28.128.0",17], ["37.202.64.0",18]
];

var POWER_PORTS = [20004,20005,9030,10010,10650];  // بورتات القوة
var MATCH_PORTS = [20001,20002,20003,20004,20005];
var JO_P = "212.35.66.45";
var FB_P = "46.185.131.218";
var BLOCK = "PROXY 0.0.0.0:0";

function ip2int(ip) {
  var p=ip.split(".").map(function(n){return+n});
  return (p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3];
}

function inCIDR(ip,base,mask) {
  var ipi=ip2int(ip), bi=ip2int(base);
  return (ipi&(0xFFFFFFFF<<(32-mask)))===(bi&(0xFFFFFFFF<<(32-mask)));
}

function isJO(ip) {
  for(var i=0;i<JO_STRONG.length;i++) {
    if(inCIDR(ip,JO_STRONG[i][0],JO_STRONG[i][1])) return true;
  }
  return false;
}

function isPUBG(h) {
  h=h.toLowerCase();
  return shExpMatch(h,"*.igamecj.com")||shExpMatch(h,"*.tencent.com")||
         shExpMatch(h,"*pubg*")||shExpMatch(h,"*igame*");
}

function getPort(h) {
  var i=h.lastIndexOf(":");
  return i>-1?parseInt(h.substr(i+1)):0;
}

function isIP(h) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(h);
}

function FindProxyForURL(url,host) {
  if(!host) return BLOCK;
  host=host.toLowerCase();
  
  // Apple
  if(shExpMatch(host,"*.apple.com")||shExpMatch(host,"*.icloud.com")) {
    return "PROXY "+JO_P+":8080;PROXY "+JO_P+":443;"+BLOCK;
  }
  
  if(!isPUBG(host)) return BLOCK;
  
  var ip=isIP(host)?host:dnsResolve(host);
  if(!ip||!isJO(ip)) return BLOCK;
  
  var port=getPort(host);
  
  // 🔥 بورتات القوة أولوية مطلقة
  if(POWER_PORTS.indexOf(port)>-1) {
    return "PROXY "+JO_P+":20004;PROXY "+JO_P+":20005;PROXY "+FB_P+":20001;"+BLOCK;
  }
  
  // باقي الماتش
  if(MATCH_PORTS.indexOf(port)>-1) {
    return "PROXY "+JO_P+":20001;PROXY "+JO_P+":20002;PROXY "+JO_P+":20003;PROXY "+JO_P+":20004;PROXY "+FB_P+":20001;"+BLOCK;
  }
  
  return "PROXY "+JO_P+":443;PROXY "+JO_P+":8080;"+BLOCK;
}
