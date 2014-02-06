import pytest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import util
from pymongo import MongoClient

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
    # driver.close()


@pytest.yield_fixture
def db():
    client = MongoClient()
    db = client.invoice
    print list(db.alerts.find())
    yield db
    res = db.alerts.drop()
    #print res
    #print db.last_status()
    client.close()
