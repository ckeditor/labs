/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals chai */

import HandlerType from '../src/HandlerType.js';
import { validateHandler, isInteger } from '../src/utils.js';

const { expect } = chai;

describe( 'utils', () => {
	describe( 'validateHandler', () => {
		it( 'validates type of handler', () => {
			const invalids = [
				1,
				'test',
				[],
				function() {},
				null,
				undefined
			];

			invalids.forEach( invalid => {
				expect( () => {
					validateHandler( invalid );
				} ).to.throw( TypeError, 'Handler must be an object' );
			} );

			expect( () => {
				validateHandler( {} );
			} ).not.to.throw( TypeError, 'Handler must be an object' );
		} );

		it( 'validates type of handle method', () => {
			const invalids = [
				1,
				'test',
				[],
				{},
				null,
				undefined
			];

			invalids.forEach( invalid => {
				expect( () => {
					validateHandler( {
						handle: invalid
					} );
				} ).to.throw( TypeError, 'Handler must have handle method' );
			} );

			expect( () => {
				validateHandler( {
					handle() {}
				} );
			} ).not.to.throw( TypeError, 'Handler must have handle method' );
		} );

		it( 'validates type property', () => {
			const invalids = [
				1,
				'paste',
				[],
				{},
				null
			];

			const valids = [
				undefined,
				HandlerType.PASTE,
				HandlerType.DROP
			];

			invalids.forEach( invalid => {
				expect( () => {
					validateHandler( {
						type: invalid,
						handle() {}
					} );
				} ).to.throw( TypeError, 'Handler type must be an instance of HandlerType' );
			} );

			valids.forEach( valid => {
				expect( () => {
					validateHandler( {
						type: valid,
						handle() {}
					} );
				} ).not.to.throw( TypeError, 'Handler type must be an instance of HandlerType' );
			} );
		} );

		it( 'validates order property', () => {
			const invalids = [
				1.5,
				'1',
				[],
				{},
				null
			];

			const valids = [
				undefined,
				1,
				Infinity,
				-Infinity
			];

			invalids.forEach( invalid => {
				expect( () => {
					validateHandler( {
						order: invalid,
						handle() {}
					} );
				} ).to.throw( TypeError, 'Handler order must be an integer' );
			} );

			valids.forEach( valid => {
				expect( () => {
					validateHandler( {
						order: valid,
						handle() {}
					} );
				} ).not.to.throw( TypeError, 'Handler order must be an integer' );
			} );
		} );
	} );

	describe( 'isInteger', () => {
		it( 'checks if given value is an integer', () => {
			const falsies = [
				undefined,
				null,
				'1',
				1.5,
				[],
				{}
			];

			const truthies = [
				1,
				Infinity,
				-Infinity,
				0,
				-0
			];

			falsies.forEach( falsy => {
				expect( isInteger( falsy ) ).to.be.false;
			} );

			truthies.forEach( truthy => {
				expect( isInteger( truthy ), truthy ).to.be.true;
			} );
		} );
	} );
} );
