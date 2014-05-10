import fixtures
import util
import time

def test_customer_order_number_update(wd, db):
    wd.auth()
    invoice = fixtures.INVOICE.copy()
    db.sale.insert(invoice)
    invoice1 = fixtures.INVOICE1.copy()
    invoice1.pop('customer_order_number')
    db.sale.insert(invoice1)
    util.click_button_by_id(wd, 'Salg')
    util.click_button_by_id(wd, 'customer-order-number')
    elems = wd.find_elements_by_class_name("edit-field")
    assert len(elems) == 1, 'expected one element without customer_order_number'
    #elems[0] = wd.find_elements_by_class_name("copy-ean")
    editables = wd.find_elements_by_css_selector('.edit-field')
    customer_order_number = '1234'
    util.fill_xeditable_field(wd, editables[0], customer_order_number);
    elems = wd.find_elements_by_class_name(".edit_field")
    assert len(elems) == 0, 'expected no'


    # assert that the value has been updated
    inv = wd.db.sale.find_one({ 'key': invoice1['key'] })
    assert inv['customer_order_number'] == customer_order_number

def test_customer_order_disappear(wd, db):
    wd.auth()
    invoice = fixtures.INVOICE.copy()
    invoice.pop('customer_order_number')
    db.sale.insert(invoice)
    util.click_button_by_id(wd, 'Salg')
    util.click_button_by_id(wd, 'customer-order-number')
    elems = wd.find_elements_by_class_name("edit-field")
    assert len(elems) == 1, 'expected one element without customer_order_number'

    inv = wd.db.sale.update({ 'key': invoice['key'] }, {'customer_order_number': 123})
    time.sleep(10)
    elems = wd.find_elements_by_class_name("edit-field")
    assert len(elems) == 0, 'expected invoice to be gone no'
