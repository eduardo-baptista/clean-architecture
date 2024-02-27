import type { OrderItem } from "./order_item";

export class Order {
	private _id: string;
	private _customerId: string;
	private _items: OrderItem[];
	private _total: number;

	constructor(id: string, customerId: string, items: OrderItem[]) {
		this._id = id;
		this._customerId = customerId;
		this._items = items;
		this._total = this.total();
		this.validate();
	}

	get id(): string {
		return this._id;
	}

	get customerId(): string {
		return this._customerId;
	}

	get items(): OrderItem[] {
		return this._items;
	}

	addItem(item: OrderItem): void {
		this._items.push(item);
		this._total = this.total();
	}

	validate(): void {
		if (!this._id) {
			throw new Error("Id is required");
		}

		if (!this._customerId) {
			throw new Error("Customer Id is required");
		}

		if (this._items.length === 0) {
			throw new Error("Items qtd must be greater than 0");
		}

		if (this._items.some((item) => item.quantity < 1)) {
			throw new Error("Item quantity must be greater than 0");
		}
	}

	total(): number {
		return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
	}
}
