import type {LedgerAccountGet, LedgerAccountParentGet} from "../../client";
import {PageParams} from "./PageParams";
import type {ItemPageParams} from "~/hooks/useItemPageParams";

export function getLedgerAccountPageParams(item: LedgerAccountParentGet): ItemPageParams {
    const itemPageParams: ItemPageParams = {
        id: item.id,
        name: item.account_name,
    }
    if (item.parent !== null) {
        itemPageParams.parent = getLedgerAccountPageParams(item.parent)
    }
    return itemPageParams
}

export const LEDGER_ACCOUNT_PARAMS = new PageParams<LedgerAccountGet>(
    "Ledger accounts",
    "/ledger-account",
    "ledger account",
    "Ledger Account",
    "account_name",
    getLedgerAccountPageParams,
)