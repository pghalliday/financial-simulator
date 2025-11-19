import {Page} from "~/pages/common/Page";
import {useValue} from "~/providers/item_providers";
import {ValuePostFormProvider} from "~/forms/value/ValuePostFormContext";
import ValuePageForms from "~/pages/ValuePage/ValuePageForms";

export default function ValuePage() {
    const [value, _putValue, pageParams] = useValue({})

    return <Page
        pageParams={pageParams}
    >
        <ValuePostFormProvider
            key={value?.id}
            initialValues={value}
        >
            <ValuePageForms/>
        </ValuePostFormProvider>
    </Page>
}
