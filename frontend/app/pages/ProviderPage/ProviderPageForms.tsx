import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {useProvider} from "~/providers/item_providers";
import {PROVIDER_POST_FORM_NAME, useProviderPostFormContext} from "~/forms/provider/ProviderPostFormContext";
import {ProviderPostForm} from "~/forms/provider/ProviderPostForm";

export default function ProviderPageForms() {
    const providerPostForm = useProviderPostFormContext()
    const [_provider, putProvider] = useProvider({
        onPutSuccess: (provider) => {
            providerPostForm.setInitialValues(provider)
        }
    })

    return <ItemPageForm
        formName={PROVIDER_POST_FORM_NAME}
        onSubmit={putProvider}
    >
        <ProviderPostForm/>
    </ItemPageForm>
}
