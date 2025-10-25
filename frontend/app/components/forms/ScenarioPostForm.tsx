import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {ScenarioPost} from "~/client";
import type {ItemPostFieldGetter, ItemPostFieldSetter} from "~/lib/hooks/useItemPost";

export function ScenarioPostForm({
                                     getField,
                                     setField,
                                 }: {
    getField: ItemPostFieldGetter<ScenarioPost>,
    setField: ItemPostFieldSetter<ScenarioPost>,
}) {
    return <>
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
    </>
}
