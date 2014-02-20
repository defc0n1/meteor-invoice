import time
import util

item_key = '123456789'
def test_create_item(wd, db):
    wd.auth()
    util.click_button_by_id(wd, 'Varer')
    util.click_button_by_id(wd, 'newItem')
    util.form_fill_by_css_selector(wd, '.bootbox .bootbox-input', item_key)
    util.click_button_by_css_selector(wd, '.bootbox .btn-primary')

    test_item = {
        'name': 'name',
        'group': 'group',
        'cost_price': '1',
        'price': '2',
        'price_1': '3',
        'price_2': '4',
        'price_3': '5',
        'price_4': '6',
        'inner_box': '7',
        'outer_box': '8',
        'ean': '9',
        'quantity': '10',
    }

    for key, value in test_item.iteritems():
        util.fill_xeditable_field(wd, key, value);

    item = db.items.find_one({ 'key': item_key })
    assert item != None

    for key, value in test_item.iteritems():
        assert item[key] == value

def teardown_module(module):
    pass