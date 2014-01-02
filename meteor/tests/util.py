def click_button_by_id(wd, id_element):
    #wait = WebDriverWait(wd, timeout)
    #wait.until(element_to_be_clickable((By.ID, id_element)))
    wd.find_element_by_id(id_element).click()

def form_fill_by_id(wd, element_id, value):
    element = wd.find_element_by_id(element_id)
    element.click()
    element.clear()
    element.send_keys(value)
