__author__ = 'Irina'
# /usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: Author
"""
from unittestzero import Assert

from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.home_page import HomePage
from pages.fragments.booking_widget import BookingWidget
from pages.fragments.footer import FooterRegion
from salsa_webqa.library.control_test import ControlTest
from conftest import get_test_info
import pytest
import time

@pytest.mark.usefixtures("test_status")
class TestHomePage():
    """Footer tests """

    def setup_class(self):
        """ executes before test class starts """
        self.control_test= ControlTest()
        self.driver = self.control_test.start_browser('Test Footer')
        self.booking_widget=BookingWidget(self.driver)
        self.footer = FooterRegion(self.driver)
        self.test_selenium = SeleniumTest(self.driver)
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())


    def teardown_class(self):
        """ executes after test class finishes """
        self.control_test.stop_browser()

    def setup_method(self, method):
        """ executes before test function starts """
        self.control_test.start_test()


    def teardown_method(self, method):
        """ executes after test function finishes """
        test_info = get_test_info()
        self.control_test.stop_test(test_info)

    ### Tests ###
    def test_footer_items_present(self):
        """Test check if all footers elements are visible """
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        #(self.control_test.gid("base_url"))
        footer =self.footer
        Assert.true(footer.is_footer_area_visible, "Footer Region is missing  ")
        Assert.true(footer.is_footer_social_icons_visible, "Footer Social icons is missing " )
        Assert.true(footer.is_footer_navigation_links_visible, "Footer Navigation links are missing ")
        Assert.true(footer.is_footer_right_reserved_visible, "Footer All right reserved is missing")


    @pytest.mark.parametrize(('url', 'element'), [
        ("twitter.com", 0),
        ("facebook.com", 1),
        ("youtube.com", 2),
        ("flickr.com", 3),
        ("pinterest.com", 4)])
    def test_footer_social_icon_click(self, url, element):
        """Test check clicks on footer social icons """
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        footer =self.footer
        icons=footer.get_social_icons
        icons[element].click()
        Assert.contains(url, self.test_selenium.get_current_url())
    '''
    @pytest.mark.parametrize(('url', 'element'), [
        ("", 0),
        ("", 1),
        ("", 2),
        ("", 3),
        ("", 4)])
    def test_footer_link_click(self, url, element):
        """Test check click on footer navigation links -implement later when API will be available"""
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        footer =self.footer
        icons=footer.get_navigation_links
        icons[element].click()
        Assert.equal(self.test_selenium.get_current_url(), url)'''