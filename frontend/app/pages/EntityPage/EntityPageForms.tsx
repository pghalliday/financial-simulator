import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {EntityPostForm} from "~/forms/entity/EntityPostForm";
import {ENTITY_POST_FORM_NAME, useEntityPostFormContext} from "~/forms/entity/EntityPostFormContext";
import {useEntity} from "~/providers/item_providers";

export default function EntityPageForms() {
    const entityPostForm = useEntityPostFormContext()
    const [_entity, putEntity] = useEntity({
        onPutSuccess: (entity) => {
            entityPostForm.setInitialValues(entity)
        }
    })

    return <ItemPageForm
        formName={ENTITY_POST_FORM_NAME}
        onSubmit={putEntity}
    >
        <EntityPostForm/>
    </ItemPageForm>
}
