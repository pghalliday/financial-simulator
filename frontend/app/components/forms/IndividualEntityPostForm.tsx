import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {IndividualEntityPost} from "~/client";
import type {ItemPostFieldGetter, ItemPostFieldSetter} from "~/lib/hooks/useItemPost";

export function IndividualEntityPostForm({
                                             getField,
                                             setField,
                                         }: {
    getField: ItemPostFieldGetter<IndividualEntityPost>,
    setField: ItemPostFieldSetter<IndividualEntityPost>,
}) {
    return <>
        <ItemTextInput<IndividualEntityPost, "name">
            field="name"
            getField={getField}
            setField={setField}
            label="Name"
            description={"Individual name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<IndividualEntityPost, "description">
            field="description"
            getField={getField}
            setField={setField}
            label="Description"
            description={"Individual description"}
            placeholder="Description"
        />
    </>
}
