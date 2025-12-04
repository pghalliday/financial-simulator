import {createContext, type PropsWithChildren, type ReactElement, useContext, useState} from "react";
import type {
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
import {useGetItem} from "~/hooks/useGetItem";
import {
    type AllScheduleGet,
    type AllSchedulePost,
    type AnyScheduleGet,
    type AnySchedulePost,
    type BandedRateGet,
    type BandedRatePost,
    type BankAccountGet,
    type BankAccountPost,
    type ContinuousRateGet,
    type ContinuousRatePost,
    type CorporationEntityGet,
    type CorporationEntityPost,
    type DailyScheduleGet,
    type DailySchedulePost,
    type DayScheduleGet,
    type DaySchedulePost,
    type FromScheduleGet,
    type FromSchedulePost,
    getItemRouteBankAccountsItemIdGet,
    getItemRouteDecimalProvidersItemIdGet,
    getItemRouteEntitiesItemIdGet,
    getItemRouteLedgerAccountsItemIdGet,
    getItemRouteRateProvidersItemIdGet,
    getItemRouteRatesItemIdGet,
    getItemRouteScenariosItemIdGet,
    getItemRouteSchedulesItemIdGet,
    type IndividualEntityGet,
    type IndividualEntityPost,
    type LedgerAccountGet,
    type LedgerAccountPost,
    type MergeDecimalProviderGet,
    type MergeDecimalProviderPost,
    type MergeRateProviderGet,
    type MergeRateProviderPost,
    type MonthlyScheduleGet,
    type MonthlySchedulePost,
    type NextDecimalProviderGet,
    type NextDecimalProviderPost,
    type NextRateProviderGet,
    type NextRateProviderPost,
    type PeriodicRateGet,
    type PeriodicRatePost,
    putItemRouteBankAccountsItemIdPut,
    putItemRouteDecimalProvidersItemIdPut,
    putItemRouteEntitiesItemIdPut,
    putItemRouteLedgerAccountsItemIdPut,
    putItemRouteRateProvidersItemIdPut,
    putItemRouteRatesItemIdPut,
    putItemRouteScenariosItemIdPut,
    putItemRouteSchedulesItemIdPut,
    type RangeScheduleGet,
    type RangeSchedulePost,
    type ScenarioGet,
    type ScenarioPost,
    type ScheduledDecimalProviderGet,
    type ScheduledDecimalProviderPost,
    type ScheduledRateProviderGet,
    type ScheduledRateProviderPost,
    type UntilScheduleGet,
    type UntilSchedulePost,
    type WeeklyScheduleGet,
    type WeeklySchedulePost,
    type YearlyScheduleGet,
    type YearlySchedulePost
} from "../../client";
import {usePutItem} from "~/hooks/usePutItem";
import {useItemPageParams} from "~/hooks/useItemPageParams";
import type {PageParams} from "~/pages/PageMetaData";
import type {PageParams} from "~/page_params/PageParams";

interface ProviderProps<Get> {
    itemId: string
    itemParams: PageParams<Get>
    onBegin?: () => void
    onEnd?: () => void
}

interface ContextData<Get> {
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
    const Context = createContext<ContextData<Get> | undefined>(undefined);

    function ItemProvider(
        {
            itemId,
            itemParams,
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
            title: itemParams.itemPageTitle(itemPageParams),
            description: itemParams.itemPageDescription(itemPageParams),
            breadcrumbs: itemParams.itemBreadcrumbs(itemPageParams)
        })

        const [previousItem, setPreviousItem] = useState(item)
        if (previousItem !== item) {
            setPreviousItem(item)
            if (item !== undefined) {
                setPageParams({
                    title: itemParams.itemPageTitle(itemParams.getItemPageParams(item)),
                    description: itemParams.itemPageDescription(itemParams.getItemPageParams(item)),
                    breadcrumbs: itemParams.itemBreadcrumbs(itemParams.getItemPageParams(item)),
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
    label: "IndividualEntity",
    getItemApi: getItemRouteEntitiesItemIdGet,
    putItemApi: putItemRouteEntitiesItemIdPut,
})

export const [IndividualEntityProvider, useIndividualEntity] = createItemProvider<IndividualEntityPost, IndividualEntityGet>({
    label: "IndividualEntity",
    getItemApi: getItemRouteEntitiesItemIdGet as GetItemApi<IndividualEntityGet>,
    putItemApi: putItemRouteEntitiesItemIdPut as PutItemApi<IndividualEntityPost, IndividualEntityGet>,
})

export const [CorporationEntityProvider, useCorporationEntity] = createItemProvider<CorporationEntityPost, CorporationEntityGet>({
    label: "CorporationEntity",
    getItemApi: getItemRouteEntitiesItemIdGet as GetItemApi<CorporationEntityGet>,
    putItemApi: putItemRouteEntitiesItemIdPut as PutItemApi<CorporationEntityPost, CorporationEntityGet>,
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
    label: "PeriodicRate",
    getItemApi: getItemRouteRatesItemIdGet,
    putItemApi: putItemRouteRatesItemIdPut,
})

export const [PeriodicRateProvider, usePeriodicRate] = createItemProvider<PeriodicRatePost, PeriodicRateGet>({
    label: "PeriodicRate",
    getItemApi: getItemRouteRatesItemIdGet as GetItemApi<PeriodicRateGet>,
    putItemApi: putItemRouteRatesItemIdPut as PutItemApi<PeriodicRatePost, PeriodicRateGet>,
})

export const [ContinuousRateProvider, useContinuousRate] = createItemProvider<ContinuousRatePost, ContinuousRateGet>({
    label: "ContinuousRate",
    getItemApi: getItemRouteRatesItemIdGet as GetItemApi<ContinuousRateGet>,
    putItemApi: putItemRouteRatesItemIdPut as PutItemApi<ContinuousRatePost, ContinuousRateGet>,
})

export const [BandedRateProvider, useBandedRate] = createItemProvider<BandedRatePost, BandedRateGet>({
    label: "BandedRate",
    getItemApi: getItemRouteRatesItemIdGet as GetItemApi<BandedRateGet>,
    putItemApi: putItemRouteRatesItemIdPut as PutItemApi<BandedRatePost, BandedRateGet>,
})

export const [ScheduleProvider, useSchedule] = createItemProvider<SchedulePost, ScheduleGet>({
    label: "DailySchedule",
    getItemApi: getItemRouteSchedulesItemIdGet,
    putItemApi: putItemRouteSchedulesItemIdPut,
})

export const [DailyScheduleProvider, useDailySchedule] = createItemProvider<DailySchedulePost, DailyScheduleGet>({
    label: "DailySchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<DailyScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<DailySchedulePost, DailyScheduleGet>,
})

export const [DayScheduleProvider, useDaySchedule] = createItemProvider<DaySchedulePost, DayScheduleGet>({
    label: "DaySchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<DayScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<DaySchedulePost, DayScheduleGet>,
})

export const [WeeklyScheduleProvider, useWeeklySchedule] = createItemProvider<WeeklySchedulePost, WeeklyScheduleGet>({
    label: "WeeklySchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<WeeklyScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<WeeklySchedulePost, WeeklyScheduleGet>,
})

export const [MonthlyScheduleProvider, useMonthlySchedule] = createItemProvider<MonthlySchedulePost, MonthlyScheduleGet>({
    label: "MonthlySchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<MonthlyScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<MonthlySchedulePost, MonthlyScheduleGet>,
})

export const [YearlyScheduleProvider, useYearlySchedule] = createItemProvider<YearlySchedulePost, YearlyScheduleGet>({
    label: "YearlySchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<YearlyScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<YearlySchedulePost, YearlyScheduleGet>,
})

export const [FromScheduleProvider, useFromSchedule] = createItemProvider<FromSchedulePost, FromScheduleGet>({
    label: "FromSchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<FromScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<FromSchedulePost, FromScheduleGet>,
})

export const [UntilScheduleProvider, useUntilSchedule] = createItemProvider<UntilSchedulePost, UntilScheduleGet>({
    label: "UntilSchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<UntilScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<UntilSchedulePost, UntilScheduleGet>,
})

export const [RangeScheduleProvider, useRangeSchedule] = createItemProvider<RangeSchedulePost, RangeScheduleGet>({
    label: "RangeSchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<RangeScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<RangeSchedulePost, RangeScheduleGet>,
})

export const [AllScheduleProvider, useAllSchedule] = createItemProvider<AllSchedulePost, AllScheduleGet>({
    label: "AllSchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<AllScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<AllSchedulePost, AllScheduleGet>,
})

export const [AnyScheduleProvider, useAnySchedule] = createItemProvider<AnySchedulePost, AnyScheduleGet>({
    label: "AnySchedule",
    getItemApi: getItemRouteSchedulesItemIdGet as GetItemApi<AnyScheduleGet>,
    putItemApi: putItemRouteSchedulesItemIdPut as PutItemApi<AnySchedulePost, AnyScheduleGet>,
})

export const [DecimalProviderProvider, useDecimalProvider] = createItemProvider<DecimalProviderPost, DecimalProviderGet>({
    label: "DecimalProvider",
    getItemApi: getItemRouteDecimalProvidersItemIdGet,
    putItemApi: putItemRouteDecimalProvidersItemIdPut,
})

export const [ScheduledDecimalProviderProvider, useScheduledDecimalProvider] = createItemProvider<ScheduledDecimalProviderPost, ScheduledDecimalProviderGet>({
    label: "ScheduledDecimalProvider",
    getItemApi: getItemRouteDecimalProvidersItemIdGet as GetItemApi<ScheduledDecimalProviderGet>,
    putItemApi: putItemRouteDecimalProvidersItemIdPut as PutItemApi<ScheduledDecimalProviderPost, ScheduledDecimalProviderGet>,
})

export const [MergeDecimalProviderProvider, useMergeDecimalProvider] = createItemProvider<MergeDecimalProviderPost, MergeDecimalProviderGet>({
    label: "MergeDecimalProvider",
    getItemApi: getItemRouteDecimalProvidersItemIdGet as GetItemApi<MergeDecimalProviderGet>,
    putItemApi: putItemRouteDecimalProvidersItemIdPut as PutItemApi<MergeDecimalProviderPost, MergeDecimalProviderGet>,
})

export const [NextDecimalProviderProvider, useNextDecimalProvider] = createItemProvider<NextDecimalProviderPost, NextDecimalProviderGet>({
    label: "NextDecimalProvider",
    getItemApi: getItemRouteDecimalProvidersItemIdGet as GetItemApi<NextDecimalProviderGet>,
    putItemApi: putItemRouteDecimalProvidersItemIdPut as PutItemApi<NextDecimalProviderPost, NextDecimalProviderGet>,
})

export const [RateProviderProvider, useRateProvider] = createItemProvider<RateProviderPost, RateProviderGet>({
    label: "RateProvider",
    getItemApi: getItemRouteRateProvidersItemIdGet,
    putItemApi: putItemRouteRateProvidersItemIdPut,
})

export const [ScheduledRateProviderProvider, useScheduledRateProvider] = createItemProvider<ScheduledRateProviderPost, ScheduledRateProviderGet>({
    label: "ScheduledRateProvider",
    getItemApi: getItemRouteRateProvidersItemIdGet as GetItemApi<ScheduledRateProviderGet>,
    putItemApi: putItemRouteRateProvidersItemIdPut as PutItemApi<ScheduledRateProviderPost, ScheduledRateProviderGet>,
})

export const [MergeRateProviderProvider, useMergeRateProvider] = createItemProvider<MergeRateProviderPost, MergeRateProviderGet>({
    label: "MergeRateProvider",
    getItemApi: getItemRouteRateProvidersItemIdGet as GetItemApi<MergeRateProviderGet>,
    putItemApi: putItemRouteRateProvidersItemIdPut as PutItemApi<MergeRateProviderPost, MergeRateProviderGet>,
})

export const [NextRateProviderProvider, useNextRateProvider] = createItemProvider<NextRateProviderPost, NextRateProviderGet>({
    label: "NextRateProvider",
    getItemApi: getItemRouteRateProvidersItemIdGet as GetItemApi<NextRateProviderGet>,
    putItemApi: putItemRouteRateProvidersItemIdPut as PutItemApi<NextRateProviderPost, NextRateProviderGet>,
})
