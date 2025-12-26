function FindProxyForURL(url, host) {
    // متغيرات للنطاقات الرئيسية لتيك توك (موسعة لتغطية شاملة)
    var tiktokDomains = [
        "*.tiktok.com",
        "*.tiktokv.com",
        "*.tiktokcdn.com",
        "*.byteoversea.com",
        "*.musical.ly",
        "*.bytedance.com",
        "*.ibyteimg.com",
        "*.ttlivecdn.com",
        "*.akamaized.net",  // للـ CDN مثل p16-tiktokcdn-com.akamaized.net
        "*.tiktoken.com"     // إضافي إذا لزم
    ];

    // متغيرات للبروكسيات السعودية (ترتيب من الأفضل)
    var proxies = "PROXY 156.244.11.6:80; PROXY 156.244.11.6:443; PROXY 156.244.11.6:8081; PROXY 46.152.153.247:8080; PROXY 213.136.192.28:80";

    // التحقق من النطاقات بترتيب فعال (الشائع أولاً)
    if (dnsDomainIs(host, ".tiktok.com") ||  // الأكثر شيوعاً
        dnsDomainIs(host, ".tiktokcdn.com") ||
        dnsDomainIs(host, ".tiktokv.com") ||
        dnsDomainIs(host, ".byteoversea.com") ||
        dnsDomainIs(host, ".musical.ly") ||
        dnsDomainIs(host, ".bytedance.com") ||
        dnsDomainIs(host, ".ibyteimg.com") ||
        dnsDomainIs(host, ".ttlivecdn.com") ||
        shExpMatch(host, "*akamaized.net") ||  // للـ CDN
        shExpMatch(host, "*.tiktoken.com")) {
        return proxies;  // بدون DIRECT، جرب البروكسيات بالترتيب
    }

    // لكل المواقع الأخرى: مباشر للسرعة
    return "DIRECT";
}
