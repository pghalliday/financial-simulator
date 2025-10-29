import {
    ENTITIES_ADD_ITEM_MODAL_TITLE,
    ENTITIES_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    ENTITIES_CONFIRM_DELETE_ITEM_MODAL_TITLE,
    ENTITY_HREF,
    ENTITY_TYPES
} from "~/strings";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {deleteItemRouteEntitiesItemIdDelete, postItemRouteEntitiesPost} from "~/client";
import {validateEntityPost} from "~/lib/validators";
import type {EntityGet, EntityPost} from "~/lib/types";
import {EntityPostForm} from "~/components/forms/EntityPostForm";
import {getEntityPageParams} from "~/routes/Entity";
import {useRef} from "react";
import {Collection, type CollectionRef} from "~/components/controls/Collection";

const NAME_COLUMN: Column<EntityGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<EntityGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => ENTITY_TYPES[a.type].localeCompare(ENTITY_TYPES[b.type]),
    render: (item) => ENTITY_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<EntityGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.description.localeCompare(b.description),
    render: item => item.description
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<EntityGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<EntityGet>[] = ["name", "description"]


export function EntityList({items, setItems}: {
    items: EntityGet[],
    setItems: (items: EntityGet[]) => void,
}) {
    const collection = useRef<CollectionRef<EntityGet, EntityPost>>(null)
    return <>
        <Collection
            ref={collection}
            items={items}
            setItems={setItems}
            onPost={postItemRouteEntitiesPost}
            onDelete={deleteItemRouteEntitiesItemIdDelete}
            onValidate={validateEntityPost}
            addItemModalTitle={ENTITIES_ADD_ITEM_MODAL_TITLE}
            confirmDeleteItemModalTitle={ENTITIES_CONFIRM_DELETE_ITEM_MODAL_TITLE}
            confirmDeleteItemModalPrompt={ENTITIES_CONFIRM_DELETE_ITEM_MODAL_PROMPT}
        >
            <EntityPostForm allowSelectType/>
        </Collection>
        <ItemList
            columns={COLUMNS}
            items={items}
            getItemPageParams={getEntityPageParams}
            href={ENTITY_HREF}
            onAdd={() => collection.current?.startAddItem({
                name: "",
                description: "",
            })}
            onDelete={(item) => collection.current?.startDeleteItem(item)}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}