# @ckeditor/clipboard

[![npm version](https://badge.fury.io/js/@ckeditor/clipboard.svg)](https://www.npmjs.com/package/@ckeditor/clipboard)

A simple library for handling pasting and dropping into a webpage.

## Usage

```js
import { Clipboard, HandlerType } from '@ckeditor/clipboard';

const clipboard = new Clipboard();

// Add some handlers.
clipboard.addHandler( {
	type: HandlerType.PASTE,
	order: 5,
	handle( clipboardData, next ) {
		doSomething( clipboardData );

		next();
	}
} );

// Add some zones.
clipboard.addZone( document.querySelector( '#pasteArea', HandlerType.PASTE ) );
```

## Contributing

After cloning this repository, install necessary dependencies:

```bash
npm install
```

### Executing tests

```bash
npm run test
```

If you are going to change the source files (ones located in the `src/` directory), remember about rebuilding the package. You can use `npm run develop` in order to do it automatically.

### Building the package

Build a minified version of the package that is ready to publish:

```bash
npm run build
```

## License

Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.

Licensed under the terms of any of the following licenses at your
choice:

* [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html),
* [GNU Lesser General Public License Version 2.1 or later](http://www.gnu.org/licenses/lgpl.html),
* [Mozilla Public License Version 1.1 or later (the "MPL")](http://www.mozilla.org/MPL/MPL-1.1.html).

For full details about the license, please check the `LICENSE.md` file.
