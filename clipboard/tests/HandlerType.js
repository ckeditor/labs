/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals chai */

import HandlerType from '../src/HandlerType.js';

const { expect } = chai;

describe( 'HandlerType', () => {
	it( 'has property PASTE', () => {
		expect( HandlerType.enumValues[ 0 ].name ).to.equal( 'PASTE' );
	} );

	it( 'has property DROP', () => {
		expect( HandlerType.enumValues[ 1 ].name ).to.equal( 'DROP' );
	} );
} );
