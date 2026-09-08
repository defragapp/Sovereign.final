import re
import json

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/raw_landing.html') as f:
    html = f.read()

# Let's find the FAQ questions and answers
faq_questions = re.findall(r'<p[^>]*class=\"[^\"]*framer-styles-preset-[^\"]*\"[^>]*>\s*What[^<]+|\s*Can[^<]+|\s*Is[^<]+', html)
print("FAQ questions found:")
for q in set(faq_questions):
    clean = re.sub(r'<[^>]+>', '', q).strip()
    if clean:
        print(" -", clean)

# Let's find FAQ answers from searchIndex.json or HTML
with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/searchIndex.json') as f:
    search_data = json.load(f)

print("\nSearchIndex page '/' content keys:")
for k, v in search_data.get('/', {}).items():
    if k in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        print(f"Heading {k}: {v}")

