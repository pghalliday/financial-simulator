import {Title} from "@mantine/core";
import {RATE_PROVIDER_TYPES} from "~/strings";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {BoundSelect, type BoundSelectOption} from "~/components/controls/bound/BoundSelect";
import {
    RATE_PROVIDER_POST_FORM_NAME,
    useRateProviderPostFormContext
} from "~/forms/rate_provider/RateProviderPostFormContext";
import {ScheduledRateProviderPostForm} from "~/forms/rate_provider/ScheduledRateProviderPostForm";
import {MergeRateProviderPostForm} from "~/forms/rate_provider/MergeRateProviderPostForm";
import {NextRateProviderPostForm} from "~/forms/rate_provider/NextRateProviderPostForm";

export interface Props {
    allowSelectType?: boolean,
}

const TYPE_SELECT_DATA: BoundSelectOption[] = Object.entries(RATE_PROVIDER_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

export function RateProviderPostForm({allowSelectType = false}: Props) {
    const form = useRateProviderPostFormContext()
    return <>
        {allowSelectType ? (
            <BoundSelect
                formName={RATE_PROVIDER_POST_FORM_NAME}
                fieldName="type"
                label="Type"
                description="Provider type"
                placeholder="Select the provider type"
                data={TYPE_SELECT_DATA}
                required
            />
        ) : (
            <Title order={4}>{RATE_PROVIDER_TYPES[form.getValues().type]}</Title>
        )}
        <BoundTextInput
            formName={RATE_PROVIDER_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Provider name"
            placeholder="The unique provider name"
            required
        />
        <BoundTextInput
            formName={RATE_PROVIDER_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Provider description"
            placeholder="The provider description"
        />
        {(() => {
            switch (form.getValues().type) {
                case "scheduled_rate_provider":
                    return <ScheduledRateProviderPostForm/>
                case "merge_rate_provider":
                    return <MergeRateProviderPostForm/>
                case "next_rate_provider":
                    return <NextRateProviderPostForm/>
            }
        })()}
    </>
}
