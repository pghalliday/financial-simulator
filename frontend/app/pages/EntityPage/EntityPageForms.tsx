import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {EntityPostForm} from "~/forms/entity/EntityPostForm";
import {ENTITY_POST_FORM_NAME} from "~/forms/entity/EntityPostFormContext";
import {useEntity} from "~/providers/item_providers";
import {useFormContext} from "~/lib/hooks/useFormContext";

export default function EntityPageForms() {
    const entityPostForm = useFormContext(ENTITY_POST_FORM_NAME)
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
