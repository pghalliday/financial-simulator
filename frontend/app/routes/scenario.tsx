import type {Route} from "./+types/scenario";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    PAGE_TITLE,
    SCENARIO_HREF,
    SCENARIO_PAGE_DESCRIPTION,
    SCENARIOS_HREF,
    SCENARIOS_PAGE_DESCRIPTION
} from "~/strings";
import {getItemScenariosItemIdGet} from "~/client";
import {ItemPage} from "~/components/ItemPage";

export default function Scenario({params}: Route.ComponentProps) {
    return <ItemPage
        itemId={params.scenarioId}
        getItem={itemId => getItemScenariosItemIdGet({
            path: {
                item_id: itemId,
            },
        })}
        getTitle={(itemId, item) => {
            return PAGE_TITLE(SCENARIO_PAGE_DESCRIPTION(item === undefined ? itemId : item.name))
        }}
        getDescription={(itemId, item) => {
            return SCENARIO_PAGE_DESCRIPTION(item === undefined ? itemId : item.name)
        }}
        getBreadcrumbs={(itemId, item) => {
            return [
                {
                    title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
                    href: COMPARE_SCENARIOS_HREF,
                },
                {
                    title: SCENARIOS_PAGE_DESCRIPTION,
                    href: SCENARIOS_HREF,
                },
                {
                    title: item === undefined ? itemId : item.name,
                    href: SCENARIO_HREF(itemId),
                },
            ]
        }}
    />
}
