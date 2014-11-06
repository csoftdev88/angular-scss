__author__ = 'Irina Gvozdeva'
import time
import random

from unittestzero import Assert
import pytest

from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.hotels_page import HotelsPage
from pages.hotel_page import HotelPage
from pages.room_page import RoomPage
from pages.fragments.booking_widget import BookingWidget
from pages.fragments.footer import FooterRegion
from salsa_webqa.library.control_test import ControlTest
from conftest import get_test_info


@pytest.mark.usefixtures("test_status")
class TestHotelPage():
    """ Room page tests """

    def setup_class(self):
        """ executes before test class starts """
        self.control_test = ControlTest()
        self.driver = self.control_test.start_browser('Test Room Page')
        self.hotels_page = HotelsPage(self.driver)
        self.hotel_page = HotelPage(self.driver)
        self.room_page = RoomPage(self.driver)
        self.booking_widget = BookingWidget(self.driver)
        self.footer = FooterRegion(self.driver)
        self.test_selenium = SeleniumTest(self.driver)

    def teardown_class(self):
        """ executes after test class finishes """
        self.control_test.stop_browser()

    def setup_method(self, method):
        self.control_test.start_test(True)

    def teardown_method(self, method):
        """ executes after test function finishes """
        test_info = get_test_info()
        self.control_test.stop_test(test_info)

    def test_room_elements_present(self):
        """Test check if different elements of room page are visible: hotel description, rooms, map, services"""
        self.hotels_page.click_on_hotels()
        #for now without api i just made a click on some rand hotels, when API will be ready - i can check that correct hotel is opened
        self.hotels_page.get_hotels[random.randint(0, len(self.hotels_page.get_hotels) - 1)].click()
        rooms = self.hotel_page.get_view_more
        #for now without api i just made a click on first room, when API will be ready - i can check that correct room is opened
        rooms[0].click()
        time.sleep(2)
        Assert.true(self.room_page.is_room_visible, "Room description is missing")
        Assert.true(self.room_page.are_room_prices_visible, "Room prices are  missing")
        Assert.true(self.room_page.is_room_amentities_visible, "Room amentities is  missing")

    def test_opened_room_rate_all_area(self):
        """Test check if user made click on room rate - room rate info should be opened"""
        self.hotels_page.click_on_hotels()
        #for now without api i just made a click on some rand hotels, when API will be ready - i can check that correct hotel is opened
        self.hotels_page.get_hotels[random.randint(0, len(self.hotels_page.get_hotels) - 1)].click()
        rooms = self.hotel_page.get_view_more
        #for now without api i just made a click on first room, when API will be ready - i can check that correct room is opened
        rooms[0].click()
        time.sleep(2)
        #for now without api i just made a click on second room rate, when API will be ready - i can check that correct rate is opened
        open_rate = self.room_page.get_room_rates_names[2].text
        self.room_page.get_room_rates_area[2].click()
        time.sleep(1)
        Assert.true(self.room_page.opened_room_rate_is_visible, "Room rate didn't open")
        room = self.room_page.get_opened_room_name
        Assert.equal(room, open_rate, "Another room opened")

    def test_opened_room_rate_name_click(self):
        """Test check if different elements of room page are visible: hotel description, rooms, map, services"""
        self.hotels_page.click_on_hotels()
        #for now without api i just made a click on some rand hotels, when API will be ready - i can check that correct hotel is opened
        self.hotels_page.get_hotels[random.randint(0, len(self.hotels_page.get_hotels) - 1)].click()
        rooms = self.hotel_page.get_view_more
        #for now without api i just made a click on first room, when API will be ready - i can check that correct room is opened
        rooms[0].click()
        time.sleep(2)
        #for now without api i just made a click on second room rate, when API will be ready - i can check that correct rate is opened
        open_rate = self.room_page.get_room_rates_names[2].text
        self.room_page.get_room_rates_names[2].click()
        time.sleep(1)
        Assert.true(self.room_page.opened_room_rate_is_visible, "Room rate didn't open")
        room = self.room_page.get_opened_room_name
        Assert.equal(room, open_rate, "Another room opened")