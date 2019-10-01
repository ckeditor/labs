/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import HandlerType from './HandlerType.js';

function validateHandler( handler ) {
	const isCorrectType = handler && typeof handler === 'object' && !Array.isArray( handler );

	if ( !isCorrectType ) {
		throw new TypeError( 'Handler must be an object' );
	}

	if ( typeof handler.handle !== 'function' ) {
		throw new TypeError( 'Handler must have handle method' );
	}

	if ( typeof handler.type !== 'undefined' && !( handler.type instanceof HandlerType ) ) {
		throw new TypeError( 'Handler type must be an instance of HandlerType' );
	}

	if ( typeof handler.order !== 'undefined' && !isInteger( handler.order ) ) {
		throw new TypeError( 'Handler order must be an integer' );
	}
}

function isInteger( number ) {
	if ( typeof number !== 'number' ) {
		return false;
	}

	return parseInt( number, 10 ) === number || number === Infinity || number === -Infinity;
}

export { validateHandler };
export { isInteger };
