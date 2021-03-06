from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

def click_button_by_id(wd, id_element):
    #wait = WebDriverWait(wd, timeout)
    #wait.until(element_to_be_clickable((By.ID, id_element)))
    wd.find_element_by_id(id_element).click()

def click_button_by_css_selector(wd, selector):
    element = wd.find_elements_by_css_selector(selector)[0].click()

def click_button_by_xpath_selector(wd, selector):
    #wd.find_elements_by_xpath(selector)[0].click()
    elem = wd.find_elements_by_xpath(selector)[0]
    print elem, elem.text
    elem.click()

def form_fill(element, value):
    element.click()
    element.clear()
    element.send_keys(value)

def form_fill_by_id(wd, element_id, value):
    element = wd.find_element_by_id(element_id)
    form_fill(element, value)

def form_fill_by_class(wd, element_class, value):
    element = wd.find_elements_by_class_name(element_class)[0]
    form_fill(element, value)

def form_fill_by_css_selector(wd, selector, value):
    element = wd.find_elements_by_css_selector(selector)[0]
    form_fill(element, value)


def fill_xeditable_field(wd, elem, value):
    elem.send_keys(Keys.ENTER) # chrome issue --> we cannot click on xeditable field
    elem2 = wd.find_element_by_class_name('input-sm')
    elem2.send_keys(value)
    ok_btn = wd.find_elements_by_class_name('editable-submit')[0]
    ok_btn.send_keys(Keys.ENTER) # chrome issue --> we cannot click on xeditable field
    ac = ActionChains(wd)
    ac.key_down(Keys.ESCAPE)
    ac.perform()
