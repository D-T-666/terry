const pageButtonsDiv = document.getElementById("page-buttons");
const addPageButton = document.getElementById("add-page");

const page = {
	current: 0,
	total: 0,
	pageElements: [],
	addPage() {
		const innerElt = createElementFromHTML(`<input type="radio" id="page-${this.total + 1}" name="current-page">`);
		const newPageIndex = this.total;
		innerElt.addEventListener("change", (e) => {
			this.showPage(newPageIndex);
		})
		const label = createElementFromHTML(`<label>${this.total + 1}</label>`);
		label.appendChild(innerElt);
		pageButtonsDiv.insertBefore(label, addPageButton);
		this.pageElements.push([]);
		this.total += 1;
		mainContent.firstElementChild.dataset.pages = this.total;
	},
	hidePage() {
		for (const elt of this.pageElements[this.current]) {
			elt.classList.remove("current")
		}
	},
	showPage(i) {
		if (!(i < this.total && i >= 0)) {
			return;
		}

		this.hidePage();
		this.current = i;
		for (const elt of this.pageElements[this.current]) {
			elt.classList.add("current");
		}
	},
	importElement(elt) {
		const visibilityType = elt.dataset.visibilityType || "always";

		switch (visibilityType ) {
			case "only":
				const ind = Number(elt.dataset.visibleOnlyOn || "1")
				while (ind > this.total) {
					this.addPage();
				}
				this.trackElementOnly(elt, ind);
				break;
			case "range":
				const l = Number(elt.dataset.visibleFrom || "1");
				const r = Number(elt.dataset.visibleTo || "1");
				while (l > this.total) {
					this.addPage();
				}
				while (r > this.total) {
					this.addPage();
				}
				this.trackElementRange(elt, l, r);
				break;
		}

		for (const child of elt.children) {
			this.importElement(child);
		}
	},
	untrackElement(elt) {
		for (const elts of this.pageElements) {
			const ind = elts.indexOf(elt);
			if (ind >= 0) {
				elts.splice(ind, 1);
			}
		}
	},
	trackElementOnly(elt, i, untrackFirst=true) {
		i -= 1;
		if (!(i < this.total && i >= 0)) {
			return;
		}

		if (untrackFirst) {
			this.untrackElement(elt);
		}

		if (!this.pageElements[i].includes(elt)) {
			this.pageElements[i].push(elt);
		}

		if (i === this.current) {
			this.showPage(i);
		}
	},
	trackElementRange(elt, l, r) {
		this.untrackElement(elt);
		
		for (let i = l; i <= r; i++) {
			this.trackElementOnly(elt, i, false);
		}
	}
};

addPageButton.addEventListener("click", (e) => {
	page.addPage();
})
page.addPage();
