import re
import json

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    landing_code = f.read()

# Let's find all transitions and variants in landing_code
transitions = re.findall(r'(\w+)\s*=\s*\{([^}]*duration:[^}]*)\}', landing_code)
print(f"Found {len(transitions)} transition objects")
for name, tr in transitions[:15]:
    print(f"Transition {name}: {tr.strip()}")

# Let's inspect breakpoints and layout dimensions
breakpoints = re.findall(r'min-width:\s*\d+px|max-width:\s*\d+px', landing_code)
print("Breakpoints in landing:", set(breakpoints))

