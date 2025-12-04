import {createPostFormContext} from "~/providers/post_form_providers";
import type {ScenarioPost} from "../../../client";

export const [ScenarioPostFormProvider, useScenarioPostFormContext] = createPostFormContext<ScenarioPost>()
