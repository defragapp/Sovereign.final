import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

# Extract the navbar HTML block
nav_match = re.search(r'(<nav[^>]*>.*?</nav>)', html, re.DOTALL)
if not nav_match:
    # search for framer-8pbdi3
    idx = html.find('framer-8pbdi3')
    start = html.rfind('<', 0, idx)
    print("Navbar HTML slice:")
    print(html[start:start+4000])
else:
    print(nav_match.group(1)[:3000])

