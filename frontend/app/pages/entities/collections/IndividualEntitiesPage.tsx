import {Page} from "~/pages/Page";
import {IndividualEntityList} from "~/lists/entities/IndividualEntityList";
import {useIndividualEntities} from "~/providers/typed_items_providers";
import {INDIVIDUAL_ENTITY_PARAMS} from "~/page_params/entities";
import {IndividualEntityPostFormProvider} from "~/forms/entity/contexts";

export function IndividualEntitiesPage() {
    const [entities, setEntities] = useIndividualEntities()
    return <Page
        pageParams={{
            title: INDIVIDUAL_ENTITY_PARAMS.collectionPageTitle,
            description: INDIVIDUAL_ENTITY_PARAMS.collectionPageDescription,
            breadcrumbs: INDIVIDUAL_ENTITY_PARAMS.collectionBreadcrumbs,
        }}
    >
        <IndividualEntityPostFormProvider>
            <IndividualEntityList items={entities} onChange={setEntities}/>
        </IndividualEntityPostFormProvider>
    </Page>
}
