import subprocess
import os

try:
    out = subprocess.check_output('git log --all --format="%h | %an | %ae | %s"', shell=True, text=True)
    with open('git_log_parsed.txt', 'w', encoding='utf-8') as f:
        f.write(out)
except Exception as e:
    with open('git_log_parsed.txt', 'w', encoding='utf-8') as f:
        f.write(str(e))

try:
    import fitz
    doc = fitz.open('Team_128_report_20260409.pdf')
    text = ""
    for page in doc:
        text += page.get_text()
    with open('report_parsed.txt', 'w', encoding='utf-8') as f:
        f.write(text)
except Exception as e:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader('Team_128_report_20260409.pdf')
        with open('report_parsed.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join([p.extract_text() for p in reader.pages]))
    except Exception as e2:
        with open('report_parsed.txt', 'w', encoding='utf-8') as f:
            f.write("Failed: " + str(e2))
