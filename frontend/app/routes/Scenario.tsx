import type {Route} from "./+types/Scenario";
import {SCENARIO_BREADCRUMBS, SCENARIO_PAGE_DESCRIPTION, SCENARIO_PAGE_TITLE} from "~/strings";
import {ItemPageForm} from "~/components/forms/ItemPageForm";
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
import {useItemPage} from "~/lib/hooks/useItemPage";
import {RelationSelector} from "~/components/controls/RelationSelector";
import {Page} from "~/components/pages/Page";
import {validateScenarioPost} from "~/lib/validators";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import {ScenarioPostForm} from "~/components/forms/ScenarioPostForm";
import {Stack} from "@mantine/core";

export function getScenarioPageParams(item: ScenarioGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

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
        itemId,
        SCENARIO_PAGE_TITLE,
        SCENARIO_PAGE_DESCRIPTION,
        SCENARIO_BREADCRUMBS,
        getScenarioPageParams,
        getItemRouteScenariosItemIdGet,
        putItemRouteScenariosItemIdPut,
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
            <ScenarioPostForm getField={getField} setField={setField}/>
        </ItemPageForm>
        <Stack>
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
        </Stack>
    </Page>
}
