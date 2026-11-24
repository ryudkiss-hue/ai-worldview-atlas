"""Renders paper/booklet.html to public/ai-worldview-atlas-paper.pdf with Python Playwright's Chromium."""
import os
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(HERE, 'booklet.html')
out = os.path.join(os.path.dirname(HERE), 'public', 'ai-worldview-atlas-paper.pdf')
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto('file://' + src); pg.wait_for_timeout(800)
    pg.evaluate("document.fonts.ready")
    pg.pdf(path=out, format='Letter', print_background=True, prefer_css_page_size=True,
           display_header_footer=True, header_template='<div></div>',
           footer_template='<div style="width:100%;font-size:7pt;font-family:monospace;color:#6b7772;padding:0 0.65in;display:flex;justify-content:space-between"><span>AI Worldview Atlas · paper edition</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
           margin={'top': '0.6in', 'bottom': '0.7in', 'left': '0.65in', 'right': '0.65in'})
    b.close()
print('wrote', out)
