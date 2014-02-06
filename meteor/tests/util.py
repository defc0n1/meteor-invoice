def click_button_by_id(wd, id_element):
    #wait = WebDriverWait(wd, timeout)
    #wait.until(element_to_be_clickable((By.ID, id_element)))
    wd.find_element_by_id(id_element).click()

def click_button_by_css_selector(wd, selector):
	element = wd.find_elements_by_css_selector(selector)[0].click()

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