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
import {getItemEntitiesItemIdGet} from "~/client";
import {ApiError} from "~/ApiError";

export async function clientLoader({params}: Route.LoaderArgs) {
    const response = await getItemEntitiesItemIdGet({
        path: {item_id: params.entityId},
    });
    if (response.data !== undefined) {
        return response.data
    }
    throw new ApiError(response.response.status, response.response.statusText, response.error)
}

export default function Entity({loaderData: entity}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();

    const description = ENTITY_NAME(entity.name)
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
                    title: entity.name,
                    href: ENTITY_HREF(entity.id),
                },
            ],
        });
    }, []);

    return <>
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        {entity.name}
    </>
}
