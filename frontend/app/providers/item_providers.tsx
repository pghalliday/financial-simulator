import {createContext, type PropsWithChildren, type ReactElement, useContext, useState} from "react";
import type {
    Breadcrumb,
    DecimalProviderGet,
    DecimalProviderPost,
    EntityGet,
    EntityPost,
    GetItemApi,
    IdItem,
    PutItemApi,
    RateGet,
    RatePost,
    RateProviderGet,
    RateProviderPost,
    ScheduleGet,
    SchedulePost,
} from "~/lib/types";
import {useGetItem} from "~/lib/hooks/useGetItem";
import {
    type BankAccountGet,
    type BankAccountPost,
    getItemRouteBankAccountsItemIdGet,
    getItemRouteDecimalProvidersItemIdGet,
    getItemRouteEntitiesItemIdGet,
    getItemRouteLedgerAccountsItemIdGet,
    getItemRouteRateProvidersItemIdGet,
    getItemRouteRatesItemIdGet,
    getItemRouteScenariosItemIdGet,
    getItemRouteSchedulesItemIdGet,
    type LedgerAccountGet,
    type LedgerAccountPost,
    putItemRouteBankAccountsItemIdPut,
    putItemRouteDecimalProvidersItemIdPut,
    putItemRouteEntitiesItemIdPut,
    putItemRouteLedgerAccountsItemIdPut,
    putItemRouteRateProvidersItemIdPut,
    putItemRouteRatesItemIdPut,
    putItemRouteScenariosItemIdPut,
    putItemRouteSchedulesItemIdPut,
    type ScenarioGet,
    type ScenarioPost
} from "../../client";
import {usePutItem} from "~/lib/hooks/usePutItem";
import {type ItemPageParams, useItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {PageParams} from "~/pages/common/PageMetaData";

interface ProviderProps<Get> {
    itemId: string
    itemPageTitle: (itemPageParams: ItemPageParams) => string,
    itemPageDescription: (itemPageParams: ItemPageParams) => string,
    itemBreadcrumbs: (itemPageParams: ItemPageParams) => Breadcrumb[],
    getItemPageParams: (item: Get) => ItemPageParams,
    onBegin?: () => void
    onEnd?: () => void
}

interface ContextData<Post, Get> {
    item: Get | undefined
    setItem: (item: Get) => void
    onBegin?: () => void
    onEnd?: () => void
    pageParams: PageParams
}

interface Props<Post, Get extends IdItem> {
    label: string
    getItemApi: GetItemApi<Get>
    putItemApi: PutItemApi<Post, Get>
}

interface HookProps<Get> {
    onPutSuccess?: (item: Get) => void
}

type HookData<Post, Get> = [Get | undefined, (item: Post) => void, PageParams]

type ProviderType<Get> = (
    props: PropsWithChildren<ProviderProps<Get>>
) => ReactElement

export function createItemProvider<Post, Get extends IdItem>(
    {
        label,
        getItemApi,
        putItemApi,
    }: Props<Post, Get>
): [ProviderType<Get>, (props: HookProps<Get>) => HookData<Post, Get>] {
    const Context = createContext<ContextData<Post, Get> | undefined>(undefined);

    function ItemProvider(
        {
            itemId,
            itemPageTitle,
            itemPageDescription,
            itemBreadcrumbs,
            getItemPageParams,
            onBegin,
            onEnd,
            children,
        }: PropsWithChildren<ProviderProps<Get>>
    ) {
        const {item, setItem} = useGetItem({
            itemId,
            getItemApi: getItemApi,
            onBegin,
            onEnd,
        })

        const itemPageParams = useItemPageParams(itemId)

        const [pageParams, setPageParams] = useState<PageParams>({
            title: itemPageTitle(itemPageParams),
            description: itemPageDescription(itemPageParams),
            breadcrumbs: itemBreadcrumbs(itemPageParams)
        })

        const [previousItem, setPreviousItem] = useState(item)
        if (previousItem !== item) {
            setPreviousItem(item)
            if (item !== undefined) {
                setPageParams({
                    title: itemPageTitle(getItemPageParams(item)),
                    description: itemPageDescription(getItemPageParams(item)),
                    breadcrumbs: itemBreadcrumbs(getItemPageParams(item)),
                })
            }
        }

        return <Context.Provider value={{
            item,
            setItem,
            onBegin,
            onEnd,
            pageParams,
        }}>
            {children}
        </Context.Provider>
    }

    function useItem({onPutSuccess}: HookProps<Get>): HookData<Post, Get> {
        const contextData = useContext(Context)
        if (contextData === undefined) {
            throw new Error(`Attempted to call use${label}() outside of <${label}Provider>`)
        }

        const putItem = usePutItem({
            item: contextData.item,
            onSuccess: (item: Get) => {
                contextData.setItem(item)
                onPutSuccess && onPutSuccess(item)
            },
            putItemApi,
            onBegin: contextData.onBegin,
            onEnd: contextData.onEnd,
        })

        return [contextData.item, putItem, contextData.pageParams]
    }

    return [ItemProvider, useItem]
}

export const [ScenarioProvider, useScenario] = createItemProvider<ScenarioPost, ScenarioGet>({
    label: "Scenario",
    getItemApi: getItemRouteScenariosItemIdGet,
    putItemApi: putItemRouteScenariosItemIdPut,
})

export const [EntityProvider, useEntity] = createItemProvider<EntityPost, EntityGet>({
    label: "Entity",
    getItemApi: getItemRouteEntitiesItemIdGet,
    putItemApi: putItemRouteEntitiesItemIdPut,
})

export const [BankAccountProvider, useBankAccount] = createItemProvider<BankAccountPost, BankAccountGet>({
    label: "BankAccount",
    getItemApi: getItemRouteBankAccountsItemIdGet,
    putItemApi: putItemRouteBankAccountsItemIdPut,
})

export const [LedgerAccountProvider, useLedgerAccount] = createItemProvider<LedgerAccountPost, LedgerAccountGet>({
    label: "LedgerAccount",
    getItemApi: getItemRouteLedgerAccountsItemIdGet,
    putItemApi: putItemRouteLedgerAccountsItemIdPut,
})

export const [RateProvider, useRate] = createItemProvider<RatePost, RateGet>({
    label: "Rate",
    getItemApi: getItemRouteRatesItemIdGet,
    putItemApi: putItemRouteRatesItemIdPut,
})

export const [ScheduleProvider, useSchedule] = createItemProvider<SchedulePost, ScheduleGet>({
    label: "Schedule",
    getItemApi: getItemRouteSchedulesItemIdGet,
    putItemApi: putItemRouteSchedulesItemIdPut,
})

export const [DecimalProviderProvider, useDecimalProvider] = createItemProvider<DecimalProviderPost, DecimalProviderGet>({
    label: "DecimalProvider",
    getItemApi: getItemRouteDecimalProvidersItemIdGet,
    putItemApi: putItemRouteDecimalProvidersItemIdPut,
})

export const [RateProviderProvider, useRateProvider] = createItemProvider<RateProviderPost, RateProviderGet>({
    label: "RateProvider",
    getItemApi: getItemRouteRateProvidersItemIdGet,
    putItemApi: putItemRouteRateProvidersItemIdPut,
})
