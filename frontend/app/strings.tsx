import {createSearchParams} from "react-router";
import {type ItemPageParams, PAGE_PARAMS_SEARCH_KEY} from "./lib/hooks/useItemPageParams";
import type {Breadcrumb, EntityGet, ProviderGet, RateGet, ScheduleGet, ValueGet} from "~/lib/types";
import type {
    BankAccountGet,
    EntityType,
    LedgerAccountGet,
    ProviderType,
    RateType,
    ScenarioGet,
    ScheduleType,
    ValueType
} from "../client";

function createItemSuffix(itemPageParams: ItemPageParams): string {
    const names: string[] = []
    let parent: ItemPageParams | undefined = itemPageParams
    while (parent !== undefined) {
        names.unshift(parent.name)
        parent = parent.parent
    }
    return names.join(" - ")
}

function createItemBreadcrumbs(itemHref: (itemPageParams: ItemPageParams) => string, itemPageParams: ItemPageParams): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = []
    let parent: ItemPageParams | undefined = itemPageParams
    while (parent !== undefined) {
        breadcrumbs.unshift({
            title: parent.name,
            href: itemHref(parent),
        })
        parent = parent.parent
    }
    return breadcrumbs
}

function createItemPageDescriptionFunction(prefix: string): (itemPageParams: ItemPageParams) => string {
    return (itemPageParams: ItemPageParams) => `${prefix} - ${createItemSuffix(itemPageParams)}`
}

function createItemPageTitleFunction(itemPageDescription: (itemPageParams: ItemPageParams) => string): (itemPageParams: ItemPageParams) => string {
    return (itemPageParams: ItemPageParams) => PAGE_TITLE(itemPageDescription(itemPageParams))
}

function createItemHrefFunction(rootHref: string): (itemPageParams: ItemPageParams) => string {
    return (itemPageParams: ItemPageParams) => `${rootHref}/${itemPageParams.id}?${createSearchParams({[PAGE_PARAMS_SEARCH_KEY]: JSON.stringify(itemPageParams)})}`
}

function createItemBreadcrumbsFunction(prefix: Breadcrumb[], itemHref: (itemPageParams: ItemPageParams) => string): (itemPageParams: ItemPageParams) => Breadcrumb[] {
    return (itemPageParams: ItemPageParams) => prefix.concat(createItemBreadcrumbs(itemHref, itemPageParams))
}

export const APP_NAME = 'Financial Simulator';
export const PAGE_TITLE = (suffix: string) => `${APP_NAME} - ${suffix}`;
export const ADD_ITEM_MODAL_TITLE = (label: string) => `Add ${label}`
export const CONFIRM_DELETE_ITEM_MODAL_TITLE = (label: string) => `Confirm delete ${label}`
export const CONFIRM_DELETE_ITEM_MODAL_PROMPT = (label: string) => (name: string) => (
    <p>
        Are you sure you want to delete {label}:
        <ul>
            <li><b>{name}</b></li>
        </ul>
    </p>
)

export const COMPARE_SCENARIOS_PAGE_DESCRIPTION = 'Compare scenarios';
export const COMPARE_SCENARIOS_HREF = '/';

export const SCENARIOS_PAGE_DESCRIPTION = 'Scenarios';
export const SCENARIOS_PAGE_TITLE = PAGE_TITLE(SCENARIOS_PAGE_DESCRIPTION);
export const SCENARIOS_HREF = '/scenarios';
export const SCENARIOS_LABEL = 'scenario';
export const SCENARIOS_BREADCRUMBS = [
    {
        title: SCENARIOS_PAGE_DESCRIPTION,
        href: SCENARIOS_HREF,
    },
];
export const SCENARIOS_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(SCENARIOS_LABEL)
export const SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(SCENARIOS_LABEL)
export const SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: ScenarioGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(SCENARIOS_LABEL)(item.name)

export const SCENARIO_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Scenario")
export const SCENARIO_PAGE_TITLE = createItemPageTitleFunction(SCENARIO_PAGE_DESCRIPTION);
export const SCENARIO_HREF = createItemHrefFunction(SCENARIOS_HREF)
export const SCENARIO_BREADCRUMBS = createItemBreadcrumbsFunction(SCENARIOS_BREADCRUMBS, SCENARIO_HREF)

export const ENTITIES_PAGE_DESCRIPTION = 'Entities';
export const ENTITIES_PAGE_TITLE = PAGE_TITLE(ENTITIES_PAGE_DESCRIPTION);
export const ENTITIES_HREF = '/entities';
export const ENTITIES_LABEL = 'entity';
export const ENTITIES_BREADCRUMBS = [
    {
        title: ENTITIES_PAGE_DESCRIPTION,
        href: ENTITIES_HREF,
    },
];
export const ENTITIES_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(ENTITIES_LABEL)
export const ENTITIES_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(ENTITIES_LABEL)
export const ENTITIES_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: EntityGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(ENTITIES_LABEL)(item.name)

export const ENTITY_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Entity")
export const ENTITY_PAGE_TITLE = createItemPageTitleFunction(ENTITY_PAGE_DESCRIPTION);
export const ENTITY_HREF = createItemHrefFunction(ENTITIES_HREF)
export const ENTITY_BREADCRUMBS = createItemBreadcrumbsFunction(ENTITIES_BREADCRUMBS, ENTITY_HREF)
export const ENTITY_TYPES: Record<EntityType, string> = {
    individual_entity: "Individual",
    corporation_entity: "Corporation",
}

export const BANK_ACCOUNTS_PAGE_DESCRIPTION = 'Bank accounts';
export const BANK_ACCOUNTS_PAGE_TITLE = PAGE_TITLE(BANK_ACCOUNTS_PAGE_DESCRIPTION);
export const BANK_ACCOUNTS_HREF = '/bank-accounts'
export const BANK_ACCOUNTS_LABEL = 'bank account'
export const BANK_ACCOUNTS_BREADCRUMBS = [
    {
        title: BANK_ACCOUNTS_PAGE_DESCRIPTION,
        href: BANK_ACCOUNTS_HREF,
    },
];
export const BANK_ACCOUNTS_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(BANK_ACCOUNTS_LABEL)
export const BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(BANK_ACCOUNTS_LABEL)
export const BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: BankAccountGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(BANK_ACCOUNTS_LABEL)(item.name)

export const BANK_ACCOUNT_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Bank Account")
export const BANK_ACCOUNT_PAGE_TITLE = createItemPageTitleFunction(BANK_ACCOUNT_PAGE_DESCRIPTION)
export const BANK_ACCOUNT_HREF = createItemHrefFunction(BANK_ACCOUNTS_HREF)
export const BANK_ACCOUNT_BREADCRUMBS = createItemBreadcrumbsFunction(BANK_ACCOUNTS_BREADCRUMBS, BANK_ACCOUNT_HREF)

export const LEDGER_ACCOUNTS_PAGE_DESCRIPTION = 'Ledger accounts';
export const LEDGER_ACCOUNTS_PAGE_TITLE = PAGE_TITLE(LEDGER_ACCOUNTS_PAGE_DESCRIPTION)
export const LEDGER_ACCOUNTS_HREF = '/ledger-accounts'
export const LEDGER_ACCOUNTS_LABEL = 'ledger account'
export const LEDGER_ACCOUNTS_BREADCRUMBS = [
    {
        title: LEDGER_ACCOUNTS_PAGE_DESCRIPTION,
        href: LEDGER_ACCOUNTS_HREF,
    },
]
export const LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(LEDGER_ACCOUNTS_LABEL)
export const LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(LEDGER_ACCOUNTS_LABEL)
export const LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: LedgerAccountGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(LEDGER_ACCOUNTS_LABEL)(item.account_name)

export const LEDGER_ACCOUNT_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Ledger Account")
export const LEDGER_ACCOUNT_PAGE_TITLE = createItemPageTitleFunction(LEDGER_ACCOUNT_PAGE_DESCRIPTION)
export const LEDGER_ACCOUNT_HREF = createItemHrefFunction(LEDGER_ACCOUNTS_HREF)
export const LEDGER_ACCOUNT_BREADCRUMBS = createItemBreadcrumbsFunction(LEDGER_ACCOUNTS_BREADCRUMBS, LEDGER_ACCOUNT_HREF)

export const RATES_PAGE_DESCRIPTION = 'Rates';
export const RATES_PAGE_TITLE = PAGE_TITLE(RATES_PAGE_DESCRIPTION);
export const RATES_HREF = '/rates';
export const RATES_LABEL = 'rate';
export const RATES_BREADCRUMBS = [
    {
        title: RATES_PAGE_DESCRIPTION,
        href: RATES_HREF,
    },
];
export const RATES_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(RATES_LABEL)
export const RATES_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(RATES_LABEL)
export const RATES_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: RateGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(RATES_LABEL)(item.name)

export const RATE_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Rate")
export const RATE_PAGE_TITLE = createItemPageTitleFunction(RATE_PAGE_DESCRIPTION);
export const RATE_HREF = createItemHrefFunction(RATES_HREF)
export const RATE_BREADCRUMBS = createItemBreadcrumbsFunction(RATES_BREADCRUMBS, RATE_HREF)
export const RATE_TYPES: Record<RateType, string> = {
    continuous_rate: "Continuous",
    banded_rate: "Banded",
    periodic_rate: "Periodic",
}

export const VALUES_PAGE_DESCRIPTION = 'Values';
export const VALUES_PAGE_TITLE = PAGE_TITLE(VALUES_PAGE_DESCRIPTION);
export const VALUES_HREF = '/values';
export const VALUES_LABEL = 'value';
export const VALUES_BREADCRUMBS = [
    {
        title: VALUES_PAGE_DESCRIPTION,
        href: VALUES_HREF,
    },
];
export const VALUES_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(VALUES_LABEL)
export const VALUES_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(VALUES_LABEL)
export const VALUES_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: ValueGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(VALUES_LABEL)(item.name)

export const VALUE_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Value")
export const VALUE_PAGE_TITLE = createItemPageTitleFunction(VALUE_PAGE_DESCRIPTION);
export const VALUE_HREF = createItemHrefFunction(VALUES_HREF)
export const VALUE_BREADCRUMBS = createItemBreadcrumbsFunction(VALUES_BREADCRUMBS, VALUE_HREF)
export const VALUE_TYPES: Record<ValueType, string> = {
    decimal_value: "Decimal",
    rate_value: "Rate",
}

export const SCHEDULES_PAGE_DESCRIPTION = 'Schedules';
export const SCHEDULES_PAGE_TITLE = PAGE_TITLE(SCHEDULES_PAGE_DESCRIPTION);
export const SCHEDULES_HREF = '/schedules';
export const SCHEDULES_LABEL = 'schedule';
export const SCHEDULES_BREADCRUMBS = [
    {
        title: SCHEDULES_PAGE_DESCRIPTION,
        href: SCHEDULES_HREF,
    },
];
export const SCHEDULES_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(SCHEDULES_LABEL)
export const SCHEDULES_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(SCHEDULES_LABEL)
export const SCHEDULES_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: ScheduleGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(SCHEDULES_LABEL)(item.name)

export const SCHEDULE_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Schedule")
export const SCHEDULE_PAGE_TITLE = createItemPageTitleFunction(SCHEDULE_PAGE_DESCRIPTION);
export const SCHEDULE_HREF = createItemHrefFunction(SCHEDULES_HREF)
export const SCHEDULE_BREADCRUMBS = createItemBreadcrumbsFunction(SCHEDULES_BREADCRUMBS, SCHEDULE_HREF)
export const SCHEDULE_TYPES: Record<ScheduleType, string> = {
    daily_schedule: "Daily",
    day_schedule: "Day",
    all_schedule: "All",
    any_schedule: "Any",
    from_schedule: "From",
    monthly_schedule: "Monthly",
    range_schedule: "Range",
    until_schedule: "Until",
    weekly_schedule: "Weekly",
    yearly_schedule: "Yearly",
}

export const PROVIDERS_PAGE_DESCRIPTION = 'Providers';
export const PROVIDERS_PAGE_TITLE = PAGE_TITLE(PROVIDERS_PAGE_DESCRIPTION);
export const PROVIDERS_HREF = '/providers';
export const PROVIDERS_LABEL = 'provider';
export const PROVIDERS_BREADCRUMBS = [
    {
        title: PROVIDERS_PAGE_DESCRIPTION,
        href: PROVIDERS_HREF,
    },
];
export const PROVIDERS_ADD_ITEM_MODAL_TITLE = ADD_ITEM_MODAL_TITLE(PROVIDERS_LABEL)
export const PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_TITLE = CONFIRM_DELETE_ITEM_MODAL_TITLE(PROVIDERS_LABEL)
export const PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_PROMPT = (item: ProviderGet) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(PROVIDERS_LABEL)(item.name)

export const PROVIDER_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Provider")
export const PROVIDER_PAGE_TITLE = createItemPageTitleFunction(PROVIDER_PAGE_DESCRIPTION);
export const PROVIDER_HREF = createItemHrefFunction(PROVIDERS_HREF)
export const PROVIDER_BREADCRUMBS = createItemBreadcrumbsFunction(PROVIDERS_BREADCRUMBS, PROVIDER_HREF)
export const PROVIDER_TYPES: Record<ProviderType, string> = {
    always_provider: "Always",
    scheduled_provider: "Scheduled",
    merge_provider: "Merge",
    next_provider: "Next",
}

export const GET_ITEMS_ERROR_TITLE = "Get Items Error"
export const POST_ITEM_ERROR_TITLE = "Post Item Error"
export const DELETE_ITEM_ERROR_TITLE = "Delete Item Error"
export const GET_ITEM_ERROR_TITLE = "Get Item Error"
export const PUT_ITEM_ERROR_TITLE = "Put Item Error"