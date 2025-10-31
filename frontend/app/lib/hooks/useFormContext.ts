import type {UseFormReturnType} from "@mantine/form";
import {FORM_REGISTRY} from "~/forms/form_registry";

export type FormRegistry = typeof FORM_REGISTRY

// Infer the Form Values type from the form name
export type FormValues<Form extends keyof FormRegistry> = FormRegistry[Form] extends () => UseFormReturnType<infer Values> ? Values : never
// Select the string key names of the Form Values type that can then be used with the resulting UseFormReturnType
export type FormKeys<Form extends keyof FormRegistry> = keyof FormValues<Form> & string

export function useFormContext<Form extends keyof FormRegistry>(form: Form): UseFormReturnType<FormValues<Form>> {
    // TODO: find out why this cast is needed. Pretty sure it's safe by why doesn't the type compiler know that?
    return FORM_REGISTRY[form]() as unknown as UseFormReturnType<FormValues<Form>>
}
