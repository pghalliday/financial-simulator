import {ENTITIES_BREADCRUMBS, ENTITIES_PAGE_DESCRIPTION, ENTITIES_PAGE_TITLE} from "~/strings";
import {getItemsRouteEntitiesGet,} from "~/client";
import {Page} from "~/components/pages/Page";
import {useDisclosure} from "@mantine/hooks";
import {useGetItems} from "~/lib/hooks/useGetItems";
import {EntityList} from "~/components/lists/EntityList";

export default function Entities() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const {items, setItems} = useGetItems(
        getItemsRouteEntitiesGet,
        startLoading,
        stopLoading,
    )

    return <Page
        title={ENTITIES_PAGE_TITLE}
        description={ENTITIES_PAGE_DESCRIPTION}
        breadcrumbs={ENTITIES_BREADCRUMBS}
        loading={loading}
    >
        <EntityList items={items} setItems={setItems}/>
    </Page>
}
