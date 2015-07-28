# The `src/app` Directory

## Overview

The `src/app` directory contains all code used in the application along with all
tests of such code.

```
src/
  |- app/
  |  |- directives/
  |  |- filters/
  |  |- layouts/
  |  |- services/
  |  |- app.js
  |  |- index.html
  |  |- settings.js
```

- `src/app/index.html` - this is the HTML document of the single-page application.
  See below.

## `index.html`

The `index.html` file is the HTML document of the single-page application (SPA)
that should contain all markup that applies to everything in the app, such as
the header and footer. It declares with `mobiusApp` and contains the `ui-view` directive into which route templates are
placed.

Unlike any other HTML document (e.g. the templates), `index.html` is compiled as
a Grunt template, so variables from `Gruntfile.js` and `package.json` can be
referenced from within it.

- `src/app/settings.js` - this is the main application configuration.
  See below.

## `settings.js`

### Main configuration sections

- `API` - remote endpoints. `baseURL` specifies full path to the API. The rest of the settings are relative to the `baseURL`.

- `UI` - settings related to UI components/directives.

- `menu` - customer specific settings for the main menu.

- `currencies` - list of supported currencies. Server doesn't provide a list of corresponding currency symbols so we keep this settings directly on the front-end.

- `languages` - list of supported languages. This dictionary is used for mapping locales into a short language name.

- `bookingWidget` - settings for booking widget directive. Customer related settings as number of adults/children are specified here.

- `layout` - settings for dynamic page layout based on application states. Every displayed page in the application has a corresponding application state. States are short definitions which are specified in app.js file and associate view, controllers and path in the URL. By changing this configuration we can affect the view and component placement without making changes in application templates (layouts). dynamicLayoutDirective will build a final page layout on the fly according to the specified configuration. Content in this section is tightly connected with templates definitions, See below.

- `templates` - map of component names and their templates.

- `booking.cardTypes` - credit card validation rules, icons, codes.

## Controllers

### SanitizeCtrl
`SanitizeCtrl` provides HTML sanitization for the data recieved from the API. [See more](controllers/common/sanitize/README.md)

## Embedded forms
It's possible to embed special elements thru the content which is coming from the API. In case when data contains plain text or HTML which includes `<embedded-form type="snippet-type"></embedded-form>` tag corresponding snipped will be appended when found. All snippets are available in `app\directives\embeddedForms\snippets\` folder. Each snippet is a HTML template and can also include javascript functions e.g.:

```
<a class="typeform-share button" href="https://peterswain.typeform.com/to/KZfV4O" data-mode="2" target="_blank">Best Price Guarantee</a>

<script>(function(){var qs,js,q,s,d=document,gi=d.getElementById,ce=d.createElement,gt=d.getElementsByTagName,id='typeform',b='https://s3-eu-west-1.amazonaws.com/share.typeform.com/';if(!gi.call(d,id)){js=ce.call(d,'script');js.id=id;js.src=b+'share.js';q=gt.call(d,'script')[0];q.parentNode.insertBefore(js,q)}id=id+'';if(!gi.call(d,id)){qs=ce.call(d,'link');qs.rel='stylesheet';qs.id=id;qs.href=b+'share-button.css';s=gt.call(d,'head')[0];s.appendChild(qs,s)}})()</script>

```

See also [bind-unsafe](app/directives/bindUnsafe) directive.
