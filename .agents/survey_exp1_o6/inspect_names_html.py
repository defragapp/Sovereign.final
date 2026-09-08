import re
from html.parser import HTMLParser

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

# Let's find all section tags or top-level containers inside #main
main_idx = html.find('id="main"')
print("Found main at", main_idx)

# Let's search for all data-framer-name attributes
names = re.findall(r'data-framer-name=[\'\"]([^\'\"]+)[\'\"]', html)
print(f"Found {len(names)} elements with data-framer-name")
for n in set(names):
    print(" - Name:", n)

