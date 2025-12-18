function FindProxyForURL(url, host) {

```
// ═══════════════════════════════════════════════════════════
// PUBG MOBILE & PC - ADVANCED PAC CONFIGURATION
// Optimized for Jordan Players - Maximum Performance
// ═══════════════════════════════════════════════════════════

// البروكسيات الأردنية المتطورة - مرتبة حسب الأداء
var jordanProxies = [
    "PROXY 212.118.1.149:8080",      // NETS - الأسرع
    "PROXY 212.118.1.10:8080",       // NETS - احتياطي
    "PROXY 212.118.28.179:8080",     // NETS - عالي الأداء
    "PROXY 212.35.79.196:8080",      // BATELCO - موثوق
    "PROXY 188.247.66.0:8080",       // JO-LINK - متوازن
    "PROXY 212.118.22.2:8080"        // NETS - استقرار
];

// نظام التوزيع الذكي للبروكسيات
var primaryProxy = jordanProxies[0] + "; " + jordanProxies[1];
var secondaryProxy = jordanProxies[2] + "; " + jordanProxies[3];
var backupProxy = jordanProxies[4] + "; " + jordanProxies[5];

// ═══════════════════════════════════════════════════════════
// PUBG MOBILE - نطاقات اللعبة الرئيسية
// ═══════════════════════════════════════════════════════════

var pubgMobileDomains = [
    // خوادم اللعبة الأساسية
    "*.pubgmobile.com",
    "*.pubgm.com",
    "*.igamecj.com",
    "*.proximabeta.com",
    "*.anticheatexpert.com",
    
    // Tencent Cloud Infrastructure
    "*.tencentcs.com",
    "*.tencent.com",
    "*.myqcloud.com",
    "*.qcloud.com",
    
    // خوادم الشرق الأوسط
    "*.intl.pubgmobile.com",
    "*.me.pubgmobile.com",
    "mena*.pubgmobile.com",
    
    // APIs & Authentication
    "api*.pubgmobile.com",
    "auth*.pubgmobile.com",
    "login*.pubgmobile.com",
    "account*.pubgmobile.com",
    
    // Game Assets & Updates
    "cdn*.pubgmobile.com",
    "dl*.pubgmobile.com",
    "download*.pubgmobile.com",
    "update*.pubgmobile.com",
    
    // Matchmaking & Stats
    "match*.pubgmobile.com",
    "stat*.pubgmobile.com",
    "rank*.pubgmobile.com",
    
    // Voice Chat
    "voice*.pubgmobile.com",
    "rtc*.pubgmobile.com"
];

// ═══════════════════════════════════════════════════════════
// PUBG PC (STEAM) - نطاقات اللعبة
// ═══════════════════════════════════════════════════════════

var pubgPCDomains = [
    "*.playbattlegrounds.com",
    "*.battlegrounds.com",
    "*.pubg.com",
    "*.pubgapi.com",
    "*.bluehole.net",
    "*.krafton.com",
    
    // Game Servers
    "prod*.playbattlegrounds.com",
    "live*.playbattlegrounds.com",
    "as*.playbattlegrounds.com",
    "eu*.playbattlegrounds.com",
    "me*.playbattlegrounds.com"
];

// ═══════════════════════════════════════════════════════════
// تحسينات خاصة بالشرق الأوسط والأردن
// ═══════════════════════════════════════════════════════════

// تحديد نطاقات PUBG الكاملة
var allPubgDomains = pubgMobileDomains.concat(pubgPCDomains);

// التحقق من نطاقات اللعبة
for (var i = 0; i < allPubgDomains.length; i++) {
    if (shExpMatch(host, allPubgDomains[i])) {
        
        // ═══ نظام التوجيه الذكي حسب نوع الاتصال ═══
        
        // 1. اتصالات اللعب المباشر (أعلى أولوية)
        if (shExpMatch(url, "*match*") || 
            shExpMatch(url, "*game*") || 
            shExpMatch(url, "*server*") ||
            shExpMatch(host, "*.prod.*") ||
            shExpMatch(host, "*.live.*")) {
            return primaryProxy;
        }
        
        // 2. Voice Chat (أولوية عالية لتقليل التأخير)
        if (shExpMatch(url, "*voice*") || 
            shExpMatch(url, "*rtc*") || 
            shExpMatch(url, "*audio*")) {
            return primaryProxy;
        }
        
        // 3. التحديثات والتنزيلات (أولوية متوسطة)
        if (shExpMatch(url, "*download*") || 
            shExpMatch(url, "*update*") || 
            shExpMatch(url, "*cdn*") ||
            shExpMatch(url, "*dl.*")) {
            return secondaryProxy;
        }
        
        // 4. APIs والمصادقة
        if (shExpMatch(url, "*api*") || 
            shExpMatch(url, "*auth*") || 
            shExpMatch(url, "*login*")) {
            return primaryProxy;
        }
        
        // 5. الإحصائيات والترتيب
        if (shExpMatch(url, "*stat*") || 
            shExpMatch(url, "*rank*") || 
            shExpMatch(url, "*leaderboard*")) {
            return secondaryProxy;
        }
        
        // جميع طلبات PUBG الأخرى
        return primaryProxy;
    }
}

// ═══════════════════════════════════════════════════════════
// نطاقات IP خاصة بخوادم PUBG في الشرق الأوسط
// ═══════════════════════════════════════════════════════════

// Tencent Cloud - Middle East Servers
if (isInNet(host, "43.129.0.0", "255.255.0.0") ||     // Tencent ME
    isInNet(host, "43.130.0.0", "255.255.0.0") ||     // Tencent ME
    isInNet(host, "43.131.0.0", "255.255.0.0") ||     // Tencent ME
    isInNet(host, "170.106.0.0", "255.255.0.0") ||    // Singapore Servers
    isInNet(host, "152.136.0.0", "255.255.0.0") ||    // Tencent Cloud
    isInNet(host, "118.107.0.0", "255.255.0.0")) {    // Asia Servers
    return primaryProxy;
}

// AWS Middle East (Bahrain) - PUBG Servers
if (isInNet(host, "15.184.0.0", "255.255.0.0") ||     // AWS Bahrain
    isInNet(host, "15.185.0.0", "255.255.0.0")) {     // AWS Bahrain
    return primaryProxy;
}

// ═══════════════════════════════════════════════════════════
// خدمات إضافية مهمة للألعاب
// ═══════════════════════════════════════════════════════════

// Discord (للتواصل مع الفريق)
if (shExpMatch(host, "*.discord.com") || 
    shExpMatch(host, "*.discordapp.com")) {
    return secondaryProxy;
}

// Steam (لـ PUBG PC)
if (shExpMatch(host, "*.steampowered.com") || 
    shExpMatch(host, "*.steamcontent.com") ||
    shExpMatch(host, "*.steamstatic.com")) {
    return secondaryProxy;
}

// Cloudflare CDN (تستخدمه بعض خدمات الألعاب)
if (shExpMatch(host, "*.cloudflare.com") ||
    shExpMatch(host, "*.cloudflarecdns.com")) {
    return backupProxy;
}

// ═══════════════════════════════════════════════════════════
// نظام الفشل الآمن (Failover)
// ═══════════════════════════════════════════════════════════

// المواقع المهمة الأخرى تستخدم نظام احتياطي
if (shExpMatch(host, "*.google.com") ||
    shExpMatch(host, "*.googleapis.com") ||
    shExpMatch(host, "*.facebook.com") ||
    shExpMatch(host, "*.whatsapp.com")) {
    return backupProxy;
}

// ═══════════════════════════════════════════════════════════
// لا يوجد DIRECT - كل الاتصالات عبر البروكسي
// ═══════════════════════════════════════════════════════════

// جميع الطلبات الأخرى تمر عبر البروكسي الاحتياطي
return backupProxy;
```

}

// ═══════════════════════════════════════════════════════════════
// ملاحظات مهمة للاستخدام الأمثل:
// ═══════════════════════════════════════════════════════════════
// 1. تأكد من أن البروكسيات تعمل وتدعم المنافذ المذكورة
// 2. يمكنك تغيير المنافذ حسب إعدادات البروكسي الخاص بك
// 3. السكربت يعطي أولوية قصوى لاتصالات اللعب المباشر
// 4. Voice Chat له معاملة خاصة لتقليل التأخير (Lag)
// 5. لا يوجد DIRECT - كل شيء يمر عبر البروكسيات الأردنية
// 6. نظام Failover تلقائي في حال فشل أي بروكسي
// ═══════════════════════════════════════════════════════════════
