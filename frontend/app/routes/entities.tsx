import { useEffect } from "react";
import type { Route } from "./+types/entities";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {
  APP_NAME,
  COMPARE_SCENARIOS_HREF,
  COMPARE_SCENARIOS_NAME,
  ENTITIES_HREF,
  ENTITIES_NAME,
  TITLE
} from "~/strings";

export default function Entities({params}: Route.ComponentProps) {
  const [_, setHeaderData] = useHeaderData();

  const description = ENTITIES_NAME
  const title = TITLE(description)

  useEffect(() => {
    setHeaderData({
      title: title,
      breadcrumbs: [
        {
          title: COMPARE_SCENARIOS_NAME,
          href: COMPARE_SCENARIOS_HREF,
        },
        {
          title: description,
          href: ENTITIES_HREF,
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
