/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals chai */

import sinonChai from 'sinon-chai';
import Clipboard from '../src/Clipboard.js';
import HandlerType from '../src/HandlerType.js';

const { expect, use } = chai;

use( sinonChai );

describe( 'Clipboard', () => {
	it( 'is a class', () => {
		expect( Clipboard ).to.be.a( 'function' );

		expect( () => {
			Clipboard(); // eslint-disable-line new-cap
		} ).to.throw( TypeError );
	} );

	describe( 'handlers', () => {
		describe( 'addHandler', () => {
			it( 'requires correct shape of handler', () => {
				const clipboard = new Clipboard();

				expect( () => {
					clipboard.addHandler( 5 );
				} ).to.throw( TypeError, 'Handler must be an object' );

				expect( () => {
					clipboard.addHandler( {
					} );
				} ).to.throw( TypeError, 'Handler must have handle method' );
			} );

			it( 'requires correct type of handler', () => {
				const clipboard = new Clipboard();

				expect( () => {
					clipboard.addHandler( {
						type: 'paste',
						handle() {}
					} );
				} ).to.throw( TypeError, 'Handler type must be an instance of HandlerType' );

				expect( () => {
					clipboard.addHandler( {
						type: HandlerType.PASTE,
						handle() {}
					} );
				} ).not.to.throw( TypeError, 'Handler type must be an instance of HandlerType' );
			} );

			it( 'sets type to HandlerType.PASTE if it is not passed', () => {
				const clipboard = new Clipboard();
				const handler = {
					handle() {}
				};

				clipboard.addHandler( handler );

				const [ { type: actualType } ] = clipboard.getHandlers();

				expect( actualType ).to.equal( HandlerType.PASTE );
			} );

			it( 'requires order of handler to be an integer', () => {
				const clipboard = new Clipboard();

				expect( () => {
					clipboard.addHandler( {
						order: 10.5,
						handle() {}
					} );
				} ).to.throw( TypeError, 'Handler order must be an integer' );

				expect( () => {
					clipboard.addHandler( {
						order: 999,
						handle() {}
					} );
				} ).not.to.throw( TypeError, 'Handler order must be an integer' );
			} );

			it( 'sets order to 0 if it is not passed', () => {
				const clipboard = new Clipboard();
				const handler = {
					handle() {}
				};

				clipboard.addHandler( handler );

				const [ { order: actualOrder } ] = clipboard.getHandlers();

				expect( actualOrder ).to.equal( 0 );
			} );
		} );

		describe( 'getHandlers', () => {
			const pasteHandler = {
				type: HandlerType.PASTE,
				handle() {}
			};
			const dropHandler = {
				type: HandlerType.DROP,
				handle() {}
			};

			it( 'returns all handlers by default', () => {
				const clipboard = new Clipboard();

				clipboard.addHandler( pasteHandler );
				clipboard.addHandler( dropHandler );

				expect( clipboard.getHandlers() ).to.be.deep.equal( [
					pasteHandler,
					dropHandler
				] );
			} );

			it( 'requires type to be instance of HandlerType', () => {
				const clipboard = new Clipboard();

				expect( () => {
					clipboard.getHandlers( 'paste' );
				} ).to.throw( TypeError, 'Type must be an instance of HandlerType' );

				expect( () => {
					clipboard.getHandlers( HandlerType.PASTE );
				} ).not.to.throw( TypeError, 'Type must be an instance of HandlerType' );
			} );

			it( 'returns all handlers for given type', () => {
				const clipboard = new Clipboard();

				clipboard.addHandler( Object.assign( pasteHandler ) );
				clipboard.addHandler( Object.assign( dropHandler ) );
				clipboard.addHandler( Object.assign( pasteHandler ) );
				clipboard.addHandler( Object.assign( dropHandler ) );

				const handlers = clipboard.getHandlers( HandlerType.PASTE );

				expect( handlers ).to.have.lengthOf( 2 );

				handlers.forEach( ( { type } ) => {
					expect( type ).to.equal( HandlerType.PASTE );
				} );
			} );

			it( 'always returns an array', () => {
				const clipboard = new Clipboard();
				const handlers = clipboard.getHandlers();

				expect( handlers ).to.be.an( 'array' );
			} );
		} );

		describe( 'removeHandler', () => {
			it( 'requires valid handler', () => {
				const clipboard = new Clipboard();
				const handler = {
				};

				expect( () => {
					clipboard.removeHandler( handler );
				} ).to.throw( TypeError, 'Handler must have handle method' );
			} );

			it( 'removes passed handler', () => {
				const clipboard = new Clipboard();
				const pasteHandler = {
					type: HandlerType.PASTE,
					handle() {}
				};
				const dropHandler = {
					type: HandlerType.DROP,
					handle() {}
				};

				clipboard.addHandler( pasteHandler );
				clipboard.addHandler( dropHandler );

				clipboard.removeHandler( dropHandler );

				expect( clipboard.getHandlers() ).to.deep.equal( [ pasteHandler ] );
			} );

			it( 'does nothing when handler is not found', () => {
				const clipboard = new Clipboard();
				const pasteHandler = {
					type: HandlerType.PASTE,
					handle() {}
				};
				const dropHandler = {
					type: HandlerType.DROP,
					handle() {}
				};

				clipboard.addHandler( pasteHandler );

				clipboard.removeHandler( dropHandler );

				expect( clipboard.getHandlers() ).to.deep.equal( [ pasteHandler ] );
			} );
		} );
	} );

	describe( 'zones', () => {
		const sandbox = sinon.createSandbox();

		afterEach( () => {
			sandbox.restore();
		} );

		describe( 'addZone', () => {
			it( 'requires DOM element', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );

				expect( () => {
					clipboard.addZone( { tagName: 'DIV' }, HandlerType.PASTE );
				} ).to.throw( TypeError, 'Zone container must be an HTML element' );

				expect( () => {
					clipboard.addZone( div, HandlerType.PASTE );
				} ).not.to.throw( TypeError, 'Zone container must be an HTML element' );
			} );

			it( 'requires correct type', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );

				expect( () => {
					clipboard.addZone( div, 'paste' );
				} ).to.throw( TypeError, 'Zone type must be an instance of HandlerType' );

				expect( () => {
					clipboard.addZone( div, HandlerType.PASTE );
				} ).not.to.throw( TypeError, 'Zone type must be an instance of HandlerType' );
			} );

			it( 'throws error when trying to add more than one zone of given type to the same element', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );

				clipboard.addZone( div, HandlerType.PASTE );

				expect( () => {
					clipboard.addZone( div, HandlerType.PASTE );
				} ).to.throw( Error, 'Only one zone of given type can be attached to the same element' );
			} );

			it( 'creates appropriate event listener on the element', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );
				const spy = sandbox.spy( div, 'addEventListener' );

				clipboard.addZone( div, HandlerType.PASTE );

				const [ { listener: pasteListener } ] = clipboard.getZones( HandlerType.PASTE );

				expect( spy ).to.have.been.calledWith( 'paste', pasteListener );

				clipboard.addZone( div, HandlerType.DROP );

				const [ { listener: dropListener } ] = clipboard.getZones( HandlerType.DROP );

				expect( spy ).to.have.been.calledWith( 'drop', dropListener );
			} );
		} );

		describe( 'getZones', () => {
			it( 'returns all zones by default', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );

				clipboard.addZone( div, HandlerType.PASTE );
				clipboard.addZone( div, HandlerType.DROP );

				const zones = clipboard.getZones();

				expect( zones ).to.have.lengthOf( 2 );

				zones.forEach( ( { element, type, listener }, i ) => {
					const expectedType = HandlerType[ i === 0 ? 'PASTE' : 'DROP' ];

					expect( element ).to.equal( div );
					expect( type ).to.equal( expectedType );
					expect( listener ).to.be.a( 'function' );
				} );
			} );

			it( 'requires type to be instance of HandlerType', () => {
				const clipboard = new Clipboard();

				expect( () => {
					clipboard.getZones( 'paste' );
				} ).to.throw( TypeError, 'Zone type must be an instance of HandlerType' );

				expect( () => {
					clipboard.getZones( HandlerType.PASTE );
				} ).not.to.throw( TypeError, 'Zone type must be an instance of HandlerType' );
			} );

			it( 'returns all zones for given type', () => {
				const clipboard = new Clipboard();

				clipboard.addZone( document.createElement( 'div' ), HandlerType.PASTE );
				clipboard.addZone( document.createElement( 'div' ), HandlerType.PASTE );
				clipboard.addZone( document.createElement( 'div' ), HandlerType.DROP );
				clipboard.addZone( document.createElement( 'div' ), HandlerType.DROP );

				const zones = clipboard.getZones( HandlerType.PASTE );

				expect( zones ).to.have.lengthOf( 2 );

				zones.forEach( ( { type } ) => {
					expect( type ).to.equal( HandlerType.PASTE );
				} );
			} );

			it( 'always returns an array', () => {
				const clipboard = new Clipboard();
				const handlers = clipboard.getZones();

				expect( handlers ).to.be.an( 'array' );
			} );
		} );

		describe( 'removeZone', () => {
			it( 'requires DOM element', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );

				expect( () => {
					clipboard.removeZone( { tagName: 'DIV' }, HandlerType.PASTE );
				} ).to.throw( TypeError, 'Zone container must be an HTML element' );

				expect( () => {
					clipboard.removeZone( div, HandlerType.PASTE );
				} ).not.to.throw( TypeError, 'Zone container must be an HTML element' );
			} );

			it( 'requires correct type', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );

				expect( () => {
					clipboard.removeZone( div, 'paste' );
				} ).to.throw( TypeError, 'Zone type must be an instance of HandlerType' );

				expect( () => {
					clipboard.removeZone( div, HandlerType.PASTE );
				} ).not.to.throw( TypeError, 'Zone type must be an instance of HandlerType' );
			} );

			it( 'removes passed zone', () => {
				const clipboard = new Clipboard();
				const div = document.createElement( 'div' );
				const spy = sandbox.spy( div, 'removeEventListener' );

				clipboard.addZone( div, HandlerType.DROP );
				clipboard.addZone( div, HandlerType.PASTE );

				const [ { listener } ] = clipboard.getZones();

				clipboard.removeZone( div, HandlerType.DROP );

				const zones = clipboard.getZones();
				const [ { element: zoneElement, type: zoneType } ] = zones;

				expect( zones ).to.have.lengthOf( 1 );
				expect( zoneElement ).to.equal( div );
				expect( zoneType ).to.equal( HandlerType.PASTE );
				expect( spy ).to.have.been.calledWith( 'drop', listener );
			} );
		} );
	} );

	describe( 'middlewares', () => {
		const sandbox = sinon.createSandbox();

		afterEach( () => {
			sandbox.restore();
		} );

		it( 'prevents default behaviour of event', () => {
			const clipboard = new Clipboard();
			const div = document.createElement( 'div' );

			clipboard.addZone( div, HandlerType.PASTE );

			const pasteEvent = new ClipboardEvent( 'paste' );
			const spy = sandbox.spy( pasteEvent, 'preventDefault' );

			div.dispatchEvent( pasteEvent );

			expect( spy ).to.have.been.calledOnce;
		} );

		it( 'passes DataTransfer instance to the handlers', () => {
			const clipboard = new Clipboard();
			const div = document.createElement( 'div' );
			const spy = sandbox.spy();

			clipboard.addHandler( {
				type: HandlerType.PASTE,
				handle: spy
			} );
			clipboard.addZone( div, HandlerType.PASTE );

			const dataTransfer = new DataTransfer();
			const pasteEvent = new ClipboardEvent( 'paste', {
				clipboardData: dataTransfer
			} );

			div.dispatchEvent( pasteEvent );

			expect( spy ).to.have.been.calledOnce;
			expect( spy.getCall( 0 ).args[ 0 ] ).to.be.an.instanceOf( DataTransfer );
		} );

		it( 'passes execution to correct handlers in correct order', () => {
			const clipboard = new Clipboard();
			const div = document.createElement( 'div' );

			const expected1 = {
				type: HandlerType.PASTE,
				handle: sandbox.stub().callsFake( ( data, next ) => {
					next();
				} )
			};

			const expected2 = {
				type: HandlerType.PASTE,
				handle: sandbox.stub().callsFake( ( data, next ) => {
					next();
				} )
			};

			const expected3 = {
				type: HandlerType.PASTE,
				order: 999,
				handle: sandbox.stub()
			};

			const expected4 = {
				type: HandlerType.PASTE,
				order: Infinity,
				handle: sandbox.stub()
			};

			const unexpected = {
				type: HandlerType.DROP,
				handle: sandbox.stub().callsFake( ( data, next ) => {
					next();
				} )
			};

			clipboard.addHandler( expected3 );
			clipboard.addHandler( expected1 );
			clipboard.addHandler( expected2 );
			clipboard.addHandler( unexpected );

			clipboard.addZone( div, HandlerType.PASTE );

			const pasteEvent = new ClipboardEvent( 'paste' );
			div.dispatchEvent( pasteEvent );

			expect( expected1.handle ).to.have.been.calledOnce;
			expect( expected2.handle ).to.have.been.calledOnce;
			expect( expected2.handle ).to.have.been.calledImmediatelyAfter( expected1.handle );
			expect( expected3.handle ).to.have.been.calledOnce;
			expect( expected3.handle ).to.have.been.calledImmediatelyAfter( expected2.handle );
			expect( expected4.handle ).not.to.have.been.called;
			expect( unexpected.handle ).not.to.have.been.called;
		} );
	} );
} );
