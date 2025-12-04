import {ItemPageForm} from "~/pages/ItemPageForm";
import {useCorporationEntity} from "~/providers/item_providers";
import {useCorporationEntityPostFormContext} from "~/forms/entity/contexts";
import {CorporationEntityPostForm} from "~/forms/entity/CorporationEntityPostForm";

export function CorporationEntityPageForms() {
    const entityPostForm = useCorporationEntityPostFormContext()
    const [_entity, putEntity] = useCorporationEntity({
        onPutSuccess: (entity) => {
            entityPostForm.setInitialValues(entity)
        }
    })

    return <ItemPageForm
        onSubmit={entityPostForm.onSubmit(putEntity)}
        onReset={entityPostForm.onReset}
    >
        <CorporationEntityPostForm/>
    </ItemPageForm>
}
