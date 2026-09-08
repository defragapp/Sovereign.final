import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/ssr_styles.css') as f:
    css = f.read()

# Find font family declarations
font_matches = re.findall(r'(\.framer-[a-zA-Z0-9_-]+)[^{]*\{[^}]*(--framer-font-family|font-family):\s*([^;}]+)', css)
fonts = {}
for cl, prop, fam in font_matches:
    fam = fam.strip().replace('"', '').replace("'", "")
    if fam not in fonts:
        fonts[fam] = []
    if len(fonts[fam]) < 10:
        fonts[fam].append(cl)

print("Font families used in CSS:")
for fam, classes in fonts.items():
    print(f"Family: {fam} (Count: {len(classes)} classes, sample: {classes[:5]})")
