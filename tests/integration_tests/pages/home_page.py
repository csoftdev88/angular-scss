__author__ = 'Irina Gvozdeva'
from selenium.webdriver.common.by import By
from pages.base_page import Page

class HomePage(Page):
    #Home Page locators
    _section_locator = (By.CLASS_NAME, "logo")
    _best_offers_selection_locator = (By.CSS_SELECTOR, "section.best-offers__selection")
    _best_offers_explorer_locator = (By.CSS_SELECTOR, "section.best-offers__explore")
    _best_hotels_section_locator = (By.XPATH, "//div[@widget='best-hotels']")

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
