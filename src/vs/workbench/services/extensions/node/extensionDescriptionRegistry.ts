/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionDescription } from 'vs/workbench/services/extensions/common/extensions';

const hasOwnProperty = Object.hasOwnProperty;

export class ExtensionDescriptionRegistry {
	private _extensionDescriptions: IExtensionDescription[];
	private _extensionsMap: { [extensionId: string]: IExtensionDescription; };
	private _extensionsArr: IExtensionDescription[];
	private _activationMap: { [activationEvent: string]: IExtensionDescription[]; };

	constructor(extensionDescriptions: IExtensionDescription[]) {
		this._extensionDescriptions = extensionDescriptions;
		this._initialize();
	}

	private _initialize(): void {
		this._extensionsMap = {};
		this._extensionsArr = [];
		this._activationMap = {};

		for (let i = 0, len = this._extensionDescriptions.length; i < len; i++) {
			let extensionDescription = this._extensionDescriptions[i];

			if (hasOwnProperty.call(this._extensionsMap, extensionDescription.id)) {
				// No overwriting allowed!
				console.error('Extension `' + extensionDescription.id + '` is already registered');
				continue;
			}

			this._extensionsMap[extensionDescription.id] = extensionDescription;
			this._extensionsArr.push(extensionDescription);

			if (Array.isArray(extensionDescription.activationEvents)) {
				for (let j = 0, lenJ = extensionDescription.activationEvents.length; j < lenJ; j++) {
					let activationEvent = extensionDescription.activationEvents[j];

					// TODO there's no easy way to contribute this id:168 @joao:
					if (activationEvent === 'onUri') {
						activationEvent = `onUri:${extensionDescription.id}`;
					}

					this._activationMap[activationEvent] = this._activationMap[activationEvent] || [];
					this._activationMap[activationEvent].push(extensionDescription);
				}
			}
		}
	}

	public keepOnly(extensionIds: string[]): void {
		let toKeep = new Set<string>();
		extensionIds.forEach(extensionId => toKeep.add(extensionId));
		this._extensionDescriptions = this._extensionDescriptions.filter(extension => toKeep.has(extension.id));
		this._initialize();
	}

	public containsActivationEvent(activationEvent: string): boolean {
		return hasOwnProperty.call(this._activationMap, activationEvent);
	}

	public getExtensionDescriptionsForActivationEvent(activationEvent: string): IExtensionDescription[] {
		if (!hasOwnProperty.call(this._activationMap, activationEvent)) {
			return [];
		}
		return this._activationMap[activationEvent].slice(0);
	}

	public getAllExtensionDescriptions(): IExtensionDescription[] {
		return this._extensionsArr.slice(0);
	}

	public getExtensionDescription(extensionId: string): IExtensionDescription | null {
		if (!hasOwnProperty.call(this._extensionsMap, extensionId)) {
			return null;
		}
		return this._extensionsMap[extensionId];
	}
}
