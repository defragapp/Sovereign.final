import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

# Let's inspect each named component in the file:
card_components = [
    'Card Illustration 1', 'Card Illustration 2', 'Card Illustration 3', 'Card Illustration 4',
    'Impact Card', 'Process Card', 'Testimonial Card', 'Pricing Card', 'Pricing Section', 'Chat Glow', 'Total Users'
]

for name in card_components:
    idx = text.find(f'displayName=`{name}`')
    if idx == -1:
        idx = text.find(f'displayName="{name}"')
    if idx != -1:
        print(f"=== COMPONENT: {name} (near idx {idx}) ===")
        # Look backwards for component function start
        start = max(0, idx - 4000)
        snippet = text[start:idx+300]
        # Find defaultProps
        dp = re.findall(r'defaultProps\s*=\s*\{([^}]+)\}', snippet)
        if dp:
            print("  defaultProps:", dp[-1])
        # Find variants
        variants = re.findall(r'variantClassNames\s*:\s*\{([^}]+)\}', snippet)
        if variants:
            print("  variants:", variants[-1])
        # Find transitions
        transitions = re.findall(r'(\w+)\s*=\s*\{([^}]*duration:[^}]*)\}', snippet)
        if transitions:
            for tr_name, tr_body in transitions[:3]:
                print(f"  transition {tr_name}: {tr_body}")
        # Find any text or labels inside
        labels = re.findall(r'children:\s*[`\'"]([^`\'"]{3,60})[`\'"]', snippet)
        if labels:
            print("  sample labels:", labels[:5])
        print()

