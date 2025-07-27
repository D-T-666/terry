type TerryPresset = {
	realElement: () => HTMLElement;
	mounted?: (elt: HTMLElement) => void;
	children?: string[];
	parents?: string[];
};

import * as shortTextQuestion from "./short-text-question.ts";
import * as multipleChoiceQuestion from "./multiple-choice-question.ts";

export const presets: {[name: string]: TerryPresset} = {
	shortTextQuestion, multipleChoiceQuestion
};

export function availablePresets() {
	const res = [];

	for (const key of Object.keys(presets)) {
		res.push(key);
	}

	return res;
};
