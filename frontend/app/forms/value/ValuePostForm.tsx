import {Title} from "@mantine/core";
import {VALUE_TYPES} from "~/strings";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {BoundSelect} from "~/components/controls/bound/BoundSelect";
import {useValuePostFormContext, VALUE_POST_FORM_NAME} from "~/forms/value/ValuePostFormContext";
import {DecimalValuePostForm} from "~/forms/value/DecimalValuePostForm";
import {RateValuePostForm} from "~/forms/value/RateValuePostForm";

export interface Props {
    allowSelectType?: boolean,
}

const TYPE_SELECT_DATA = Object.entries(VALUE_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

export function ValuePostForm({allowSelectType = false}: Props) {
    const form = useValuePostFormContext()
    return <>
        {allowSelectType ? (
            <BoundSelect
                formName={VALUE_POST_FORM_NAME}
                fieldName="type"
                label="Type"
                description="Value type"
                placeholder="Select the value type"
                data={TYPE_SELECT_DATA}
                required
            />
        ) : (
            <Title order={4}>{VALUE_TYPES[form.getValues().type]}</Title>
        )}
        <BoundTextInput
            formName={VALUE_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Value name"
            placeholder="The unique value name"
            required
        />
        <BoundTextInput
            formName={VALUE_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Value description"
            placeholder="The value description"
        />
        {(() => {
            switch (form.getValues().type) {
                case "decimal_value":
                    return <DecimalValuePostForm/>
                case "rate_value":
                    return <RateValuePostForm/>
            }
        })()}
    </>
}
