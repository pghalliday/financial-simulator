import {useEffect} from "react";
import type {Route} from "./+types/entity";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {
  COMPARE_SCENARIOS_HREF,
  COMPARE_SCENARIOS_NAME,
  ENTITIES_HREF,
  ENTITIES_NAME,
  ENTITY_HREF,
  ENTITY_NAME,
  TITLE
} from "~/strings";

export async function clientLoader({params}: Route.LoaderArgs) {
    //                           ^? { entityId: string }
}

export default function Entity({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();

    const description = ENTITY_NAME(params.entityId)
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
                    title: ENTITIES_NAME,
                    href: ENTITIES_HREF,
                },
                {
                    title: params.entityId,
                    href: ENTITY_HREF(params.entityId),
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
