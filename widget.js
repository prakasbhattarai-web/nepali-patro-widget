/*!
 * Antaryami free Nepali patro + rashifal widget. https://antaryami.com.au/widget
 *
 * Paste on your page:
 *   <a class="antaryami-widget" href="https://antaryami.com.au/patro">नेपाली पात्रो र राशिफल — अन्तर्यामी</a>
 *   <script async src="https://antaryami.com.au/widget.js"></script>
 *
 * Options, as data attributes on the link: data-type="both|patro|rashifal",
 * data-lang="ne|en", data-theme="light|dark", data-sign="mesha" … "meena".
 *
 * The widget draws in an iframe placed just above the link; the link stays on
 * your page as its credit line. Nothing here reads your page or sets a cookie.
 *
 * Pages that add the link after load (React, Vue, Next.js route changes) call
 * window.AntaryamiWidget.scan() once it is in the page.
 *
 * Source and docs: https://github.com/prakasbhattarai-web/nepali-patro-widget
 */
(function () {
  'use strict';
  // Loaded twice (a theme and a plugin both adding it): the first copy owns
  // the frames and the message listener, so the second only scans.
  if (window.AntaryamiWidget) {
    window.AntaryamiWidget.scan();
    return;
  }
  var ORIGIN = 'https://antaryami.com.au';
  var frames = [];

  function build(a) {
    if (a.getAttribute('data-antaryami-ready')) return;
    a.setAttribute('data-antaryami-ready', '1');

    var q = [];
    ['type', 'lang', 'theme', 'sign'].forEach(function (k) {
      var v = a.getAttribute('data-' + k);
      if (v) q.push(k + '=' + encodeURIComponent(v));
    });
    var type = a.getAttribute('data-type') || 'both';
    var lang = a.getAttribute('data-lang') || 'ne';

    var box = document.createElement('div');
    box.style.cssText = 'max-width:420px;width:100%;margin:0 0 6px;';
    var f = document.createElement('iframe');
    f.src = ORIGIN + '/embed' + (q.length ? '?' + q.join('&') : '');
    f.title = lang === 'en' ? 'Nepali Patro and Rashifal' : 'नेपाली पात्रो र राशिफल';
    f.loading = 'lazy';
    f.setAttribute('scrolling', 'no');
    f.style.cssText =
      'display:block;width:100%;border:0;overflow:hidden;background:transparent;height:' +
      (type === 'patro' ? 300 : type === 'rashifal' ? 400 : 600) + 'px;';
    box.appendChild(f);
    a.parentNode.insertBefore(box, a);

    // The link becomes the small credit line under the widget.
    a.style.display = 'inline-block';
    a.style.fontSize = '13px';
    frames.push(f);
  }

  function scan() {
    var links = document.querySelectorAll('a.antaryami-widget');
    for (var i = 0; i < links.length; i++) build(links[i]);
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== ORIGIN || !e.data || e.data.type !== 'antaryami-widget:height') return;
    var h = Number(e.data.height);
    if (!(h > 0 && h < 3000)) return;
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) frames[i].style.height = h + 'px';
    }
  });

  window.AntaryamiWidget = { scan: scan };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
})();
