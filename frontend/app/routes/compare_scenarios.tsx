import {useEffect, useState} from "react";
import type {Route} from "./+types/compare_scenarios";
import {useHeaderData} from "~/components/providers/HeaderDataProvider";
import {COMPARE_SCENARIOS_HREF, COMPARE_SCENARIOS_PAGE_DESCRIPTION, PAGE_TITLE} from "~/strings";
import {Box, LoadingOverlay} from "@mantine/core";
import {getItemsScenariosGet, type ScenarioGet} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {StickyItemMultiSelect} from "~/components/controls/StickyItemMultiSelect";
import {callApi} from "~/lib/api_wrapper";

export default function CompareScenarios({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [scenarios, setScenarios] = useState<ScenarioGet[]>()
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])

    const description = COMPARE_SCENARIOS_PAGE_DESCRIPTION;
    const title = PAGE_TITLE(description)

    useEffect(() => {
        setHeaderData({
            title: title,
            breadcrumbs: [
                {
                    title: description,
                    href: COMPARE_SCENARIOS_HREF,
                },
            ],
        });
        callApi({
            api: () => getItemsScenariosGet(),
            errorTitle: "Get scenarios error",
            onSuccess: setScenarios,
            startLoading,
            stopLoading,
        });
    }, []);

    useEffect(() => {
        console.log(selectedScenarios)
    }, [selectedScenarios]);

    return <Box pos="relative">
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <StickyItemMultiSelect
            localStorageKey="compare-scenarios--selected-scenarios"
            label="Scenarios"
            placeholder="Select scenarios to compare"
            items={scenarios}
            onChange={setSelectedScenarios}
        />
    </Box>
}
