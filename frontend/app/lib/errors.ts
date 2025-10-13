import { notifications } from "@mantine/notifications";

export function notifyError(title: string, response: Response, error: unknown) {
    notifications.show({
        color: 'red',
        title: title,
        message: `${response.status}: ${response.statusText}: ${JSON.stringify(error, null, 2)}`,
    })
}
