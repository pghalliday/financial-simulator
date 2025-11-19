import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {useValue} from "~/providers/item_providers";
import {useValuePostFormContext, VALUE_POST_FORM_NAME} from "~/forms/value/ValuePostFormContext";
import {ValuePostForm} from "~/forms/value/ValuePostForm";

export default function ValuePageForms() {
    const valuePostForm = useValuePostFormContext()
    const [_value, putValue] = useValue({
        onPutSuccess: (value) => {
            valuePostForm.setInitialValues(value)
        }
    })

    return <ItemPageForm
        formName={VALUE_POST_FORM_NAME}
        onSubmit={putValue}
    >
        <ValuePostForm/>
    </ItemPageForm>
}
