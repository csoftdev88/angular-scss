__author__ = 'Irina Gvozdeva'
from selenium.webdriver.common.by import By

from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.base_page import Page


class HotelPage(Page):
    # this variables need to open hotel page itslelf (without API direct links didn't work)
    def __init__(self, driver):
        Page.__init__(self, driver)
        self.driver = driver
        self.test_selenium = SeleniumTest(driver)
        self._hotels_link_locator = (By.LINK_TEXT, "Hotels")
        self._hotel_link_locator = (By.CSS_SELECTOR, "li.item.ng-scope")
        self._hotel_description_locator = (By.CSS_SELECTOR, "header")
        self._hotel_header_locator = (By.CSS_SELECTOR, "header.hotels__header h1")
        self._hotel_services_locator = (By.CSS_SELECTOR, "section.hotel-detail__services")
        self._hotel_services_element_locator = (By.XPATH, ".//li")
        self._hotel_details_locator = (By.CSS_SELECTOR, "section.hotel-detail__rooms")
        self._hotel_rooms_locator = (By.XPATH, ".//li")
        self._hotel_location_locator = (By.CSS_SELECTOR, "section.hotel-detail__location")
        self._view_more_locator = (By.CSS_SELECTOR, "a.more")
        self._room_price_locator = (By.CSS_SELECTOR, "span.price")

    @property
    def is_hotel_visible(self):
        return self.test_selenium.is_element_visible(self._hotel_description_locator)

    @property
    def is_hotel_services_visible(self):
        return self.test_selenium.is_element_visible(self._hotel_services_locator)

    @property
    def is_hotel_details_visible(self):
        return self.test_selenium.is_element_visible(self._hotel_details_locator)

    @property
    def is_hotel_location_visible(self):
        return self.test_selenium.is_element_visible(self._hotel_location_locator)

    @property
    def get_hotel_name(self):
        return self.driver.find_element(*self._hotel_header_locator).text

    @property
    def get_hotel_services(self):
        element = self.driver.find_element(*self._hotel_services_locator)
        return element.find_elements(*self._hotel_services_element_locator)

    @property
    def get_hotel_rooms(self):
        element = self.driver.find_element(*self._hotel_details_locator)
        return element.find_elements(*self._hotel_rooms_locator)

    @property
    def get_view_more(self):
        return self.driver.find_elements(*self._view_more_locator)
