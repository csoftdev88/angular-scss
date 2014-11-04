__author__ = 'Irina Gvozdeva'

from selenium.webdriver.common.by import By
from pages.base_page import Page

class BookingWidget(Page):
    #Booking Widget locators
    _booking_widget_locator = (By.CSS_SELECTOR, 'ul.booking-inputs')
    _choose_dropdown_locator = (By.CSS_SELECTOR, "div.form-group")
    _dates_choose_locator = (By.CSS_SELECTOR, "li.booking-input.dates")
    _adults_locator=(By.CSS_SELECTOR, "li.booking-input.adults.small")
    _children_locator=(By.CSS_SELECTOR, "li.booking-input.small")
    _search_locator = (By.CSS_SELECTOR, "li.booking-input.submit")
    _dropdown_locator=(By.CSS_SELECTOR, "div.chosen-drop")
    _dropdown_search_locator=(By.CSS_SELECTOR, "ul.chosen-results")
    _dropdown_text_locator = (By.CSS_SELECTOR, "span.info")

    @property
    def is_booking_widget_visible(self):
        return self.test_selenium.is_element_visible(self._booking_widget_locator)

    def submit_click(self):
        self.driver.find_element(*self._submit_locator).click()

    def hotel_click_dropdown(self):
        print("el %s"% len(self.driver.find_elements(*self._hotels_choose_locator)))
        self.driver.find_elements(*self._hotels_choose_locator)[1].click()

    def text_on_click(self, number):
        self.driver.find_elements(*self._choose_dropdown_locator)[number].click()
        return self.driver.find_elements(*self._dropdown_text_locator)[number]

    def get_dropdown(self,number):
        return self.driver.find_elements(*self._dropdown_locator)[number]