import time
import util

def test_create_item(wd, db):
    key = '123456789'

    wd.auth()
    util.click_button_by_id(wd, 'Varer')
    util.click_button_by_id(wd, 'newItem')
    util.form_fill_by_css_selector(wd, '.bootbox .bootbox-input', key)
    util.click_button_by_css_selector(wd, '.bootbox .btn-primary')

    editables = wd.find_elements_by_class_name('editable')
    print editables

    item = db.items.find({ 'key': key })
    assert item != None
    db.items.remove({ 'key': key })