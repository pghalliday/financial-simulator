import type {RowData} from "~/components/controls/item_list/ItemList";

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

export type APIItems = (APISuccessResult<RowData[]> & APIRequestData) | (APIErrorResult & APIRequestData)
export type APIItem = (APISuccessResult<RowData> & APIRequestData) | (APIErrorResult & APIRequestData)

