import {createSearchParams} from "react-router";
import type {NamedItem} from "~/lib/types";

function createItemPageDescriptionFunction(prefix: string): (item: NamedItem) => string {
    return (item: NamedItem) => `${prefix} - ${item.name}`
}

function createItemHrefFunction(rootHref: string): (item: NamedItem) => string {
    return (item: NamedItem) => `${rootHref}/${item.id}?${createSearchParams({name: item.name})}`
}

export const APP_NAME = 'Financial Simulator';
export const PAGE_TITLE = (suffix: string) => `${APP_NAME} - ${suffix}`;
export const COMPARE_SCENARIOS_PAGE_DESCRIPTION = 'Compare scenarios';
export const COMPARE_SCENARIOS_HREF = '/';
export const SCENARIOS_PAGE_DESCRIPTION = 'Scenarios';
export const SCENARIOS_HREF = '/scenarios';
export const SCENARIOS_LABEL = 'scenario';
export const ENTITIES_PAGE_DESCRIPTION = 'Entities';
export const ENTITIES_HREF = '/entities';
export const ENTITIES_LABEL = 'entity';
export const BANK_ACCOUNTS_PAGE_DESCRIPTION = 'Bank accounts';
export const BANK_ACCOUNTS_HREF = '/bank-accounts'
export const BANK_ACCOUNTS_LABEL = 'bank account'
export const SCENARIO_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Scenario")
export const SCENARIO_HREF = createItemHrefFunction(SCENARIOS_HREF)
export const ENTITY_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Entity")
export const ENTITY_HREF = createItemHrefFunction(ENTITIES_HREF)
export const ENTITY_TYPES = {
    "individual_entity": "Individual",
    "corporation_entity": "Corporation",
}
export const BANK_ACCOUNT_PAGE_DESCRIPTION = createItemPageDescriptionFunction("Bank Account")
export const BANK_ACCOUNT_HREF = createItemHrefFunction(BANK_ACCOUNTS_HREF)

export const GET_ITEMS_ERROR_TITLE = "Get Items Error"
export const POST_ITEM_ERROR_TITLE = "Post Item Error"
export const DELETE_ITEM_ERROR_TITLE = "Delete Item Error"
export const GET_ITEM_ERROR_TITLE = "Get Item Error"
export const PUT_ITEM_ERROR_TITLE = "Put Item Error"
export const GET_RELATED_OPTIONS_ERROR_TITLE = "Get related options error";
export const GET_RELATED_ITEMS_ERROR_TITLE = "Get related items error";
export const POST_RELATED_ITEM_ERROR_TITLE = "Post related item error";
export const DELETE_RELATED_ITEM_ERROR_TITLE = "Delete related item error";