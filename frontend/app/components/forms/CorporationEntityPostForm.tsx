import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {CorporationEntityPost} from "~/client";
import type {ItemPostFieldGetter, ItemPostFieldSetter} from "~/lib/hooks/useItemPost";

export function CorporationEntityPostForm({
                                              getField,
                                              setField,
                                          }: {
    getField: ItemPostFieldGetter<CorporationEntityPost>,
    setField: ItemPostFieldSetter<CorporationEntityPost>,
}) {
    return <>
        <ItemTextInput<CorporationEntityPost, "name">
            field="name"
            getField={getField}
            setField={setField}
            label="Name"
            description={"Corporation name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<CorporationEntityPost, "description">
            field="description"
            getField={getField}
            setField={setField}
            label="Description"
            description={"Corporation description"}
            placeholder="Description"
        />
    </>
}
