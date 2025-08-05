import { mainContent } from "./panels.ts";

type Scheme = any;

const extractors: {[type: string]: (e: HTMLInputElement) => any} = {
	"multipleChoiceInput": (e) => {
		const res: {options: any[], correct: any[]} = {
			options: [],
			correct: []
		};

		for (const child of e.children) {
			// multiple-choice-items have <input type="checkbox"> as their first child.
			const checkbox = child.children[0];
			res.options.push(checkbox.id);
			res.correct.push((checkbox as HTMLInputElement).checked);
		}

		return res;
	},
	"singleChoiceInput": (e) => {
		const res: {options: any[], correct: any[]} = {
			options: [],
			correct: []
		};

		for (const child of e.children) {
			// single-choice-items have <input type="radio"> as their first child.
			const radio = child.children[0];
			res.options.push(radio.id);
			res.correct.push((radio as HTMLInputElement).checked);
		}

		return res;
	},
	"shortTextInput": (e) => {
		const res = {
			correct: e.value
		};

		return res;
	},
};

const loaders: {[type: string]: (e: HTMLInputElement, data: any) => any} = {
	"shortTextInput": (e, {correct}) => {
		e.value = correct;
	},
	"multipleChoiceInput": (e, {options, correct}) => {
		for (let i = 0; i < options.length; i++) {
			(e.querySelector(`#options[i]`) as HTMLInputElement).checked = correct[i];
		}
	},
	"singleChoiceInput": (e, {options, correct}) => {
		for (let i = 0; i < options.length; i++) {
			(e.querySelector(`#options[i]`) as HTMLInputElement).checked = correct[i];
		}
	}
}

let currentScheme: Scheme = undefined;

export function getCurrentScheme() {
	currentScheme = {};

	for (const type of Object.keys(extractors)) {
		for (const e of mainContent.querySelectorAll(`[data-type=${type}]`)) {
			console.log("extracted", extractors[type](e as HTMLInputElement));
			currentScheme[e.id] = extractors[type](e as HTMLInputElement);
		}
	}

	return currentScheme;
};
