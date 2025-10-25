import type {Route} from "./+types/Entity";
import {ENTITY_BREADCRUMBS, ENTITY_PAGE_DESCRIPTION, ENTITY_PAGE_TITLE} from "~/strings";
import {ItemPageForm} from "~/components/pages/ItemPage/ItemPageForm";
import {useState} from "react";
import {
    type CorporationEntityGet,
    type CorporationEntityPost,
    deleteRelatedItemRouteEntitiesItemIdScenariosRelatedItemIdDelete,
    getItemRouteEntitiesItemIdGet,
    getItemsRouteScenariosGet,
    getRelatedItemsRouteEntitiesItemIdScenariosGet,
    type IndividualEntityGet,
    type IndividualEntityPost,
    postRelatedItemRouteEntitiesItemIdScenariosPost,
    putItemRouteEntitiesItemIdPut
} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {useItemPage} from "~/lib/hooks/useItemPage";
import {ItemPageRelations} from "~/components/pages/ItemPage/ItemPageRelations";
import {RelationSelector} from "~/components/controls/RelationSelector";
import {Page} from "~/components/pages/Page";
import {validateEntityPost} from "~/lib/validators";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {EntityGet} from "~/lib/types";
import {EntityPostForm} from "~/components/forms/EntityPostForm";

export function getEntityPageParams(item: EntityGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function Entity({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [revertDisabled, setRevertDisabled] = useState(true)
    const [saveDisabled, setSaveDisabled] = useState(true)

    const {
        getField,
        setField,
        revert,
        submit,
        pageTitle,
        pageDescription,
        pageBreadcrumbs,
    } = useItemPage<IndividualEntityPost | CorporationEntityPost, IndividualEntityGet | CorporationEntityGet>(
        itemId,
        ENTITY_PAGE_TITLE,
        ENTITY_PAGE_DESCRIPTION,
        ENTITY_BREADCRUMBS,
        getEntityPageParams,
        getItemRouteEntitiesItemIdGet,
        putItemRouteEntitiesItemIdPut,
        startLoading,
        stopLoading,
        setRevertDisabled,
        setSaveDisabled,
        validateEntityPost,
    )

    return <Page
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={pageBreadcrumbs}
        loading={loading}
    >
        <ItemPageForm
            onRevert={revert}
            revertDisabled={revertDisabled}
            onSave={submit}
            saveDisabled={saveDisabled}
        >
            <EntityPostForm getField={getField} setField={setField}/>
        </ItemPageForm>
        <ItemPageRelations>
            <RelationSelector
                itemId={itemId}
                label="scenarios"
                getRelatedOptions={getItemsRouteScenariosGet}
                getRelatedItems={getRelatedItemsRouteEntitiesItemIdScenariosGet}
                postRelatedItem={postRelatedItemRouteEntitiesItemIdScenariosPost}
                deleteRelatedItem={deleteRelatedItemRouteEntitiesItemIdScenariosRelatedItemIdDelete}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />
        </ItemPageRelations>
    </Page>
}
