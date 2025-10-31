import {Page} from "~/pages/common/Page";
import {EntityPostFormProvider} from "~/forms/entity/EntityPostFormContext";
import {useEntity} from "~/providers/item_providers";
import EntityPageForms from "~/pages/EntityPage/EntityPageForms";

export default function EntityPage() {
    const [entity, _putEntity, pageParams] = useEntity({})

    return <Page
        pageParams={pageParams}
    >
        <EntityPostFormProvider
            key={entity?.id}
            initialValues={entity}
        >
            <EntityPageForms/>
        </EntityPostFormProvider>
    </Page>
}
