import {Page} from "~/pages/Page";
import {CorporationEntityList} from "~/lists/entities/CorporationEntityList";
import {CORPORATION_ENTITY_PARAMS} from "~/page_params/entities";
import {CorporationEntityPostFormProvider} from "~/forms/entity/contexts";
import {useEntities} from "~/providers/items_providers";

export function CorporationEntitiesPage() {
    const [entities, setEntities] = useEntities()
    return <Page
        pageParams={{
            title: CORPORATION_ENTITY_PARAMS.collectionPageTitle,
            description: CORPORATION_ENTITY_PARAMS.collectionPageDescription,
            breadcrumbs: CORPORATION_ENTITY_PARAMS.collectionBreadcrumbs,
        }}
    >
        <CorporationEntityPostFormProvider>
            <CorporationEntityList entities={entities} onChange={setEntities}/>
        </CorporationEntityPostFormProvider>
    </Page>
}
