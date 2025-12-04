import {createPostFormContext} from "~/providers/post_form_providers";
import type {CorporationEntityPost, IndividualEntityPost} from "../../../client";

export const [CorporationEntityPostFormProvider, useCorporationEntityPostFormContext] = createPostFormContext<CorporationEntityPost>()
export const [IndividualEntityPostFormProvider, useIndividualEntityPostFormContext] = createPostFormContext<IndividualEntityPost>()
