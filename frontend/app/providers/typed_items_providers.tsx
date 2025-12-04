import {createContext, type PropsWithChildren, type ReactElement, useContext} from "react";
import type {GetTypedItemsApi} from "~/lib/types";
import {
    type AllScheduleGet,
    type AnyScheduleGet,
    type BandedRateGet,
    type ContinuousRateGet,
    type CorporationEntityGet,
    type DailyScheduleGet,
    type DayScheduleGet,
    type FromScheduleGet,
    getItemsRouteDecimalProvidersGet,
    getItemsRouteEntitiesGet,
    getItemsRouteRateProvidersGet,
    getItemsRouteRatesGet,
    getItemsRouteSchedulesGet,
    type IndividualEntityGet,
    type MergeDecimalProviderGet,
    type MergeRateProviderGet,
    type MonthlyScheduleGet,
    type NextDecimalProviderGet,
    type NextRateProviderGet,
    type PeriodicRateGet,
    type RangeScheduleGet,
    type ScheduledDecimalProviderGet,
    type ScheduledRateProviderGet,
    type UntilScheduleGet,
    type WeeklyScheduleGet,
    type YearlyScheduleGet,
} from "../../client";
import {useGetTypedItems} from "~/hooks/useGetTypedItems";

interface ProviderProps {
    onBegin?: () => void
    onEnd?: () => void
}

type ContextData<Get> = [Get[], (items: Get[]) => void]

interface Props<Get extends { type: any }, Type = Get["type"]> {
    label: string
    getTypedItemsApi: GetTypedItemsApi<Get, Type>
    type: Type
}

type ProviderType = (
    props: PropsWithChildren<ProviderProps>
) => ReactElement

function createTypedItemsProvider<Get extends { type: any }, Type = Get["type"]>(
    {
        label,
        getTypedItemsApi,
        type,
    }: Props<Get, Type>
): [ProviderType, () => ContextData<Get>] {
    const Context = createContext<ContextData<Get> | undefined>(undefined);

    function TypedItemsProvider({onBegin, onEnd, children}: PropsWithChildren<ProviderProps>) {
        const {items, setItems} = useGetTypedItems({
            getTypedItemsApi,
            type,
            onBegin,
            onEnd,
        })
        return <Context.Provider value={[items, setItems]}>
            {children}
        </Context.Provider>
    }

    function useTypedItems(): ContextData<Get> {
        const contextData = useContext(Context)
        if (contextData === undefined) {
            throw new Error(`Attempted to call use${label}() outside of <${label}Provider>`)
        }
        return contextData
    }

    return [TypedItemsProvider, useTypedItems]
}

export const [IndividualEntitiesProvider, useIndividualEntities] = createTypedItemsProvider<IndividualEntityGet>({
    label: "IndividualEntities",
    getTypedItemsApi: getItemsRouteEntitiesGet as GetTypedItemsApi<IndividualEntityGet>,
    type: "individual_entity",
})

export const [CorporationEntitiesProvider, useCorporationEntities] = createTypedItemsProvider<CorporationEntityGet>({
    label: "CorporationEntities",
    getTypedItemsApi: getItemsRouteEntitiesGet as GetTypedItemsApi<CorporationEntityGet>,
    type: "corporation_entity",
})

export const [PeriodicRatesProvider, usePeriodicRates] = createTypedItemsProvider<PeriodicRateGet>({
    label: "PeriodicRates",
    getTypedItemsApi: getItemsRouteRatesGet as GetTypedItemsApi<PeriodicRateGet>,
    type: "periodic_rate",
})

export const [ContinuousRatesProvider, useContinuousRates] = createTypedItemsProvider<ContinuousRateGet>({
    label: "ContinuousRates",
    getTypedItemsApi: getItemsRouteRatesGet as GetTypedItemsApi<ContinuousRateGet>,
    type: "continuous_rate",
})

export const [BandedRatesProvider, useBandedRates] = createTypedItemsProvider<BandedRateGet>({
    label: "BandedRates",
    getTypedItemsApi: getItemsRouteRatesGet as GetTypedItemsApi<BandedRateGet>,
    type: "banded_rate",
})

export const [DailySchedulesProvider, useDailySchedules] = createTypedItemsProvider<DailyScheduleGet>({
    label: "DailySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<DailyScheduleGet>,
    type: "daily_schedule",
})

export const [DaySchedulesProvider, useDaySchedules] = createTypedItemsProvider<DayScheduleGet>({
    label: "DaySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<DayScheduleGet>,
    type: "day_schedule",
})

export const [WeeklySchedulesProvider, useWeeklySchedules] = createTypedItemsProvider<WeeklyScheduleGet>({
    label: "WeeklySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<WeeklyScheduleGet>,
    type: "weekly_schedule",
})

export const [MonthlySchedulesProvider, useMonthlySchedules] = createTypedItemsProvider<MonthlyScheduleGet>({
    label: "MonthlySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<MonthlyScheduleGet>,
    type: "monthly_schedule",
})

export const [YearlySchedulesProvider, useYearlySchedules] = createTypedItemsProvider<YearlyScheduleGet>({
    label: "YearlySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<YearlyScheduleGet>,
    type: "yearly_schedule",
})

export const [FromSchedulesProvider, useFromSchedules] = createTypedItemsProvider<FromScheduleGet>({
    label: "FromSchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<FromScheduleGet>,
    type: "from_schedule",
})

export const [UntilSchedulesProvider, useUntilSchedules] = createTypedItemsProvider<UntilScheduleGet>({
    label: "UntilSchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<UntilScheduleGet>,
    type: "until_schedule",
})

export const [RangeSchedulesProvider, useRangeSchedules] = createTypedItemsProvider<RangeScheduleGet>({
    label: "WeeklySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<RangeScheduleGet>,
    type: "range_schedule",
})

export const [AllSchedulesProvider, useAllSchedules] = createTypedItemsProvider<AllScheduleGet>({
    label: "AnySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<AllScheduleGet>,
    type: "all_schedule",
})

export const [AnySchedulesProvider, useAnySchedules] = createTypedItemsProvider<AnyScheduleGet>({
    label: "AnySchedules",
    getTypedItemsApi: getItemsRouteSchedulesGet as GetTypedItemsApi<AnyScheduleGet>,
    type: "any_schedule",
})

export const [ScheduledDecimalProvidersProvider, useScheduledDecimalProviders] = createTypedItemsProvider<ScheduledDecimalProviderGet>({
    label: "ScheduledDecimalProviders",
    getTypedItemsApi: getItemsRouteDecimalProvidersGet as GetTypedItemsApi<ScheduledDecimalProviderGet>,
    type: "scheduled_decimal_provider",
})

export const [MergeDecimalProvidersProvider, useMergeDecimalProviders] = createTypedItemsProvider<MergeDecimalProviderGet>({
    label: "MergeDecimalProviders",
    getTypedItemsApi: getItemsRouteDecimalProvidersGet as GetTypedItemsApi<MergeDecimalProviderGet>,
    type: "merge_decimal_provider",
})

export const [NextDecimalProvidersProvider, useNextDecimalProviders] = createTypedItemsProvider<NextDecimalProviderGet>({
    label: "NextDecimalProviders",
    getTypedItemsApi: getItemsRouteDecimalProvidersGet as GetTypedItemsApi<NextDecimalProviderGet>,
    type: "next_decimal_provider",
})

export const [ScheduledRateProvidersProvider, useScheduledRateProviders] = createTypedItemsProvider<ScheduledRateProviderGet>({
    label: "ScheduledProviders",
    getTypedItemsApi: getItemsRouteRateProvidersGet as GetTypedItemsApi<ScheduledRateProviderGet>,
    type: "scheduled_rate_provider",
})
export const [MergeRateProvidersProvider, useMergeRateProviders] = createTypedItemsProvider<MergeRateProviderGet>({
    label: "MergeProviders",
    getTypedItemsApi: getItemsRouteRateProvidersGet as GetTypedItemsApi<MergeRateProviderGet>,
    type: "merge_rate_provider",
})
export const [NextRateProvidersProvider, useNextRateProviders] = createTypedItemsProvider<NextRateProviderGet>({
    label: "NextProviders",
    getTypedItemsApi: getItemsRouteRateProvidersGet as GetTypedItemsApi<NextRateProviderGet>,
    type: "next_rate_provider",
})
