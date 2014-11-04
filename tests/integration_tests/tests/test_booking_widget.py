__author__ = 'Irina Gvozdeva'
from unittestzero import Assert
import pytest

from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.fragments.booking_widget import BookingWidget
from pages.fragments.footer import FooterRegion
from salsa_webqa.library.control_test import ControlTest
from conftest import get_test_info


@pytest.mark.usefixtures("test_status")
class TestHomePage():
    """ Booking widget tests,  for now only one simple test is added as there is no much more func without API """

    def setup_class(self):
        """ executes before test class starts """
        self.control_test= ControlTest()
        self.driver = self.control_test.start_browser('Test Booking Widget')
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
    @pytest.mark.parametrize(('text', 'index1', 'index2'), [
        ("Find Your Hotel:", 0, 0),
        ("Adults:", 3, 1),
        ("Children:", 4, 2)])
    def test_open_dropdown(self, text, index1, index2):
        """Test check if user click on dropdown area The words above is visible and dropdown as well"""
        booking_widget=self.booking_widget
        text_el= booking_widget.text_on_click(index1)
        Assert.true(text_el.is_displayed(), "Text element is not displayed")
        Assert.equal(text_el.text, text, "Incorrect text is shown")
        Assert.true(booking_widget.get_dropdown(index2).is_displayed(), "Dropdown is not shown on click")

