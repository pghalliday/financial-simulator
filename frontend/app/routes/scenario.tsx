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

export async function clientLoader({params}: Route.LoaderArgs) {
    //                           ^? { scenarioId: string }
}

export default function Scenario({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();

    const description = SCENARIO_NAME(params.scenarioId)
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
                    title: params.scenarioId,
                    href: SCENARIO_HREF(params.scenarioId),
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
