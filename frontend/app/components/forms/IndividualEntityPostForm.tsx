import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {IndividualEntityPost} from "~/client";

export function IndividualEntityPostForm() {
    return <>
        <ItemTextInput<IndividualEntityPost, "name">
            field="name"
            label="Name"
            description={"Individual name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<IndividualEntityPost, "description">
            field="description"
            label="Description"
            description={"Individual description"}
            placeholder="Description"
        />
    </>
}
