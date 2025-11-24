import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {useDecimalProvider} from "~/providers/item_providers";
import {
    DECIMAL_PROVIDER_POST_FORM_NAME,
    useDecimalProviderPostFormContext
} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import {DecimalProviderPostForm} from "~/forms/decimal_provider/DecimalProviderPostForm";

export default function DecimalProviderPageForms() {
    const providerPostForm = useDecimalProviderPostFormContext()
    const [_provider, putProvider] = useDecimalProvider({
        onPutSuccess: (decimalProvider) => {
            providerPostForm.setInitialValues(decimalProvider)
        }
    })

    return <ItemPageForm
        formName={DECIMAL_PROVIDER_POST_FORM_NAME}
        onSubmit={putProvider}
    >
        <DecimalProviderPostForm/>
    </ItemPageForm>
}
