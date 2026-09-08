import json
import re
from html.parser import HTMLParser

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/appear_animations.json') as f:
    appear = json.load(f)

for key in appear.keys():
    # search for class framer-{key}
    pattern = rf'class=\"[^\"]*framer-{key}[^\"]*\"'
    matches = re.findall(rf'<([a-zA-Z0-9]+)\s+[^>]*class=\"([^\"]*framer-{key}[^\"]*)\"[^>]*>(.*?)</\1>', html, re.DOTALL)
    if matches:
        tag, classes, inner = matches[0]
        # clean inner text
        clean_text = re.sub(r'<[^>]+>', ' ', inner).strip()[:100]
        print(f"Key: {key} -> Tag: <{tag}>, Classes: {classes}")
        print(f"   Text/Inner: {clean_text}\n")
    else:
        # maybe self-closing or container
        matches2 = re.findall(rf'<([a-zA-Z0-9]+)\s+[^>]*class=\"([^\"]*framer-{key}[^\"]*)\"', html)
        if matches2:
            tag, classes = matches2[0]
            print(f"Key: {key} -> Tag: <{tag}>, Classes: {classes} (no inner match)\n")
        else:
            print(f"Key: {key} -> Not found in HTML by class\n")
