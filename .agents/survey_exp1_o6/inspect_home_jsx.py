import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

home_code = text[624551:711517]

# Let's find all component calls in Home
# Framer uses jsx runtime p(...) or f(...) or jsx(...)
# Let's find all subcomponent names used in Home
subcomponents = re.findall(r'f\((\w+),\{([^}]+)\}', home_code)
print(f"Found {len(subcomponents)} subcomponent calls")

# Find section elements or IDs
section_ids = re.findall(r'id:\s*[`\'"]([^`\'"]+)[`\'"]', home_code)
print("Section/element IDs in Home:", set(section_ids))

# Let's inspect classNames
class_names = re.findall(r'className:\s*[`\'"]([^`\'"]+)[`\'"]', home_code)
print(f"Found {len(class_names)} classNames")
print("Sample classNames:", class_names[:20])

# Find headings, texts, strings
strings = re.findall(r'children:\s*[`\'"]([^`\'"]{5,100})[`\'"]', home_code)
print(f"Found {len(strings)} text strings in Home")
for s in strings[:30]:
    print(" -", s)
