import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {CorporationEntityPost} from "~/client";

export function CorporationEntityPostForm() {
    return <>
        <ItemTextInput<CorporationEntityPost, "name">
            field="name"
            label="Name"
            description={"Corporation name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<CorporationEntityPost, "description">
            field="description"
            label="Description"
            description={"Corporation description"}
            placeholder="Description"
        />
    </>
}
