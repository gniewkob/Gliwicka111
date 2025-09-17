var _paq = window._paq = window._paq || [];
// Force GET to avoid cross-origin POST/beacon being rejected
_paq.push(['disableAlwaysUseSendBeacon']);
_paq.push(['setRequestMethod', 'GET']);
// Track after configuring
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u = 'https://stats0.mydevil.net/';
  _paq.push(['setTrackerUrl', u + 'matomo.php']);
  _paq.push(['setSiteId', '591']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
