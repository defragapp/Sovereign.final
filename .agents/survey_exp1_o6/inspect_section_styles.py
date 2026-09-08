import re

with open('/Users/cjo/Sovereign.final/.agents/survey_exp1_o6/ssr_styles.css') as f:
    css = f.read()

target_classes = [
    # Nav
    'framer-8pbdi3', 'framer-1g7tdyi', 'framer-wlww4a', 'framer-gcjtmo', 'framer-1um9kbg', 'framer-yb73mw',
    # Hero
    'framer-18femmv', 'framer-1gffwn7', 'framer-knjtz1-container', 'framer-1ennkrg', 'framer-9s1ge8',
    'framer-1mnq5vh', 'framer-13cwpfj', 'framer-1lyxcuk', 'framer-93qf5f-container', 'framer-vg2egy-container',
    'framer-1m40qh5', 'framer-1a1ehbx', 'framer-b0087j', 'framer-9jv8xs', 'framer-10wbp92',
    # Glow
    'framer-436ii3', 'framer-1ykp0g5', 'framer-1dbxvbt', 'framer-1lyse93', 'framer-1ytd2cr', 'framer-1jjvits',
    # About
    'framer-g0xfnu', 'framer-1qg8mn2', 'framer-64tebd', 'framer-156qq0v',
    # Impact
    'framer-m09nmb', 'framer-13746jr', 'framer-1efx8f8',
    # Process
    'framer-x58hde', 'framer-1xap4vh', 'framer-1d3gxt9',
    # Features
    'framer-yi5hfl', 'framer-86gd72', 'framer-uugprf',
    # Testimonials
    'framer-1d2xjte', 'framer-18iyemz', 'framer-1j3hrtt',
    # Start With Yourself / Pricing
    'framer-9o0xhc',
    # FAQ
    'framer-1az5ofq', 'framer-kwgsjm', 'framer-1kekoru',
    # Contact
    'framer-1heyl85', 'framer-1tgknnn',
    # Footer
    'framer-bsoi5h', 'framer-1283csf', 'framer-1l5ljkf'
]

for tc in target_classes:
    pattern = rf'(\.{tc}(?:\.[a-zA-Z0-9_-]+)*[^{{]*\{{[^}}]+\}})'
    rules = re.findall(pattern, css)
    # also find media query rules
    media_pattern = rf'(@media[^{{]+\{{[^{{]*\.{tc}[^{{]*\{{[^}}]+\}}\s*\}})'
    media_rules = re.findall(media_pattern, css)
    print(f"=== CLASS: {tc} ===")
    for r in rules:
        print(r)
    for mr in media_rules:
        print(mr)
    print()

