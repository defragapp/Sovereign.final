import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

# Let's search for "Two Baselines" and "Relationship context" and "Family system"
for term in ["Two Baselines", "Relationship context", "Family system"]:
    idx = text.find(term)
    if idx != -1:
        print(f"=== Found {term} at {idx} ===")
        print(text[max(0, idx-100):idx+400])
        print("="*60)
