# /usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: Irina Gvozdeva
"""
from salsa_webqa.library.support.selenium_support import SeleniumTest


class Page(object):
    """ Base class for all Pages """
    def __init__(self, driver):
        self.driver = driver
        self.test_selenium = SeleniumTest(driver)