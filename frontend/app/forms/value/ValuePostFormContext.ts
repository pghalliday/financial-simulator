import {createPostFormContext} from "~/providers/post_form_providers";
import type {ValuePost} from "~/lib/types";

export const VALUE_POST_FORM_NAME = "ValuePost"
export const [ValuePostFormProvider, useValuePostFormContext] = createPostFormContext<ValuePost>()
