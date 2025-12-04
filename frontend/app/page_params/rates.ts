import {PageParams} from "./PageParams";
import type {BandedRateGet, ContinuousRateGet, PeriodicRateGet} from "../../client";
import type {NavbarLinkTree} from "~/components/layout/NavbarLink";

export const RATES_HREF = '/rate';
export const RATES_PAGE_DESCRIPTION = 'Rates';

export const PERIODIC_RATE_PARAMS = new PageParams<PeriodicRateGet>(
    "Periodic rates",
    RATES_HREF + "/periodic",
    "periodic rate",
    "Periodic Rate",
    "name",
    (item: PeriodicRateGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const CONTINUOUS_RATE_PARAMS = new PageParams<ContinuousRateGet>(
    "Continuous rates",
    RATES_HREF + "/continuous",
    "continuous rate",
    "Continuous Rate",
    "name",
    (item: ContinuousRateGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const BANDED_RATE_PARAMS = new PageParams<BandedRateGet>(
    "Banded rates",
    RATES_HREF + "/banded",
    "banded rate",
    "Banded Rate",
    "name",
    (item: BandedRateGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const RATES_NAVBAR_LINK_TREE: NavbarLinkTree = {
    navbarLinkHref: RATES_HREF,
    navbarLinkLabel: RATES_PAGE_DESCRIPTION,
    navbarLinkChildren: [
        CONTINUOUS_RATE_PARAMS,
        PERIODIC_RATE_PARAMS,
        BANDED_RATE_PARAMS,
    ]
}
