/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from 'vs/base/common/lifecycle';
import { Event } from 'vs/base/common/event';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { IContextMenuDelegate } from 'vs/base/browser/contextmenu';
import { AnchorAlignment } from 'vs/base/browser/ui/contextview/contextview';

export const IContextViewService = createDecorator<IContextViewService>('contextViewService');

export interface IContextViewService {

	_serviceBrand: any;

	showContextView(delegate: IContextViewDelegate): void;
	hideContextView(data?: any): void;
	layout(): void;
	anchorAlignment?: AnchorAlignment;
}

export interface IContextViewDelegate {

	canRelayout?: boolean; // Default: true

	getAnchor(): HTMLElement | { x: number; y: number; width?: number; height?: number; };
	render(container: HTMLElement): IDisposable;
	onDOMEvent?(e: any, activeElement: HTMLElement): void;
	onHide?(data?: any): void;
	focus?(): void;
	anchorAlignment?: AnchorAlignment;
}

export const IContextMenuService = createDecorator<IContextMenuService>('contextMenuService');

export interface IContextMenuService {

	_serviceBrand: any;

	showContextMenu(delegate: IContextMenuDelegate): void;
	onDidContextMenu: Event<void>; // TODO these event should be removed once we get async context menus id:39 @isidor
}