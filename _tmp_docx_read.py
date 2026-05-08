import zipfile
from pathlib import Path
p=Path(r't:/ml_project/final_report_format.docx')
with zipfile.ZipFile(p) as z:
    xml=z.read('word/document.xml').decode('utf-8',errors='ignore')
print(xml[:4000])
