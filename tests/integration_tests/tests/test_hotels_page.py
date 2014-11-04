__author__ = 'Irina'
# /usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: Author
"""
from unittestzero import Assert
from selenium.webdriver.common.keys import Keys
from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.hotels_page import HotelsPage
from pages.fragments.booking_widget import BookingWidget
from pages.fragments.footer import FooterRegion
from salsa_webqa.library.control_test import ControlTest
from conftest import get_test_info
import pytest
import time

@pytest.mark.usefixtures("test_status")
class TestHotelsPage():
    """ Hotels page tests"""

    def setup_class(self):
        """ executes before test class starts """
        self.control_test= ControlTest()
        self.driver = self.control_test.start_browser('Test Hotels Page')
        self.hotels_page = HotelsPage(self.driver)
        self.booking_widget=BookingWidget(self.driver)
        self.footer = FooterRegion(self.driver)
        self.test_selenium = SeleniumTest(self.driver)
        #self.driver.maximize_window()

    def teardown_class(self):
        """ executes after test class finishes """
        self.control_test.stop_browser()

    def teardown_method(self, method):
        """ executes after test function finishes """
        test_info = get_test_info()
        self.control_test.stop_test(test_info)

    def test_hotels_elements_present(self):
        """Test check if different elements of hotels page are visible: hotels area, hotels, sorting, viewing icons as well"""
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        hotels_page =self.hotels_page
        hotels_page.click_on_hotels
        Assert.true(hotels_page.is_hotel_visible, "Hotels are  missing")
        Assert.true(hotels_page.are_hotels_visible, "Hotels are  missing")
        Assert.true(hotels_page.is_sorting_visible, "Sorting is missing")
        Assert.true(hotels_page.is_change_viewing_visible, "Change viewing is missing  ")
        Assert.equal(hotels_page.get_header, "Our Hotels", "Headers are not equal, should be: Our Hotels, but found " + hotels_page.get_header)

    @pytest.mark.parametrize('sorting', [
        ("Star Rating Low to High"),
        ("Star Rating High to Low")])
    def test_star_sorting_hotels(self, sorting):
        """Test check sorting hotels by "Star Rating Low to High" - sorting is correct - can be done when API available (for now just check chosen dropdown element)"""
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        hotels_page =self.hotels_page
        hotels_page.click_on_hotels
        Assert.true(hotels_page.is_sorting_dropwdown_visible, "Dropdown is not visible")
        element = hotels_page.make_sorting(sorting)
        rating=hotels_page.get_hotels_rating
        print rating
        Assert.true(element, "User didn't choose any value")

    @pytest.mark.parametrize('sorting', [
        ("Price Low to High"),
        ("Price High to Low")])
    def test_price_sorting_hotels(self, sorting):
        """Test check sorting hotels by "Price Low to High" - sorting is correct - can be done when API available (for now just check chosen dropdown element)"""
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        hotels_page =self.hotels_page
        hotels_page.click_on_hotels
        Assert.true(hotels_page.is_sorting_dropwdown_visible, "Dropdown is not visible")
        element = hotels_page.make_sorting(sorting)
        prices=hotels_page.get_hotels_prices
        print prices
        Assert.true(element, "User didn't choose any value")

    @pytest.mark.parametrize('sorting', [
        ("A - Z"),
        ("Z - A")])
    def test_name_sorting_hotels(self, sorting):
        """Test check sorting hotels by "A-Z" - checking is sorting is correct - can be done when API available (for now just check chosen dropdown element)"""
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        hotels_page =self.hotels_page
        hotels_page.click_on_hotels
        Assert.true(hotels_page.is_sorting_dropwdown_visible, "Dropdown is not visible")
        element= hotels_page.make_sorting(sorting)
        names=hotels_page.get_hotels_names
        print names
        Assert.true(element, "User didn't choose any value")

    def test_change_viewing(self):
        """Test check if view changed after use click on change view icons"""
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        hotels_page =self.hotels_page
        hotels_page.click_on_hotels
        Assert.true(hotels_page.switch_view, "View didn't change")
        Assert.true(hotels_page.switch_view, "View didn't change")
