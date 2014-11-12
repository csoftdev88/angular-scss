__author__ = 'Irina'
# /usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: Author
"""
from unittestzero import Assert
import pytest

from salsa_webqa.library.support.selenium_support import SeleniumTest
from pages.home_page import HomePage
from salsa_webqa.library.control_test import ControlTest
from conftest import get_test_info


@pytest.mark.usefixtures("test_status")
class TestHomePage():
    """Home page tests """

    def setup_class(self):
        """ executes before test class starts """
        self.control_test = ControlTest()
        self.driver = self.control_test.start_browser('Test Home page')
        self.home_page = HomePage(self.driver)
        self.test_selenium = SeleniumTest(self.driver)

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
    def test_home_elements_present(self):
        """Test check if different elements of hotels page are visible: hotels area, hotels, sorting, viewing icons as well"""
        Assert.true(self.home_page.is_best_offers_selection_section_visible, "Best offers selection section are missing")
        Assert.true(self.home_page.is_best_offers_explorer_section_visible, "Best offers explorer section is  missing")
        Assert.true(self.home_page.is_best_hotels_section_visible, "Best hotels section is missing")
