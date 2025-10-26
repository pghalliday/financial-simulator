import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {EntityPost} from "~/lib/types";
import {ItemSelectInput} from "~/components/controls/ItemSelectInput";
import {ENTITY_TYPES} from "~/strings";
import {Title} from "@mantine/core";
import {useTypeIndicator} from "~/lib/hooks/useTypeIndicator";
import {useGetSetWithType} from "~/components/providers/GetSetProvider";

export function EntityPostForm({
                                   allowSelectType,
                               }: {
    allowSelectType?: boolean,
}) {
    const {getField} = useGetSetWithType<EntityPost, string>()
    const typeIndicator = useTypeIndicator(ENTITY_TYPES, getField)
    const typeSelectData = Object.entries(ENTITY_TYPES).map(entry => ({
        value: entry[0],
        label: entry[1],
    }))
    const selectType = allowSelectType ? <ItemSelectInput<EntityPost, "type">
        field={"type"}
        label="Type"
        description={"Select the entity type"}
        placeholder={"Entity type"}
        data={typeSelectData}
        required
    /> : <Title order={4}>{typeIndicator}</Title>
    return <>
        {selectType}
        <ItemTextInput<EntityPost, "name">
            field="name"
            label="Name"
            description={"Entity name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<EntityPost, "description">
            field="description"
            label="Description"
            description={"Entity description"}
            placeholder="Description"
        />
    </>
}
