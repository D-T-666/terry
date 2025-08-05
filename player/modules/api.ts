const api = {
	getTest(id) {
		// TODO: Hook this up to the API
		return JSON.parse(localStorage.getItem("currentFile"));
	}
};

export {api as default};
