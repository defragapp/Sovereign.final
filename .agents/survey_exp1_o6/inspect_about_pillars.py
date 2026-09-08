import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

# find where "SELF" or "BETWEEN" or "WHOLE" occurs
for term in ["SELF", "BETWEEN", "WHOLE"]:
    idx = text.find(term)
    while idx != -1:
        print(f"Found {term} at {idx}:")
        print(text[max(0, idx-100):idx+300])
        print("="*60)
        idx = text.find(term, idx+1)
