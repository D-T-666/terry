class BrowserSim extends HTMLElement {
	constructor() {
		super()

		/// Create static sub-elements

		this.tabs = document.createElement("div");
		this.tabs.classList.add("tabs");

		this.urlBar = document.createElement("div");
		this.urlBar.classList.add("url");

		const header = document.createElement("div");
		header.classList.add("header");

		header.append(this.tabs, this.urlBar);

		this.pages = document.createElement("div");
		this.pages.classList.add("pages");
		this.pages.innerHTML = this.innerHTML;
		this.innerHTML = "";

		this.append(header, this.pages);

		/// Create dynamic sub-elements

		this.pagesByURL = {};
		for (const page of this.pages.children) {
			this.pagesByURL[page.getAttribute("url")] = page;
		}

		this.pages.firstElementChild.setAttribute("closable", false)

		this.visibleTabs = {};
		this.currentPageUrl = undefined;

		this.showPage(this.pages.children[0].getAttribute("url"));
	}

	showPage(u) {
		if (this.currentPageUrl !== undefined) {
			this.pagesByURL[this.currentPageUrl].classList.remove("current");
			if (this.visibleTabs[this.currentPageUrl]) {
				this.visibleTabs[this.currentPageUrl].classList.remove("current");
			}
		}

		this.currentPageUrl = u;
		this.pagesByURL[this.currentPageUrl].classList.add("current");

		if (this.visibleTabs[this.currentPageUrl] === undefined) {
			this.createTab(this.currentPageUrl);
		}

		this.visibleTabs[this.currentPageUrl].classList.add("current");

		this.urlBar.innerText = `https://${this.currentPageUrl}`;
	}

	createTab(u) {
		const tab = document.createElement("span");
		tab.classList.add("tab");

		const open = document.createElement("button");
		open.innerText = this.pagesByURL[this.currentPageUrl].getAttribute("title");
		open.addEventListener("click", (e) => this.showPage(u));
		tab.appendChild(open);

		if (this.pagesByURL[this.currentPageUrl].getAttribute("closable") !== "false") {
			const close = document.createElement("button");
			close.innerHTML = "&#10005;";
			close.addEventListener("click", (e) => {
				this.visibleTabs[u].remove();
				delete this.visibleTabs[u];
				if (u === this.currentPageUrl) {
					this.showPage(Object.keys(this.visibleTabs)[0])
				}
			});

			tab.appendChild(close);
		}

		this.tabs.appendChild(tab);
		this.visibleTabs[this.currentPageUrl] = tab;
	}
}

class BrowserLink extends HTMLElement {
	constructor() {
		super();

		this.addEventListener("click", this.click);
	}

	connectedCallback() {
		const targetBrowserId = this.getAttribute("browser");

		if (targetBrowserId !== null) {
			this.targetBrowser = document.getElementById(targetBrowserId);
		} else {
			let parent = this.parentElement;

			while (parent.parentElement) {
				parent = parent.parentElement;

				if (parent.tagName === "BROWSER-SIM") {
					this.targetBrowser = parent;
					break;
				}
			}
		}
	}

	click(event) {
		this.targetBrowser.showPage(this.getAttribute("to"))
		this.targetBrowser.scrollIntoView({ behavior: "smooth" });
	}
}

class BrowserPage extends HTMLElement {
	constructor() {
		super()
	}
}

customElements.define("browser-sim", BrowserSim);
customElements.define("browser-link", BrowserLink);
customElements.define("browser-page", BrowserPage);

