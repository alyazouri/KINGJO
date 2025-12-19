// JO PAC (NO DIRECT) — Generated 2025-12-19T07:39:38.871875Z
// If no proxies => BLOCK
var DISCOVERED_PROXIES = ["212.118.1.27:8080", "212.118.1.20:8080", "212.118.1.19:8080", "212.118.1.26:8080", "212.118.1.24:8080", "212.118.1.22:8080", "212.118.1.18:8080", "212.118.1.94:1080", "212.118.1.243:8080", "212.118.2.91:8080", "212.118.4.130:8080", "212.118.4.187:8080", "212.118.7.93:1080", "212.118.7.91:1080", "212.118.7.147:8080"];

function FindProxyForURL(url, host) {
  if (!DISCOVERED_PROXIES || DISCOVERED_PROXIES.length === 0) {
    return "PROXY 0.0.0.0:0";
  }
  var chain = "";
  for (var i = 0; i < DISCOVERED_PROXIES.length; i++) {
    if (i > 0) chain += "; ";
    chain += "PROXY " + DISCOVERED_PROXIES[i];
  }
  return chain;
}
