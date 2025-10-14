import {notifyAnyError, notifyError} from "~/lib/errors";

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
    startLoading: () => void,
    stopLoading: () => void,
}

export function callApi<T>({
                               api,
                               errorTitle,
                               onSuccess,
                               startLoading,
                               stopLoading,
                           }: CallApiParams<T>) {
    startLoading()
    api().then(({data, error, response}) => {
        if (data != undefined) {
            onSuccess(data)
        } else {
            notifyError(errorTitle, response, error)
        }
    }).catch(error => {
        notifyAnyError(errorTitle, error)
    }).finally(stopLoading)
}
