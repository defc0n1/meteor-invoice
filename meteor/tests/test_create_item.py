import time
import util
import fixtures

def test_create_item(wd):
    wd.auth()
    util.click_button_by_id(wd, 'Varer')
    util.click_button_by_id(wd, 'newItem')
    util.form_fill_by_css_selector(wd, '.bootbox .bootbox-input', fixtures.ITEM['key'])
    util.click_button_by_css_selector(wd, '.bootbox .btn-primary')


    for key, value in fixtures.ITEM.iteritems():
        util.fill_xeditable_field(wd, key, value);

    item = wd.db.items.find_one({ 'key': fixtures.ITEM['key'] })
    assert item != None

    for key, value in fixtures.ITEM.iteritems():
        assert item[key] == value

def teardown_module(module):
    pass
