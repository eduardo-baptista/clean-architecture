export type NotificationErrorProps = {
	message: string;
	context: string;
};

export default class Notification {
	private errors: NotificationErrorProps[] = [];

	getErrors() {
		return this.errors;
	}

	addError(error: NotificationErrorProps) {
		this.errors.push(error);
	}

	messages(context?: string): string {
		const messages = this.errors
			.filter((error) => (context ? error.context === context : true))
			.map((error) => `${error.context}: ${error.message}`)
			.join(",");

		return messages;
	}

	hasErrors(): boolean {
		return this.errors.length > 0;
	}
}
