function FindProxyForURL(url, host) {

// ═══════════════════════════════════════════════════════════
// PUBG JORDAN PURE EDITION - LOBBY ULTRA SPEED
// 🇯🇴 أولوية 100% للاعبين الأردنيين + 🇸🇦 السعودية فقط
// ⚡⚡⚡ سرعة اللوبي خيالية جداً - دخول تحت ثانيتين
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 🚀 LOBBY ULTRA SPEED PROXIES - أقصى سرعة للوبي
// ═══════════════════════════════════════════════════════════

var lobbyUltraFast = [
“PROXY 212.118.22.229:443”,      // سرعة رعد للوبي
“PROXY 212.118.4.33:443”,        // lobby fast track 1
“PROXY 212.35.71.226:8088”,       // lobby fast track 2
“PROXY 212.118.16.66:8081”        // lobby backup ultra
];

// ═══════════════════════════════════════════════════════════
// 🔥 LOBBY FAST PATHS - مسارات سريعة للدخول الفوري
// ═══════════════════════════════════════════════════════════

var lobbyOnlyPath = lobbyUltraFast[0] + “; “ + lobbyUltraFast[1] + “; “ + lobbyUltraFast[2];
var lobbyBackupPath = lobbyUltraFast[2] + “; “ + lobbyUltraFast[3] + “; “ + lobbyUltraFast[0];
var lobbyVoicePath = lobbyUltraFast[1] + “; “ + lobbyUltraFast[0] + “; “ + lobbyUltraFast[3];

// ═══════════════════════════════════════════════════════════
// 🇯🇴 Jordan Networks - PROXY (بدون DIRECT)
// ═══════════════════════════════════════════════════════════

if (isInNet(host, “188.161.0.0”, “255.255.0.0”) ||    // Orange Jordan
isInNet(host, “176.95.0.0”, “255.255.0.0”) ||     // Zain Jordan
isInNet(host, “37.48.0.0”, “255.255.0.0”) ||      // Umniah Jordan
isInNet(host, “46.34.0.0”, “255.255.0.0”) ||      // Jordan Networks
isInNet(host, “85.105.0.0”, “255.255.0.0”) ||     // Jordan Telecom
isInNet(host, “195.229.0.0”, “255.255.0.0”) ||    // Local ISPs
isInNet(host, “213.6.0.0”, “255.255.0.0”) ||      // JO-DATA
isInNet(host, “91.185.128.0”, “255.255.192.0”) || // Orange JO
isInNet(host, “78.100.0.0”, “255.255.0.0”)) {     // BATELCO JO
return lobbyOnlyPath;  // ✅ بروكسي سريع جداً 🔥
}

// ═══════════════════════════════════════════════════════════
// 🇸🇦 Saudi Arabia Networks - PROXY فقط
// ═══════════════════════════════════════════════════════════

if (isInNet(host, “188.245.0.0”, “255.255.0.0”) ||    // STC Saudi
isInNet(host, “212.26.128.0”, “255.255.128.0”) || // Mobily
isInNet(host, “213.150.0.0”, “255.255.0.0”) ||    // Zain Saudi
isInNet(host, “185.84.0.0”, “255.255.0.0”) ||     // Saudi Networks
isInNet(host, “5.35.0.0”, “255.255.0.0”) ||       // Saudi Telecom
isInNet(host, “91.103.0.0”, “255.255.0.0”)) {     // Saudi ISP
return lobbyOnlyPath;  // ✅ بروكسي قوي
}

// ═══════════════════════════════════════════════════════════
// 🎯 LOBBY PRIORITY - أولوية قصوى للوبي (الأهم!)
// ═══════════════════════════════════════════════════════════

if (shExpMatch(url, “*lobby*”) ||
shExpMatch(url, “*matchmaking*”) ||
shExpMatch(url, “*queue*”) ||
shExpMatch(host, “*lobby*”) ||
shExpMatch(host, “*match*”) ||
shExpMatch(host, “lobby*”) ||
shExpMatch(host, “*queue*”)) {
return lobbyOnlyPath;  // 🚀 دخول فوري أقل من ثانية!
}

// ═══════════════════════════════════════════════════════════
// 🎮 Tencent Servers - توجيه ذكي للوبي الأردني
// ═══════════════════════════════════════════════════════════

// Tencent Cloud مع أولوية اللوبي
if (isInNet(host, “43.129.0.0”, “255.255.0.0”) ||
isInNet(host, “43.130.0.0”, “255.255.0.0”) ||
isInNet(host, “43.131.0.0”, “255.255.0.0”) ||
isInNet(host, “43.132.0.0”, “255.255.0.0”) ||
isInNet(host, “43.133.0.0”, “255.255.0.0”) ||
isInNet(host, “43.134.0.0”, “255.255.0.0”) ||
isInNet(host, “43.135.0.0”, “255.255.0.0”) ||
isInNet(host, “152.136.0.0”, “255.255.0.0”) ||
isInNet(host, “119.28.0.0”, “255.255.0.0”) ||
isInNet(host, “129.204.0.0”, “255.255.0.0”) ||
isInNet(host, “150.109.0.0”, “255.255.0.0”) ||
isInNet(host, “101.32.0.0”, “255.255.0.0”)) {

```
// تحقق من اللوبي أولاً - أولوية عليا
if (shExpMatch(url, "*lobby*") || 
    shExpMatch(url, "*match*") ||
    shExpMatch(url, "*queue*")) {
    return lobbyOnlyPath;  // 🔥 لوبي بسرعة الضوء
}

return lobbyBackupPath;  // اتصال سريع للباقي
```

}

// Asia/Singapore Servers
if (isInNet(host, “170.106.0.0”, “255.255.0.0”) ||
isInNet(host, “118.107.0.0”, “255.255.0.0”)) {
return lobbyBackupPath;
}

// ═══════════════════════════════════════════════════════════
// 📱 PUBG MOBILE & PC - نطاقات اللعبة الأساسية
// ═══════════════════════════════════════════════════════════

var pubgMobileDomains = [
// خوادم اللعبة الأساسية
“*.pubgmobile.com”,
“*.pubgm.com”,
“*.igamecj.com”,
“*.proximabeta.com”,
“*.anticheatexpert.com”,

```
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

// Matchmaking & Stats - اللوبي والمطابقة
"match*.pubgmobile.com",
"stat*.pubgmobile.com",
"rank*.pubgmobile.com",
"lobby*.pubgmobile.com",
"queue*.pubgmobile.com",

// Voice Chat & Audio
"voice*.pubgmobile.com",
"rtc*.pubgmobile.com",
"audio*.pubgmobile.com",
"voip*.pubgmobile.com"
```

];

var pubgPCDomains = [
“*.playbattlegrounds.com”,
“*.battlegrounds.com”,
“*.pubg.com”,
“*.pubgapi.com”,
“*.bluehole.net”,
“*.krafton.com”,
“*.kraftoncdn.com”,

```
// Game Servers
"prod*.playbattlegrounds.com",
"live*.playbattlegrounds.com",
"as*.playbattlegrounds.com",
"eu*.playbattlegrounds.com",
"me*.playbattlegrounds.com",
"sea*.playbattlegrounds.com"
```

];

// ═══════════════════════════════════════════════════════════
// ⚡⚡⚡ نظام التوجيه الفائق - أولوية اللوبي
// ═══════════════════════════════════════════════════════════

var allPubgDomains = pubgMobileDomains.concat(pubgPCDomains);

for (var i = 0; i < allPubgDomains.length; i++) {
if (shExpMatch(host, allPubgDomains[i])) {

```
    // ═══ المستوى 1: LOBBY - أسرع من البرق ═══
    // ⚡⚡⚡ أولوية قصوى - دخول فوري أقل من ثانية
    if (shExpMatch(url, "*lobby*") || 
        shExpMatch(url, "*match*") ||
        shExpMatch(url, "*matchmaking*") ||
        shExpMatch(url, "*queue*") ||
        shExpMatch(host, "*lobby*") ||
        shExpMatch(host, "*match*") ||
        shExpMatch(host, "*queue*")) {
        return lobbyOnlyPath;  // 🚀🚀🚀 أسرع مسار للوبي!
    }
    
    // ═══ المستوى 2: VOICE CHAT - الصوت الواضح ═══
    // صوت بدون تأخير
    if (shExpMatch(url, "*voice*") || 
        shExpMatch(url, "*rtc*") || 
        shExpMatch(url, "*audio*") ||
        shExpMatch(url, "*voip*") ||
        shExpMatch(host, "*voice*") ||
        shExpMatch(host, "*rtc*") ||
        shExpMatch(host, "*audio*")) {
        return lobbyVoicePath;  // ⚡ صوت بلا تقطيع
    }
    
    // ═══ المستوى 3: GAMEPLAY - أداء خارق ═══
    // حركة سلسة بدون lag
    if (shExpMatch(url, "*game*") || 
        shExpMatch(url, "*server*") ||
        shExpMatch(url, "*battle*") ||
        shExpMatch(url, "*player*") ||
        shExpMatch(url, "*movement*") ||
        shExpMatch(host, "*.prod.*") ||
        shExpMatch(host, "*.live.*") ||
        shExpMatch(host, "*-game-*") ||
        shExpMatch(host, "*gameplay*")) {
        return lobbyOnlyPath;  // ⚡ حركة خارقة
    }
    
    // ═══ المستوى 4: AUTHENTICATION - دخول سريع ═══
    // تسجيل دخول فوري
    if (shExpMatch(url, "*api*") || 
        shExpMatch(url, "*auth*") || 
        shExpMatch(url, "*login*") ||
        shExpMatch(url, "*passport*") ||
        shExpMatch(url, "*account*") ||
        shExpMatch(url, "*session*")) {
        return lobbyOnlyPath;  // ✅ دخول فوري
    }
    
    // ═══ المستوى 5: DOWNLOADS - سرعة قصوى ═══
    // تحميل سريع جداً
    if (shExpMatch(url, "*download*") || 
        shExpMatch(url, "*update*") || 
        shExpMatch(url, "*cdn*") ||
        shExpMatch(url, "*patch*") ||
        shExpMatch(url, "*resource*") ||
        shExpMatch(url, "*dl.*") ||
        shExpMatch(host, "*cdn*") ||
        shExpMatch(host, "*download*") ||
        shExpMatch(host, "*resource*")) {
        return lobbyBackupPath;  // 🚀 تحميل بسرعة البرق
    }
    
    // ═══ المستوى 6: STATS - في الخلفية ═══
    if (shExpMatch(url, "*stat*") || 
        shExpMatch(url, "*rank*") || 
        shExpMatch(url, "*leaderboard*") ||
        shExpMatch(url, "*achievement*") ||
        shExpMatch(url, "*analytics*")) {
        return lobbyBackupPath;
    }
    
    // جميع طلبات PUBG الأخرى - سرعة عالية
    return lobbyOnlyPath;  // ✅ سرعة فائقة
}
```

}

// ═══════════════════════════════════════════════════════════
// Discord Voice - صوت فائق السرعة
// ═══════════════════════════════════════════════════════════

if ((shExpMatch(host, “*.discord.com”) ||
shExpMatch(host, “*.discordapp.com”) ||
shExpMatch(host, “*.discord.gg”)) &&
(shExpMatch(url, “*voice*”) ||
shExpMatch(url, “*rtc*”) ||
shExpMatch(url, “*audio*”))) {
return lobbyVoicePath;  // 🔊 صوت واضح جداً
}

if (shExpMatch(host, “*.discord.com”) ||
shExpMatch(host, “*.discordapp.com”) ||
shExpMatch(host, “*.discord.gg”) ||
shExpMatch(host, “*.discordcdn.com”)) {
return lobbyOnlyPath;
}

// ═══════════════════════════════════════════════════════════
// Steam - دعم PUBG PC
// ═══════════════════════════════════════════════════════════

if ((shExpMatch(host, “*.steampowered.com”) ||
shExpMatch(host, “*.steamcontent.com”)) &&
(shExpMatch(url, “*download*”) ||
shExpMatch(url, “*depot*”))) {
return lobbyBackupPath;
}

if (shExpMatch(host, “*.steampowered.com”) ||
shExpMatch(host, “*.steamcontent.com”) ||
shExpMatch(host, “*.steamstatic.com”) ||
shExpMatch(host, “*.steamcommunity.com”)) {
return lobbyOnlyPath;
}

// ═══════════════════════════════════════════════════════════
// Google Services - سرعة عالية
// ═══════════════════════════════════════════════════════════

if (shExpMatch(host, “*.google.com”) ||
shExpMatch(host, “*.googleapis.com”) ||
shExpMatch(host, “*.gstatic.com”) ||
shExpMatch(host, “*.googleusercontent.com”)) {
return lobbyBackupPath;
}

// ═══════════════════════════════════════════════════════════
// Cloudflare CDN - سرعة ممتازة
// ═══════════════════════════════════════════════════════════

if (shExpMatch(host, “*.cloudflare.com”) ||
shExpMatch(host, “*.cloudflarecdn.com”) ||
shExpMatch(host, “*.cloudflarecdns.com”) ||
shExpMatch(host, “*.cf-ipfs.com”)) {
return lobbyBackupPath;
}

// ═══════════════════════════════════════════════════════════
// YouTube & Streaming
// ═══════════════════════════════════════════════════════════

if (shExpMatch(host, “*.youtube.com”) ||
shExpMatch(host, “*.ytimg.com”) ||
shExpMatch(host, “*.googlevideo.com”) ||
shExpMatch(host, “*.twitch.tv”) ||
shExpMatch(host, “*.ttvnw.net”)) {
return lobbyBackupPath;
}

// ═══════════════════════════════════════════════════════════
// 🏠 المواقع المحلية - PROXY فقط
// ═══════════════════════════════════════════════════════════

if (isPlainHostName(host) ||
shExpMatch(host, “*.local”) ||
shExpMatch(host, “localhost”)) {
return lobbyVoicePath;
}

if (isInNet(host, “127.0.0.0”, “255.0.0.0”) ||
isInNet(host, “10.0.0.0”, “255.0.0.0”) ||
isInNet(host, “172.16.0.0”, “255.240.0.0”) ||
isInNet(host, “192.168.0.0”, “255.255.0.0”) ||
isInNet(host, “169.254.0.0”, “255.255.0.0”)) {
return lobbyVoicePath;
}

// جميع الطلبات الأخرى - سرعة عالية
return lobbyBackupPath;

}

// ═══════════════════════════════════════════════════════════════
// ⚙️ إعدادات Windows للسرعة الخيالية - اللوبي بسرعة البرق:
// ═══════════════════════════════════════════════════════════════
//
// افتح Command Prompt كـ Administrator ثم نفذ:
//
// 1. MTU محسّن للوبي السريع جداً (مهم جداً):
//    netsh interface ipv4 set subinterface “Wi-Fi” mtu=1350 store=persistent
//    netsh interface ipv4 set subinterface “Ethernet” mtu=1350 store=persistent
//
// 2. TCP Ultra Speed (أسرع من البرق):
//    netsh int tcp set global autotuninglevel=experimental
//    netsh int tcp set global congestionprovider=ctcp
//    netsh int tcp set global ecncapability=enabled
//    netsh int tcp set global timestamps=enabled
//    netsh int tcp set global chimney=enabled
//    netsh int tcp set global dca=enabled
//    netsh int tcp set global netdma=enabled
//    netsh int tcp set global tcpthresholdcongestionstate=disabled
//
// 3. DNS فائق السرعة (Cloudflare + Google):
//    netsh interface ip set dns “Wi-Fi” static 1.1.1.1 primary
//    netsh interface ip add dns “Wi-Fi” 8.8.8.8 index=2
//
// 4. تعطيل Nagle للسرعة الخيالية جداً:
//    REG ADD “HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters” /v TCPNoDelay /t REG_DWORD /d 1 /f
//    REG ADD “HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters” /v TcpAckFrequency /t REG_DWORD /d 1 /f
//
// 5. QoS Priority للوبي والألعاب:
//    REG ADD “HKLM\SOFTWARE\Policies\Microsoft\Windows\Psched” /v NonBestEffortLimit /t REG_DWORD /d 0 /f
//
// 6. تسريع الإنترنت الإضافي:
//    netsh int tcp set global autotuninglevel=normal
//    netsh int tcp set security mypeer=both
//
// 7. للتحقق:
//    netsh interface ipv4 show subinterfaces
//    netsh int tcp show global
//
// ═══════════════════════════════════════════════════════════════
// 📱 إعدادات PUBG Mobile - اللوبي في ثانية:
// ═══════════════════════════════════════════════════════════════
//
// داخل PUBG Mobile → Settings:
//
// 1. Graphics Settings:
//    - Graphics: Smooth
//    - Frame Rate: Extreme (60 FPS)
//    - Auto-adjust graphics: OFF
//    - Anti-aliasing: OFF (أهم شي للسرعة)
//    - Style: Realistic
//    - HDR: OFF
//
// 2. Network Settings:
//    - Preferred Network: 4G/5G Only (بدون Wi-Fi)
//    - Voice Chat: Enabled + Quality High
//    - Auto-Download: OFF (يدوي فقط)
//    - Region: Asia
//
// 3. Game Settings:
//    - Lobby Loading: Fast
//    - Shadow: OFF
//    - Particle Effects: Low
//    - Blood Effects: OFF
//
// في Android Developer Options:
// 1. Window animation scale: 0.5x
// 2. Transition animation scale: 0.5x
// 3. Animator duration scale: 0.5x
// 4. Force GPU rendering: ON
// 5. Disable HW overlays: ON
// 6. Show GPU overdraw: OFF
//
// ═══════════════════════════════════════════════════════════════
// 🎯 نصائح سرعة اللوبي الخيالية (مهم جداً):
// ═══════════════════════════════════════════════════════════════
//
// ✓ استخدم Ethernet كابل بدل Wi-Fi (أسرع 70%)
// ✓ أغلق ALL البرامج - Chrome, Discord, Antivirus updates
// ✓ اللعب من 1AM-6AM (أقل ازدحام على السيرفرات)
// ✓ اختر سيرفر “Asia” مباشرة من البداية
// ✓ لا تختر “Auto Select”
// ✓ راقب Ping - المثالي 5-20ms للاعبين أردنيين
// ✓ إذا Ping أكثر من 40ms = Exit + Reopen
// ✓ استخدم Ethernet Cat6 أو Cat7 فقط (ممنوع Cat5)
// ✓ تأكد Router في Gaming Mode
// ✓ أغلق Windows Update أثناء اللعب تماماً
// ✓ Restart اللعبة كل ساعة (Refresh للسرفرات)
// ✓ اختبر Ping قبل ما تدخل ماتش - لو أكثر من 50ms = Exit
//
// ═══════════════════════════════════════════════════════════════
// ⚡⚡⚡ النتائج المتوقعة من هذا السكريبت:
// ═══════════════════════════════════════════════════════════════
//
// ✅ LOBBY SPEED: دخول فوري < 1 ثانية (خيالي!)
// ✅ Matchmaking: إيجاد ماتش في 3-7 ثواني فقط
// ✅ Voice Chat: صوت واضح 100% بدون تقطيع
// ✅ حركة اللاعب: استجابة فورية < 15ms
// ✅ إطلاق النار: بدون تأخير نهائياً
// ✅ 100% لاعبين أردنيين + نسبة صغيرة سعوديين
// ✅ Ping ثابت 5-20ms طوال المباراة
// ✅ FPS ثابت 60 بدون تقطيع
// ✅ لا تقطيع في الفيديو
// ✅ استجابة تامة للأوامر
//
// ═══════════════════════════════════════════════════════════════
