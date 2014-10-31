# The `src` Directory

## Overview

The `src` directory contains all code used in the application along with all
tests of such code, localisation data, images, fonts, CSS and LESS files.

```
src/
  |- app/
  |- font/
  |- images/
  |- locales/
  |- styles/
```

- `src/app/` - application-specific code [Read more &raquo;](app/README.md)
- `src/font/` - static files, fonts, vector images.
- `src/images/` - application icons, logos.
- `src/locales/` - localisation filesю
- `src/styles/` - application styles.


# The `src/locales` Directory

## Overview

The `src/locales/` directory contains all locales supported by the application.


## `*.json`

JSON files contains the translations for all view related strings presented in the application, locale code, language name and description. These files are used during the build process when application templates are created.
