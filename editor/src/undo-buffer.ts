export class UndoBuffer<T> {
	#historyLenght = 100;
	#history: T[] = [];
	#head = -1;

	update(state: T) {
		this.#history.splice(0, this.#head, state);
		if (this.#history.length >= this.#historyLenght) {
			this.#history.splice(this.#historyLenght);
		}
		this.#head = -1;

		console.log(this.#history);
	}

	canGoBack(): boolean {
		return this.#head < this.#history.length - 1;
	}

	goBack(): T {
		this.#head += 1;
		console.log("returning version", this.#head);
		return this.#history[this.#head];
	}

	canGoForward(): boolean {
		return this.#head > 0;
	}

	goForward(): T {
		this.#head -= 1;	
		console.log("returning version", this.#head);
		return this.#history[this.#head];
	}
}
