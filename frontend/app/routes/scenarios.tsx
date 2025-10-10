import {useEffect} from "react";
import type {Route} from "./+types/scenarios";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {COMPARE_SCENARIOS_HREF, COMPARE_SCENARIOS_NAME, SCENARIOS_HREF, SCENARIOS_NAME, TITLE} from "~/strings";

export async function clientLoader({params}: Route.LoaderArgs) {
    //                           ^? { scenarioId: string }
}

export default function Scenarios({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();

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
        {description}
    </>
}
