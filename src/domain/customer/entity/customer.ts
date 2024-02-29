import { Entity } from "../../@shared/entity/entity.abstract";
import { NotificationError } from "../../@shared/notification/notification.error";
import { CustomerAddressChangedEvent } from "../event/customer-address-changed.event";
import { CustomerCreateEvent } from "../event/customer-created.event";
import { CustomerValidatorFactory } from "../factory/customer.validator.factory";
import type { Address } from "../value-object/address";

export class Customer extends Entity {
	private _name: string;
	private _address!: Address;
	private _active = false;
	private _rewardPoints = 0;

	constructor(id: string, name: string) {
		super();
		this._id = id;
		this._name = name;
		this.validate();

		if (this.notification.hasErrors()) {
			throw new NotificationError(this.notification);
		}
	}

	static create(id: string, name: string) {
		const customer = new Customer(id, name);
		customer.addEvent(new CustomerCreateEvent(id, name));

		return customer;
	}

	get name(): string {
		return this._name;
	}

	get rewardPoints(): number {
		return this._rewardPoints;
	}

	get address(): Address {
		return this._address;
	}

	set address(address: Address) {
		this._address = address;
	}

	changeAddress(address: Address) {
		this._address = address;
		this._address.validate();

		this.addEvent(
			new CustomerAddressChangedEvent(this.id, this._name, this._address),
		);
	}

	validate() {
		CustomerValidatorFactory.create().validate(this);
	}

	addRewardPoints(points: number) {
		this._rewardPoints += points;
	}

	changeName(name: string) {
		this._name = name;
		this.validate();
	}

	activate() {
		if (!this._address)
			throw new Error("Address is mandatory to activate customer");

		this._active = true;
	}

	deactivate() {
		this._active = false;
	}

	isActive() {
		return this._active;
	}
}
