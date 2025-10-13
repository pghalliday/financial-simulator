import {isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration,} from "react-router";
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from '@mantine/core';


import type {Route} from "./+types/root";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import {NavLayout} from "~/components/NavLayout";
import {HeaderDataProvider} from "~/components/HeaderDataProvider";
import {ApiError} from "~/ApiError";
import { Notifications } from "@mantine/notifications";

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" {...mantineHtmlProps}>
        <head>
            <title>Financial Simulator</title>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <ColorSchemeScript/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <MantineProvider>
            <Notifications/>
            <HeaderDataProvider>
                <NavLayout>{children}</NavLayout>
            </HeaderDataProvider>
        </MantineProvider>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

// export function HydrateFallback() {
//     return <p>Loading...</p>;
// }
//
export default function App() {
    return <Outlet/>;
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (error instanceof ApiError) {
        message = error.message
        details = JSON.stringify(error.content, null, 2)
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <pre>{details}</pre>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
            )}
        </main>
    );
}
