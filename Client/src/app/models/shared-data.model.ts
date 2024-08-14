import { DomRectModel } from "./dom-rect.model";

export interface IRequiredItemData {
  id: string;
  itemType: string;

}
export interface IOptionalItemData {
  domRect: DomRectModel;
  [key: string]: any;
}
export type SharedDataModel = IRequiredItemData & Partial<IOptionalItemData>
//  {
//   id: string;
//   itemType: string;
//   domRect?: DomRectModel;
//   [key: string]: any;
// }

export interface IAddMessage<T> {
  type: 'add',
  payload: T
}

export interface IUpdateMessage<T> {
  type: 'update',
  payload: Partial<T> & IRequiredItemData
}

export interface IRemoveMessage<T> {
  type: 'remove',
  payload: T;
}

export interface INewClientMessage {
  type: 'new-client'
}

export type Message<T> = IAddMessage<T> | IUpdateMessage<T> | IRemoveMessage<T> | INewClientMessage;

