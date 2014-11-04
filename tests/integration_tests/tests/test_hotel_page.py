__author__ = 'Irina Gvozdeva'
from unittestzero import Assert
from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.hotels_page import HotelsPage
from pages.hotel_page import HotelPage
from pages.fragments.booking_widget import BookingWidget
from pages.fragments.footer import FooterRegion
from salsa_webqa.library.control_test import ControlTest
from conftest import get_test_info
import pytest
import time

@pytest.mark.usefixtures("test_status")
class TestRoomPage():
    """  Hotel page tests """
    def setup_class(self):
        """ executes before test class starts """
        self.control_test= ControlTest()
        self.driver = self.control_test.start_browser('Test Hotel Page')
        self.hotels_page = HotelsPage(self.driver)
        self.hotel_page = HotelPage(self.driver)
        self.booking_widget=BookingWidget(self.driver)
        self.footer = FooterRegion(self.driver)
        self.test_selenium = SeleniumTest(self.driver)

    def teardown_class(self):
        """ executes after test class finishes """
        self.control_test.stop_browser()

    def teardown_method(self, method):
        """ executes after test function finishes """
        test_info = get_test_info()
        self.control_test.stop_test(test_info)

    def test_hotel_elements_present(self):
        """Test check if different elements of hotel page are visible: hotel description, rooms, map, services"""
        self.test_selenium.go_to_page(self.test_selenium.get_base_url())
        hotels_page =self.hotels_page
        hotels_page.click_on_hotels
        hotels_page.get_hotels[3].click()
        hotel_page =self.hotel_page
        time.sleep(3)
        Assert.true(hotel_page.is_hotel_visible, "Hotel description is missing")
        Assert.true(hotel_page.is_hotel_details_visible, "Hotel details is  missing")
        Assert.true(hotel_page.is_hotel_services_visible, "Hotel services is  missing")
        Assert.true(hotel_page.is_hotel_location_visible, "Hotel location is  missing")
