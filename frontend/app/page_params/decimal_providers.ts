import {PageParams} from "./PageParams";
import type {MergeDecimalProviderGet, NextDecimalProviderGet, ScheduledDecimalProviderGet} from "../../client";
import type {NavbarLinkTree} from "~/components/layout/NavbarLink";

export const DECIMAL_PROVIDERS_HREF = '/decimal-provider';
export const DECIMAL_PROVIDERS_PAGE_DESCRIPTION = 'Decimal providers';

export const SCHEDULED_DECIMAL_PROVIDER_PARAMS = new PageParams<ScheduledDecimalProviderGet>(
    "Scheduled decimal providers",
    DECIMAL_PROVIDERS_HREF + "/scheduled",
    "scheduled decimal provider",
    "Scheduled Decimal Provider",
    "name",
    (item: ScheduledDecimalProviderGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const MERGE_DECIMAL_PROVIDER_PARAMS = new PageParams<MergeDecimalProviderGet>(
    "Merge decimal providers",
    DECIMAL_PROVIDERS_HREF + "/merge",
    "merge decimal provider",
    "Merge Decimal Provider",
    "name",
    (item: MergeDecimalProviderGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const NEXT_DECIMAL_PROVIDER_PARAMS = new PageParams<NextDecimalProviderGet>(
    "Next decimal providers",
    DECIMAL_PROVIDERS_HREF + "/next",
    "next decimal provider",
    "Next Decimal Provider",
    "name",
    (item: NextDecimalProviderGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const DECIMAL_PROVIDERS_NAVBAR_LINK_TREE: NavbarLinkTree = {
    navbarLinkHref: DECIMAL_PROVIDERS_HREF,
    navbarLinkLabel: DECIMAL_PROVIDERS_PAGE_DESCRIPTION,
    navbarLinkChildren: [
        SCHEDULED_DECIMAL_PROVIDER_PARAMS,
        MERGE_DECIMAL_PROVIDER_PARAMS,
        NEXT_DECIMAL_PROVIDER_PARAMS,
    ]
}
