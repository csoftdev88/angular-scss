__author__ = 'Irina Gvozdeva'
from selenium.webdriver.common.by import By

from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.base_page import Page


class RoomPage(Page):
    #Room Page locators
    def __init__(self, driver):
        Page.__init__(self, driver)
        self.driver = driver
        self.test_selenium = SeleniumTest(driver)
        self._room_description_locator = (By.CSS_SELECTOR, "header")
        self._room_name_locator = (By.CSS_SELECTOR, "h1.ng-binding")
        self._room_prices_area_locator = (By.CSS_SELECTOR, "div.room-prices")
        self._room_rates_area_locator = (By.CSS_SELECTOR, "div.panel.panel-default.ng-isolate-scope")
        self._room_rates_names_locator = (By.CSS_SELECTOR, "h3.title.ng-binding")
        self._room_opened_locator = (By.CSS_SELECTOR, "div.panel.panel-default.ng-isolate-scope.is-open")
        self._room_opened_rate_locator = (By.XPATH, ".//h3[@class='title ng-binding']")
        self._room_amentities_locator = (By.CSS_SELECTOR, "div.room-amenities")
        self._continue_button_locator = (By.CSS_SELECTOR, "div.room-continue")

    @property
    def is_room_visible(self):
        return self.test_selenium.is_element_visible(self._room_description_locator)

    @property
    def is_room_amentities_visible(self):
        return self.test_selenium.is_element_visible(self._room_amentities_locator)

    @property
    def are_room_prices_visible(self):
        return self.test_selenium.is_element_visible(self._room_prices_area_locator)

    @property
    def get_room_name(self):
        return self.driver.find_element(*self._room_name_locator).text

    @property
    def get_room_rates_area(self):
        return self.driver.find_elements(*self._room_rates_area_locator)

    @property
    def get_room_rates_names(self):
        return self.driver.find_elements(*self._room_rates_names_locator)

    @property
    def opened_room_rate_is_visible(self):
        return self.test_selenium.is_element_visible(self._room_opened_locator)

    @property
    def get_opened_room_name(self):
        return self.driver.find_element(*self._room_opened_locator).find_element(*self._room_opened_rate_locator).text