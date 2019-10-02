# clipboar

[![npm version](https://badge.fury.io/js/clipboar.svg)](https://www.npmjs.com/package/clipboar)

<img src="https://raw.githubusercontent.com/ckeditor/labs/f50c8addbe0383718ebe9f6db63de5a149347014/clipboar/boar-graphics.png" alt="">

A simple library for handling pasting and dropping content into a web page.

## Usage

```js
import { Clipboard, HandlerType } from 'clipboar';

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

Licensed under the terms of [MIT license](https://opensource.org/licenses/MIT).

For full details about the license, please check the `LICENSE.md` file.

The boar 🐗 used in the project illustration is designed by xylia from [Pngtree.com](https://pngtree.com/).
