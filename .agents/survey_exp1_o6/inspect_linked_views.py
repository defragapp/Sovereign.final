import re

def inspect_page(path, name):
    print(f"================================ {name} ================================")
    with open(path) as f:
        text = f.read()
    
    # find titles, headings, texts
    headings = re.findall(r'children:\s*p\([^,]+,\{[^}]*children:\s*[`\'"]([^`\'"]{3,100})[`\'"]', text)
    print("Headings/texts:", headings[:10])

    framer_names = re.findall(r'\"data-framer-name\":\s*[`\'"]([^`\'"]+)[`\'"]', text)
    print("Framer names:", set(framer_names))

inspect_page('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/contact.mjs', 'CONTACT')
inspect_page('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/privacy.mjs', 'PRIVACY')
inspect_page('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/terms.mjs', 'TERMS')

