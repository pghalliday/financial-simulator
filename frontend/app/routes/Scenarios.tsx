import {SCENARIOS_BREADCRUMBS, SCENARIOS_PAGE_DESCRIPTION, SCENARIOS_PAGE_TITLE} from "~/strings";
import {getItemsRouteScenariosGet,} from "~/client";
import {Page} from "~/components/pages/Page";
import {useDisclosure} from "@mantine/hooks";
import {useGetItems} from "~/lib/hooks/useGetItems";
import {ScenarioList} from "~/components/lists/ScenarioList";

export default function Scenarios() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const {items, setItems} = useGetItems(
        getItemsRouteScenariosGet,
        startLoading,
        stopLoading,
    )

    return <Page
        title={SCENARIOS_PAGE_TITLE}
        description={SCENARIOS_PAGE_DESCRIPTION}
        breadcrumbs={SCENARIOS_BREADCRUMBS}
        loading={loading}
    >
        <ScenarioList items={items} setItems={setItems}/>
    </Page>
}
