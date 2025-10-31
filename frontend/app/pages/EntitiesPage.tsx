import {ENTITIES_BREADCRUMBS, ENTITIES_PAGE_DESCRIPTION, ENTITIES_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {EntityList} from "~/lists/EntityList";
import {EntityPostFormProvider} from "~/forms/entity/EntityPostFormContext";
import {useEntities} from "~/providers/items_providers";

export default function EntitiesPage() {
    const [entities, setEntities] = useEntities()
    return <Page
        pageParams={{
            title: ENTITIES_PAGE_TITLE,
            description: ENTITIES_PAGE_DESCRIPTION,
            breadcrumbs: ENTITIES_BREADCRUMBS,
        }}
    >
        <EntityPostFormProvider>
            <EntityList entities={entities} onChange={setEntities}/>
        </EntityPostFormProvider>
    </Page>
}
