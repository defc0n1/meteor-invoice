import fixtures
import util
import time

def test_quick_gln_update(db, wd):
    wd.auth()
    item1 = fixtures.ITEM1.copy()
    db.items.insert(item1)
    item = fixtures.ITEM.copy()
    item.pop('gln_number')
    db.items.insert(item)
    util.click_button_by_id(wd, 'Varer')
    util.click_button_by_id(wd, 'quick-gln')
    elems = wd.find_elements_by_class_name("copy-ean")
    assert len(elems) == 1, 'expected one element without gln'
    elems[0] = wd.find_elements_by_class_name("copy-ean")
    editables = wd.find_elements_by_css_selector('.edit-field')
    gln_number = '1234'
    util.fill_xeditable_field(wd, editables[0], gln_number);
    elems = wd.find_elements_by_class_name("copy-ean")
    assert len(elems) == 0, 'expected no'


    # assert that the value has been updated
    item = db.items.find_one({ 'key': item['key'] })
    assert item['gln_number'] == gln_number


def test_quick_gln_copy_ean(db, wd):
    wd.auth()
    item1 = fixtures.ITEM1.copy()
    db.items.insert(item1)
    item = fixtures.ITEM.copy()
    item.pop('gln_number')
    db.items.insert(item)
    util.click_button_by_id(wd, 'Varer')
    util.click_button_by_id(wd, 'quick-gln')
    elems = wd.find_elements_by_class_name("copy-ean")
    assert len(elems) == 1, 'expected one element without gln'
    util.click_button_by_css_selector(wd, ".copy-ean")

    # assert that the value has been updated
    item = db.items.find_one({ 'key': item['key']})
    assert item['gln_number'] == item['ean']

    # assert that the element is not present anymore
    elems = wd.find_elements_by_class_name("copy-ean")
    assert len(elems) == 0, 'expected no'

def test_quick_gln_correct_disappear(db, wd):
    wd.auth()
    item = fixtures.ITEM.copy()
    item.pop('gln_number')
    db.items.insert(item)
    util.click_button_by_id(wd, 'Varer')
    util.click_button_by_id(wd, 'quick-gln')
    elems = wd.find_elements_by_class_name("copy-ean")
    assert len(elems) == 1, 'expected one element without gln'
    db.items.update({'key': item['key']}, {'gln_number': '1234'})
    time.sleep(1)
    elems = wd.find_elements_by_class_name("copy-ean")
    assert len(elems) == 0, 'expected item to be gone'
