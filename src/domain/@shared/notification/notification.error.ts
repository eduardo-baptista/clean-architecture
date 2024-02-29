import type Notification from "./notification";

export class NotificationError extends Error {
	constructor(public notification: Notification) {
		super(notification.messages());
	}
}
