import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/ssr_styles.css') as f:
    css = f.read()

# Search for presets and font styles
presets = re.findall(r'(\.framer-styles-preset-[a-zA-Z0-9]+|\.framer-[A-Za-z0-9]+)[^{]*\{([^}]+)\}', css)

font_presets = {}
for selector, body in presets:
    if 'font-' in body or '--font-' in body or '--framer-font-' in body:
        # extract properties
        props = {}
        for line in body.split(';'):
            if ':' in line:
                k, v = line.split(':', 1)
                k = k.strip()
                v = v.strip()
                if any(x in k for x in ['font', 'letter-spacing', 'line-height', 'text-transform', 'color']):
                    props[k] = v
        if props:
            font_presets[selector] = props

print(f"Found {len(font_presets)} typography rule blocks")
for sel, p in list(font_presets.items())[:25]:
    print(f"{sel}:")
    for k, v in p.items():
        print(f"  {k}: {v}")
