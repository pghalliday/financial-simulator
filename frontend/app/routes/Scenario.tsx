import type {Route} from "./+types/Scenario";
import {SCENARIO_HREF, SCENARIO_PAGE_DESCRIPTION, SCENARIOS_HREF, SCENARIOS_PAGE_DESCRIPTION} from "~/strings";
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
import {Page} from "~/components/pages/Page";
import {validateScenarioPost} from "~/lib/validators";

export default function BankAccount({params}: Route.ComponentProps) {
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
        validateScenarioPost,
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
            <ItemTextInput<ScenarioPost, "name">
                field="name"
                getField={getField}
                setField={setField}
                label="Name"
                description={"Scenario name"}
                placeholder="Name"
                required
            />
            <ItemTextInput<ScenarioPost, "description">
                field="description"
                getField={getField}
                setField={setField}
                label="Description"
                description={"Scenario description"}
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
    </Page>
}
