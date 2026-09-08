import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/ssr_styles.css') as f:
    css = f.read()

presets = set(re.findall(r'\.framer-styles-preset-[a-zA-Z0-9]+', css))

for p in sorted(presets):
    # Find all rules matching this preset (including media queries if any)
    rules = re.findall(rf'({re.escape(p)}[^{{]*\{{[^}}]+\}})', css)
    print(f"=== PRESET: {p} ===")
    for r in rules[:3]:
        print(r)
    print()
