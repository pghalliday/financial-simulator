import type {NavbarLinkTree} from "~/components/layout/NavbarLink";
import {COMPARE_SCENARIOS_NAVBAR_LINK_TREE} from "~/page_params/compare_scenarios";
import {SCENARIO_PARAMS} from "~/page_params/scenarios";
import {ENTITIES_NAVBAR_LINK_TREE} from "~/page_params/entities";
import {BANK_ACCOUNT_PARAMS} from "~/page_params/bank_accounts";
import {LEDGER_ACCOUNT_PARAMS} from "~/page_params/ledger_accounts";
import {RATES_NAVBAR_LINK_TREE} from "~/page_params/rates";
import {SCHEDULES_NAVBAR_LINK_TREE} from "~/page_params/schedules";
import {DECIMAL_PROVIDERS_NAVBAR_LINK_TREE} from "~/page_params/decimal_providers";
import {RATE_PROVIDERS_NAVBAR_LINK_TREE} from "~/page_params/rate_providers";
import {PLAYGROUND_NAVBAR_LINK_TREE} from "~/page_params/playground";

export const GET_ITEMS_ERROR_TITLE = "Get Items Error"
export const POST_ITEM_ERROR_TITLE = "Post Item Error"
export const DELETE_ITEM_ERROR_TITLE = "Delete Item Error"
export const GET_ITEM_ERROR_TITLE = "Get Item Error"
export const PUT_ITEM_ERROR_TITLE = "Put Item Error"

export const NAVBAR_LINK_TREES: NavbarLinkTree[] = [
    COMPARE_SCENARIOS_NAVBAR_LINK_TREE,
    SCENARIO_PARAMS,
    ENTITIES_NAVBAR_LINK_TREE,
    BANK_ACCOUNT_PARAMS,
    LEDGER_ACCOUNT_PARAMS,
    RATES_NAVBAR_LINK_TREE,
    SCHEDULES_NAVBAR_LINK_TREE,
    DECIMAL_PROVIDERS_NAVBAR_LINK_TREE,
    RATE_PROVIDERS_NAVBAR_LINK_TREE,
    PLAYGROUND_NAVBAR_LINK_TREE,
]
