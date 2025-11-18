import {Title} from "@mantine/core";
import {RATE_TYPES} from "~/strings";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {BoundSelect} from "~/components/controls/bound/BoundSelect";
import {RATE_POST_FORM_NAME, useRatePostFormContext} from "~/forms/rate/RatePostFormContext";
import {PeriodicRatePostForm} from "~/forms/rate/PeriodicRatePostForm";
import {ContinuousRatePostForm} from "~/forms/rate/ContinuousRatePostForm";
import {BandedRatePostForm} from "~/forms/rate/BandedRatePostForm";

export interface Props {
    allowSelectType?: boolean,
}

const TYPE_SELECT_DATA = Object.entries(RATE_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

export function RatePostForm({allowSelectType = false}: Props) {
    const form = useRatePostFormContext()
    return <>
        {allowSelectType ? (
            <BoundSelect
                formName={RATE_POST_FORM_NAME}
                fieldName="type"
                label="Type"
                description="Rate type"
                placeholder="Select the rate type"
                data={TYPE_SELECT_DATA}
                required
            />
        ) : (
            <Title order={4}>{RATE_TYPES[form.getValues().type]}</Title>
        )}
        <BoundTextInput
            formName={RATE_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Rate name"
            placeholder="The unique rate name"
            required
        />
        <BoundTextInput
            formName={RATE_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Rate description"
            placeholder="The rate description"
        />
        {(() => {
            switch (form.getValues().type) {
                case "periodic_rate":
                    return <PeriodicRatePostForm/>
                case "continuous_rate":
                    return <ContinuousRatePostForm/>
                case "banded_rate":
                    return <BandedRatePostForm/>
            }
        })()}
    </>
}
