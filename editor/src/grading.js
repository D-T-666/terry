const extractors = {
	"multiple-choice-input": (e) => {
		const res = {
			options: [],
			correct: []
		};

		for (const child of e.children) {
			// multiple-choice-items have <input type="checkbox"> as their first child.
			const checkbox = child.children[0];
			res.options.push(checkbox.id);
			res.correct.push(checkbox.checked);
		}

		return res;
	},
	"short-text-input": (e) => {
		const res = {
			correct: e.value
		};

		return res;
	},
}

const grading = {
	current: {},
	getScheme() {
		this.current = {};

		this._parse(mainContent);

		return this.current;
	},
	_parse(e) {
		if (e.dataset.type !== undefined && extractors[e.dataset.type] !== undefined) {
			const extractor = extractors[e.dataset.type];
			this.current[e.id] = extractor(e);
			return;
		}

		for (const child of e.children) {
			this._parse(child);
		}
	}
}
