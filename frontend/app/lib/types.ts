import type {APIResult} from "~/lib/callApi";

export type KeysOfType<Type, ValueType> = keyof { [P in keyof Type as Type[P] extends ValueType ? P : never]: Type[P] }

export function getFieldOfType<Type, ValueType>(obj: Type, key: KeysOfType<Type, ValueType>): ValueType {
    return obj[key] as ValueType
}

export interface IdItem {
    id: string
}

export interface NamedItem extends IdItem {
    name: string
}

export type GetItemsApi<Get> = () => Promise<APIResult<Get[]>>

export type GetItemApi<Get> = (options: {
    path: {
        item_id: string,
    },
}) => Promise<APIResult<Get>>

export type PostItemApi<Post, Get> = (options: {
    body: Post,
}) => Promise<APIResult<Get>>

export type PutItemApi<Post, Get> = (options: {
    path: {
        item_id: string,
    },
    body: Post,
}) => Promise<APIResult<Get>>

export type PatchItemApi<Patch, Get> = (options: {
    path: {
        item_id: string,
    },
    body: Patch,
}) => Promise<APIResult<Get>>

export type DeleteItemApi<Get> = (options: {
    path: {
        item_id: string,
    },
}) => Promise<APIResult<Get>>

export type GetRelatedItemsApi<Get> = (options: {
    path: {
        item_id: string,
    },
}) => Promise<APIResult<Get[]>>

export type GetRelatedItemApi<Get> = (options: {
    path: {
        item_id: string,
        related_item_id: string,
    },
}) => Promise<APIResult<Get>>

export type PostRelatedItemApi<Post, Get> = (options: {
    path: {
        item_id: string,
    },
    body: Post,
}) => Promise<APIResult<Get>>

export type DeleteRelatedItemApi<Get> = (options: {
    path: {
        item_id: string,
        related_item_id: string,
    },
}) => Promise<APIResult<Get>>