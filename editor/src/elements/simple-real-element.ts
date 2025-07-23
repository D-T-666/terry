export default function simpleRealElement(type: string, tag: string, id: string, name?: string): HTMLElement {
	if (name === undefined) { name = `${type}-${id}`; }

	const elt = document.createElement(tag);
	elt.id = id;
	elt.dataset.name = name;
	elt.dataset.type = type;

	return elt;
}
