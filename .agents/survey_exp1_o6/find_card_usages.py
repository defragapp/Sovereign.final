import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/-yWFydp2_K7xkqc2UuFAhxJUepLDUGgUzdKz6Xi-P0Q.DiYx201D.mjs') as f:
    text = f.read()

matches = re.findall(r'(\w+)\.displayName\s*=\s*[`\'"]Card Illustration (\d)[`\'"]', text)
for var_name, num in matches:
    print(f"Card Illustration {num} is {var_name}")
    # find where var_name is called
    calls = [m.start() for m in re.finditer(rf'p\({var_name},', text)]
    print(f"  Called {len(calls)} times at indices: {calls}")
    for idx in calls:
        print(f"    Context: {text[max(0, idx-100):idx+150]}\n")
