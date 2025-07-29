const editors: string[] = [];

/// Registers an editor if none of its parents have been registered as editors
export function registerEditor(elt: HTMLElement) {
	let parent = elt.parentElement!;
	while (parent.id !== 'main-content') {
		if (editors.includes(parent.id)) return;
		parent = parent.parentElement!;
	}

	editors.push(elt.id);

	elt.contentEditable = 'true';
	console.log(`making ${elt} contenteditable;`)
}
