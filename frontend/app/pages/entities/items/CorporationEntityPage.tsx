import {Page} from "~/pages/Page";
import {useCorporationEntity} from "~/providers/item_providers";
import {CorporationEntityPostFormProvider} from "~/forms/entity/contexts";
import {CorporationEntityPageForms} from "~/pages/entities/forms/CorporationEntityPageForms";

export function CorporationEntityPage() {
    const [entity, _putEntity, pageParams] = useCorporationEntity({})

    return <Page
        pageParams={pageParams}
    >
        <CorporationEntityPostFormProvider
            key={entity?.id}
            initialValues={entity}
        >
            <CorporationEntityPageForms/>
        </CorporationEntityPostFormProvider>
    </Page>
}
