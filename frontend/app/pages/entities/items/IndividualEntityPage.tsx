import {Page} from "~/pages/Page";
import {useIndividualEntity} from "~/providers/item_providers";
import {IndividualEntityPostFormProvider} from "~/forms/entity/contexts";
import {IndividualEntityPageForms} from "~/pages/entities/forms/IndividualEntityPageForms";

export function IndividualEntityPage() {
    const [entity, _putEntity, pageParams] = useIndividualEntity({})

    return <Page
        pageParams={pageParams}
    >
        <IndividualEntityPostFormProvider
            key={entity?.id}
            initialValues={entity}
        >
            <IndividualEntityPageForms/>
        </IndividualEntityPostFormProvider>
    </Page>
}
