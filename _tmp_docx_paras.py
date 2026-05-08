from docx import Document
from pathlib import Path
import json
path=Path(r't:/ml_project/final_report_format.docx')
doc=Document(path)
rows=[]
for i,p in enumerate(doc.paragraphs):
    rows.append({'i': i, 'style': p.style.name, 'text': p.text})
Path(r't:/ml_project/_docx_paragraphs.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
print('paras', len(rows))
