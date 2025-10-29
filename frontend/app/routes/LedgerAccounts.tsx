import {LEDGER_ACCOUNTS_BREADCRUMBS, LEDGER_ACCOUNTS_PAGE_DESCRIPTION, LEDGER_ACCOUNTS_PAGE_TITLE} from "~/strings";
import {getItemsRouteLedgerAccountsGet,} from "~/client";
import {Page} from "~/components/pages/Page";
import {useDisclosure} from "@mantine/hooks";
import {useGetItems} from "~/lib/hooks/useGetItems";
import {LedgerAccountList} from "~/components/lists/LedgerAccountList";

export default function LedgerAccounts() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const {items, setItems} = useGetItems(
        getItemsRouteLedgerAccountsGet,
        startLoading,
        stopLoading,
        0,
        -1,
    )

    return <Page
        title={LEDGER_ACCOUNTS_PAGE_TITLE}
        description={LEDGER_ACCOUNTS_PAGE_DESCRIPTION}
        breadcrumbs={LEDGER_ACCOUNTS_BREADCRUMBS}
        loading={loading}
    >
        <LedgerAccountList items={items} setItems={setItems}/>
    </Page>
}
