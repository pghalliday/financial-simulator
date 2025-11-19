import {createPostFormContext} from "~/providers/post_form_providers";
import type {ScenarioPost} from "../../../client";

export const SCENARIO_POST_FORM_NAME = "ScenarioPost"
export const [ScenarioPostFormProvider, useScenarioPostFormContext] = createPostFormContext<ScenarioPost>()
