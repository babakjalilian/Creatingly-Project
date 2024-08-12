import { DomRectModel } from "./dom-rect.model";

export interface SharedDataModel {
  id: string;
  itemType: string;
  domRect?: DomRectModel;
}

export interface AddMessage<T> {
  type: 'add',
  payload: T
}

export interface UpdateMessage<T> {
  type: 'update',
  payload: T
}

export interface RemoveMessage<T> {
  type: 'remove',
  payload: T;
}

export interface AliveMessage {
  type: 'new-client',
}

export type Message<T> = AddMessage<T> | UpdateMessage<T> | RemoveMessage<T> | AliveMessage;

