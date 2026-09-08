import re
from html.parser import HTMLParser

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

# Let's find all elements with data-framer-name ending in "Section" or top-level wrappers
section_matches = re.finditer(r'<([a-zA-Z0-9]+)\s+[^>]*data-framer-name=[\'\"]([^\'\"]*Section[^\'\"]*|FAQ|Footer|Start With Yourself|Text Reveal|Hero[^\'\"]*)[^>]*>', html)

sections = []
for m in section_matches:
    tag = m.group(1)
    full_tag = m.group(0)
    # extract name
    name_m = re.search(r'data-framer-name=[\'\"]([^\'\"]+)[\'\"]', full_tag)
    name = name_m.group(1) if name_m else "unknown"
    # extract id if any
    id_m = re.search(r'id=[\'\"]([^\'\"]+)[\'\"]', full_tag)
    elem_id = id_m.group(1) if id_m else ""
    # extract class
    class_m = re.search(r'class=[\'\"]([^\'\"]+)[\'\"]', full_tag)
    elem_class = class_m.group(1) if class_m else ""
    sections.append({
        'pos': m.start(),
        'tag': tag,
        'name': name,
        'id': elem_id,
        'class': elem_class
    })

print(f"Found {len(sections)} matching section tags:")
for i, s in enumerate(sections):
    print(f"{i+1}. Pos: {s['pos']}, Name: '{s['name']}', Tag: <{s['tag']}>, ID: '{s['id']}', Class: '{s['class'][:40]}...'")

