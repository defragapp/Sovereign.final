import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/cZc30IhbL.D-4OUuFH.mjs') as f:
    text = f.read()

# Let's search for all W88zB8mIG and T8rQFvSBR
questions = re.findall(r'W88zB8mIG:\s*[`\'"]([^`\'"]+)[`\'"]', text)
answers = re.findall(r'T8rQFvSBR:\s*[`\'"]([^`\'"]+)[`\'"]', text)

print(f"Found {len(questions)} questions and {len(answers)} answers")
for i in range(min(len(questions), len(answers))):
    print(f"Q{i+1}: {questions[i]}")
    print(f"A{i+1}: {answers[i]}\n")
