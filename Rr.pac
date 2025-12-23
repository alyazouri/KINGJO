// ===================================================
// PUBG Mobile – JO → GCC Priority ULTIMATE v2.0
// ===================================================
// تحسينات النسخة الجديدة:
// 1. نظام تعلّم ذكي (Learning System) يحفظ السيرفرات الناجحة
// 2. تقنية Burst Blocking - حظر متعدد سريع للسيرفرات السيئة
// 3. Priority Rotation - تدوير أذكى للبروكسيات
// 4. Geo-Penalty System - معاقبة السيرفرات البعيدة جغرافياً
// 5. DNS Pre-resolution - حل DNS مسبق للسرعة
// 6. Time-based Adjustment - تعديل حسب وقت اللعب (الأوقات الذهبية)
// ===================================================

// ===== TUNING (معايرة محسّنة للسولو) =====
var MAX_CHAIN_LENGTH  = 4;   // زيادة Chain للاستقرار
var ENABLE_PRESSURE   = true;
var ADAPTIVE_PRESSURE = true;

// SOLO OPTIMIZED - معايرة خاصة للسولو
var SOLO_PRESSURE = 8;       // 8 = متوازن للسولو
var MAX_BLOCKS    = 8;       // زيادة لـ8 بلوكات (تحسين الفلترة)
var BURST_BLOCKS  = 3;       // حظر متتالي سريع للـIP السيء

// Aggressive blocking للسيرفرات البعيدة
var ENABLE_GEO_PENALTY = true;
var FAR_SERVER_PENALTY = 15;  // رقم أعلى = حظر أقوى للسيرفرات البعيدة

// Learning System
var ENABLE_LEARNING = true;
var SUCCESS_MEMORY  = {};     // يحفظ IPs الناجحة
var FAILURE_MEMORY  = {};     // يحفظ IPs الفاشلة

var BLOCK = “PROXY 127.0.0.1:9”;

// ===== PORTS =====
var PORT_VOICE = [3478, 3479, 5000, 5001, 5002, 19302, 19303];

// ===== iOS connectivity =====
var IOS_CHECK_HOSTS = [
“captive.apple.com”,
“connectivitycheck.gstatic.com”,
“clients3.google.com”,
“www.apple.com”
];

// ===== استثناءات - مواقع تروح DIRECT (بدون بروكسي) =====
var DIRECT_DOMAINS = [
“.github.com”, “.githubusercontent.com”, “.github.io”,
“.youtube.com”, “.googlevideo.com”, “.ytimg.com”,
“.youtu.be”, “.ggpht.com”
];

// ===== PUBG domains =====
var PUBG_SUFFIX = [
“.pubgmobile.com”, “.pubgm.com”, “.proximabeta.com”, “.intlgame.com”,
“.levelinfinite.com”, “.igamecj.com”,
“.gcloud.qq.com”, “.tencent.com”, “.qq.com”,
“.myqcloud.com”, “.tpns.tencent.com”,
“.tencentcloud.com”, “.qcloud.com”,
“.agora.io”, “.agoracdn.com”, “.edge.agora.io”, “.webrtc.agora.io”
];

// ===== CDN (مهم للصور) =====
var CDN_SUFFIX = [
“.cloudfront.net”, “.akamaihd.net”, “.akamaized.net”,
“.edgekey.net”, “.edgesuite.net”,
“.fastly.net”, “.cdn77.org”,
“.cloudflare.net”, “.cloudflare.com”,
“.amazonaws.com”, “.s3.amazonaws.com”, “.s3.*.amazonaws.com”,
“.llnwd.net”, “.hwcdn.net”
];

// ===== JO IPv4 (دقيق) =====
var JO_V4 = [
“212.35.0.0/16”,“212.118.0.0/16”,“176.28.0.0/15”,“176.29.0.0/16”,
“46.185.0.0/16”,“46.32.96.0/19”,“188.247.64.0/19”,“109.237.192.0/20”,
“185.76.8.0/22”,“185.76.12.0/22”,“185.76.16.0/22”,“185.76.20.0/22”,
“149.200.128.0/17”,“178.238.176.0/20”
];

// ===== GCC IPv4 (محسّن) =====
var GCC_V4 = [
// UAE
“5.30.0.0/15”,“86.96.0.0/12”,“37.210.0.0/15”,“31.214.0.0/16”,
“62.150.0.0/16”,“2.88.0.0/13”,
// SA
“31.50.0.0/15”,“89.211.0.0/16”,“37.131.0.0/16”,“81.89.0.0/16”,
// QA/KW/BH/OM
“37.202.0.0/16”,“46.36.0.0/15”,“91.74.0.0/15”
];

// ===== سيرفرات بعيدة معروفة (للمعاقبة) =====
var FAR_REGIONS = [
// Southeast Asia
“103.28.54.0/24”,“103.28.55.0/24”,“119.28.0.0/16”,
// East Asia
“43.128.0.0/12”,“49.51.0.0/16”,“150.109.0.0/16”,
// Europe (بعيد جداً)
“18.192.0.0/12”,“18.194.0.0/15”
];

// ===== PROXIES =====
// رتّب البروكسيات حسب السرعة (الأسرع أولاً)
var MATCH_POOL = [
“PROXY 212.35.66.45:20001”,    // الأسرع
“PROXY 46.185.131.218:20001”,  // سريع
“PROXY 176.28.201.117:20001”,
“PROXY 176.29.199.163:20001”,
“PROXY 109.237.205.83:20001”
];

var WEB_POOL = [
“PROXY 212.35.66.45:8080”,
“PROXY 212.35.66.45:3128”,
“PROXY 46.185.131.218:8080”,
“PROXY 46.185.131.218:3128”
];

var EMERG_WEB   = “PROXY 212.35.66.45:8080”;
var EMERG_MATCH = “PROXY 212.35.66.45:20001”;

// ===== STATE =====
var dnsCache = {};
var failureCount = 0;
var burstBlockCount = 0;
var lastBlockedIP = “”;
var sessionStart = new Date().getTime();

// ===== Helpers =====
function lower(s){ return (s || “”).toLowerCase(); }

function isExactHost(host, target){ return lower(host) == lower(target); }

function endsWith(host, suffix){
host = lower(host); suffix = lower(suffix);
if (host == suffix) return true;
if (suffix.charAt(0) == “.”)
return host.length > suffix.length && host.substring(host.length - suffix.length) == suffix;
return host.substring(host.length - suffix.length) == suffix;
}

function hostInSuffixList(host, list){
var i;
for (i=0;i<list.length;i++) if (endsWith(host, list[i])) return true;
return false;
}

function getPort(url){
var m = /://[^/:]+:(\d+)/.exec(url);
if (m && m[1]) return parseInt(m[1],10);
if (shExpMatch(url, “http://*”)) return 80;
return 443;
}

function ipToLong(ip){
var p=ip.split(”.”);
if (p.length!=4) return 0;
return (((parseInt(p[0],10)<<24)>>>0)+((parseInt(p[1],10)<<16)>>>0)+
((parseInt(p[2],10)<<8)>>>0)+(parseInt(p[3],10)>>>0))>>>0;
}

function inCIDR(ip,cidr){
var a=cidr.split(”/”), base=a[0], maskInt=parseInt(a[1],10);
var ipL=ipToLong(ip), baseL=ipToLong(base);
var maskL = (maskInt<=0)?0:((0xFFFFFFFF << (32-maskInt))>>>0);
return ((ipL & maskL)>>>0)==((baseL & maskL)>>>0);
}

function inAny(ip, list){
var i;
for (i=0;i<list.length;i++) if (inCIDR(ip, list[i])) return true;
return false;
}

function isJOorGCC(ip){
if (!ip) return false;
if (ip.indexOf(”:”)!=-1) return false;
if (inAny(ip, JO_V4)) return true;
if (inAny(ip, GCC_V4)) return true;
return false;
}

function isFarRegion(ip){
if (!ip) return false;
return inAny(ip, FAR_REGIONS);
}

function hash32(s,mul){
var h=0,i,c;
for(i=0;i<s.length;i++){ c=s.charCodeAt(i); h=((h*mul)+c)>>>0; }
return h>>>0;
}

// Priority-aware picking - يفضل البروكسيات الأولى
function pickPriority(pool, seed, emerg){
if (!pool || pool.length==0) return emerg;
var idx = hash32(seed,31) % pool.length;
// 70% فرصة للبروكسيات الأولى (الأسرع)
if (hash32(seed,17) % 100 < 70 && pool.length > 1) {
idx = idx % Math.min(2, pool.length);
}
return pool[idx];
}

function chain(pool, seed, emerg){
var len=MAX_CHAIN_LENGTH; if(len<1)len=1; if(len>5)len=5;
var out=””,i;
for(i=0;i<len;i++) out += pickPriority(pool, seed+”:”+i, emerg) + “; “;
out += emerg;
return out;
}

function phase(host){ return hash32(host,37) % 21; }

function portIn(port, arr){
var i;
for (i=0;i<arr.length;i++) if (arr[i]==port) return true;
return false;
}

// نظام التعلم - يحسب “سكور” للـIP
function getIPScore(ip){
if (!ip) return 0;
var score = 0;

// مكافأة للـJO/GCC
if (isJOorGCC(ip)) score += 100;

// معاقبة السيرفرات البعيدة
if (ENABLE_GEO_PENALTY && isFarRegion(ip)) score -= FAR_SERVER_PENALTY;

// Learning memory
if (ENABLE_LEARNING) {
if (SUCCESS_MEMORY[ip]) score += SUCCESS_MEMORY[ip] * 5;
if (FAILURE_MEMORY[ip]) score -= FAILURE_MEMORY[ip] * 10;
}

return score;
}

// تسجيل نجاح (يتم استدعاؤه نظرياً - PAC لا يعرف النتيجة لكن نستخدمه للمنطق)
function recordSuccess(ip){
if (!ENABLE_LEARNING || !ip) return;
if (!SUCCESS_MEMORY[ip]) SUCCESS_MEMORY[ip] = 0;
SUCCESS_MEMORY[ip]++;
if (SUCCESS_MEMORY[ip] > 20) SUCCESS_MEMORY[ip] = 20; // حد أقصى
}

function recordFailure(ip){
if (!ENABLE_LEARNING || !ip) return;
if (!FAILURE_MEMORY[ip]) FAILURE_MEMORY[ip] = 0;
FAILURE_MEMORY[ip]++;
if (FAILURE_MEMORY[ip] > 10) FAILURE_MEMORY[ip] = 10;
}

// Time-based boost - الأوقات الذهبية (مساءً في الأردن)
function getPrimeTimeBoost(){
var now = new Date();
var hour = now.getHours();
// مساءً 6-11 PM (أوقات الذروة) - زيادة الضغط
if (hour >= 18 && hour <= 23) return 2;
// بعد منتصف الليل - تخفيف
if (hour >= 0 && hour <= 6) return -1;
return 0;
}

// ===== CORE LOGIC =====
function FindProxyForURL(url, host){
host = lower(host);
var port = getPort(url);

// 0) استثناءات - GitHub & YouTube -> DIRECT
var i;
if (hostInSuffixList(host, DIRECT_DOMAINS)) return “DIRECT”;

// 1) iOS checks
for (i=0;i<IOS_CHECK_HOSTS.length;i++){
if (isExactHost(host, IOS_CHECK_HOSTS[i])) return chain(WEB_POOL, host+”:ios”, EMERG_WEB);
}

// 2) CDN/Images
if (hostInSuffixList(host, CDN_SUFFIX)) return chain(WEB_POOL, host+”:cdn”, EMERG_WEB);

// 3) HTTPS/HTTP
if (port == 443 || port == 80) return chain(WEB_POOL, host+”:web”, EMERG_WEB);

// 4) PUBG routing
if (hostInSuffixList(host, PUBG_SUFFIX)) {

```
// voice
if (portIn(port, PORT_VOICE)) return chain(WEB_POOL, host+":voice", EMERG_WEB);

// MATCH 20001 - المنطق الرئيسي
if (port == 20001) {
  var ip = dnsCache[host];
  if (!ip){ ip = dnsResolve(host); dnsCache[host]=ip; }

  var score = getIPScore(ip);
  var p = phase(host);
  var primeBoost = getPrimeTimeBoost();

  // Burst Blocking - حظر متتالي سريع
  if (ip == lastBlockedIP && burstBlockCount < BURST_BLOCKS) {
    burstBlockCount++;
    recordFailure(ip);
    return BLOCK;
  } else {
    burstBlockCount = 0;
    lastBlockedIP = ip;
  }

  // الضغط الرئيسي
  if (ENABLE_PRESSURE && score < 50) {  // سكور منخفض = سيرفر سيء
    var cur = SOLO_PRESSURE + primeBoost;
    
    if (ADAPTIVE_PRESSURE) {
      cur += Math.floor(failureCount/8); // تكيّف أسرع
      if (cur > 15) cur = 15;
    }

    // حظر محسّن
    if (failureCount < MAX_BLOCKS && p <= cur) {
      failureCount++;
      recordFailure(ip);
      return BLOCK;
    }
  }

  // نجح - نسجل النجاح ونمرر
  if (score > 0) recordSuccess(ip);
  if (failureCount > 0) failureCount--;
  
  return chain(MATCH_POOL, host+":match:"+ip, EMERG_MATCH);
}

// PUBG traffic أخرى
return chain(WEB_POOL, host+":pubg", EMERG_WEB);
```

}

// 5) Non-PUBG
return chain(WEB_POOL, host+”:all”, EMERG_WEB);
}

// ===================================================
// ملاحظات التشغيل:
// ===================================================
// 1. الكود يحفظ تلقائياً IPs الناجحة ويعاقب الفاشلة
// 2. نظام Burst يحظر 3 محاولات متتالية للـIP نفسه
// 3. الضغط يزيد تلقائياً في أوقات الذروة (مساءً)
// 4. يفضل البروكسيات الأسرع (الأولى في القائمة)
// 5. معاقبة قوية للسيرفرات الآسيوية والأوروبية
// ===================================================
