import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {SCENARIO_POST_FORM_NAME} from "./ScenarioPostFormContext"
import {BoundRelationSelect} from "~/components/controls/bound/BoundRelationSelect";
import {useEntities} from "~/providers/items_providers";

export function ScenarioPostForm() {
    const [entities] = useEntities()
    return <>
        <BoundTextInput
            formName={SCENARIO_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Scenario name"
            placeholder="The unique scenario name"
            required
        />
        <BoundTextInput
            formName={SCENARIO_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Scenario description"
            placeholder="The scenario description"
        />
        <BoundRelationSelect
            formName={SCENARIO_POST_FORM_NAME}
            fieldName="entities"
            data={entities}
            label="Entities"
            description="Linked entities"
            placeholder="The scenario entities"
        />
    </>
}
