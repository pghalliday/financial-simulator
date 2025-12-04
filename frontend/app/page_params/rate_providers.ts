import {PageParams} from "./PageParams";
import type {MergeRateProviderGet, NextRateProviderGet, ScheduledRateProviderGet} from "../../client";
import type {NavbarLinkTree} from "~/components/layout/NavbarLink";

export const RATE_PROVIDERS_HREF = '/rate-provider';
export const RATE_PROVIDERS_PAGE_DESCRIPTION = 'Rate providers';

export const SCHEDULED_RATE_PROVIDER_PARAMS = new PageParams<ScheduledRateProviderGet>(
    "Scheduled rate providers",
    RATE_PROVIDERS_HREF + "/scheduled",
    "scheduled rate provider",
    "Scheduled Rate Provider",
    "name",
    (item: ScheduledRateProviderGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const MERGE_RATE_PROVIDER_PARAMS = new PageParams<MergeRateProviderGet>(
    "Merge rate providers",
    RATE_PROVIDERS_HREF + "/merge",
    "merge rate provider",
    "Merge Rate Provider",
    "name",
    (item: MergeRateProviderGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const NEXT_RATE_PROVIDER_PARAMS = new PageParams<NextRateProviderGet>(
    "Next rate providers",
    RATE_PROVIDERS_HREF + "/Next",
    "next rate provider",
    "Next Rate Provider",
    "name",
    (item: NextRateProviderGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const RATE_PROVIDERS_NAVBAR_LINK_TREE: NavbarLinkTree = {
    navbarLinkHref: RATE_PROVIDERS_HREF,
    navbarLinkLabel: RATE_PROVIDERS_PAGE_DESCRIPTION,
    navbarLinkChildren: [
        SCHEDULED_RATE_PROVIDER_PARAMS,
        MERGE_RATE_PROVIDER_PARAMS,
        NEXT_RATE_PROVIDER_PARAMS,
    ]
}
