import type {Breadcrumb} from "~/lib/types";
import {useHeaderData} from "~/providers/HeaderDataProvider";
import {useEffect} from "react";

export interface PageMetaDataParams {
    title: string
    description: string
    breadcrumbs: Breadcrumb[]
}

export function PageMetaData({pageMetaDataParams}: { pageMetaDataParams: PageMetaDataParams }) {
    const {setHeaderData} = useHeaderData();

    useEffect(() => {
        setHeaderData(pageMetaDataParams)
    }, [pageMetaDataParams]);

    return <>
        <title>{pageMetaDataParams?.title}</title>
        <meta property="og:title" content={pageMetaDataParams?.title}/>
        <meta property="description" content={pageMetaDataParams?.description}/>
    </>
}