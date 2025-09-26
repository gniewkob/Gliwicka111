var _paq = window._paq = window._paq || [];
// Force GET to avoid cross-origin POST/beacon being rejected
_paq.push(['disableAlwaysUseSendBeacon']);
_paq.push(['setRequestMethod', 'GET']);
(function () {
  var host = window.location.hostname;
  var isProductionHost = /(?:^|\.)gliwicka111\.pl$/.test(host);

  if (!isProductionHost) {
    return;
  }

  var u = "https://stats0.mydevil.net/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "591"]);
  _paq.push(["setCookieDomain", "*.gliwicka111.pl"]);
  _paq.push(["setDomains", ["*.gliwicka111.pl"]]);
  _paq.push(["enableLinkTracking"]);
  _paq.push(["trackPageView"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = "/vendor/matomo-tracker.js";
  s.parentNode.insertBefore(g, s);
})();
