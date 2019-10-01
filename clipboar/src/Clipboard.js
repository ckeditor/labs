/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import HandlerType from './HandlerType.js';
import { validateHandler } from './utils.js';

const handlersStore = new WeakMap();
const zonesStore = new WeakMap();

class Clipboard {
	addHandler( handler ) {
		validateHandler( handler );

		if ( typeof handler.type === 'undefined' ) {
			handler.type = HandlerType.PASTE;
		}

		if ( typeof handler.order === 'undefined' ) {
			handler.order = 0;
		}

		const store = handlersStore.get( this ) || [];

		store.push( handler );
		handlersStore.set( this, store );
	}

	getHandlers( type ) {
		if ( typeof type !== 'undefined' && !( type instanceof HandlerType ) ) {
			throw new TypeError( 'Type must be an instance of HandlerType' );
		}

		const handlers = handlersStore.get( this ) || [];

		if ( !type ) {
			return handlers;
		}

		return handlers.filter( ( { type: handlerType } ) => {
			return handlerType === type;
		} );
	}

	removeHandler( handler ) {
		validateHandler( handler );

		const handlers = this.getHandlers();
		const index = handlers.indexOf( handler );

		if ( index === -1 ) {
			return;
		}

		handlers.splice( index, 1 );
		handlersStore.set( this, handlers );
	}

	addZone( element, type ) {
		if ( !( element instanceof HTMLElement ) ) {
			throw new TypeError( 'Zone container must be an HTML element.' );
		}

		if ( !( type instanceof HandlerType ) ) {
			throw new TypeError( 'Zone type must be an instance of HandlerType.' );
		}

		const zones = zonesStore.get( this ) || [];
		const isDuplicate = zones.some( ( { element: zoneElement, type: zoneType } ) => {
			return zoneElement === element && zoneType === type;
		} );

		if ( isDuplicate ) {
			throw new Error( 'Only one zone of a given type can be attached to the same element.' );
		}

		const listener = evt => {
			const handlers = this.getHandlers( type ).splice( 0 ).sort( ( { order: order1 }, { order: order2 } ) => {
				if ( order1 === order2 ) {
					return 0;
				}

				return order1 - order2;
			} );

			evt.preventDefault();
			next();

			function next() {
				const handler = handlers.shift();

				if ( handler ) {
					handler.handle( evt.clipboardData, next );
				}
			}
		};

		element.addEventListener( type.name.toLowerCase(), listener );

		zones.push( {
			element,
			type,
			listener
		} );
		zonesStore.set( this, zones );
	}

	getZones( type ) {
		if ( typeof type !== 'undefined' && !( type instanceof HandlerType ) ) {
			throw new TypeError( 'Zone type must be an instance of HandlerType.' );
		}

		const zones = zonesStore.get( this ) || [];

		if ( !type ) {
			return zones;
		}

		return zones.filter( ( { type: zoneType } ) => {
			return zoneType === type;
		} );
	}

	removeZone( element, type ) {
		if ( !( element instanceof HTMLElement ) ) {
			throw new TypeError( 'Zone container must be an HTML element.' );
		}

		if ( !( type instanceof HandlerType ) ) {
			throw new TypeError( 'Zone type must be an instance of HandlerType.' );
		}

		const zones = this.getZones();
		const index = zones.findIndex( ( { element: zoneElement, type: zoneType } ) => {
			return zoneElement === element && zoneType === type;
		} );

		if ( index === -1 ) {
			return;
		}

		const { listener } = zones[ index ];

		element.removeEventListener( type.name.toLowerCase(), listener );

		zones.splice( index, 1 );
		handlersStore.set( this, zones );
	}
}

export default Clipboard;
