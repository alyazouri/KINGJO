function FindProxyForURL(url, host) {

  // ==================================================
  // JO PROXIES (LONG-TERM TRUST)
  // ==================================================
  var JO_CORE   = "PROXY 82.212.84.33:8080";
  var JO_BACKUP = "PROXY 46.32.102.152:8080";
  var BLOCK    = "PROXY 127.0.0.1:9";

  // ==================================================
  // PEAK HOURS (18:00 → 06:00)
  // ==================================================
  var isPeak =
    timeRange(18, 0, 23, 59) ||
    timeRange(0, 0, 6, 0);

  // ==================================================
  // PUBG DOMAIN & CDN WHITELIST
  // ==================================================
  var isPUBG =
    dnsDomainIs(host, "pubg.com") ||
    shExpMatch(host, "*.pubg.com") ||
    shExpMatch(host, "*.pubgmobile.com") ||
    shExpMatch(host, "*.pubgmobilecdn.com") ||
    shExpMatch(host, "*.krafton.com") ||
    shExpMatch(host, "*.bluehole.net");

  // ==================================================
  // DNS LEAK PROTECTION
  // ==================================================
  if (isPlainHostName(host)) {
    return isPUBG ? JO_CORE : BLOCK;
  }

  // ==================================================
  // NON-PUBG TRAFFIC
  // ==================================================
  if (!isPUBG) {
    return "DIRECT";
  }

  // ==================================================
  // STICKY HASH (SESSION PINNING)
  // ==================================================
  function stickyHash(host) {
    var h = 9;
    for (var i = 0; i < host.length; i++) {
      h = (h * 31 + host.charCodeAt(i)) & 0xffffffff;
    }
    return h & 1;
  }

  // ==================================================
  // MATCH TRAFFIC (UDP)
  // ==================================================
  if (url.substring(0, 4) === "udp:") {
    var port = parseInt((url.match(/:(\d+)/) || [0, 0])[1]);

    // PUBG Game Ports
    if (port >= 10000 && port <= 20099) {

      // 🔒 PEAK MODE – STRICT JO
      if (isPeak) {
        return JO_CORE + "; " + JO_BACKUP;
      }

      // 🧠 OFF-PEAK – SMART JO BIAS
      return stickyHash(host) === 0
        ? JO_CORE + "; " + JO_BACKUP
        : JO_BACKUP + "; " + JO_CORE;
    }

    // Any other UDP from PUBG
    return JO_CORE;
  }

  // ==================================================
  // TCP / HTTPS (LOGIN, LOBBY, STORE, UPDATES)
  // ==================================================
  return isPeak
    ? JO_CORE + "; " + JO_BACKUP   // Strict
    : JO_CORE + "; " + JO_BACKUP;  // Smart
}
