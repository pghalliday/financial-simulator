import type {Route} from "./+types/Entity";
import {ENTITIES_HREF, ENTITIES_PAGE_DESCRIPTION, ENTITY_HREF, ENTITY_PAGE_DESCRIPTION, ENTITY_TYPES} from "~/strings";
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
import {ItemTextInput} from "~/components/controls/ItemTextInput";
import {useItemPage} from "~/lib/hooks/useItemPage";
import {ItemPageRelations} from "~/components/pages/ItemPage/ItemPageRelations";
import {RelationSelector} from "~/components/controls/RelationSelector";
import {Title} from "@mantine/core";
import {useTypeIndicator} from "~/lib/hooks/useTypeIndicator";
import {Page} from "~/components/pages/Page";
import {validateEntityPost} from "~/lib/validators";

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
        getItemRouteEntitiesItemIdGet,
        putItemRouteEntitiesItemIdPut,
        itemId,
        ENTITIES_PAGE_DESCRIPTION,
        ENTITIES_HREF,
        ENTITY_PAGE_DESCRIPTION,
        ENTITY_HREF,
        startLoading,
        stopLoading,
        setRevertDisabled,
        setSaveDisabled,
        validateEntityPost,
    )

    const typeIndicator = useTypeIndicator(ENTITY_TYPES, getField)

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
            <Title order={4}>{typeIndicator}</Title>
            <ItemTextInput<IndividualEntityPost | CorporationEntityPost, "name">
                field="name"
                getField={getField}
                setField={setField}
                label="Name"
                description={"Entity name"}
                placeholder="Name"
                required
            />
            <ItemTextInput<IndividualEntityPost | CorporationEntityPost, "description">
                field="description"
                getField={getField}
                setField={setField}
                label="Description"
                description={"Entity description"}
                placeholder="Description"
            />
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
