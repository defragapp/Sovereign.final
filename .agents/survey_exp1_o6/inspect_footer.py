import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

footer_idx = html.find('data-framer-name="Footer"')
while footer_idx != -1:
    start = html.rfind('<', 0, footer_idx)
    print("=== FOOTER SLICE ===")
    print(html[start:start+2500])
    print("="*60)
    footer_idx = html.find('data-framer-name="Footer"', footer_idx+1)

