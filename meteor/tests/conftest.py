import pytest
import time
import sys
import subprocess
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import util
from pymongo import MongoClient
from bson.son import SON

def real_auth(wd):
    wd.goto('')
    util.form_fill_by_id(wd, 'login-email', 'test')
    util.form_fill_by_id(wd, 'login-password', 'test')
    util.click_button_by_id(wd, 'login-button')
    # make sure login is done before returning
    test = wd.find_element_by_id('logout-dropdown')

def auth(wd):
    wd.execute_script('Accounts.createUser({ username: "test", password: "test", email: "mikkobe+test@gmail.com" })')

@pytest.yield_fixture
def wd(request, db):
    driver = webdriver.Chrome()
    driver.implicitly_wait(3)
    domain = "http://localhost:3000/{}"
    driver.goto = lambda x: driver.get(domain.format(x))
    driver.auth = lambda: auth(driver)
    driver.real_auth = lambda: real_auth(driver)
    driver.goto('')
    driver.db = db
    driver.delete_all_cookies()
    yield driver
    driver.close()

@pytest.yield_fixture()
#@pytest.yield_fixture(scope='session')
def meteor():
    client = MongoClient()
    print 'dropping db'
    client.drop_database('invoice_test')
    p = subprocess.Popen('MONGO_URL="mongodb://localhost:27017/invoice_test" meteor --settings ../config/test-settings.json', cwd='meteor', shell=True, stdout=subprocess.PIPE)
    print 'starting meteor'
    yield p
    print 'terminating meteor'
    p.terminate()
    p.wait()
    print 'dropping db'
    client.drop_database('invoice_test')

@pytest.yield_fixture()
def db(meteor):
    client = MongoClient()
    #print 'dropping db'
    #client.drop_database('invoice_test')
    #print 'copying database'
    #client.admin.command(SON([('copydb', 1), ('fromdb', 'invoice'), ('todb', 'invoice_test')]))
    print 'done copying database'
    db = client.invoice_test
    yield db
    print 'cleaning up'
    #client.drop_database('invoice_test')
    #print res
    #print db.last_status()
    client.close()
