import sys
import subprocess

try:
    import pypdf
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pypdf', '-q'])
    import pypdf

try:
    with open('t:\\ml_project\\Team_128_report_20260319.pdf', 'rb') as f:
        reader = pypdf.PdfReader(f)
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"--- Page {i+1} ---\n"
            text += page.extract_text() + "\n"
        
        with open('t:\\ml_project\\pdf_output_utf8.txt', 'w', encoding='utf-8') as out:
            out.write(text)
        print("Done")
except Exception as e:
    print(f"Error reading PDF: {e}")
