from docx import Document
from pathlib import Path
path=Path(r't:/ml_project/final_report_format.docx')
doc=Document(path)
heads=[]
for i,p in enumerate(doc.paragraphs):
    if p.style.name.startswith('Heading') and p.text.strip():
        heads.append((i,p.style.name,p.text.strip()))
Path(r't:/ml_project/_docx_headings.txt').write_text('\n'.join([f'{i}\t{style}\t{text}' for i,style,text in heads]), encoding='utf-8')
print('headings', len(heads))
