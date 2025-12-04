import {AppShell} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {type PropsWithChildren} from "react";
import {Header} from "~/components/layout/Header";
import {Navbar} from "~/components/layout/Navbar";
import type {NavbarLinkTree} from "~/components/layout/NavbarLink";

interface Props {
    navbarLinkTrees: NavbarLinkTree[]
}

export function Shell({navbarLinkTrees, children}: PropsWithChildren<Props>) {
    const [opened, {toggle, close}] = useDisclosure();
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
            <Header burgerOpened={opened} toggleBurger={toggle}/>
            <Navbar close={close} navbarLinkTrees={navbarLinkTrees}/>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}