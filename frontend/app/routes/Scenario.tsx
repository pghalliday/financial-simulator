import type {Route} from "./+types/Scenario";
import {SCENARIO_HREF, SCENARIO_PAGE_DESCRIPTION, SCENARIOS_HREF, SCENARIOS_PAGE_DESCRIPTION} from "~/strings";
import {ItemPage} from "~/components/pages/ItemPage/ItemPage";
import {ItemPageForm} from "~/components/pages/ItemPage/ItemPageForm";
import {useState} from "react";
import {
    deleteRelatedItemRouteScenariosItemIdEntitiesRelatedItemIdDelete,
    getItemRouteScenariosItemIdGet,
    getItemsRouteEntitiesGet,
    getRelatedItemsRouteScenariosItemIdEntitiesGet,
    postRelatedItemRouteScenariosItemIdEntitiesPost,
    putItemRouteScenariosItemIdPut,
    type ScenarioGet,
    type ScenarioPost
} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {ItemTextInput} from "~/components/controls/ItemTextInput";
import {useItemPage} from "~/lib/hooks/useItemPage";
import {ItemPageRelations} from "~/components/pages/ItemPage/ItemPageRelations";
import {RelationSelector} from "~/components/controls/RelationSelector";

export default function BankAccount({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [revertDisabled, setRevertDisabled] = useState(true)
    const [saveDisabled, setSaveDisabled] = useState(true)

    const {
        getItemPostField,
        setItemPostField,
        revert,
        save,
        pageTitle,
        pageDescription,
        pageBreadcrumbs,
    } = useItemPage<ScenarioPost, ScenarioGet>(
        getItemRouteScenariosItemIdGet,
        putItemRouteScenariosItemIdPut,
        itemId,
        SCENARIOS_PAGE_DESCRIPTION,
        SCENARIOS_HREF,
        SCENARIO_PAGE_DESCRIPTION,
        SCENARIO_HREF,
        startLoading,
        stopLoading,
        setRevertDisabled,
        setSaveDisabled,
        (itemPost) => itemPost.name !== ""
    )

    return <ItemPage
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={pageBreadcrumbs}
        loading={loading}
    >
        <ItemPageForm
            onRevert={revert}
            revertDisabled={revertDisabled}
            onSave={save}
            saveDisabled={saveDisabled}
        >
            <ItemTextInput<ScenarioPost, "name">
                field="name"
                getField={getItemPostField}
                setField={setItemPostField}
                label="Name"
                description={"Bank account name"}
                placeholder="Name"
                required
            />
            <ItemTextInput<ScenarioPost, "description">
                field="description"
                getField={getItemPostField}
                setField={setItemPostField}
                label="Description"
                description={"Bank account description"}
                placeholder="Description"
            />
        </ItemPageForm>
        <ItemPageRelations>
            <RelationSelector
                itemId={itemId}
                label="entities"
                getRelatedOptions={getItemsRouteEntitiesGet}
                getRelatedItems={getRelatedItemsRouteScenariosItemIdEntitiesGet}
                postRelatedItem={postRelatedItemRouteScenariosItemIdEntitiesPost}
                deleteRelatedItem={deleteRelatedItemRouteScenariosItemIdEntitiesRelatedItemIdDelete}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />
        </ItemPageRelations>
    </ItemPage>
}
