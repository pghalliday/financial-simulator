import {useEffect} from "react";
import {useLoaderData} from "react-router";
import type {Route} from "./+types/scenarios";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    SCENARIO_HREF,
    SCENARIOS_HREF,
    SCENARIOS_NAME,
    TITLE
} from "~/strings";
import {getScenariosScenariosGet} from "~/client"
import {ItemList} from "~/components/ItemList";
import {ApiError} from "~/ApiError";

export async function clientLoader({params}: Route.LoaderArgs) {
    const response = await getScenariosScenariosGet()
    if (response.data !== undefined) {
        return response.data
    }
    throw new ApiError(response.response.status, response.response.statusText, response.error)
}

export default function Scenarios({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();
    const scenarios = useLoaderData<typeof clientLoader>()

    const description = SCENARIOS_NAME
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
                    title: description,
                    href: SCENARIOS_HREF,
                },
            ],
        });
    }, []);

    return <>
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <ItemList items={scenarios} href={SCENARIO_HREF}/>
    </>
}
