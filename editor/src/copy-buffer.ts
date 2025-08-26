export class CopyBuffer<T> {
	#data?: T;

	set data(v: T) {
		this.#data = v;
	}

	get data(): T | undefined {
		return this.#data
	}

	isCopying(): boolean {
		return this.#data !== undefined;
	}
}
