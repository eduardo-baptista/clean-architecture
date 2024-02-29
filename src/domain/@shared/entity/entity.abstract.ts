import Notification from "../notification/notification";
import { AggregateRoot } from "./aggregate-root";

export abstract class Entity extends AggregateRoot {
	protected _id!: string;
	protected notification: Notification;

	constructor() {
		super();
		this.notification = new Notification();
	}

	get id(): string {
		return this._id;
	}
}
