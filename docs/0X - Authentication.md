## 0X - Authentication ##

Mobius web interacts with 3 authentication systems, but only 1 may be used for a
tenant.

All auth related tasks should be performed using the main auth controller. This
controller acts as the context for the different authentication strategies. If
you are not familiar with this pattern, please see (https://en.wikipedia.org/wiki/Strategy_pattern).

Any controller that requires authentication functionality should inherit the
auth controller by using $controller('AuthCtrl', {scope: $scope}); This will
the inject all of its auth functions into the provided scope.
:w

Any page that requires to be auth protected should inherit this controller

#### 1 - Mobius Auth ####
The original auth system was mobius auth, it is a basic HTTP auth implementation
used in conjunction with S2R.

Currently only the me and all and national tenants use it. Other than logging in and
registering it can perform basic user management tasks such as updating a profile
and auto populating a user's information in the booking flow.

#### 2 - Keystone ####
This is the most current authentication system used and is the preferred system for
new tenants.

Keystone works by injecting a script called status.js in the application and
providing specific DOM elements for it to inject it's controls. Such as a login
button, the profile section etc.

Keystone also has a JS API that is loaded into window.KS, where operations such as
requesting the login modal to appear, getting user information etc can be performed.
Please visit the repo (https://github.com/2PVentures/keystone-profiles) for more
information. Also note, you should rarely need to use the JS API, as the auth
controller in mobius will wrap around this to provide it's functionality.

#### 3 - Infiniti ####


