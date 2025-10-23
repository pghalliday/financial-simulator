import {useSearchParams} from "react-router";
import type {NamedItem} from "~/lib/types";

export function useInitialItem(itemId: string): NamedItem {
    const [searchParams] = useSearchParams()
    const searchParamsName = searchParams.get("name") || itemId;

    return {
        id: itemId,
        name: searchParamsName,
    }
}