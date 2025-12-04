import {useEntities} from "~/providers/items_providers";
import {TextInput} from "@mantine/core";
import {RelationMultiSelect} from "~/components/controls/RelationMultiSelect";
import {useScenarioPostFormContext} from "~/forms/scenario/contexts";

export function ScenarioPostForm() {
    const form = useScenarioPostFormContext()
    const [entities] = useEntities()
    return <>
        <TextInput
            autoFocus
            label="Name"
            description="Scenario name"
            placeholder="The unique scenario name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="Scenario description"
            placeholder="The scenario description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
        <RelationMultiSelect
            data={entities}
            label="Entities"
            description="Linked entities"
            placeholder="The scenario entities"
            key={form.key("entities")}
            {...form.getInputProps("entities")}
        />
    </>
}
