import zipfile
from pathlib import Path
import re
p=Path(r't:/ml_project/final_report_format.docx')
xml=zipfile.ZipFile(p).read('word/document.xml').decode('utf-8','ignore')
texts=re.findall(r'<w:t[^>]*>(.*?)</w:t>', xml)
text=''.join([t+'\n' for t in texts])
Path(r't:/ml_project/_docx_text.txt').write_text(text, encoding='utf-8')
print('wrote', len(text))
