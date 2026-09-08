import json
import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

# Extract __framer__appearAnimationsContent
m = re.search(r'<script id="__framer__appearAnimationsContent"[^>]*>(.*?)</script>', html, re.DOTALL)
if m:
    anim_data = json.loads(m.group(1))
    print("=== APPEAR ANIMATIONS CONTENT ===")
    print(json.dumps(anim_data, indent=2)[:3000])
    with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/appear_animations.json', 'w') as out:
        json.dump(anim_data, out, indent=2)
    print("Saved appear_animations.json")

# Extract __framer__breakpoints
m2 = re.search(r'<script id="__framer__breakpoints"[^>]*>(.*?)</script>', html, re.DOTALL)
if m2:
    bp_data = json.loads(m2.group(1))
    print("=== BREAKPOINTS ===")
    print(json.dumps(bp_data, indent=2))
