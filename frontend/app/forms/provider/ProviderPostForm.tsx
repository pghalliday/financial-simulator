import {Title} from "@mantine/core";
import {PROVIDER_TYPES} from "~/strings";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {BoundSelect} from "~/components/controls/bound/BoundSelect";
import {PROVIDER_POST_FORM_NAME, useProviderPostFormContext} from "~/forms/provider/ProviderPostFormContext";
import {AlwaysProviderPostForm} from "~/forms/provider/AlwaysProviderPostForm";
import {ScheduledProviderPostForm} from "~/forms/provider/ScheduledProviderPostForm";
import {MergeProviderPostForm} from "~/forms/provider/MergeProviderPostForm";
import {NextProviderPostForm} from "~/forms/provider/NextProviderPostForm.tsx";

export interface Props {
    allowSelectType?: boolean,
}

const TYPE_SELECT_DATA = Object.entries(PROVIDER_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

export function ProviderPostForm({allowSelectType = false}: Props) {
    const form = useProviderPostFormContext()
    return <>
        {allowSelectType ? (
            <BoundSelect
                formName={PROVIDER_POST_FORM_NAME}
                fieldName="type"
                label="Type"
                description="Provider type"
                placeholder="Select the provider type"
                data={TYPE_SELECT_DATA}
                required
            />
        ) : (
            <Title order={4}>{PROVIDER_TYPES[form.getValues().type]}</Title>
        )}
        <BoundTextInput
            formName={PROVIDER_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Provider name"
            placeholder="The unique provider name"
            required
        />
        <BoundTextInput
            formName={PROVIDER_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Provider description"
            placeholder="The provider description"
        />
        {(() => {
            switch (form.getValues().type) {
                case "always_provider":
                    return <AlwaysProviderPostForm/>
                case "scheduled_provider":
                    return <ScheduledProviderPostForm/>
                case "merge_provider":
                    return <MergeProviderPostForm/>
                case "next_provider":
                    return <NextProviderPostForm/>
            }
        })()}
    </>
}
