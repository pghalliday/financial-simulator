import {notifyApiError, notifyApiErrorResponse} from "~/lib/errors";

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

export type APIResult<T> = (APISuccessResult<T> & APIRequestData) | (APIErrorResult & APIRequestData)

export interface CallApiParams<T> {
    api: () => Promise<APIResult<T>>
    errorTitle: string,
    onSuccess: (data: T) => void,
    onBegin?: () => void,
    onEnd?: () => void,
}

export function callApi<T>({
                               api,
                               errorTitle,
                               onSuccess,
                               onBegin,
                               onEnd,
                           }: CallApiParams<T>) {
    onBegin && onBegin()
    api().then(({data, error, response}) => {
        if (data != undefined) {
            onSuccess(data)
        } else {
            notifyApiErrorResponse(errorTitle, response, error)
        }
    }).catch(error => {
        notifyApiError(errorTitle, error)
    }).finally(onEnd)
}
