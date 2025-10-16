import {useCallback, useEffect, useState} from "react";
import type {Route} from "./+types/compare_scenarios";
import {useHeaderData} from "~/components/providers/HeaderDataProvider";
import {COMPARE_SCENARIOS_HREF, COMPARE_SCENARIOS_PAGE_DESCRIPTION, PAGE_TITLE} from "~/strings";
import {Box, Button, Group, LoadingOverlay, NumberInput, Stack} from "@mantine/core";
import {getItemsScenariosGet, type ScenarioGet} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {StickyItemMultiSelect} from "~/components/controls/StickyItemMultiSelect";
import {callApi} from "~/lib/api_wrapper";
import {createEventSource} from "eventsource-client";

export default function CompareScenarios({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [scenarios, setScenarios] = useState<ScenarioGet[]>()
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
    const [dummyDaysStart, setDummyDaysStart] = useState<string | number>(0)
    const [dummyDaysEnd, setDummyDaysEnd] = useState<string | number>(10)

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

    const getDummyDays = useCallback(async () => {
        const es = createEventSource({
            url: `http://localhost:5174/dummy-days/?start=${dummyDaysStart}&end=${dummyDaysEnd}`,
            onDisconnect: (() => {
                es.close()
            })
        })
        for await (const {data, event, id} of es) {
            switch (event) {
                case "end": {
                    console.info("Complete")
                    es.close()
                    break
                }
                case "error": {
                    es.close()
                    console.error(`Error: ${data}`)
                    break
                }
                case "day": {
                    console.info(`Data: ${id}: ${data}`)
                    break
                }
                default: {
                    console.warn(`Unknown event: ${event}: ${id}: ${data}`)
                }
            }
        }
    }, [dummyDaysStart, dummyDaysEnd])

    return <Box pos="relative">
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <Stack>
            <StickyItemMultiSelect
                localStorageKey="compare-scenarios--selected-scenarios"
                label="Scenarios"
                placeholder="Select scenarios to compare"
                items={scenarios}
                onChange={setSelectedScenarios}
            />
            <Group align="">
                <NumberInput
                    label="Start day"
                    value={dummyDaysStart}
                    onChange={setDummyDaysStart}
                    min={0}
                    allowDecimal={false}
                    clampBehavior="strict"
                />
                <NumberInput
                    label="End day"
                    value={dummyDaysEnd}
                    onChange={setDummyDaysEnd}
                    min={0}
                    allowDecimal={false}
                    clampBehavior="strict"
                    inputContainer={(children) => (
                        <Group align="flex-start">
                            {children}
                            <Button onClick={getDummyDays}>Get dummy days!</Button>
                        </Group>
                    )}
                />
            </Group>
        </Stack>
    </Box>
}
