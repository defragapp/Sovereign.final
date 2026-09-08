import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

illustrations = [
    ('Card Illustration 1', 501933),
    ('Card Illustration 2', 123643),
    ('Card Illustration 3', 599866),
    ('Card Illustration 4', 102243)
]

for name, idx in illustrations:
    print(f"==================================================")
    print(f"ILLUSTRATION: {name}")
    print(f"==================================================")
    start = max(0, idx - 15000)
    snippet = text[start:idx]
    # find all strings in snippet
    strings = re.findall(r'children:\s*(?:p\([^)]+\)|[`\'"]([^`\'"]{3,120})[`\'"])', snippet)
    clean_strings = []
    for s in strings:
        if isinstance(s, str) and len(s.strip()) > 2 and not s.startswith('var('):
            clean_strings.append(s.strip())
    print("Strings in illustration:", clean_strings[:15])
    
    # find data-framer-names
    names = re.findall(r'\"data-framer-name\":\s*[`\'"]([^`\'"]+)[`\'"]', snippet)
    print("Framer names in illustration:", set(names))
    print()

