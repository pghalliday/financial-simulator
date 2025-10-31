import {Anchor, AppShell, Breadcrumbs, Burger, Group, Stack, Title} from "@mantine/core";
import {useHeaderData} from "~/providers/HeaderDataProvider";
import {useCallback, useState} from "react";
import {Link} from "react-router";

interface Props {
    burgerOpened: boolean
    toggleBurger: () => void
}

export function Header({burgerOpened, toggleBurger}: Props) {
    const {headerData} = useHeaderData();

    const createBreadcrumbs = useCallback(() => {
        return headerData.breadcrumbs.map(breadcrumb => (
            <Anchor component={Link} to={breadcrumb.href}>
                {breadcrumb.title}
            </Anchor>
        ))
    }, [headerData])

    const [breadcrumbs, setBreadcrumbs] = useState(createBreadcrumbs())
    const [previousHeaderData, setPreviousHeaderData] = useState(headerData)
    if (previousHeaderData !== headerData) {
        setPreviousHeaderData(headerData)
        setBreadcrumbs(createBreadcrumbs())
    }

    return <AppShell.Header>
        <Group
            h="100%"
            styles={{
                root: {
                    paddingLeft: 11,
                },
            }}
        >
            <Burger
                opened={burgerOpened}
                onClick={toggleBurger}
                hiddenFrom="xs"
                size="sm"
            />
            <Stack gap={2}>
                <Title order={4}>
                    {headerData.title}
                </Title>
                <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
                    {breadcrumbs}
                </Breadcrumbs>
            </Stack>
        </Group>
    </AppShell.Header>
}
