import { Optional } from "@angular/core";
import { DomRectModel } from "./dom-rect.model";

export interface BaseItemDataModel {
  id: string;
  itemType: string;

}
export interface AdditionalPropertiesDataModel {
  domRect: DomRectModel;
  [key: string]: any;
}
export type SharedDataModel = BaseItemDataModel & Partial<AdditionalPropertiesDataModel>
//  {
//   id: string;
//   itemType: string;
//   domRect?: DomRectModel;
//   [key: string]: any;
// }

export interface AddMessage<T> {
  type: 'add',
  payload: T
}

export interface UpdateMessage<T> {
  type: 'update',
  payload: Partial<T> & BaseItemDataModel
}

export interface RemoveMessage<T> {
  type: 'remove',
  payload: T;
}

export interface AliveMessage {
  type: 'new-client',
}

export type Message<T> = AddMessage<T> | UpdateMessage<T> | RemoveMessage<T> | AliveMessage;

