// Email links: let the visitor pick how to send.
//
// A bare mailto: only works when the OS has a mail client registered, so for
// anyone on webmail the button silently does nothing. This intercepts the
// click and offers Gmail, the mail app, or copying the address. Without JS
// the link stays a plain mailto:, which is the correct fallback.

(function () {
    var openPop = null;

    function labels() {
        var ja = document.documentElement.lang === 'ja';
        return {
            gmail: ja ? 'Gmail で開く' : 'Open in Gmail',
            app: ja ? 'メールアプリで開く' : 'Open in mail app',
            copy: ja ? 'アドレスをコピー' : 'Copy address',
            copied: ja ? 'コピーしました' : 'Copied'
        };
    }

    function close() {
        if (!openPop) return;
        if (openPop.trigger) openPop.trigger.setAttribute('aria-expanded', 'false');
        openPop.el.remove();
        openPop = null;
        document.removeEventListener('keydown', onKey, true);
        document.removeEventListener('click', onOutside, true);
        window.removeEventListener('scroll', close, true);
        window.removeEventListener('resize', close);
    }

    function onKey(e) {
        if (e.key === 'Escape') { var t = openPop && openPop.trigger; close(); if (t) t.focus(); }
    }

    function onOutside(e) {
        if (openPop && !openPop.el.contains(e.target) && e.target !== openPop.trigger) close();
    }

    function place(el, trigger) {
        var r = trigger.getBoundingClientRect();
        var w = el.offsetWidth, h = el.offsetHeight, pad = 8;
        var left = Math.min(Math.max(pad, r.left), window.innerWidth - w - pad);
        var top = r.bottom + 8;
        if (top + h > window.innerHeight - pad) top = Math.max(pad, r.top - h - 8);
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    }

    function open(trigger, address) {
        close();
        var L = labels();
        var pop = document.createElement('div');
        pop.className = 'contact-pop';
        pop.setAttribute('role', 'menu');

        function item(text, cls) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'contact-pop-item' + (cls ? ' ' + cls : '');
            b.setAttribute('role', 'menuitem');
            b.textContent = text;
            pop.appendChild(b);
            return b;
        }

        var addr = document.createElement('p');
        addr.className = 'contact-pop-addr';
        addr.textContent = address;
        pop.appendChild(addr);

        item(L.gmail).addEventListener('click', function () {
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' +
                encodeURIComponent(address), '_blank', 'noopener');
            close();
        });

        item(L.app).addEventListener('click', function () {
            window.location.href = 'mailto:' + address;
            close();
        });

        var copyBtn = item(L.copy);
        copyBtn.addEventListener('click', function () {
            var done = function () { copyBtn.textContent = L.copied; setTimeout(close, 900); };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(address).then(done, fallbackCopy);
            } else {
                fallbackCopy();
            }
            function fallbackCopy() {
                var ta = document.createElement('textarea');
                ta.value = address;
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); done(); } catch (e) { close(); }
                ta.remove();
            }
        });

        document.body.appendChild(pop);
        place(pop, trigger);
        trigger.setAttribute('aria-expanded', 'true');
        openPop = { el: pop, trigger: trigger };

        pop.querySelector('.contact-pop-item').focus();
        document.addEventListener('keydown', onKey, true);
        document.addEventListener('click', onOutside, true);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
    }

    document.addEventListener('click', function (e) {
        var link = e.target.closest && e.target.closest('a[href^="mailto:"]');
        if (!link) return;
        // let modifier-clicks and middle-clicks behave normally
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        if (openPop && openPop.trigger === link) { close(); return; }
        open(link, decodeURIComponent(link.getAttribute('href').slice(7).split('?')[0]));
    });

    document.addEventListener('DOMContentLoaded', function () {
        var links = document.querySelectorAll('a[href^="mailto:"]');
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute('aria-haspopup', 'menu');
            links[i].setAttribute('aria-expanded', 'false');
        }
    });
}());
