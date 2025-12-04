import {ItemPageForm} from "~/pages/ItemPageForm";
import {useMergeDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {useMergeDecimalProvider} from "~/providers/item_providers";
import {MergeDecimalProviderPostForm} from "~/forms/decimal_provider/MergeDecimalProviderPostForm";

export function MergeDecimalProviderPageForms() {
    const form = useMergeDecimalProviderPostFormContext()
    const [_provider, putProvider] = useMergeDecimalProvider({
        onPutSuccess: (decimalProvider) => {
            form.setInitialValues(decimalProvider)
        }
    })

    return <ItemPageForm
        onSubmit={form.onSubmit(putProvider)}
        onReset={form.onReset}
    >
        <MergeDecimalProviderPostForm/>
    </ItemPageForm>
}
