import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

# Find the Home component function definition
idx = text.rfind('Home')
print("Home occurrences near end:")
while idx != -1:
    print(idx, text[idx-50:idx+150])
    idx = text.rfind('Home', 0, idx)
    if len(text) - idx > 100000:
        break
