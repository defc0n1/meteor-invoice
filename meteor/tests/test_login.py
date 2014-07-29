import util
import time


def test_login_logout(db, wd):
    wd.auth()
    util.click_button_by_id(wd, 'logout-dropdown')
    util.click_button_by_id(wd, 'logout')
    wd.real_auth()
    util.click_button_by_id(wd, 'logout-dropdown')
    util.click_button_by_id(wd, 'logout')
    elem = wd.find_element_by_xpath("//h1")
    assert elem.text == 'Log ind'
