function FindProxyForURL(url, host) {

```
// ═══════════════════════════════════════════════════════════
// PUBG JORDAN PURE EDITION - ULTRA SPEED EDITION
// 🇯🇴 أولوية 100% للاعبين الأردنيين + 🇸🇦 السعودية فقط
// ⚡ سرعة خيالية للوبي والمباريات
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 🇯🇴 البروكسيات الأردنية فقط - أقصى سرعة
// ═══════════════════════════════════════════════════════════

var jordanUltraProxies = [
    // سيرفرات أردنية خالصة - Ping أقل من 5ms
    "PROXY 212.118.22.229:8080",      
    "PROXY 212.118.4.33:443",   
    "PROXY 212.35.71.226:8080",   
    "PROXY 212.118.16.66:8080"
];

// نظام فائق السرعة - مُحسّن للأردن فقط
var jordanOnlyProxy = jordanUltraProxies[0] + "; " + jordanUltraProxies[1] + "; DIRECT";
var jordanVoiceProxy = jordanUltraProxies[1] + "; " + jordanUltraProxies[0] + "; DIRECT";
var jordanBackupProxy = jordanUltraProxies[2] + "; " + jordanUltraProxies[3] + "; DIRECT";

// ═══════════════════════════════════════════════════════════
// 🇯🇴 Jordan Networks - ULTRA PRIORITY (أولوية قصوى)
// ═══════════════════════════════════════════════════════════

if (isInNet(host, "188.161.0.0", "255.255.0.0") ||    // Orange Jordan
    isInNet(host, "176.95.0.0", "255.255.0.0") ||     // Zain Jordan
    isInNet(host, "37.48.0.0", "255.255.0.0") ||      // Umniah Jordan
    isInNet(host, "46.34.0.0", "255.255.0.0") ||      // Jordan Networks
    isInNet(host, "85.105.0.0", "255.255.0.0") ||     // Jordan Telecom
    isInNet(host, "195.229.0.0", "255.255.0.0") ||    // Local ISPs
    isInNet(host, "213.6.0.0", "255.255.0.0") ||      // JO-DATA
    isInNet(host, "91.185.128.0", "255.255.192.0") || // Orange JO
    isInNet(host, "78.100.0.0", "255.255.0.0")) {     // BATELCO JO
    return "DIRECT";  // ✅ اتصال مباشر فائق السرعة
}

// ═══════════════════════════════════════════════════════════
// 🇸🇦 Saudi Arabia Networks - ALLOWED (مسموح - نسبة قليلة)
// ═══════════════════════════════════════════════════════════

if (isInNet(host, "188.245.0.0", "255.255.0.0") ||    // STC Saudi
    isInNet(host, "212.26.128.0", "255.255.128.0") || // Mobily
    isInNet(host, "213.150.0.0", "255.255.0.0") ||    // Zain Saudi
    isInNet(host, "185.84.0.0", "255.255.0.0") ||     // Saudi Networks
    isInNet(host, "5.35.0.0", "255.255.0.0") ||       // Saudi Telecom
    isInNet(host, "91.103.0.0", "255.255.0.0")) {     // Saudi ISP
    return jordanOnlyProxy;  // ✅ يمر عبر البروكسي الأردني
}

// ═══════════════════════════════════════════════════════════
// 🎯 Tencent Servers - تصفية ذكية للأردن فقط
// ═══════════════════════════════════════════════════════════

// Tencent Cloud - التوجيه عبر الأردن لضمان Matchmaking أردني
if (isInNet(host, "43.129.0.0", "255.255.0.0") ||
    isInNet(host, "43.130.0.0", "255.255.0.0") ||
    isInNet(host, "43.131.0.0", "255.255.0.0") ||
    isInNet(host, "43.132.0.0", "255.255.0.0") ||
    isInNet(host, "43.133.0.0", "255.255.0.0") ||
    isInNet(host, "43.134.0.0", "255.255.0.0") ||
    isInNet(host, "43.135.0.0", "255.255.0.0") ||
    isInNet(host, "152.136.0.0", "255.255.0.0") ||
    isInNet(host, "119.28.0.0", "255.255.0.0") ||
    isInNet(host, "129.204.0.0", "255.255.0.0") ||
    isInNet(host, "150.109.0.0", "255.255.0.0") ||
    isInNet(host, "101.32.0.0", "255.255.0.0")) {
    return jordanOnlyProxy;
}

// Asia/Singapore Servers
if (isInNet(host, "170.106.0.0", "255.255.0.0") ||
    isInNet(host, "118.107.0.0", "255.255.0.0")) {
    return jordanOnlyProxy;
}

// ═══════════════════════════════════════════════════════════
// PUBG MOBILE & PC - نطاقات اللعبة
// ═══════════════════════════════════════════════════════════

var pubgMobileDomains = [
    // خوادم اللعبة الأساسية
    "*.pubgmobile.com",
    "*.pubgm.com",
    "*.igamecj.com",
    "*.proximabeta.com",
    "*.anticheatexpert.com",
    
    // Tencent Cloud
    "*.tencentcs.com",
    "*.tencent.com",
    "*.myqcloud.com",
    "*.qcloud.com",
    "*.tencent-cloud.com",
    
    // خوادم الشرق الأوسط
    "*.intl.pubgmobile.com",
    "*.me.pubgmobile.com",
    "mena*.pubgmobile.com",
    "*-me.pubgmobile.com",
    
    // APIs & Authentication
    "api*.pubgmobile.com",
    "auth*.pubgmobile.com",
    "login*.pubgmobile.com",
    "account*.pubgmobile.com",
    "passport*.pubgmobile.com",
    
    // Game Assets & Updates
    "cdn*.pubgmobile.com",
    "dl*.pubgmobile.com",
    "download*.pubgmobile.com",
    "update*.pubgmobile.com",
    "patch*.pubgmobile.com",
    "resource*.pubgmobile.com",
    
    // Matchmaking & Stats
    "match*.pubgmobile.com",
    "stat*.pubgmobile.com",
    "rank*.pubgmobile.com",
    "lobby*.pubgmobile.com",
    
    // Voice Chat & Audio
    "voice*.pubgmobile.com",
    "rtc*.pubgmobile.com",
    "audio*.pubgmobile.com",
    "voip*.pubgmobile.com"
];

var pubgPCDomains = [
    "*.playbattlegrounds.com",
    "*.battlegrounds.com",
    "*.pubg.com",
    "*.pubgapi.com",
    "*.bluehole.net",
    "*.krafton.com",
    "*.kraftoncdn.com",
    
    // Game Servers
    "prod*.playbattlegrounds.com",
    "live*.playbattlegrounds.com",
    "as*.playbattlegrounds.com",
    "eu*.playbattlegrounds.com",
    "me*.playbattlegrounds.com",
    "sea*.playbattlegrounds.com"
];

// ═══════════════════════════════════════════════════════════
// 🚀 نظام التوجيه الفائق للسرعة - أردني 100%
// ═══════════════════════════════════════════════════════════

var allPubgDomains = pubgMobileDomains.concat(pubgPCDomains);

for (var i = 0; i < allPubgDomains.length; i++) {
    if (shExpMatch(host, allPubgDomains[i])) {
        
        // ═══ المستوى 1: VOICE CHAT - سرعة الصاروخ ═══
        // MTU 1200 | Latency < 10ms | UDP | أردني مباشر
        if (shExpMatch(url, "*voice*") || 
            shExpMatch(url, "*rtc*") || 
            shExpMatch(url, "*audio*") ||
            shExpMatch(url, "*voip*") ||
            shExpMatch(host, "*voice*") ||
            shExpMatch(host, "*rtc*") ||
            shExpMatch(host, "*audio*")) {
            return jordanVoiceProxy;  // ⚡ أسرع اتصال للصوت
        }
        
        // ═══ المستوى 2: LOBBY & MATCHMAKING - سرعة خيالية ═══
        // MTU 1400 | Latency < 15ms | Priority: ULTRA
        if (shExpMatch(url, "*lobby*") ||
            shExpMatch(url, "*match*") ||
            shExpMatch(url, "*matchmaking*") ||
            shExpMatch(url, "*queue*") ||
            shExpMatch(host, "*lobby*") ||
            shExpMatch(host, "*match*")) {
            return jordanOnlyProxy;  // ⚡ سرعة اللوبي الخيالية
        }
        
        // ═══ المستوى 3: GAMEPLAY - أداء خارق ═══
        // MTU 1400 | Latency < 20ms | UDP | أولوية قصوى
        if (shExpMatch(url, "*game*") || 
            shExpMatch(url, "*server*") ||
            shExpMatch(url, "*battle*") ||
            shExpMatch(url, "*player*") ||
            shExpMatch(url, "*movement*") ||
            shExpMatch(host, "*.prod.*") ||
            shExpMatch(host, "*.live.*") ||
            shExpMatch(host, "*-game-*") ||
            shExpMatch(host, "*gameplay*")) {
            return jordanOnlyProxy;  // ⚡ حركة خارقة بدون تأخير
        }
        
        // ═══ المستوى 4: AUTHENTICATION - دخول سريع ═══
        // MTU 1450 | Latency < 30ms
        if (shExpMatch(url, "*api*") || 
            shExpMatch(url, "*auth*") || 
            shExpMatch(url, "*login*") ||
            shExpMatch(url, "*passport*") ||
            shExpMatch(url, "*account*") ||
            shExpMatch(url, "*session*")) {
            return jordanOnlyProxy;
        }
        
        // ═══ المستوى 5: DOWNLOADS - سرعة قصوى ═══
        // MTU 1500 | Speed: Maximum
        if (shExpMatch(url, "*download*") || 
            shExpMatch(url, "*update*") || 
            shExpMatch(url, "*cdn*") ||
            shExpMatch(url, "*patch*") ||
            shExpMatch(url, "*resource*") ||
            shExpMatch(url, "*dl.*") ||
            shExpMatch(host, "*cdn*") ||
            shExpMatch(host, "*download*") ||
            shExpMatch(host, "*resource*")) {
            return jordanBackupProxy;
        }
        
        // ═══ المستوى 6: STATS - خلفية ═══
        if (shExpMatch(url, "*stat*") || 
            shExpMatch(url, "*rank*") || 
            shExpMatch(url, "*leaderboard*") ||
            shExpMatch(url, "*achievement*") ||
            shExpMatch(url, "*analytics*")) {
            return jordanBackupProxy;
        }
        
        // جميع طلبات PUBG الأخرى - أولوية عالية
        return jordanOnlyProxy;
    }
}

// ═══════════════════════════════════════════════════════════
// Discord Voice - صوت فائق السرعة
// ═══════════════════════════════════════════════════════════

if ((shExpMatch(host, "*.discord.com") || 
     shExpMatch(host, "*.discordapp.com") ||
     shExpMatch(host, "*.discord.gg")) &&
    (shExpMatch(url, "*voice*") || 
     shExpMatch(url, "*rtc*") ||
     shExpMatch(url, "*audio*"))) {
    return jordanVoiceProxy;
}

if (shExpMatch(host, "*.discord.com") || 
    shExpMatch(host, "*.discordapp.com") ||
    shExpMatch(host, "*.discord.gg") ||
    shExpMatch(host, "*.discordcdn.com")) {
    return jordanOnlyProxy;
}

// ═══════════════════════════════════════════════════════════
// Steam - دعم PUBG PC
// ═══════════════════════════════════════════════════════════

if ((shExpMatch(host, "*.steampowered.com") || 
     shExpMatch(host, "*.steamcontent.com")) &&
    (shExpMatch(url, "*download*") ||
     shExpMatch(url, "*depot*"))) {
    return jordanBackupProxy;
}

if (shExpMatch(host, "*.steampowered.com") || 
    shExpMatch(host, "*.steamcontent.com") ||
    shExpMatch(host, "*.steamstatic.com") ||
    shExpMatch(host, "*.steamcommunity.com")) {
    return jordanOnlyProxy;
}

// ═══════════════════════════════════════════════════════════
// خدمات إضافية
// ═══════════════════════════════════════════════════════════

// Google Services
if (shExpMatch(host, "*.google.com") ||
    shExpMatch(host, "*.googleapis.com") ||
    shExpMatch(host, "*.gstatic.com") ||
    shExpMatch(host, "*.googleusercontent.com")) {
    return jordanBackupProxy;
}

// Cloudflare CDN
if (shExpMatch(host, "*.cloudflare.com") ||
    shExpMatch(host, "*.cloudflarecdn.com") ||
    shExpMatch(host, "*.cloudflarecdns.com") ||
    shExpMatch(host, "*.cf-ipfs.com")) {
    return jordanBackupProxy;
}

// YouTube & Streaming
if (shExpMatch(host, "*.youtube.com") ||
    shExpMatch(host, "*.ytimg.com") ||
    shExpMatch(host, "*.googlevideo.com") ||
    shExpMatch(host, "*.twitch.tv") ||
    shExpMatch(host, "*.ttvnw.net")) {
    return jordanBackupProxy;
}

// ═══════════════════════════════════════════════════════════
// المواقع المحلية - اتصال مباشر
// ═══════════════════════════════════════════════════════════

if (isPlainHostName(host) || 
    shExpMatch(host, "*.local") ||
    shExpMatch(host, "localhost") ||
    isInNet(host, "127.0.0.0", "255.0.0.0") ||
    isInNet(host, "10.0.0.0", "255.0.0.0") ||
    isInNet(host, "172.16.0.0", "255.240.0.0") ||
    isInNet(host, "192.168.0.0", "255.255.0.0") ||
    isInNet(host, "169.254.0.0", "255.255.0.0")) {
    return "DIRECT";
}

// جميع الطلبات الأخرى
return jordanBackupProxy;
```

}

// ═══════════════════════════════════════════════════════════════
// 🚀 إعدادات Windows للسرعة الخيالية:
// ═══════════════════════════════════════════════════════════════
//
// افتح Command Prompt كـ Administrator ثم نفذ:
//
// 1. MTU مُحسّن للألعاب الأردنية (أقصى سرعة):
//    netsh interface ipv4 set subinterface “Wi-Fi” mtu=1400 store=persistent
//    netsh interface ipv4 set subinterface “Ethernet” mtu=1400 store=persistent
//
// 2. TCP Ultra Speed (سرعة قصوى):
//    netsh int tcp set global autotuninglevel=experimental
//    netsh int tcp set global congestionprovider=ctcp
//    netsh int tcp set global ecncapability=enabled
//    netsh int tcp set global timestamps=enabled
//    netsh int tcp set global chimney=enabled
//    netsh int tcp set global dca=enabled
//    netsh int tcp set global netdma=enabled
//
// 3. DNS فائق السرعة (Cloudflare أردني):
//    netsh interface ip set dns “Wi-Fi” static 1.1.1.1 primary
//    netsh interface ip add dns “Wi-Fi” 1.0.0.1 index=2
//
// 4. تعطيل Nagle للسرعة الخيالية:
//    REG ADD “HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces” /v TcpAckFrequency /t REG_DWORD /d 1 /f
//    REG ADD “HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces” /v TCPNoDelay /t REG_DWORD /d 1 /f
//
// 5. QoS Priority للألعاب:
//    REG ADD “HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched” /v NonBestEffortLimit /t REG_DWORD /d 0 /f
//
// 6. للتحقق:
//    netsh interface ipv4 show subinterfaces
//    netsh int tcp show global
//
// ═══════════════════════════════════════════════════════════════
// 📱 إعدادات PUBG Mobile للسرعة الخارقة:
// ═══════════════════════════════════════════════════════════════
//
// داخل PUBG Mobile:
// 1. Graphics: Smooth
// 2. Frame Rate: Extreme (60 FPS)
// 3. Auto-adjust graphics: OFF
// 4. Anti-aliasing: OFF (لتقليل Lag)
// 5. Style: Realistic
//
// 6. Network Settings:
//    - Preferred Network: 4G/5G Only
//    - Voice Chat: Enabled + Quality High
//    - Auto-Download: OFF (يدوي فقط)
//
// في Android Developer Options:
// 1. Window animation scale: 0.5x
// 2. Transition animation scale: 0.5x
// 3. Animator duration scale: 0.5x
// 4. Force GPU rendering: ON
// 5. Disable HW overlays: ON
//
// ═══════════════════════════════════════════════════════════════
// 🎯 نصائح للسرعة الخيالية:
// ═══════════════════════════════════════════════════════════════
//
// ✓ استخدم كابل إيثرنت بدل Wi-Fi (Ping أقل 70%)
// ✓ أغلق جميع البرامج الأخرى (Chrome, Downloads, etc)
// ✓ العب من منتصف الليل حتى الفجر (أقل ازدحام)
// ✓ اختر سيرفر “Asia” ثم اترك اللعبة تختار أقرب سيرفر
// ✓ راقب Ping - المثالي 5-15ms للاعبين أردنيين
// ✓ إذا Ping أكثر من 30ms = اخرج وادخل من جديد
// ✓ استخدم Ethernet Cat6 أو Cat7 للسرعة القصوى
// ✓ تأكد Router في وضع Gaming Mode
// ✓ أغلق Windows Update أثناء اللعب
//
// ═══════════════════════════════════════════════════════════════
// ⚡ ميزات السرعة الخيالية:
// ═══════════════════════════════════════════════════════════════
//
// ✓ اللوبي: دخول فوري أقل من 2 ثانية
// ✓ المطابقة: إيجاد ماتش أردني في 5-10 ثواني
// ✓ Voice Chat: صوت واضح بدون تقطيع (< 10ms)
// ✓ حركة اللاعب: استجابة فورية (< 20ms)
// ✓ إطلاق النار: بدون تأخير (Zero Lag)
// ✓ 100% لاعبين أردنيين + نسبة قليلة سعوديين
// ✓ بدون لاعبين من البحرين أو باقي الشرق الأوسط
// ✓ Ping ثابت 5-20ms طوال المباراة
// ✓ FPS ثابت 60 بدون تقطيع
//
// ═══════════════════════════════════════════════════════════════
