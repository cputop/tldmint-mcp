/**
 * TLDMint Embeddable Live Domain Availability Widget (<tldmint-domain-search>)
 * Powered by Cloudflare 1.1.1.1 DNS via https://tldmint.com/api/generate
 * Zero dependencies, Shadow DOM isolated. License: MIT
 */
(function () {
  if (typeof window === 'undefined' || !window.customElements || customElements.get('tldmint-domain-search')) {
    return;
  }

  const API_BASE = 'https://tldmint.com/api/generate';

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  class TldmintDomainSearch extends HTMLElement {
    static get observedAttributes() {
      return ['mode', 'theme', 'placeholder', 'limit'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._rendered = false;
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this._rendered) this.render();
    }

    render() {
      this._rendered = true;
      const mode = this.getAttribute('mode') || 'saas-ai';
      const theme = this.getAttribute('theme') === 'dark' ? 'dark' : 'light';
      const placeholder = this.getAttribute('placeholder') || 'Enter a keyword (e.g. nova, orbit)…';
      const limit = Math.max(3, Math.min(15, parseInt(this.getAttribute('limit') || '6', 10) || 6));

      const isDark = theme === 'dark';
      const bg = isDark ? '#0f172a' : '#ffffff';
      const fg = isDark ? '#f8fafc' : '#0f172a';
      const muted = isDark ? '#94a3b8' : '#475569';
      const border = isDark ? '#334155' : '#e2e8f0';
      const rowBg = isDark ? '#1e293b' : '#f8fafc';
      const inputBg = isDark ? '#0b1220' : '#ffffff';

      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: ${fg}; }
          .box { background: ${bg}; border: 1px solid ${border}; border-radius: 14px; padding: 16px; box-shadow: 0 6px 20px rgba(15,23,42,0.06); }
          .head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
          .title { font-size: 15px; font-weight: 800; margin: 0; }
          .badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: rgba(16,185,129,0.14); color: #10b981; }
          form { display: flex; gap: 8px; flex-wrap: wrap; }
          input { flex: 1 1 180px; padding: 10px 12px; border-radius: 9px; border: 1px solid ${border}; background: ${inputBg}; color: ${fg}; font-size: 14px; outline: none; }
          input:focus { border-color: #ea580c; }
          button { padding: 10px 16px; border-radius: 9px; border: 0; background: #ea580c; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; }
          button:disabled { opacity: 0.6; cursor: wait; }
          .status { font-size: 12.5px; color: ${muted}; margin-top: 10px; }
          .list { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 8px; }
          .row { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; padding: 10px 12px; border-radius: 10px; background: ${rowBg}; border: 1px solid ${border}; }
          .dom { font-weight: 800; font-size: 14.5px; color: ${fg}; }
          .meta { font-size: 12px; color: ${muted}; margin-left: 6px; }
          .avail { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 99px; background: rgba(16,185,129,0.15); color: #10b981; margin-right: 6px; }
          .cta { display: inline-block; padding: 6px 12px; border-radius: 8px; background: #ea580c; color: #fff; text-decoration: none; font-weight: 700; font-size: 12.5px; }
          .foot { margin-top: 12px; padding-top: 10px; border-top: 1px solid ${border}; display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: ${muted}; flex-wrap: wrap; gap: 6px; }
          .foot a { color: #ea580c; text-decoration: none; font-weight: 700; }
        </style>
        <div class="box">
          <div class="head">
            <h3 class="title">Live Domain Availability Finder</h3>
            <span class="badge">1.1.1.1 Live DNS</span>
          </div>
          <form>
            <input type="text" placeholder="${esc(placeholder)}" autocomplete="off" spellcheck="false" required />
            <button type="submit">Find Available &rarr;</button>
          </form>
          <div class="status" role="status">Type any word to verify real-time domain availability.</div>
          <ul class="list"></ul>
          <div class="foot">
            <span>Verified live via Cloudflare 1.1.1.1 DoH</span>
            <span>Powered by <a href="https://tldmint.com/?ref=embed_widget" target="_blank" rel="noopener">TLDMint.com</a></span>
          </div>
        </div>
      `;

      const form = this.shadowRoot.querySelector('form');
      const input = this.shadowRoot.querySelector('input');
      const btn = this.shadowRoot.querySelector('button');
      const status = this.shadowRoot.querySelector('.status');
      const list = this.shadowRoot.querySelector('.list');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const q = (input.value || '').trim();
        if (!q) return;
        btn.disabled = true;
        status.textContent = `Checking live DNS availability for "${q}"…`;
        list.innerHTML = '';

        try {
          const url = `${API_BASE}?mode=${encodeURIComponent(mode)}&q=${encodeURIComponent(q)}&availableOnly=true`;
          const res = await fetch(url);
          const data = await res.json();
          const items = (data && Array.isArray(data.results) ? data.results : []).slice(0, limit);

          if (!items.length) {
            status.textContent = `No instant matches for "${q}". Try another keyword or open full 16-mode suite on TLDMint.`;
          } else {
            status.textContent = `Found ${items.length} available domain${items.length > 1 ? 's' : ''} right now:`;
            list.innerHTML = items
              .map(
                (it) => `<li class="row">
                  <div>
                    <span class="avail">Available</span>
                    <span class="dom">${esc(it.domain)}</span>
                    <span class="meta">${esc(it.firstYearPrice || '$5.98')}${it.promoCode ? ` • Code: ${esc(it.promoCode)}` : ''}</span>
                  </div>
                  <a class="cta" href="${esc(it.registerUrl)}" target="_blank" rel="sponsored nofollow noopener">Register &rarr;</a>
                </li>`
              )
              .join('');
          }
        } catch {
          status.textContent = 'Could not reach live DNS resolver. Please try again.';
        } finally {
          btn.disabled = false;
        }
      });
    }
  }

  customElements.define('tldmint-domain-search', TldmintDomainSearch);
})();
