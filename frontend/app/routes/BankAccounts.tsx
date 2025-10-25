import {BANK_ACCOUNTS_BREADCRUMBS, BANK_ACCOUNTS_PAGE_DESCRIPTION, BANK_ACCOUNTS_PAGE_TITLE} from "~/strings";
import {getItemsRouteBankAccountsGet,} from "~/client";
import {Page} from "~/components/pages/Page";
import {useDisclosure} from "@mantine/hooks";
import {useGetItems} from "~/lib/hooks/useGetItems";
import {BankAccountList} from "~/components/lists/BankAccountList";

export default function Scenarios() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const items = useGetItems(
        getItemsRouteBankAccountsGet,
        startLoading,
        stopLoading,
    )

    return <Page
        title={BANK_ACCOUNTS_PAGE_TITLE}
        description={BANK_ACCOUNTS_PAGE_DESCRIPTION}
        breadcrumbs={BANK_ACCOUNTS_BREADCRUMBS}
        loading={loading}
    >
        <BankAccountList items={items}/>
    </Page>
}
