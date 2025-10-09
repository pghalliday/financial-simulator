import { useEffect } from "react";
import type { Route } from "./+types/home";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {COMPARE_SCENARIOS_HREF, COMPARE_SCENARIOS_NAME, TITLE} from "~/strings";

export default function CompareScenarios({params}: Route.ComponentProps) {
  const [_, setHeaderData] = useHeaderData();

  const description = COMPARE_SCENARIOS_NAME;
  const title = TITLE(description)

  useEffect(() => {
    setHeaderData({
      title: title,
      breadcrumbs: [
        {
          title: description,
          href: COMPARE_SCENARIOS_HREF,
        },
      ],
    });
  }, []);

  return <>
    <title>{title}</title>
    <meta property="og:title" content={title}/>
    <meta property="description" content={description}/>
    {description}
  </>
}
