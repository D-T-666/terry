export default {
	current: undefined,
	total: undefined,
	container: undefined,
	elementsOfPage: undefined,
	pageRadio: undefined,

	init({total, container}) {
		this.total = total;
		this.container = container;
		this.elementsOfPage = [];
		this.pageRadio = [];

		for (let i = 0; i < this.total; i++) {
			const innerElt = document.createElement("input");
			innerElt.type = "radio";
			innerElt.name = "current-page";
			innerElt.addEventListener("change", (e) => {
				if (e.target.checked) {
					this.hidePage();
					this.showPage(i);
				}
			});
			this.pageRadio.push(innerElt);
			const label = document.createElement("label");
			label.innerText = i + 1;
			label.appendChild(innerElt);
			this.container.appendChild(label);
			this.elementsOfPage.push([]);
		}
	},

	hidePage() {
		for (const elt of this.elementsOfPage[this.current]) {
			elt.classList.remove("current")
		}
	},

	showPage(i) {
		this.current = i;
		this.pageRadio[i].checked = true;
		for (const elt of this.elementsOfPage[this.current]) {
			elt.classList.add("current", "visited");
		}
	},

	registerElement(elt) {
		const visibilityType = elt.dataset.visibilityType || "always";

		switch (visibilityType ) {
			case "only":
				const ind = Number(elt.dataset.visibleOnlyOn)
				this.trackElementOnly(elt, ind);
				break;
			case "range":
				const l = Number(elt.dataset.visibleFrom);
				const r = Number(elt.dataset.visibleTo);
				this.trackElementRange(elt, l, r);
				break;
		}

		for (const child of elt.children) {
			this.registerElement(child);
		}
	},

	untrackElement(elt) {
		for (const elts of this.elementsOfPage) {
			const ind = elts.indexOf(elt);
			if (ind >= 0) {
				elts.splice(ind, 1);
			}
		}
	},

	trackElementOnly(elt, i, untrackFirst=true) {
		this.untrackElement(elt);

		this.elementsOfPage[i - 1].push(elt);
	},

	trackElementRange(elt, l, r) {
		this.untrackElement(elt);

		for (let i = l; i <= r; i++) {
			this.elementsOfPage[i - 1].push(elt);
		}
	}
};
