import {
    SCENARIO_HREF,
    SCENARIOS_ADD_ITEM_MODAL_TITLE,
    SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {type Column, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {deleteItemRouteScenariosItemIdDelete, postItemRouteScenariosPost, type ScenarioGet} from "~/client";
import {validateScenarioPost} from "~/lib/validators";
import {ScenarioPostForm} from "~/components/forms/ScenarioPostForm";
import {getScenarioPageParams} from "~/routes/Scenario";
import {CollectionList} from "~/components/controls/CollectionList";

const NAME_COLUMN: Column<ScenarioGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<ScenarioGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.description.localeCompare(b.description),
    render: item => item.description
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ScenarioGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ScenarioGet>[] = ["name", "description"]


export function ScenarioList({items}: { items: ScenarioGet[] }) {
    return <CollectionList
        columns={COLUMNS}
        searchFields={SEARCH_FIELDS}
        defaultSortBy={DEFAULT_SORT_BY}
        getItemPageParams={getScenarioPageParams}
        itemHref={SCENARIO_HREF}
        items={items}
        onPost={postItemRouteScenariosPost}
        onDelete={deleteItemRouteScenariosItemIdDelete}
        onValidate={validateScenarioPost}
        addItemModalTitle={SCENARIOS_ADD_ITEM_MODAL_TITLE}
        addItemModalDefaultPost={{
            name: "",
            description: "",
        }}
        confirmDeleteItemModalTitle={SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
        confirmDeleteItemModalPrompt={SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_PROMPT}
    >
        <ScenarioPostForm/>
    </CollectionList>
}