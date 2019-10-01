/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Enum } from 'enumify';

class HandlerType extends Enum {}

HandlerType.initEnum( [
	'PASTE',
	'DROP'
] );

export default HandlerType;
