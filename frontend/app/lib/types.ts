import type {APIResult} from "~/lib/callApi";
import type {
    GetItemRouteDecimalProvidersItemIdGetResponse,
    GetItemRouteEntitiesItemIdGetResponse,
    GetItemRouteRateProvidersItemIdGetResponse,
    GetItemRouteRatesItemIdGetResponse,
    GetItemRouteSchedulesItemIdGetResponse,
    PostItemRouteDecimalProvidersPostData,
    PostItemRouteEntitiesPostData,
    PostItemRouteRateProvidersPostData,
    PostItemRouteRatesPostData,
    PostItemRouteSchedulesPostData
} from "../../client";

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

export interface Breadcrumb {
    title: string,
    href: string,
}

export type GetItemsApi<Get> = () => Promise<APIResult<Get[]>>

export type GetTypedItemsApi<Get extends { type: any }, Type = Get["type"]> = (options?: {
    query?: {
        type?: Type,
    },
}) => Promise<APIResult<Get[]>>

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

export type DeleteItemApi<Get> = (options: {
    path: {
        item_id: string,
    },
}) => Promise<APIResult<Get>>

export type EntityGet = GetItemRouteEntitiesItemIdGetResponse
export type EntityPost = PostItemRouteEntitiesPostData["body"]

export type RateGet = GetItemRouteRatesItemIdGetResponse
export type RatePost = PostItemRouteRatesPostData["body"]

export type ScheduleGet = GetItemRouteSchedulesItemIdGetResponse
export type SchedulePost = PostItemRouteSchedulesPostData["body"]

export type DecimalProviderGet = GetItemRouteDecimalProvidersItemIdGetResponse
export type DecimalProviderPost = PostItemRouteDecimalProvidersPostData["body"]

export type RateProviderGet = GetItemRouteRateProvidersItemIdGetResponse
export type RateProviderPost = PostItemRouteRateProvidersPostData["body"]
