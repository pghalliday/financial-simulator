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
    getItemRouteAllSchedulesItemIdGet,
    getItemRouteAnySchedulesItemIdGet,
    getItemRouteBandedRatesItemIdGet,
    getItemRouteBankAccountsItemIdGet,
    getItemRouteContinuousRatesItemIdGet,
    getItemRouteCorporationEntitiesItemIdGet,
    getItemRouteDailySchedulesItemIdGet,
    getItemRouteDaySchedulesItemIdGet,
    getItemRouteDecimalProvidersItemIdGet,
    getItemRouteEntitiesItemIdGet,
    getItemRouteFromSchedulesItemIdGet,
    getItemRouteIndividualEntitiesItemIdGet,
    getItemRouteLedgerAccountsItemIdGet,
    getItemRouteMergeDecimalProvidersItemIdGet,
    getItemRouteMergeRateProvidersItemIdGet,
    getItemRouteMonthlySchedulesItemIdGet,
    getItemRouteNextDecimalProvidersItemIdGet,
    getItemRouteNextRateProvidersItemIdGet,
    getItemRoutePeriodicRatesItemIdGet,
    getItemRouteRangeSchedulesItemIdGet,
    getItemRouteRateProvidersItemIdGet,
    getItemRouteRatesItemIdGet,
    getItemRouteScenariosItemIdGet,
    getItemRouteScheduledDecimalProvidersItemIdGet,
    getItemRouteScheduledRateProvidersItemIdGet,
    getItemRouteSchedulesItemIdGet,
    getItemRouteUntilSchedulesItemIdGet,
    getItemRouteWeeklySchedulesItemIdGet,
    getItemRouteYearlySchedulesItemIdGet,
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
    putItemRouteAllSchedulesItemIdPut,
    putItemRouteAnySchedulesItemIdPut,
    putItemRouteBandedRatesItemIdPut,
    putItemRouteBankAccountsItemIdPut,
    putItemRouteContinuousRatesItemIdPut,
    putItemRouteCorporationEntitiesItemIdPut,
    putItemRouteDailySchedulesItemIdPut,
    putItemRouteDaySchedulesItemIdPut,
    putItemRouteDecimalProvidersItemIdPut,
    putItemRouteEntitiesItemIdPut,
    putItemRouteFromSchedulesItemIdPut,
    putItemRouteIndividualEntitiesItemIdPut,
    putItemRouteLedgerAccountsItemIdPut,
    putItemRouteMergeDecimalProvidersItemIdPut,
    putItemRouteMergeRateProvidersItemIdPut,
    putItemRouteMonthlySchedulesItemIdPut,
    putItemRouteNextDecimalProvidersItemIdPut,
    putItemRouteNextRateProvidersItemIdPut,
    putItemRoutePeriodicRatesItemIdPut,
    putItemRouteRangeSchedulesItemIdPut,
    putItemRouteRateProvidersItemIdPut,
    putItemRouteRatesItemIdPut,
    putItemRouteScenariosItemIdPut,
    putItemRouteScheduledDecimalProvidersItemIdPut,
    putItemRouteScheduledRateProvidersItemIdPut,
    putItemRouteSchedulesItemIdPut,
    putItemRouteUntilSchedulesItemIdPut,
    putItemRouteWeeklySchedulesItemIdPut,
    putItemRouteYearlySchedulesItemIdPut,
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
import type {PageMetaDataParams} from "~/pages/PageMetaData";
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
    pageMetaDataParams: PageMetaDataParams
}

interface Props<Post, Get extends IdItem> {
    label: string
    getItemApi: GetItemApi<Get>
    putItemApi: PutItemApi<Post, Get>
}

interface HookProps<Get> {
    onPutSuccess?: (item: Get) => void
}

type HookData<Post, Get> = [Get | undefined, (item: Post) => void, PageMetaDataParams]

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

        const [pageMetaDataParams, setPageMetaDataParams] = useState<PageMetaDataParams>({
            title: itemParams.itemPageTitle(itemPageParams),
            description: itemParams.itemPageDescription(itemPageParams),
            breadcrumbs: itemParams.itemBreadcrumbs(itemPageParams)
        })

        const [previousItem, setPreviousItem] = useState(item)
        if (previousItem !== item) {
            setPreviousItem(item)
            if (item !== undefined) {
                setPageMetaDataParams({
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
            pageMetaDataParams,
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

        return [contextData.item, putItem, contextData.pageMetaDataParams]
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

export const [IndividualEntityProvider, useIndividualEntity] = createItemProvider<IndividualEntityPost, IndividualEntityGet>({
    label: "IndividualEntity",
    getItemApi: getItemRouteIndividualEntitiesItemIdGet,
    putItemApi: putItemRouteIndividualEntitiesItemIdPut,
})

export const [CorporationEntityProvider, useCorporationEntity] = createItemProvider<CorporationEntityPost, CorporationEntityGet>({
    label: "CorporationEntity",
    getItemApi: getItemRouteCorporationEntitiesItemIdGet,
    putItemApi: putItemRouteCorporationEntitiesItemIdPut,
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

export const [PeriodicRateProvider, usePeriodicRate] = createItemProvider<PeriodicRatePost, PeriodicRateGet>({
    label: "PeriodicRate",
    getItemApi: getItemRoutePeriodicRatesItemIdGet,
    putItemApi: putItemRoutePeriodicRatesItemIdPut,
})

export const [ContinuousRateProvider, useContinuousRate] = createItemProvider<ContinuousRatePost, ContinuousRateGet>({
    label: "ContinuousRate",
    getItemApi: getItemRouteContinuousRatesItemIdGet,
    putItemApi: putItemRouteContinuousRatesItemIdPut,
})

export const [BandedRateProvider, useBandedRate] = createItemProvider<BandedRatePost, BandedRateGet>({
    label: "BandedRate",
    getItemApi: getItemRouteBandedRatesItemIdGet,
    putItemApi: putItemRouteBandedRatesItemIdPut,
})

export const [ScheduleProvider, useSchedule] = createItemProvider<SchedulePost, ScheduleGet>({
    label: "Schedule",
    getItemApi: getItemRouteSchedulesItemIdGet,
    putItemApi: putItemRouteSchedulesItemIdPut,
})

export const [DailyScheduleProvider, useDailySchedule] = createItemProvider<DailySchedulePost, DailyScheduleGet>({
    label: "DailySchedule",
    getItemApi: getItemRouteDailySchedulesItemIdGet,
    putItemApi: putItemRouteDailySchedulesItemIdPut,
})

export const [DayScheduleProvider, useDaySchedule] = createItemProvider<DaySchedulePost, DayScheduleGet>({
    label: "DaySchedule",
    getItemApi: getItemRouteDaySchedulesItemIdGet,
    putItemApi: putItemRouteDaySchedulesItemIdPut,
})

export const [WeeklyScheduleProvider, useWeeklySchedule] = createItemProvider<WeeklySchedulePost, WeeklyScheduleGet>({
    label: "WeeklySchedule",
    getItemApi: getItemRouteWeeklySchedulesItemIdGet,
    putItemApi: putItemRouteWeeklySchedulesItemIdPut,
})

export const [MonthlyScheduleProvider, useMonthlySchedule] = createItemProvider<MonthlySchedulePost, MonthlyScheduleGet>({
    label: "MonthlySchedule",
    getItemApi: getItemRouteMonthlySchedulesItemIdGet,
    putItemApi: putItemRouteMonthlySchedulesItemIdPut,
})

export const [YearlyScheduleProvider, useYearlySchedule] = createItemProvider<YearlySchedulePost, YearlyScheduleGet>({
    label: "YearlySchedule",
    getItemApi: getItemRouteYearlySchedulesItemIdGet,
    putItemApi: putItemRouteYearlySchedulesItemIdPut,
})

export const [FromScheduleProvider, useFromSchedule] = createItemProvider<FromSchedulePost, FromScheduleGet>({
    label: "FromSchedule",
    getItemApi: getItemRouteFromSchedulesItemIdGet,
    putItemApi: putItemRouteFromSchedulesItemIdPut,
})

export const [UntilScheduleProvider, useUntilSchedule] = createItemProvider<UntilSchedulePost, UntilScheduleGet>({
    label: "UntilSchedule",
    getItemApi: getItemRouteUntilSchedulesItemIdGet,
    putItemApi: putItemRouteUntilSchedulesItemIdPut,
})

export const [RangeScheduleProvider, useRangeSchedule] = createItemProvider<RangeSchedulePost, RangeScheduleGet>({
    label: "RangeSchedule",
    getItemApi: getItemRouteRangeSchedulesItemIdGet,
    putItemApi: putItemRouteRangeSchedulesItemIdPut,
})

export const [AllScheduleProvider, useAllSchedule] = createItemProvider<AllSchedulePost, AllScheduleGet>({
    label: "AllSchedule",
    getItemApi: getItemRouteAllSchedulesItemIdGet,
    putItemApi: putItemRouteAllSchedulesItemIdPut,
})

export const [AnyScheduleProvider, useAnySchedule] = createItemProvider<AnySchedulePost, AnyScheduleGet>({
    label: "AnySchedule",
    getItemApi: getItemRouteAnySchedulesItemIdGet,
    putItemApi: putItemRouteAnySchedulesItemIdPut,
})

export const [DecimalProviderProvider, useDecimalProvider] = createItemProvider<DecimalProviderPost, DecimalProviderGet>({
    label: "DecimalProvider",
    getItemApi: getItemRouteDecimalProvidersItemIdGet,
    putItemApi: putItemRouteDecimalProvidersItemIdPut,
})

export const [ScheduledDecimalProviderProvider, useScheduledDecimalProvider] = createItemProvider<ScheduledDecimalProviderPost, ScheduledDecimalProviderGet>({
    label: "ScheduledDecimalProvider",
    getItemApi: getItemRouteScheduledDecimalProvidersItemIdGet,
    putItemApi: putItemRouteScheduledDecimalProvidersItemIdPut,
})

export const [MergeDecimalProviderProvider, useMergeDecimalProvider] = createItemProvider<MergeDecimalProviderPost, MergeDecimalProviderGet>({
    label: "MergeDecimalProvider",
    getItemApi: getItemRouteMergeDecimalProvidersItemIdGet,
    putItemApi: putItemRouteMergeDecimalProvidersItemIdPut,
})

export const [NextDecimalProviderProvider, useNextDecimalProvider] = createItemProvider<NextDecimalProviderPost, NextDecimalProviderGet>({
    label: "NextDecimalProvider",
    getItemApi: getItemRouteNextDecimalProvidersItemIdGet,
    putItemApi: putItemRouteNextDecimalProvidersItemIdPut,
})

export const [RateProviderProvider, useRateProvider] = createItemProvider<RateProviderPost, RateProviderGet>({
    label: "RateProvider",
    getItemApi: getItemRouteRateProvidersItemIdGet,
    putItemApi: putItemRouteRateProvidersItemIdPut,
})

export const [ScheduledRateProviderProvider, useScheduledRateProvider] = createItemProvider<ScheduledRateProviderPost, ScheduledRateProviderGet>({
    label: "ScheduledRateProvider",
    getItemApi: getItemRouteScheduledRateProvidersItemIdGet,
    putItemApi: putItemRouteScheduledRateProvidersItemIdPut,
})

export const [MergeRateProviderProvider, useMergeRateProvider] = createItemProvider<MergeRateProviderPost, MergeRateProviderGet>({
    label: "MergeRateProvider",
    getItemApi: getItemRouteMergeRateProvidersItemIdGet,
    putItemApi: putItemRouteMergeRateProvidersItemIdPut,
})

export const [NextRateProviderProvider, useNextRateProvider] = createItemProvider<NextRateProviderPost, NextRateProviderGet>({
    label: "NextRateProvider",
    getItemApi: getItemRouteNextRateProvidersItemIdGet,
    putItemApi: putItemRouteNextRateProvidersItemIdPut,
})
