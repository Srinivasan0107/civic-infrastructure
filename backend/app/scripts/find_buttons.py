import glob, re

paths = glob.glob('frontend/src/**/*.tsx', recursive=True)
for p in sorted(paths):
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    btns = re.findall(r'<button\b[^>]*>', content)
    btn_links = re.findall(r'<Link\b[^>]*className=[\'"][^\'"]*btn[^\'"]*[\'"]', content)
    if btns or btn_links:
        print(f"{p}: {len(btns)} buttons, {len(btn_links)} btn-links")
