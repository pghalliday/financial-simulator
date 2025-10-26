import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {ScenarioPost} from "~/client";

export function ScenarioPostForm() {
    return <>
        <ItemTextInput<ScenarioPost, "name">
            field="name"
            label="Name"
            description={"Scenario name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<ScenarioPost, "description">
            field="description"
            label="Description"
            description={"Scenario description"}
            placeholder="Description"
        />
    </>
}
