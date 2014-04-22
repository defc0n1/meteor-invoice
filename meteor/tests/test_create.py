import time
import util
import fixtures

def test_create_item(wd):
    item = fixtures.ITEM.copy()
    item_key = item.pop('key')

    wd.auth()
    util.click_button_by_id(wd, 'Varer')
    util.click_button_by_id(wd, 'newItem')
    util.form_fill_by_css_selector(wd, '.bootbox .bootbox-input', item_key)
    util.click_button_by_css_selector(wd, '.bootbox .btn-primary')


    for key, value in item.iteritems():
        elem = wd.find_element_by_id(key)
        util.fill_xeditable_field(wd, elem, value)

    item = wd.db.items.find_one({'key': item_key})
    assert item != None

    for key, value in item.iteritems():
        assert item[key] == value


def test_create_deptor(wd):
    deptor = fixtures.DEPTOR.copy()
    deptor_key = deptor.pop('key')

    wd.auth()
    util.click_button_by_id(wd, 'Kontakter')
    util.click_button_by_id(wd, 'newDeptor')
    util.form_fill_by_css_selector(wd, '.bootbox .bootbox-input', deptor_key)
    util.click_button_by_css_selector(wd, '.bootbox .btn-primary')

    for key, value in deptor.iteritems():
        elem = wd.find_element_by_id(key)
        util.fill_xeditable_field(wd, elem, value);

    deptor = wd.db.deptors.find_one({'key': deptor_key})
    assert deptor != None

    for key, value in deptor.iteritems():
        assert deptor[key] == value

