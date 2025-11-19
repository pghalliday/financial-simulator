import {VALUES_BREADCRUMBS, VALUES_PAGE_DESCRIPTION, VALUES_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {useValues} from "~/providers/items_providers";
import {ValuePostFormProvider} from "~/forms/value/ValuePostFormContext";
import {ValueList} from "~/lists/ValueList";

export default function ValuesPage() {
    const [values, setValues] = useValues()
    return <Page
        pageParams={{
            title: VALUES_PAGE_TITLE,
            description: VALUES_PAGE_DESCRIPTION,
            breadcrumbs: VALUES_BREADCRUMBS,
        }}
    >
        <ValuePostFormProvider>
            <ValueList values={values} onChange={setValues}/>
        </ValuePostFormProvider>
    </Page>
}
