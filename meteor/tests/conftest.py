import pytest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import util
from pymongo import MongoClient
from bson.son import SON

def auth(wd):
    wd.goto('')
    util.form_fill_by_id(wd, 'login-email', 'test')
    util.form_fill_by_id(wd, 'login-password', 'test')
    util.click_button_by_id(wd, 'login-button')
    # make sure login is done before returning
    util.click_button_by_id(wd, 'logout-dropdown')

@pytest.yield_fixture
def wd(request):
    driver = webdriver.Chrome()
    driver.implicitly_wait(3)
    domain = "http://localhost:3000/{}"
    driver.goto = lambda x: driver.get(domain.format(x))
    driver.auth = lambda: auth(driver)
    yield driver
    driver.close()

@pytest.yield_fixture(scope='module')
def db():
    client = MongoClient()
    client.drop_database('invoice_test')
    print 'copying database'
    client.admin.command(SON([('copydb', 1), ('fromdb', 'invoice'), ('todb', 'invoice_test')]))
    print 'done copying database'
    db = client.invoice_test
    yield db
    print 'cleaning up'
    client.drop_database('invoice_test')
    #print res
    #print db.last_status()
    client.close()