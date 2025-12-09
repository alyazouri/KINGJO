// ===================================================
//  PUBG-JO-PROXY PAC — نسخة PUBG فقط
//  - يوجّه ترافيك PUBG عبر 46.32.102.152
//  - تقسيم حسب نوع الترافيك (LOBBY / MATCH / RECRUIT / UPDATES / CDN)
//  - باقي المواقع / التطبيقات = DIRECT 77.245.8.95
// ===================================================

// ---------- إعدادات البروكسي ---------- //

var PROXY_IP = "46.185.131.218";

var FIXED_PORT = {
  LOBBY:          443,    // لوجي / أصدقاء / اجتماعي
  MATCH:          20001,  // ماتش / جيم
  RECRUIT_SEARCH: 443,   // تجنيد / بحث فرق
  UPDATES:        8080,   // تحديثات / API
  CDN:            8080    // تحميل ملفات / CDN
};

// لو حاب تخلي كل الإنترنت عبر البروكسي (مش بس PUBG)
// خلّيها true (افتراضياً false = فقط PUBG عبر البروكسي)
var FORCE_ALL_THROUGH_PROXY = true;


// ---------- دوال مساعدة ---------- //

function proxyFor(role) {
  var port = FIXED_PORT[role] || 443;
  return "PROXY " + PROXY_IP + ":" + port + ";";
}

function isPUBGHost(host) {
  host = host.toLowerCase();

  // أسماء شائعة لـ PUBG Mobile (Tencent / Proximabeta / igamecj / qcloud)
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

  // احتياط: أي دومين فيه pubg
  if (host.indexOf("pubg") !== -1) return true;

  return false;
}

// تصنيف نوع ترافيك PUBG حسب الـ URL / HOST
function classifyPUBGTraffic(url, host) {
  var u = url.toLowerCase();
  var h = host.toLowerCase();

  // LOBBY / SOCIAL / FRIENDS
  if (u.indexOf("lobby") !== -1 ||
      u.indexOf("friend") !== -1 ||
      u.indexOf("social") !== -1 ||
      h.indexOf("social") !== -1) {
    return "LOBBY";
  }

  // MATCH / GAME
  if (u.indexOf("match") !== -1 ||
      u.indexOf("battle") !== -1 ||
      u.indexOf("game") !== -1 ||
      u.indexOf("play") !== -1 ||
      h.indexOf("match") !== -1) {
    return "MATCH";
  }

  // RECRUIT / TEAM SEARCH
  if (u.indexOf("recruit") !== -1 ||
      u.indexOf("team") !== -1 ||
      u.indexOf("squad") !== -1 ||
      u.indexOf("search") !== -1) {
    return "RECRUIT_SEARCH";
  }

  // UPDATES / API / CONFIG
  if (u.indexOf("update") !== -1 ||
      u.indexOf("patch") !== -1 ||
      u.indexOf("version") !== -1 ||
      u.indexOf("config") !== -1 ||
      u.indexOf("api") !== -1) {
    return "UPDATES";
  }

  // CDN / DOWNLOADS / OBB
  if (u.indexOf("cdn") !== -1 ||
      u.indexOf("download") !== -1 ||
      u.indexOf("dl-") !== -1 ||
      u.indexOf(".obb") !== -1 ||
      u.indexOf(".pak") !== -1) {
    return "CDN";
  }

  // افتراضي: اعتبره MATCH (أهم شيء الجيم نفسه على بورت قوي)
  return "MATCH";
}


// ---------- الدالة الرئيسية ---------- //

function FindProxyForURL(url, host) {
  if (!host) return "DIRECT";
  host = host.toLowerCase();

  // استثناءات أساسية (YouTube / Netflix / Social… لو حبيت تضيف لاحقاً)
  // مثال:
  // if (dnsDomainIs(host, "youtube.com") || shExpMatch(host, "*.youtube.com")) {
  //   return "DIRECT";
  // }

  // أولاً: فحص إذا هو ترافيك PUBG
  if (isPUBGHost(host)) {
    var role = classifyPUBGTraffic(url, host);
    return proxyFor(role);
  }

  // لو مفعّل FORCE_ALL_THROUGH_PROXY → كل شيء يمر عبر البروكسي (على بورت LOBBY مثلاً)
  if (FORCE_ALL_THROUGH_PROXY) {
    return proxyFor("LOBBY");
  }

  // غير PUBG → DIRECT
  return "DIRECT";
}
