import {useEffect} from "react";
import type {Route} from "./+types/scenario";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    SCENARIO_HREF,
    SCENARIO_NAME,
    SCENARIOS_HREF,
    SCENARIOS_NAME,
    TITLE
} from "~/strings";
import {getItemScenariosItemIdGet} from "~/client";
import {useLoaderData} from "react-router";
import {ApiError} from "~/ApiError";

export async function clientLoader({params}: Route.LoaderArgs) {
    const response = await getItemScenariosItemIdGet({
        path: {item_id: params.scenarioId},
    });
    if (response.data !== undefined) {
        return response.data
    }
    throw new ApiError(response.response.status, response.response.statusText, response.error)
}

export default function Scenario({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();
    const scenario = useLoaderData<typeof clientLoader>()

    const description = SCENARIO_NAME(scenario.name)
    const title = TITLE(description)

    useEffect(() => {
        setHeaderData({
            title: title,
            breadcrumbs: [
                {
                    title: COMPARE_SCENARIOS_NAME,
                    href: COMPARE_SCENARIOS_HREF,
                },
                {
                    title: SCENARIOS_NAME,
                    href: SCENARIOS_HREF,
                },
                {
                    title: scenario.name,
                    href: SCENARIO_HREF(scenario.id),
                },
            ],
        });
    }, []);

    return <>
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        {scenario.name}
    </>
}
