import {ScrollArea, Stack, Text} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import type {ReactNode} from "react";
import type {HttpChangeTypeError, HttpDatabaseIntegrityError, HttpNotFoundError, HttpValidationError,} from "~/client";

const SCROLL_AREA_HEIGHT = 100;
const SCROLL_AREA_1_LINE_HEIGHT = 30;
const SCROLL_AREA_2_LINE_HEIGHT = 50;
const STACK_GAP = "xs"
const TEXT_SIZE = "xs"
const FAILED_TO_FETCH_ERROR = "TypeError: Failed to fetch"

function isNotFoundError(response: Response, error: unknown): error is HttpNotFoundError {
    // @ts-ignore
    return response.status === 404 && error.detail.type === "not-found";
}

function isChangeTypeError(response: Response, error: unknown): error is HttpChangeTypeError {
    // @ts-ignore
    return response.status === 409 && error.detail.type === "change-type";
}

function isDatabaseIntegrityError(response: Response, error: unknown): error is HttpDatabaseIntegrityError {
    // @ts-ignore
    return response.status === 409 && error.detail.type === "database-integrity";
}

function isValidationError(response: Response, error: unknown): error is HttpValidationError {
    // @ts-ignore
    return response.status === 422 && Array.isArray(error.detail)
}

export function notifyApiErrorResponse(title: string, response: Response, error: unknown) {
    let message: ReactNode = `${response.status}: ${response.statusText}: ${JSON.stringify(error, null, 2)}`;
    if (isValidationError(response, error)) {
        message = <ScrollArea h={SCROLL_AREA_HEIGHT}>
            <Stack gap={STACK_GAP}>
                <Text size={TEXT_SIZE}>Validation error</Text>
                {error.detail!.map(verror => (
                    <>
                        <Text size={TEXT_SIZE}>loc: {verror.loc.join(", ")}</Text>
                        <Text size={TEXT_SIZE}>msg: {verror.msg}</Text>
                        <Text size={TEXT_SIZE}>type: {verror.type}</Text>
                    </>
                ))}
            </Stack>
        </ScrollArea>
    }
    if (isNotFoundError(response, error)) {
        message = `Item not found: ${error.detail.id}`
    }
    if (isChangeTypeError(response, error)) {
        message = <ScrollArea h={SCROLL_AREA_HEIGHT}>
            <Stack gap={STACK_GAP}>
                <Text size={TEXT_SIZE}>Cannot change item type</Text>
                <Text size={TEXT_SIZE}>current type: {error.detail.current_type}</Text>
                <Text size={TEXT_SIZE}>new type: {error.detail.new_type}</Text>
            </Stack>
        </ScrollArea>
    }
    if (isDatabaseIntegrityError(response, error)) {
        const message_parts = error.detail.message.split("\n");
        message = <ScrollArea h={SCROLL_AREA_HEIGHT}>
            <Stack gap={STACK_GAP}>
                <Text size={TEXT_SIZE}>Database integrity error</Text>
                <Text size={TEXT_SIZE}>message: {message_parts[0]}</Text>
                <Text size={TEXT_SIZE}>statement: {message_parts[1]}</Text>
                <Text size={TEXT_SIZE}>parameters: {message_parts[2]}</Text>
                <Text size={TEXT_SIZE}>background: {message_parts[3]}</Text>
            </Stack>
        </ScrollArea>
    }
    notifications.show({
        color: 'red',
        title,
        message,
    })
}

export function notifyApiError(title: string, error: any) {
    let message = error.toString();
    if (message === FAILED_TO_FETCH_ERROR) {
        message = <ScrollArea h={SCROLL_AREA_2_LINE_HEIGHT}>
            <Stack gap={STACK_GAP}>
                <Text size={TEXT_SIZE}>{message}</Text>
                <Text size={TEXT_SIZE}>Is the API server running?</Text>
            </Stack>
        </ScrollArea>
    }
    notifications.show({
        color: 'red',
        title,
        message,
    })
}

export function notifyError(title: string, error: any) {
    let message = error.toString();
    if (message === FAILED_TO_FETCH_ERROR) {
        message = <ScrollArea h={SCROLL_AREA_1_LINE_HEIGHT}>
            <Stack gap={STACK_GAP}>
                <Text size={TEXT_SIZE}>{message}</Text>
            </Stack>
        </ScrollArea>
    }
    notifications.show({
        color: 'red',
        title,
        message,
    })
}
