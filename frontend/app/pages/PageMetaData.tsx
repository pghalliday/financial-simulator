import type {Breadcrumb} from "~/lib/types";
import {useHeaderData} from "~/providers/HeaderDataProvider";
import {useEffect} from "react";

export interface PageParams {
    title: string
    description: string
    breadcrumbs: Breadcrumb[]
}

export function PageMetaData({pageParams}: { pageParams: PageParams }) {
    const {setHeaderData} = useHeaderData();

    useEffect(() => {
        setHeaderData(pageParams)
    }, [pageParams]);

    return <>
        <title>{pageParams?.title}</title>
        <meta property="og:title" content={pageParams?.title}/>
        <meta property="description" content={pageParams?.description}/>
    </>
}