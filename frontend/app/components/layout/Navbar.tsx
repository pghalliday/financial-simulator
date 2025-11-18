import {AppShell} from "@mantine/core";
import {NavbarLink} from "~/components/layout/NavbarLink";
import {
    BANK_ACCOUNTS_HREF,
    BANK_ACCOUNTS_PAGE_DESCRIPTION,
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    ENTITIES_HREF,
    ENTITIES_PAGE_DESCRIPTION,
    LEDGER_ACCOUNTS_HREF,
    LEDGER_ACCOUNTS_PAGE_DESCRIPTION,
    RATES_HREF,
    RATES_PAGE_DESCRIPTION,
    SCENARIOS_HREF,
    SCENARIOS_PAGE_DESCRIPTION
} from "~/strings";

interface Props {
    close: () => void
}

export function Navbar({close}: Props) {
    return <AppShell.Navbar>
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
        <NavbarLink
            href={BANK_ACCOUNTS_HREF}
            label={BANK_ACCOUNTS_PAGE_DESCRIPTION}
            onClick={close}
        />
        <NavbarLink
            href={LEDGER_ACCOUNTS_HREF}
            label={LEDGER_ACCOUNTS_PAGE_DESCRIPTION}
            onClick={close}
        />
        <NavbarLink
            href={RATES_HREF}
            label={RATES_PAGE_DESCRIPTION}
            onClick={close}
        />
        <NavbarLink
            href="/playground"
            label="Playground"
            onClick={close}
        />
    </AppShell.Navbar>
}