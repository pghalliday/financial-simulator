import {AppShell, ScrollArea} from "@mantine/core";
import {NavbarLink, type NavbarLinkTree} from "~/components/layout/NavbarLink";

interface Props {
    close: () => void
    navbarLinkTrees: NavbarLinkTree[]
}

export function Navbar({close, navbarLinkTrees}: Props) {
    return <AppShell.Navbar>
        <ScrollArea>
            {navbarLinkTrees.map(tree => (<NavbarLink key={tree.navbarLinkHref} tree={tree} onClick={close}/>))}
        </ScrollArea>
    </AppShell.Navbar>
}