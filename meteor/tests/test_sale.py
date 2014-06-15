import util
import ftplib
import time
import fixtures
from datetime import datetime

def insert_invoice(wd, db):
    wd.auth()
    db.sale.insert(fixtures.INVOICE)
    util.click_button_by_id(wd, 'Salg')
    util.form_fill_by_id(wd, 'search-query', fixtures.INVOICE['key'])
    elems = wd.find_elements_by_class_name("edi-button")
    assert len(elems) == 1, 'wrong number of elements after search'
    red_buttons = wd.find_elements_by_class_name("btn-danger")
    assert len(red_buttons) == 0, 'no red buttons should be present'
    elems[0].click()

    util.click_button_by_css_selector(wd, '.bootbox .btn-primary')

def test_send_edi_no_deptor(wd, db):
    insert_invoice(wd, db)
    elems = wd.find_elements_by_class_name("alert")
    assert len(elems) == 1, 'wrong number of errors'
    #red_buttons = wd.find_elements_by_class_name("btn-danger")
    #assert len(red_buttons) == 1, 'one red button should be present'

def test_send_edi_no_gln_group(wd, db):
    deptor = fixtures.DEPTOR.copy()
    deptor.pop('gln_group')
    db.deptors.insert(deptor)
    insert_invoice(wd, db)
    elems = wd.find_elements_by_class_name("alert")
    assert len(elems) == 1, 'wrong number of errors'

def test_send_edi_no_gln_number_deptor(wd, db):
    deptor = fixtures.DEPTOR.copy()
    deptor.pop('gln')
    db.deptors.insert(deptor)
    insert_invoice(wd, db)
    elems = wd.find_elements_by_class_name("alert")
    assert len(elems) == 1, 'wrong number of errors'

def test_send_edi_missing_item(wd, db):
    db.deptors.insert(fixtures.DEPTOR)
    insert_invoice(wd, db)
    elems = wd.find_elements_by_class_name("alert")
    assert len(elems) == 1, 'wrong number of errors'

def test_send_edi_miising_gln_item(wd, db):
    db.deptors.insert(fixtures.DEPTOR)
    item = fixtures.ITEM1.copy()
    item.pop('gln_number')
    db.items.insert(item)
    insert_invoice(wd, db)
    elems = wd.find_elements_by_class_name("alert")
    assert len(elems) == 1, 'wrong number of errors'

resp = ''
def test_send_edi(wd, db):

    expected = [
        "UNA:+.? '",
        "UNB+UNOC:3+9000026704561:14+5790000000852:14+140416:1410+1397650243++++0++1'",
        "UNH+1397650243+INVOIC:D:96A:UN:EAN008'",
        "BGM+380+91085+9'",
        "DTM+137:{}:102'".format(datetime.now().strftime('%Y%m%d')),
        "RFF+VN:1197629'",
        "RFF+AAU:91085'",
        "DTM+171::102'",
        "NAD+BY+5790000004072::9'",
        "NAD+SU+9000026704561::9'",
        "NAD+DP+123::9'",
        "NAD+IV+5790000000852::9'",
        "TAX+7+VAT::9+++:::25+S'",
        "CUX+2:DKK:4'",
        "LIN+1++5707283700003:EN'",
        "PIA+1+70000:SA'",
        "IMD+F++:::Neglelak:'",
        "QTY+47:9:PK'",
        "MOA+203:76.50'",
        "PRI+AAA:8.50'",
        "UNS+S'",
        "CNT+2:1'",
        "MOA+79:76.50'",
        "MOA+86:95.63'",
        "MOA+125:76.50'",
        "MOA+176:19.13'",
        "TAX+7+VAT::9+++:::25++S'",
        "UNT+26+1397650243'",
        "UNZ+1+1397650243'",
    ]

    db.deptors.insert(fixtures.DEPTOR)
    db.items.insert(fixtures.ITEM1)
    insert_invoice(wd, db)
    elems = wd.find_elements_by_class_name("alert")
    assert len(elems) == 0, 'wrong number of errors'
    green_buttons = wd.find_elements_by_class_name("btn-success")
    assert len(green_buttons) == 1, 'one green button should be present'

    ftp = ftplib.FTP('ettienne.webfactional.com')
    ftp.login('navigator', 'luxemb0rg')
    ftp.cwd('PROD/EDISGR/D0901-FROM-EDISGR')
    files = []
    def get_time(l):
        split = [x.strip() for x in l.split(' ') if x.strip()]
        print split
        t = str(time.gmtime().tm_year) + '-' + split[5].strip() + '-'+split[6].strip() + '-' + split[7].strip()
        tt = datetime.strptime(t,"%Y-%b-%d-%H:%M")
        files.append((tt, split[8]))
    l = ftp.retrlines('LIST', get_time)
    files = sorted(files,key=lambda x: x[0])

    resp_lines = []
    def retrieve(l):
        for line in l.split('\n'):
            if line:
                resp_lines.append(line)

    ftp.retrbinary('RETR {}'.format(files[-1][1]), retrieve)
    assert resp_lines[0] == expected[0]
    assert resp_lines[3:-2] == expected[3:-2]
    ftp.close()



#test remaining cases, test resend
