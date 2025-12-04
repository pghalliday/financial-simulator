import type {BankAccountGet} from "../../client";
import {PageParams} from "./PageParams";

export const BANK_ACCOUNT_PARAMS = new PageParams<BankAccountGet>(
    "Bank accounts",
    "/bank-account",
    "bank account",
    "Bank Account",
    "name",
    (item: BankAccountGet) => ({
        id: item.id,
        name: item.name,
    }),
)
