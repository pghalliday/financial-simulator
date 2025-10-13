import {Anchor, AppShell, Breadcrumbs, Burger, Group, Stack, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {NavbarLink} from "~/components/NavbarLink";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    ENTITIES_HREF,
    ENTITIES_NAME,
    SCENARIOS_HREF,
    SCENARIOS_NAME
} from "~/strings";

export function NavLayout({children}: { children: React.ReactNode }) {
    const [opened, {toggle, close}] = useDisclosure();
    const [headerData] = useHeaderData();

    const breadcrumbs = headerData.breadcrumbs.map(breadcrumb => (
        <Anchor href={breadcrumb.href}>
            {breadcrumb.title}
        </Anchor>
    ))

    return (
        <AppShell
            padding="md"
            header={{height: 60}}
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
                        <Title size="lg">
                            {headerData.title}
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
                    label={COMPARE_SCENARIOS_NAME}
                    onClick={close}
                />
                <NavbarLink
                    href={SCENARIOS_HREF}
                    label={SCENARIOS_NAME}
                    onClick={close}
                />
                <NavbarLink
                    href={ENTITIES_HREF}
                    label={ENTITIES_NAME}
                    onClick={close}
                />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}