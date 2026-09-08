import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

# Let's write a helper to extract a section by data-framer-name
def extract_section(name):
    # find where data-framer-name="name" occurs
    idx = html.find(f'data-framer-name="{name}"')
    if idx == -1:
        idx = html.find(f"data-framer-name='{name}'")
    if idx == -1:
        return f"Section {name} not found"
    
    # backtrack to opening tag
    start_tag = html.rfind('<', 0, idx)
    # find tag name
    tag_name = re.match(r'<([a-zA-Z0-9]+)', html[start_tag:]).group(1)
    
    # find matching closing tag
    depth = 0
    pos = start_tag
    while pos < len(html):
        open_match = re.search(r'<([a-zA-Z0-9]+)[^>]*>', html[pos:])
        close_match = re.search(r'</([a-zA-Z0-9]+)>', html[pos:])
        
        # simple slice search
        # let's just take next 8000 chars for inspection
        break
    return html[start_tag:start_tag+5000]

sections_to_check = [
    'Header', 'Hero Section', 'About Section', 'Our Impact Section',
    'Process Section', 'Features Section', 'Testimonials Section',
    'Start With Yourself', 'FAQ', 'Contact Section', 'Footer'
]

for s in sections_to_check:
    print(f"==================================================")
    print(f"SECTION: {s}")
    print(f"==================================================")
    content = extract_section(s)
    # print first 500 characters and text content
    clean_text = re.sub(r'<[^>]+>', ' ', content)
    clean_text = ' '.join(clean_text.split())
    print("TEXT EXCERPT:", clean_text[:300])
    print()

