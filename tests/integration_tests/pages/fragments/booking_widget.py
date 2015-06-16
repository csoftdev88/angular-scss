__author__ = 'Irina Gvozdeva'

from selenium.webdriver.common.by import By

from pages.base_page import Page


class BookingWidget(Page):
    #Booking Widget locators
    def __init__(self, driver):
        Page.__init__(self, driver)
        self.driver = driver
        self._booking_widget_locator = (By.CSS_SELECTOR, 'ul.booking-inputs')
        self._choose_dropdown_locator = (By.CSS_SELECTOR, "div.form-group")
        self._dates_choose_locator = (By.CSS_SELECTOR, "li.booking-input.dates")
        self._adults_locator = (By.CSS_SELECTOR, "li.booking-input.adults.small")
        self._children_locator = (By.CSS_SELECTOR, "li.booking-input.small")
        self._search_locator = (By.CSS_SELECTOR, "li.booking-input.submit")
        self._dropdown_locator = (By.CSS_SELECTOR, "div.chosen-drop")
        self._dropdown_search_locator = (By.CSS_SELECTOR, "ul.chosen-results")
        self._dropdown_text_locator = (By.CSS_SELECTOR, "span.info")

    @property
    def is_booking_widget_visible(self):
        return self.test_selenium.is_element_visible(self._booking_widget_locator)

    def search_click(self):
        self.driver.find_element(*self._search_locator).click()

    def text_on_click(self, number):
        self.driver.find_elements(*self._choose_dropdown_locator)[number].click()
        return self.driver.find_elements(*self._dropdown_text_locator)[number]

    def get_dropdown(self, number):
        return self.driver.find_elements(*self._dropdown_locator)[number]