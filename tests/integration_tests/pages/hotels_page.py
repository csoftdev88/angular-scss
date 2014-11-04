__author__ = 'Irina'
from selenium.webdriver.common.by import By
from pages.base_page import Page
import re


class HotelsPage(Page):
    _hotels_link = (By.LINK_TEXT, "Hotels")
    _hotels_header = (By.CSS_SELECTOR, "header.hotels__header h1")
    _hotels_sorting_locator = (By.CSS_SELECTOR, 'div.order-switch')
    _switch_view_items_locator = (By.CSS_SELECTOR, 'div.view-switch')
    _switch_list_locator= (By.CSS_SELECTOR, "i.icon.icon-th-list")
    _switch_tiles_locator= (By.CSS_SELECTOR, "i.icon.icon-th-thumb")
    _hotel_locator = (By.CSS_SELECTOR, 'div.hotels__list')
    _hotels_tiles_locator=(By.XPATH, '//ul[@class="entries entries--tiles"]')
    _hotels_list_locator=(By.XPATH, '//ul[@class="entries entries--list"]')
    _hotels_locator=(By.XPATH, './/li')
    _price_locator=(By.CSS_SELECTOR, 'span.price')
    _name_locator=(By.CSS_SELECTOR, 'h3.title')
    _rating_locator=(By.CSS_SELECTOR, 'span.rating')
    _star_rating_locator=(By.XPATH, './/i[@class="star ng-scope icon-star"]')
    _chosen_element = (By.XPATH, ".//a[@class='chosen-single']")
    _sorting_dropdown_locator=(By.CSS_SELECTOR, 'div.order-switch ul.chosen-results')
    _sorting_dropdown_values_locator=(By.XPATH, './/li')

    @property
    def is_hotel_visible(self):
        return self.test_selenium.is_element_visible(self._hotel_locator)

    @property
    def are_hotels_visible(self):
        return self.test_selenium.is_element_visible(self._hotels_locator)

    @property
    def is_sorting_visible(self):
        return self.test_selenium.is_element_visible(self._hotels_sorting_locator)

    @property
    def is_change_viewing_visible(self):
        return self.test_selenium.is_element_visible(self._switch_view_items_locator)

    @property
    def is_header_visible(self):
        return self.test_selenium.is_element_visible(self._hotels_header)

    @property
    def get_header(self):
        return self.driver.find_element(*self._hotels_header).text

    @property
    def get_hotels(self):
        # Return hotels elements on a page
        element= self.driver.find_element(*self._hotel_locator)
        return element.find_elements(*self._hotels_locator)

    @property
    def get_hotels_prices(self):
        #Return hotels prices
        hotel_prices=[]
        elements = self.driver.find_elements(*self._price_locator)
        for element in elements:
            price = re.search("(?:\d*\.)?\d+", element.text).group(0)
            hotel_prices.append(price)
        return hotel_prices

    @property
    def get_hotels_rating(self):
        #Return hotels ratings
        hotel_rating=[]
        elements =self.driver.find_elements(*self._rating_locator)
        for element in elements:
            rating = element.find_elements(*self._star_rating_locator)
            hotel_rating.append(rating)
        return hotel_rating

    @property
    def get_hotels_names(self):
        # Return hotels names
        hotel_names=[]
        elements =self.driver.find_elements(*self._name_locator)
        for element in elements:
            hotel_names.append(element.text)
        return hotel_names


    @property
    def is_sorting_dropwdown_visible(self):
        # Click on Sorting to open dropdown element
        self.test_selenium.execute_js_script("window.scrollTo(0, 300);")
        self.driver.find_element(*self._hotels_sorting_locator).click()
        return self.test_selenium.is_element_visible(self._sorting_dropdown_locator)

    def make_sorting(self, element):
        #Look at dropdown elements, if element found click on it
        dropdown_elements = self.driver.find_element(*self._sorting_dropdown_locator).find_elements(*self._sorting_dropdown_values_locator)
        for i in range(0, len(dropdown_elements)):
            if dropdown_elements[i].text == element:
                text = dropdown_elements[i].text
                dropdown_elements[i].click()
                break
        flag = True
        if text != self.driver.find_element(*self._hotels_sorting_locator).find_element(*self._chosen_element).text:
            flag = False
        return flag

    @property
    def switch_view(self):
        # Change hotel view method
        view_value1 = self.test_selenium.is_element_visible(self._hotels_tiles_locator)
        view_value2 = self.test_selenium.is_element_visible(self._hotels_list_locator)
        self.test_selenium.execute_js_script("window.scrollTo(0, 300);")
        if view_value1 == True:
            print "Hotels view is tiles, switch to list"
            self.driver.find_element(*self._switch_list_locator).click()
            print("Click done")
            return self.test_selenium.is_element_visible(self._hotels_list_locator)
        elif view_value2 == True and view_value1==False:
            print "Hotels view is list, switch to tiles"
            self.driver.find_element(*self._switch_tiles_locator).click()
            return self.test_selenium.is_element_visible(self._hotels_tiles_locator)

    @property
    def click_on_hotels(self):
        # Click on Hotels link in the top menu
         self.test_selenium.wait_for_element_present(self._hotels_link)
         self.driver.find_element(*self._hotels_link).click()
         self.test_selenium.wait_for_element_present(self._hotels_header)
