## 02 - System interfaces ##

Mobius web only interacts with one API for mobius booking engine directly. This
is known as soap to rest, or s2r for short.

Additionally their is a node app acting as a middleware between web and s2r. The
main contents of this can be found in /routes. It's purpose is to intercept
crawlers to pass them to the prerender site as well as performing any re directs
specified in the tenant directory (see 03 - Skinning for more).

Although this is the primary interface for mobius, thereare a few other systems 
that need to be considered.

#### Content admin ####
Content admin is 2PV's custom CRM, any generic content, such as content around the
hotel facilities, contact information is stored here

#### Rate admin ###
This is the system that will determine which rates, (that are returned as products
from the API) are available.


