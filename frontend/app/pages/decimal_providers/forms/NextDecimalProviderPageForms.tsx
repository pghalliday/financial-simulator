import {ItemPageForm} from "~/pages/ItemPageForm";
import {useNextDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {useNextDecimalProvider} from "~/providers/item_providers";
import {NextDecimalProviderPostForm} from "~/forms/decimal_provider/NextDecimalProviderPostForm";

export function NextDecimalProviderPageForms() {
    const form = useNextDecimalProviderPostFormContext()
    const [_provider, putProvider] = useNextDecimalProvider({
        onPutSuccess: (decimalProvider) => {
            form.setInitialValues(decimalProvider)
        }
    })

    return <ItemPageForm
        onSubmit={form.onSubmit(putProvider)}
        onReset={form.onReset}
    >
        <NextDecimalProviderPostForm/>
    </ItemPageForm>
}
