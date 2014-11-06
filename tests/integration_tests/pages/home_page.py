__author__ = 'Irina Gvozdeva'
from selenium.webdriver.common.by import By
from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.base_page import Page


class HomePage(Page):
    #Home Page locators
    def __init__(self, driver):
        Page.__init__(self, driver)
        self.driver = driver
        self.test_selenium = SeleniumTest(driver)
        self._section_locator = (By.CLASS_NAME, "logo")
        self._best_offers_selection_locator = (By.CSS_SELECTOR, "section.best-offers__selection")
        self._best_offers_explorer_locator = (By.CSS_SELECTOR, "section.best-offers__explore")
        self._best_hotels_section_locator = (By.XPATH, "//div[@widget='best-hotels']")

    @property
    def get_section(self):
        return self.driver.find_element(*self._section_locator).text

    @property
    def is_best_offers_selection_section_visible(self):
        return self.test_selenium.is_element_visible(self._best_offers_selection_locator)

    @property
    def is_best_offers_explorer_section_visible(self):
        return self.test_selenium.is_element_visible(self._best_offers_explorer_locator)

    @property
    def is_best_hotels_section_visible(self):
        return self.test_selenium.is_element_visible(self._best_hotels_section_locator)
