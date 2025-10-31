import {Title} from "@mantine/core";
import {ENTITY_TYPES} from "~/strings";
import {ENTITY_POST_FORM_NAME, useEntityPostFormContext} from "~/forms/entity/EntityPostFormContext";
import {IndividualEntityPostForm} from "~/forms/entity/IndividualEntityPostForm";
import {CorporationEntityPostForm} from "~/forms/entity/CorporationEntityPostForm";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {useScenarios} from "~/providers/items_providers";
import {BoundRelationSelect} from "~/components/controls/bound/BoundRelationSelect";
import {BoundSelect} from "~/components/controls/bound/BoundSelect";

export interface EntityPostFormProps {
    allowSelectType?: boolean,
}

const TYPE_SELECT_DATA = Object.entries(ENTITY_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

export function EntityPostForm({allowSelectType = false}: EntityPostFormProps) {
    const [scenarios] = useScenarios()
    const form = useEntityPostFormContext()
    return <>
        {allowSelectType ? (
            <BoundSelect
                formName={ENTITY_POST_FORM_NAME}
                fieldName="type"
                label="Type"
                description="Entity type"
                placeholder="Select the entity type"
                data={TYPE_SELECT_DATA}
                required
            />
        ) : (
            <Title order={4}>{ENTITY_TYPES[form.getValues().type]}</Title>
        )}
        <BoundTextInput
            formName={ENTITY_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Entity name"
            placeholder="The unique entity name"
            required
        />
        <BoundTextInput
            formName={ENTITY_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Entity description"
            placeholder="The entity description"
        />
        {(() => {
            switch (form.getValues().type) {
                case "individual_entity":
                    return <IndividualEntityPostForm/>
                case "corporation_entity":
                    return <CorporationEntityPostForm/>
            }
        })()}
        <BoundRelationSelect
            formName={ENTITY_POST_FORM_NAME}
            fieldName="scenarios"
            label="Scenarios"
            description="Linked scenarios"
            placeholder="The entity scenarios"
            data={scenarios}
        />
    </>
}
