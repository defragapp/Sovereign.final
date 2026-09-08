import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

# Let's search for the Process Section in landing page code
# The section has id="process"
idx = text.find('process')
while idx != -1:
    snippet = text[max(0, idx-200):idx+800]
    if 'Ask about your life' in snippet or 'Why am I so good' in snippet or 'The Intelligence' in snippet:
        print("Found process snippet at", idx)
        print(snippet[:600])
        print("="*60)
    idx = text.find('process', idx+1)
