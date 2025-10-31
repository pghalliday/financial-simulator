import {createFormContext, type FormMode, type UseFormInput, type UseFormReturnType} from "@mantine/form";
import {type PropsWithChildren, type ReactElement} from "react";

export interface PostFormProviderProps<Post> {
    initialValues?: Post
}

export type PostFormProviderType<Post> = (
    props: PropsWithChildren<PostFormProviderProps<Post>>
) => ReactElement

const DEFAULT_FORM_MODE: FormMode = "uncontrolled"

export function createPostFormContext<Post>(input?: UseFormInput<Post>): [PostFormProviderType<Post>, () => UseFormReturnType<Post>] {
    const [FormProvider, useFormContext, useForm] = createFormContext<Post>()
    const PostFormProvider = ({
                                  initialValues,
                                  children,
                              }: PropsWithChildren<PostFormProviderProps<Post>>) => {
        const form = useForm({
            mode: DEFAULT_FORM_MODE,
            ...input,
            initialValues,
        })

        return (
            <FormProvider form={form}>
                {children}
            </FormProvider>
        )
    }
    return [PostFormProvider, useFormContext]
}