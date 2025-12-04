import {createContext, type PropsWithChildren, type ReactElement, useContext} from "react";
import {useGetItems} from "~/hooks/useGetItems";
import type {GetItemsApi} from "~/lib/types";
import {
    getItemsRouteAllSchedulesGet,
    getItemsRouteAnySchedulesGet,
    getItemsRouteBandedRatesGet,
    getItemsRouteBankAccountsGet,
    getItemsRouteContinuousRatesGet,
    getItemsRouteCorporationEntitiesGet,
    getItemsRouteDailySchedulesGet,
    getItemsRouteDaySchedulesGet,
    getItemsRouteDecimalProvidersGet,
    getItemsRouteEntitiesGet,
    getItemsRouteFromSchedulesGet,
    getItemsRouteIndividualEntitiesGet,
    getItemsRouteLedgerAccountsGet,
    getItemsRouteMergeDecimalProvidersGet,
    getItemsRouteMergeRateProvidersGet,
    getItemsRouteMonthlySchedulesGet,
    getItemsRouteNextDecimalProvidersGet,
    getItemsRouteNextRateProvidersGet,
    getItemsRoutePeriodicRatesGet,
    getItemsRouteRangeSchedulesGet,
    getItemsRouteRateProvidersGet,
    getItemsRouteRatesGet,
    getItemsRouteScenariosGet,
    getItemsRouteScheduledDecimalProvidersGet,
    getItemsRouteScheduledRateProvidersGet,
    getItemsRouteSchedulesGet,
    getItemsRouteUntilSchedulesGet,
    getItemsRouteWeeklySchedulesGet,
    getItemsRouteYearlySchedulesGet,
} from "../../client";

interface ProviderProps {
    onBegin?: () => void
    onEnd?: () => void
}

type ContextData<Get> = [Get[], (items: Get[]) => void]

interface Props<Get> {
    label: string
    getItemsApi: GetItemsApi<Get>
}

type ProviderType = (
    props: PropsWithChildren<ProviderProps>
) => ReactElement

function createItemsProvider<Get>(
    {
        label,
        getItemsApi,
    }: Props<Get>
): [ProviderType, () => ContextData<Get>] {
    const Context = createContext<ContextData<Get> | undefined>(undefined);

    function ItemsProvider({onBegin, onEnd, children}: PropsWithChildren<ProviderProps>) {
        const {items, setItems} = useGetItems({
            getItemsApi,
            onBegin,
            onEnd,
        })
        return <Context.Provider value={[items, setItems]}>
            {children}
        </Context.Provider>
    }

    function useItems(): ContextData<Get> {
        const contextData = useContext(Context)
        if (contextData === undefined) {
            throw new Error(`Attempted to call use${label}() outside of <${label}Provider>`)
        }
        return contextData
    }

    return [ItemsProvider, useItems]
}

export const [ScenariosProvider, useScenarios] = createItemsProvider({
    label: "Scenarios",
    getItemsApi: getItemsRouteScenariosGet,
})

export const [EntitiesProvider, useEntities] = createItemsProvider({
    label: "Entities",
    getItemsApi: getItemsRouteEntitiesGet,
})

export const [IndividualEntitiesProvider, useIndividualEntities] = createItemsProvider({
    label: "IndividualEntities",
    getItemsApi: getItemsRouteIndividualEntitiesGet,
})

export const [CorporationEntitiesProvider, useCorporationEntities] = createItemsProvider({
    label: "CorporationEntities",
    getItemsApi: getItemsRouteCorporationEntitiesGet,
})

export const [BankAccountsProvider, useBankAccounts] = createItemsProvider({
    label: "BankAccounts",
    getItemsApi: getItemsRouteBankAccountsGet,
})

export const [LedgerAccountsProvider, useLedgerAccounts] = createItemsProvider({
    label: "LedgerAccounts",
    getItemsApi: getItemsRouteLedgerAccountsGet,
})

export const [RatesProvider, useRates] = createItemsProvider({
    label: "Rates",
    getItemsApi: getItemsRouteRatesGet,
})

export const [PeriodicRatesProvider, usePeriodicRates] = createItemsProvider({
    label: "PeriodicRates",
    getItemsApi: getItemsRoutePeriodicRatesGet,
})

export const [ContinuousRatesProvider, useContinuousRates] = createItemsProvider({
    label: "ContinuousRates",
    getItemsApi: getItemsRouteContinuousRatesGet,
})

export const [BandedRatesProvider, useBandedRates] = createItemsProvider({
    label: "BandedRates",
    getItemsApi: getItemsRouteBandedRatesGet,
})

export const [SchedulesProvider, useSchedules] = createItemsProvider({
    label: "Schedules",
    getItemsApi: getItemsRouteSchedulesGet,
})

export const [DailySchedulesProvider, useDailySchedules] = createItemsProvider({
    label: "DailySchedules",
    getItemsApi: getItemsRouteDailySchedulesGet,
})

export const [DaySchedulesProvider, useDaySchedules] = createItemsProvider({
    label: "DaySchedules",
    getItemsApi: getItemsRouteDaySchedulesGet,
})

export const [WeeklySchedulesProvider, useWeeklySchedules] = createItemsProvider({
    label: "WeeklySchedules",
    getItemsApi: getItemsRouteWeeklySchedulesGet,
})

export const [MonthlySchedulesProvider, useMonthlySchedules] = createItemsProvider({
    label: "MonthlySchedules",
    getItemsApi: getItemsRouteMonthlySchedulesGet,
})

export const [YearlySchedulesProvider, useYearlySchedules] = createItemsProvider({
    label: "YearlySchedules",
    getItemsApi: getItemsRouteYearlySchedulesGet,
})

export const [FromSchedulesProvider, useFromSchedules] = createItemsProvider({
    label: "FromSchedules",
    getItemsApi: getItemsRouteFromSchedulesGet,
})

export const [UntilSchedulesProvider, useUntilSchedules] = createItemsProvider({
    label: "UntilSchedules",
    getItemsApi: getItemsRouteUntilSchedulesGet,
})

export const [RangeSchedulesProvider, useRangeSchedules] = createItemsProvider({
    label: "RangeSchedules",
    getItemsApi: getItemsRouteRangeSchedulesGet,
})

export const [AllSchedulesProvider, useAllSchedules] = createItemsProvider({
    label: "AllSchedules",
    getItemsApi: getItemsRouteAllSchedulesGet,
})

export const [AnySchedulesProvider, useAnySchedules] = createItemsProvider({
    label: "AnySchedules",
    getItemsApi: getItemsRouteAnySchedulesGet,
})

export const [DecimalProvidersProvider, useDecimalProviders] = createItemsProvider({
    label: "DecimalProviders",
    getItemsApi: getItemsRouteDecimalProvidersGet,
})

export const [ScheduledDecimalProvidersProvider, useScheduledDecimalProviders] = createItemsProvider({
    label: "ScheduledDecimalProviders",
    getItemsApi: getItemsRouteScheduledDecimalProvidersGet,
})

export const [MergeDecimalProvidersProvider, useMergeDecimalProviders] = createItemsProvider({
    label: "MergeDecimalProviders",
    getItemsApi: getItemsRouteMergeDecimalProvidersGet,
})

export const [NextDecimalProvidersProvider, useNextDecimalProviders] = createItemsProvider({
    label: "NextDecimalProviders",
    getItemsApi: getItemsRouteNextDecimalProvidersGet,
})

export const [RateProvidersProvider, useRateProviders] = createItemsProvider({
    label: "RateProviders",
    getItemsApi: getItemsRouteRateProvidersGet,
})

export const [ScheduledRateProvidersProvider, useScheduledRateProviders] = createItemsProvider({
    label: "ScheduledRateProviders",
    getItemsApi: getItemsRouteScheduledRateProvidersGet,
})

export const [MergeRateProvidersProvider, useMergeRateProviders] = createItemsProvider({
    label: "MergeRateProviders",
    getItemsApi: getItemsRouteMergeRateProvidersGet,
})

export const [NextRateProvidersProvider, useNextRateProviders] = createItemsProvider({
    label: "NextRateProviders",
    getItemsApi: getItemsRouteNextRateProvidersGet,
})
