import {useCallback, useEffect, useState} from "react";
import {useHeaderData} from "~/components/providers/HeaderDataProvider";
import {COMPARE_SCENARIOS_HREF, COMPARE_SCENARIOS_PAGE_DESCRIPTION, PAGE_TITLE} from "~/strings";
import {Box, Button, Group, LoadingOverlay, NumberInput, Progress, Stack} from "@mantine/core";
import {
    type DummyDayAccount,
    type DummyDayDay,
    getDummyDaysGet,
    getItemsScenariosGet,
    type ScenarioGet
} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {StickyItemMultiSelect} from "~/components/controls/StickyItemMultiSelect";
import {callApi} from "~/lib/api_wrapper";
import throttle from "lodash.throttle"
import Plot from "react-plotly.js";
import {useStickyState} from "~/lib/hooks";

function get_balance(account: DummyDayAccount, sub_account_path: string[]): number {
    if (sub_account_path.length === 0) {
        const total = account.total_balance
        if (typeof total === "string") {
            return parseFloat(total)
        }
        return total
    }
    const next = sub_account_path.shift()
    for (const sub_account of account.sub_accounts) {
        if (sub_account.name === next) {
            return get_balance(sub_account, sub_account_path)
        }
    }
    return 0.0
}

export default function CompareScenarios() {
    const [_, setHeaderData] = useHeaderData();
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingDummyDays, {open: startLoadingDummyDays, close: stopLoadingDummyDays}] = useDisclosure()
    const [dummyDaysProgress, setDummyDaysProgress] = useState(0)
    const [scenarios, setScenarios] = useState<ScenarioGet[]>()
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
    const [dummyDaysStart, setDummyDaysStart] = useStickyState<string | number>(0, "compare-scenarios--start")
    const [dummyDaysEnd, setDummyDaysEnd] = useStickyState<string | number>(10, "compare-scenarios--end")
    const [days, setDays] = useStickyState<DummyDayDay[]>([], "compare-scenarios--days")

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

    const getDummyDays = useCallback(() => {
        if (typeof dummyDaysStart === "number" && typeof dummyDaysEnd === "number") {
            const updateProgress = throttle((progress) => setDummyDaysProgress(progress), 200, {
                leading: true,
                trailing: true,
            })
            setDummyDaysProgress(0)
            startLoadingDummyDays()
            const newDays: DummyDayDay[] = [];
            getDummyDaysGet({
                query: {
                    start: dummyDaysStart,
                    end: dummyDaysEnd,
                },
            }).then(async ({stream}) => {
                for await (const event of stream) {
                    switch (event.type) {
                        case "end": {
                            stopLoadingDummyDays()
                            setDays(newDays)
                            break
                        }
                        case "error": {
                            console.error(`Error: ${event.error.status_code}: ${event.error.message}`)
                            stopLoadingDummyDays()
                            break
                        }
                        case "day": {
                            newDays.push(event.day)
                            const idx = event.idx
                            const progress = (idx - dummyDaysStart + 1) / (dummyDaysEnd - dummyDaysStart) * 100
                            updateProgress(progress)
                            break
                        }
                    }
                }
            })
        }
    }, [dummyDaysStart, dummyDaysEnd])

    const chart_dates: Date[] = []
    const chart_entities: Record<string, number[]> = {}
    for (const day of days) {
        chart_dates.push(new Date(day.date))
        for (const entity of day.entities) {
            const current_account_balances = chart_entities[entity.name] || []
            current_account_balances.push(-get_balance(entity.ledger, ["assets", "bank_accounts", "current"]))
            chart_entities[entity.name] = current_account_balances
        }
    }

    return <Box pos="relative">
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <LoadingOverlay
            visible={loadingDummyDays}
            zIndex={1000}
            overlayProps={{blur: 2}}
            loaderProps={{children: <Progress value={dummyDaysProgress} w={300}/>}}
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
            <Plot
                data={Object.keys(chart_entities).map(entity_name => ({
                    x: chart_dates,
                    y: chart_entities[entity_name],
                    type: "scatter",
                    name: entity_name,
                }))}
                layout={{width: 800, height: 600, title: {text: 'Current Account Balances'}}}
            />
        </Stack>
    </Box>
}
