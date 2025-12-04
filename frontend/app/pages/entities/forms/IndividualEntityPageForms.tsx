import {ItemPageForm} from "~/pages/ItemPageForm";
import {useIndividualEntity} from "~/providers/item_providers";
import {useIndividualEntityPostFormContext} from "~/forms/entity/contexts";
import {IndividualEntityPostForm} from "~/forms/entity/IndividualEntityPostForm";

export function IndividualEntityPageForms() {
    const entityPostForm = useIndividualEntityPostFormContext()
    const [_entity, putEntity] = useIndividualEntity({
        onPutSuccess: (entity) => {
            entityPostForm.setInitialValues(entity)
        }
    })

    return <ItemPageForm
        onSubmit={entityPostForm.onSubmit(putEntity)}
        onReset={entityPostForm.onReset}
    >
        <IndividualEntityPostForm/>
    </ItemPageForm>
}
