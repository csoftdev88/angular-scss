# 01 - Overview #

Mobius web is a SPA built using angular 1.3 to act as the front end for mobius
booking engine. It is hosted as a complete site and usually run along side
customer's main site.

It's main purpose is to provide a booking flow for hotel company's and provide
several other features such as :

 - Authentication and User management
 - Loyalty programs
 - Rate & Availability information
 - Hotel & Room content
 - Offers & Promotions
 
 Mobius web is a multi tenanted system, meaning that it is designed to have a 
 'core' and then tenant implementations. The core consists of the all the business
 logic (FE logic) with JS controllers / services. These controllers then supply
 the DOM, provided by the tenant with a contract, defining which functionality
 is exposed to that page.
 
 Tenant's are also known as theme's or skins, but they are just providing the
 HTML templates, LESS styling and configuration.
 
 It is importing to remember while developing to think of the tenancy and the
 contract that the core controllers are providing to the DOM, and ensure you
 do not brake compatibility amongst tenants.
