import pytest
import time
import sys
import subprocess
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import util
import time
import uuid
import random
from pymongo import MongoClient
from bson.son import SON


uid = uuid.uuid1()
port = random.randrange(4000, 60000)
db_name = 'invoice_test_{}'.format(uid)

def real_auth(wd):
    wd.goto('')
    wd.delete_all_cookies()
    util.form_fill_by_id(wd, 'login-email', 'test')
    util.form_fill_by_id(wd, 'login-password', 'test')
    util.click_button_by_id(wd, 'login-button')
    # make sure login is done before returning
    test = wd.find_element_by_id('logout-dropdown')

def auth(wd):
    wd.goto('')
    wd.delete_all_cookies()
    wd.execute_script('Accounts.createUser({ username: "test", password: "test", email: "mikkobe+test@gmail.com" })')

@pytest.yield_fixture(scope='session')
def wd(request):
    print 'starting wedriver'
    start = time.time()
    driver = webdriver.Chrome()
    driver.implicitly_wait(3)
    domain = "http://localhost:{}/{}"
    driver.goto = lambda x: driver.get(domain.format(port, x))
    driver.auth = lambda: auth(driver)
    driver.real_auth = lambda: real_auth(driver)
    driver.goto('')
    driver.delete_all_cookies()
    print 'wedriver started'
    yield driver
    driver.close()

@pytest.yield_fixture(scope='session')
def meteor():
    client = MongoClient()
    print 'starting meteor', db_name
    p = subprocess.Popen('MONGO_URL="mongodb://localhost:27017/{}" meteor --settings ../config/test-settings.json --port {}'.format(db_name, port), cwd='meteor', shell=True, stdout=subprocess.PIPE)
    print 'meteor started'
    yield p
    print 'terminating meteor'
    p.terminate()
    for g in p.communicate():
        print 'Meteor com:', g
    p.wait()

@pytest.yield_fixture()
def db(meteor):
    start = time.time()
    client = MongoClient()
    print ''
    db = client[db_name]
    yield db
    client.drop_database(db_name)
    client.close()
    print 'dropped db'
