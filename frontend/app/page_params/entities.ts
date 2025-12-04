import {PageParams} from "./PageParams";
import type {CorporationEntityGet, IndividualEntityGet} from "../../client";
import type {NavbarLinkTree} from "~/components/layout/NavbarLink";

export const ENTITIES_HREF = '/entity';
export const ENTITIES_PAGE_DESCRIPTION = 'Entities';

export const CORPORATION_ENTITY_PARAMS = new PageParams<CorporationEntityGet>(
    "Corporation entities",
    ENTITIES_HREF + "/corporations",
    "corporation entity",
    "Corporation Entity",
    "name",
    (item: CorporationEntityGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const INDIVIDUAL_ENTITY_PARAMS = new PageParams<IndividualEntityGet>(
    "Individual entities",
    ENTITIES_HREF + "/individuals",
    "individual entity",
    "Individual Entity",
    "name",
    (item: IndividualEntityGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const ENTITIES_NAVBAR_LINK_TREE: NavbarLinkTree = {
    navbarLinkHref: ENTITIES_HREF,
    navbarLinkLabel: ENTITIES_PAGE_DESCRIPTION,
    navbarLinkChildren: [
        INDIVIDUAL_ENTITY_PARAMS,
        CORPORATION_ENTITY_PARAMS,
    ]
}
