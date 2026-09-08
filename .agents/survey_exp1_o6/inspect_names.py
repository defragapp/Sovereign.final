import glob
import re
import os

files = sorted(glob.glob('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/*.mjs'))
for f in files:
    with open(f) as fp:
        content = fp.read()
    display_names = re.findall(r'\.displayName\s*=\s*[`\'"]([^`\'"]+)[`\'"]', content)
    if display_names:
        print(os.path.basename(f), '->', display_names)
