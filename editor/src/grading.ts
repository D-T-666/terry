import { mainContent } from "./panels";

type Scheme = any;

const extractors = {
	"multipleChoiceInput": (e) => {
		const res: {options: any[], correct: any[]} = {
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
	"shortTextInput": (e) => {
		const res = {
			correct: e.value
		};

		return res;
	},
}

let currentScheme: Scheme = undefined;

function parse(e) {
	if (e.dataset.type !== undefined && extractors[e.dataset.type] !== undefined) {
		const extractor = extractors[e.dataset.type];
		currentScheme[e.id] = extractor(e);
		return;
	}

	for (const child of e.children) {
		parse(child);
	}
}

export function getCurrentScheme() {
	currentScheme = {};

	parse(mainContent);

	return currentScheme;
};
