import {Title} from "@mantine/core";
import {DECIMAL_PROVIDER_TYPES} from "~/strings";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {BoundSelect, type BoundSelectOption} from "~/components/controls/bound/BoundSelect";
import {
    DECIMAL_PROVIDER_POST_FORM_NAME,
    useDecimalProviderPostFormContext
} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import {ScheduledDecimalProviderPostForm} from "~/forms/decimal_provider/ScheduledDecimalProviderPostForm";
import {MergeDecimalProviderPostForm} from "~/forms/decimal_provider/MergeDecimalProviderPostForm";
import {NextDecimalProviderPostForm} from "~/forms/decimal_provider/NextDecimalProviderPostForm";

export interface Props {
    allowSelectType?: boolean,
}

const TYPE_SELECT_DATA: BoundSelectOption[] = Object.entries(DECIMAL_PROVIDER_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

export function DecimalProviderPostForm({allowSelectType = false}: Props) {
    const form = useDecimalProviderPostFormContext()
    return <>
        {allowSelectType ? (
            <BoundSelect
                formName={DECIMAL_PROVIDER_POST_FORM_NAME}
                fieldName="type"
                label="Type"
                description="Provider type"
                placeholder="Select the provider type"
                data={TYPE_SELECT_DATA}
                required
            />
        ) : (
            <Title order={4}>{DECIMAL_PROVIDER_TYPES[form.getValues().type]}</Title>
        )}
        <BoundTextInput
            formName={DECIMAL_PROVIDER_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Provider name"
            placeholder="The unique provider name"
            required
        />
        <BoundTextInput
            formName={DECIMAL_PROVIDER_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Provider description"
            placeholder="The provider description"
        />
        {(() => {
            switch (form.getValues().type) {
                case "scheduled_decimal_provider":
                    return <ScheduledDecimalProviderPostForm/>
                case "merge_decimal_provider":
                    return <MergeDecimalProviderPostForm/>
                case "next_decimal_provider":
                    return <NextDecimalProviderPostForm/>
            }
        })()}
    </>
}
