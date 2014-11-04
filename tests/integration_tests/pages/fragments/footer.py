__author__ = 'Irina Gvozdeva'
from selenium.webdriver.common.by import By
from pages.base_page import Page
class FooterRegion(Page):
    _footer_area_locator = (By.ID, 'main-footer')
    _footer_social_icons_locator = (By.CSS_SELECTOR, 'ul.social-links')
    _footer_social_icon_locator = (By.XPATH, './/li')
    _footer_navigation_links_locator = (By.CSS_SELECTOR, 'ul.footer-nav')
    _footer_navigation_link_locator = (By.XPATH, './/a')
    _footer_right_reserved_locator = (By.CSS_SELECTOR, 'div.main-footer__block--left')

    @property
    def is_footer_area_visible(self):
        return self.test_selenium.is_element_visible(self._footer_area_locator)
    @property
    def is_footer_social_icons_visible(self):
        return self.test_selenium.is_element_visible(self._footer_social_icons_locator)

    @property
    def is_footer_navigation_links_visible(self):
        return self.test_selenium.is_element_visible(self._footer_navigation_links_locator)
    @property
    def is_footer_right_reserved_visible(self):
        return self.test_selenium.is_element_visible(self._footer_right_reserved_locator)

    @property
    def get_social_icons(self):
        return self.driver.find_element(*self._footer_social_icons_locator).find_elements(*self._footer_social_icon_locator)

    @property
    def get_navigation_links(self):
        return self.driver.find_element(*self._footer_navigation_links_locator).find_elements(*self._footer_navigation_link_locator)