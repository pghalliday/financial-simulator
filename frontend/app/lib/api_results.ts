import type {Item} from "~/components/ItemList";

export interface APIRequestData {
    request: Request
    response: Response
}

export interface APISuccessResult<T> {
    data: T
    error: undefined
}

export interface APIErrorResult {
    data: undefined
    error: unknown
}

export type APIItems = (APISuccessResult<Item[]> & APIRequestData) | (APIErrorResult & APIRequestData)
export type APIItem = (APISuccessResult<Item> & APIRequestData) | (APIErrorResult & APIRequestData)

