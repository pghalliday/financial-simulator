import {Anchor, AppShell, Breadcrumbs, Burger, Group, Stack, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {NavbarLink} from "~/components/layout/NavbarLink";
import {useHeaderData} from "~/components/providers/HeaderDataProvider";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    ENTITIES_HREF,
    ENTITIES_PAGE_DESCRIPTION,
    SCENARIOS_HREF,
    SCENARIOS_PAGE_DESCRIPTION
} from "~/strings";
import {type ReactElement, useEffect, useState} from 'react';

export function NavLayout({children}: { children: React.ReactNode }) {
    const [opened, {toggle, close}] = useDisclosure();
    const [headerData] = useHeaderData();
    const [title, setTitle] = useState<string>("Financial Simulator")
    const [breadcrumbs, setBreadcrumbs] = useState<ReactElement[]>([])

    useEffect(() => {
        if (headerData !== undefined) {
            setTitle(headerData.title)
            setBreadcrumbs(headerData.breadcrumbs.map(breadcrumb => (
                <Anchor href={breadcrumb.href}>
                    {breadcrumb.title}
                </Anchor>
            )))
        }
    }, [headerData]);

    return (
        <AppShell
            padding="md"
            header={{height: 80}}
            navbar={{
                width: 250,
                breakpoint: 'xs',
                collapsed: {mobile: !opened},
            }}
        >
            <AppShell.Header>
                <Group
                    h="100%"
                    styles={{
                        root: {
                            paddingLeft: 11,
                        },
                    }}
                >
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="xs"
                        size="sm"
                    />
                    <Stack gap={2}>
                        <Title order={4}>
                            {title}
                        </Title>
                        <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
                            {breadcrumbs}
                        </Breadcrumbs>
                    </Stack>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar>
                <NavbarLink
                    href={COMPARE_SCENARIOS_HREF}
                    label={COMPARE_SCENARIOS_PAGE_DESCRIPTION}
                    onClick={close}
                />
                <NavbarLink
                    href={SCENARIOS_HREF}
                    label={SCENARIOS_PAGE_DESCRIPTION}
                    onClick={close}
                />
                <NavbarLink
                    href={ENTITIES_HREF}
                    label={ENTITIES_PAGE_DESCRIPTION}
                    onClick={close}
                />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}