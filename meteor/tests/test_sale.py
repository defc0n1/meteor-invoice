import util
import time
from selenium.webdriver.support.ui import WebDriverWait

def test_send_edi(wd, db):
    wd.auth()
    util.click_button_by_id(wd, 'Salg')
    util.form_fill_by_id(wd, 'search-query', '89583')
    time.sleep(2)
    elems = wd.find_elements_by_class_name("edi-button")
    assert len(elems) == 1, 'to many elements after search'
    red_buttons = wd.find_elements_by_class_name("btn-danger")
    assert len(red_buttons) == 0, 'no red buttons should be present'
    elems[0].click()
    elems = wd.find_elements_by_class_name("alert")
    assert len(elems) == 1, 'to many errors'
    red_buttons = wd.find_elements_by_class_name("btn-danger")
    assert len(red_buttons) == 1, 'one red button should be present'
#def teardown_module(mongo):
    #mongo.alerts.drop()
    
##clear edi, clear cache

