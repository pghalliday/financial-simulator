import {ItemPageForm} from "~/pages/ItemPageForm";
import {useScheduledDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {useScheduledDecimalProvider} from "~/providers/item_providers";
import {ScheduledDecimalProviderPostForm} from "~/forms/decimal_provider/ScheduledDecimalProviderPostForm";

export function ScheduledDecimalProviderPageForms() {
    const form = useScheduledDecimalProviderPostFormContext()
    const [_provider, putProvider] = useScheduledDecimalProvider({
        onPutSuccess: (decimalProvider) => {
            form.setInitialValues(decimalProvider)
        }
    })

    return <ItemPageForm
        onSubmit={form.onSubmit(putProvider)}
        onReset={form.onReset}
    >
        <ScheduledDecimalProviderPostForm/>
    </ItemPageForm>
}
