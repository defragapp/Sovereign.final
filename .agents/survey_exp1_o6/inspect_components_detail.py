import re
import json

def inspect_file(path, label):
    print(f"================== {label} ({path}) ==================")
    with open(path) as f:
        text = f.read()
    
    # Find variants
    variants = re.findall(r'variantClassNames\s*:\s*\{([^}]+)\}', text)
    if variants:
        print("Variants:", variants[0].strip())

    # Find transitions
    transitions = re.findall(r'(\w+)\s*=\s*\{([^}]*duration:[^}]*)\}', text)
    if transitions:
        print(f"Found {len(transitions)} transitions:")
        for name, tr in transitions[:10]:
            print(f"  {name}: {tr.strip()}")

    # Find defaultProps
    dp = re.findall(r'defaultProps\s*=\s*\{([^}]+)\}', text)
    if dp:
        print("DefaultProps:", dp[0].strip()[:200])

inspect_file('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/DCt_6Cz6w.C8SGroaF.mjs', 'MAIN BUTTON')
inspect_file('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/RkYOI0MxY.Dxx6MSV8.mjs', 'SECTION HEADER')
inspect_file('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/cZc30IhbL.D-4OUuFH.mjs', 'ACCORDION / BADGE / DOT')
inspect_file('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/script_main.0D24Rp15.mjs', 'NAVIGATION & FOOTER')

