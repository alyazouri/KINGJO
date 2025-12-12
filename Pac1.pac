# -*- coding: utf-8 -*-
#!/usr/bin/env python3

import json, time, ipaddress
from collections import defaultdict
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# ===================== CONFIG =====================

LOG_FILE = "sessions.jsonl"
PAC_FILE = "pubg_auto.pac"

PAC_PORT = 8080
CACHE_TTL_SEC = 10

# Proxies (خليهم زي ما عندك — إذا ما عندك بروكسي لا تستخدم PAC أساسًا)
PROXY_MATCH = "PROXY 212.35.66.45:20001"
PROXY_LOBBY = "PROXY 212.35.66.45:443"
PROXY_FALL  = "PROXY 46.185.131.218:443"

# Seed JO ranges (Day-1)
SEED_JO = [
  "46.185.128.0/17",
  "213.139.64.0/18",
  "213.140.0.0/17",
  "37.202.64.0/18",
  "46.32.96.0/19",
  "82.212.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20"
]

# Learning knobs
SCORE_THRESHOLD = 4          # أسهل للتعلّم
CIDR_MAX_PREFIX = 22         # /22 أو أوسع
PRIME_BONUS     = 2          # ذروة الأردن
MATCH_BONUS     = 2          # نعطي وزن للماتش أكثر

def is_prime_hour(h):
    return (20 <= h <= 23) or (0 <= h <= 1)

# ===================== LEARNING =====================

def append_log(ip: str, port: int, score_hint: int = 1):
    e = {
        "ip": ip,
        "port": int(port),
        "hour": time.localtime().tm_hour,
        "ts": time.time(),
        "hint": int(score_hint)  # بدل RTT probing (PUBG كثير يسكره)
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(e, ensure_ascii=True) + "\n")

def load_scores():
    scores = defaultdict(int)
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    e = json.loads(line)
                except Exception:
                    continue

                ip = e.get("ip")
                if not ip:
                    continue

                port = int(e.get("port", 0))
                hr   = int(e.get("hour", 0))
                hint = int(e.get("hint", 1))

                # base confidence
                scores[ip] += hint

                # boost prime time
                if is_prime_hour(hr):
                    scores[ip] += PRIME_BONUS

                # boost match ports (you can add by using /add?port=20001)
                if port in (20001, 10012):
                    scores[ip] += MATCH_BONUS
    except FileNotFoundError:
        pass

    return scores

def best_ips():
    scores = load_scores()
    return [ip for ip, sc in scores.items() if sc >= SCORE_THRESHOLD]

def collapse_to_cidr(ips):
    nets = [ipaddress.ip_network(f"{ip}/32", strict=False) for ip in ips]
    merged = list(ipaddress.collapse_addresses(nets))
    out = []
    for n in merged:
        if n.prefixlen <= CIDR_MAX_PREFIX:
            out.append(str(n))
    return out

# ===================== PAC GENERATION (SMART) =====================

PAC_TEMPLATE = """// PUBG JO AUTO PAC (SMART FINAL)
// Seed + Learned | NO DIRECT | SMART fallback

var PMATCH = "{PMATCH}";
var PLOBBY = "{PLOBBY}";
var PFALL  = "{PFALL}";
var BLOCK  = "PROXY 0.0.0.0:0";

var MATCH = [20001,10012];
var LOBBY = [443];
var UPD   = [80];

var JO = [
{JO_NETS}
];

function L(ip){{var p=ip.split('.');return((+p[0]<<24)>>>0)+(+p[1]<<16)+(+p[2]<<8)+(+p[3]);}}
function C(ip,c){{var x=c.split('/');var m=-1<<(32-+x[1]);return(L(ip)&m)===(L(x[0])&m);}}
function isJO(ip){{for(var i=0;i<JO.length;i++) if(C(ip,JO[i])) return true; return false;}}
function P(p,a){{for(var i=0;i<a.length;i++) if(p==a[i]) return true; return false;}}

// SMART: JO preferred, otherwise fallback (no hard-block loops)
function FindProxyForURL(url,host){{
  var ip = dnsResolve(host);
  if(!ip) return PLOBBY;

  if(P(myPort,MATCH)) return isJO(ip)?PMATCH:PFALL;
  if(P(myPort,LOBBY)) return isJO(ip)?PLOBBY:PFALL;
  if(P(myPort,UPD)) return PFALL;

  return PFALL;
}}
"""

_last_build_ts = 0
_last_pac_text = None

def build_pac_text():
    global _last_build_ts, _last_pac_text
    now = time.time()
    if _last_pac_text is not None and (now - _last_build_ts) < CACHE_TTL_SEC:
        return _last_pac_text

    ips = best_ips()
    learned = collapse_to_cidr(ips)
    merged = list(dict.fromkeys(SEED_JO + learned))

    jo_lines = ",\n".join([f'  "{c}"' for c in merged])

    pac = PAC_TEMPLATE.format(
        PMATCH=PROXY_MATCH,
        PLOBBY=PROXY_LOBBY,
        PFALL=PROXY_FALL,
        JO_NETS=jo_lines
    )

    with open(PAC_FILE, "w", encoding="utf-8") as f:
        f.write(pac)

    _last_build_ts = now
    _last_pac_text = pac
    print(f"[PAC] seed={len(SEED_JO)} learned={len(learned)} total={len(merged)}")
    return pac

# ===================== HTTP SERVER =====================

class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body, ctype="text/plain; charset=utf-8"):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)

        if path == "/pac":
            pac = build_pac_text()
            self._send(200, pac, "application/x-ns-proxy-autoconfig; charset=utf-8")
            return

        # add a "good session" manually:
        # /add?ip=1.2.3.4&port=20001&hint=3
        if path == "/add":
            ip = (qs.get("ip", [""])[0] or "").strip()
            port = int((qs.get("port", ["443"])[0] or "443"))
            hint = int((qs.get("hint", ["2"])[0] or "2"))

            try:
                ipaddress.IPv4Address(ip)
            except Exception:
                self._send(400, "bad ip")
                return

            append_log(ip, port, hint)

            # bust cache
            global _last_build_ts, _last_pac_text
            _last_build_ts = 0
            _last_pac_text = None

            self._send(200, f"logged ip={ip} port={port} hint={hint}")
            return

        if path == "/status":
            scores = load_scores()
            top = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:30]
            lines = [
                "OK",
                f"pac=http://IP:{PAC_PORT}/pac",
                f"seed_nets={len(SEED_JO)}",
                f"unique_ips={len(scores)}",
                "",
                "TOP:"
            ]
            for ip, sc in top:
                lines.append(f"{ip} score={sc}")
            self._send(200, "\n".join(lines))
            return

        self._send(200, "Endpoints:\n/pac\n/add?ip=IP&port=20001&hint=3\n/status\n")

def run():
    print(f"PAC server running at http://IP:{PAC_PORT}/pac")
    httpd = HTTPServer(("0.0.0.0", PAC_PORT), Handler)
    httpd.serve_forever()

if __name__ == "__main__":
    run()
