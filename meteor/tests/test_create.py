import time
import util
import fixtures

def test_create_item(db, wd):
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

    i = db.items.find_one({'key': item_key})
    assert i

    for key, value in item.iteritems():
        assert i[key] == value


def test_create_deptor(db, wd):
    deptor = fixtures.DEPTOR.copy()
    deptor_key = deptor.pop('key')

    wd.auth()
    util.click_button_by_id(wd, 'Kontakter')
    util.click_button_by_id(wd, 'newDeptor')
    util.form_fill_by_css_selector(wd, '.bootbox .bootbox-input', deptor_key)
    util.click_button_by_css_selector(wd, '.bootbox .btn-primary')

    for key, value in deptor.iteritems():
        if key in ['primary_emails', 'secondary_emails']:
            for val in value:
                elem = wd.find_elements_by_css_selector('.add-list-{}'.format(key))[0]
                util.fill_xeditable_field(wd, elem, val)
        elif key in ['gln_group']:
            all_options = wd.find_elements_by_tag_name("option")
            for option in all_options:
                o_value = option.get_attribute("value")
                print "Value is: %s" % o_value
                if o_value == value:
                    option.click()

        else:
            elem = wd.find_element_by_id(key)
            util.fill_xeditable_field(wd, elem, value)

    d = db.deptors.find_one({'key': deptor_key})
    assert d

    for key, value in deptor.iteritems():
        assert d[key] == value
