import re
from html.parser import HTMLParser

class DOMNode:
    def __init__(self, tag, attrs, parent=None):
        self.tag = tag
        self.attrs = dict(attrs)
        self.parent = parent
        self.children = []
        self.text = ""

    def add_child(self, child):
        self.children.append(child)

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = DOMNode("root", {})
        self.current = self.root

    def handle_starttag(self, tag, attrs):
        node = DOMNode(tag, attrs, self.current)
        self.current.add_child(node)
        # void tags don't nest
        if tag not in ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']:
            self.current = node

    def handle_endtag(self, tag):
        if tag not in ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']:
            if self.current.parent:
                self.current = self.current.parent

    def handle_data(self, data):
        cleaned = data.strip()
        if cleaned:
            self.current.text += (" " + cleaned if self.current.text else cleaned)

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html_content = f.read()

parser = PageParser()
parser.feed(html_content)

# Let's inspect the body and main containers
def print_tree(node, depth=0, max_depth=6):
    if depth > max_depth:
        return
    indent = "  " * depth
    classes = node.attrs.get("class", "")
    elem_id = node.attrs.get("id", "")
    framer_name = node.attrs.get("data-framer-name", "")
    info = []
    if elem_id: info.append(f"id='{elem_id}'")
    if framer_name: info.append(f"name='{framer_name}'")
    if classes:
        # show first 2 classes
        cl_list = classes.split()
        info.append(f"class='{' '.join(cl_list[:2])}{'...' if len(cl_list)>2 else ''}'")
    
    txt = node.text[:50] + ("..." if len(node.text) > 50 else "") if node.text else ""
    if txt:
        info.append(f"text='{txt}'")
    
    summary = f"<{node.tag} {' '.join(info)}>"
    # Only print significant nodes or nodes with children/text
    if node.tag in ['section', 'header', 'footer', 'nav', 'main', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a'] or elem_id or framer_name or (depth <= 3 and node.tag == 'div'):
        print(f"{indent}{summary}")
    
    for child in node.children:
        print_tree(child, depth + 1, max_depth)

print("=== PAGE TREE SUMMARY ===")
print_tree(parser.root, max_depth=5)
