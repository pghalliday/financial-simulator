import {scope, type} from "arktype";
import {useSearchParams} from "react-router";

const types = scope({
    ItemPageParams: {
        id: "string.uuid",
        name: "string",
        "parent?": "ItemPageParams"
    }
}).export()

export const PAGE_PARAMS_SEARCH_KEY = "pageParams"
export type ItemPageParams = typeof types.ItemPageParams.infer

export function useItemPageParams(itemId: string): ItemPageParams {
    const [searchParams] = useSearchParams()
    const json = searchParams.get(PAGE_PARAMS_SEARCH_KEY)
    if (json !== null) {
        const out = types.ItemPageParams(JSON.parse(json))
        if (out instanceof type.errors) {
            throw out
        }
        return out
    }
    return {
        id: itemId,
        name: itemId,
    }
}
