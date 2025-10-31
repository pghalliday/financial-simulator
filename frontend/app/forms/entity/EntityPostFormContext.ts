import {createPostFormContext} from "~/providers/post_form_providers";
import type {EntityPost} from "~/lib/types";

export const ENTITY_POST_FORM_NAME = "EntityPost"
export const [EntityPostFormProvider, useEntityPostFormContext] = createPostFormContext<EntityPost>()
