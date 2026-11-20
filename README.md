# TLDMint MCP Server (`tldmint-mcp`)

**Stop LLMs from suggesting registered domains.**  
`tldmint-mcp` is a free, **zero-authentication** [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server powered by **[TLDMint.com](https://tldmint.com)** that lets Claude Desktop, Cursor, Windsurf, Cline, and autonomous AI agents generate brandable domain ideas, verify **live DNS availability** via Cloudflare `1.1.1.1` DoH, inspect **SPF/DMARC/RDAP WHOIS**, and surface verified first-year registration promos.

---

## Features & Exposed MCP Tools

| Tool Name | What It Does |
| :--- | :--- |
| `generate_available_domains` | Runs **16 specialized naming engines** (`saas-ai`, `five-letter`, `homelab`, `personal-email`, `newsletter`, `domain-hack`, `ecommerce`, etc.) and filters to **live unregistered domains** with Year-1 pricing & promo codes. |
| `check_domain_availability` | Verifies up to **100 specific domain names in parallel** via Cloudflare `1.1.1.1` DNS-over-HTTPS (`NXDOMAIN` vs active delegation). |
| `inspect_domain_dns_whois` | Runs a live diagnostic across `A`, `AAAA`, `www CNAME`, `MX`, `SPF`, `_dmarc`, `NS`, and ICANN `RDAP` registration/expiration dates. |
| `get_verified_domain_coupons` | Returns verified first-year registration promo codes (`$5.98 .COM`, `$0.98 .STORE`, `$0.99 TLDs`, `$0.99/mo Private Email`). |

---

## Quick Start (Zero API Key Needed)

### Option A: Remote Streamable HTTP MCP (Fastest — Zero Install)

If your client supports **Remote HTTP MCP** (Cursor, Claude Desktop Remote Connectors, Windsurf, OpenAI Agents SDK), point directly to:

```
https://tldmint.com/api/mcp
```

### Option B: Local `stdio` Bridge (`claude_desktop_config.json` / Cursor)

Clone this repository or run via `npx`:

```json
{
  "mcpServers": {
    "tldmint": {
      "command": "npx",
      "args": ["-y", "github:cputop/tldmint-mcp"]
    }
  }
}
```

---

## Companion Browser Utilities on TLDMint.com

Prefer an interactive UI? Every endpoint powers our free ad-free web suite:

- **[16 Niche Domain Name Generators](https://tldmint.com/tools/)** — Personal Email, [Homelab SSL Domains](https://tldmint.com/tools/homelab-domain-generator/), 5-Letter CVCVC Startup Names, Substack & Podcast URLs
- **[100-Domain Bulk & Keyword × TLD Matrix Checker](https://tldmint.com/bulk-checker/)** — Cross-multiply brand seeds across 12 TLDs + CSV export
- **[Interactive "Fix My Domain" DNS Troubleshooter Wizard](https://tldmint.com/dns-wizard/)** — Live line-by-line DNS diff for Vercel, Lovable, Shopify, Canva, GitHub Pages & Substack
- **[Domain Transfer & Renewal Savings Calculator](https://tldmint.com/transfer-calculator/)** — Escape GoDaddy, Squarespace & Bluehost renewal hikes with live 60-day transfer lock checks
- **[Free Embeddable Domain Search Widget Builder](https://tldmint.com/embed/)** — Customize and embed a live domain finder in 2 lines of HTML
- **[24 TLD Year-1 vs 3-Year Renewal Cost Benchmarks](https://tldmint.com/domains/)** — Compare `.COM`, `.AI`, `.IO`, `.XYZ`, `.DEV`, `.GG` & more across 4 registrars
- **[OpenAPI 3.1 Spec for Custom GPT Actions](https://tldmint.com/ai-api/)** — `https://tldmint.com/openapi.json`

---

## Free Embeddable Domain Availability Checker Widget (jsDelivr CDN)

Drop a zero-dependency, Shadow-DOM isolated live domain finder into any HTML page, WordPress blog, Webflow site, or documentation portal via **jsDelivr**:

```html
<script src="https://cdn.jsdelivr.net/gh/cputop/tldmint-mcp@1.0.0/dist/tldmint-widget.min.js"></script>
<tldmint-domain-search mode="saas-ai" theme="light" limit="6"></tldmint-domain-search>
```

Supported attributes:
- `mode`: `saas-ai`, `five-letter`, `homelab`, `personal-email`, `newsletter`, `ecommerce`, `99-cent`, `agency`, `domain-hack`
- `theme`: `light` (default) or `dark`
- `limit`: `3` to `15` (default `6`)

Customize and preview live at **[tldmint.com/embed/](https://tldmint.com/embed/)**.

---

## Open-Source Platform DNS Presets JSON (jsDelivr CDN)

Fetch verified `A`, `CNAME`, `MX`, and `SPF` DNS presets for **Vercel, Lovable, Netlify, Shopify, Canva, GitHub Pages, Substack, Framer, Namecheap Private Email, and Google Workspace** directly over CDN:

```
https://cdn.jsdelivr.net/gh/cputop/tldmint-mcp@1.0.0/data/dns-presets.json
```

---

## Example Prompts to Try in Claude or Cursor

- *"Generate 10 pronounceable 5-letter `.com` and `.io` domains for an AI observability startup and check which ones are actually unregistered right now."*
- *"Check bulk availability for `mintpilot` across `.com`, `.ai`, `.io`, `.dev`, `.xyz`, and `.co`."*
- *"Inspect the live MX, SPF, DMARC, and RDAP expiration date for `tldmint.com`."*

---

## License

MIT © [TLDMint](https://tldmint.com)
