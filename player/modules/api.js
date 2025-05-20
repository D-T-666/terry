const api = {
	getTest(id) {
		// TODO:
		return JSON.parse(window.localStorage.getItem("test"));
	}
};

export {api as default};
