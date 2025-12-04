import {Page} from "~/pages/Page";
import {CorporationEntityList} from "~/lists/entities/CorporationEntityList";
import {useCorporationEntities} from "~/providers/typed_items_providers";
import {CORPORATION_ENTITY_PARAMS} from "~/page_params/entities";
import {CorporationEntityPostFormProvider} from "~/forms/entity/contexts";

export function CorporationEntitiesPage() {
    const [entities, setEntities] = useCorporationEntities()
    return <Page
        pageParams={{
            title: CORPORATION_ENTITY_PARAMS.collectionPageTitle,
            description: CORPORATION_ENTITY_PARAMS.collectionPageDescription,
            breadcrumbs: CORPORATION_ENTITY_PARAMS.collectionBreadcrumbs,
        }}
    >
        <CorporationEntityPostFormProvider>
            <CorporationEntityList items={entities} onChange={setEntities}/>
        </CorporationEntityPostFormProvider>
    </Page>
}
