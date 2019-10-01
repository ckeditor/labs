/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import * as index from '../src/index.js';
import Clipboard from '../src/Clipboard.js';
import HandlerType from '../src/HandlerType.js';

import './HandlerType.js';
import './utils.js';
import './Clipboard.js';

describe( 'package', () => {
	it( 'exports Clipboard', () => {
		expect( index.Clipboard ).to.equal( Clipboard );
	} );

	it( 'exports HandlerType', () => {
		expect( index.HandlerType ).to.equal( HandlerType );
	} );
} );
