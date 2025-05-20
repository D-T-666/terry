import pages from "./modules/pages.js";
import api from "./modules/api.js";

const mainContent = document.getElementById("main-content");
const pageControls = document.getElementById("page-controls");

// TODO: 
const id = 4;

const test = api.getTest(id);

mainContent.innerHTML = test.html;

pages.init({
	total: mainContent.firstChild.dataset.pages,
	container: pageControls
});
pages.registerElement(mainContent.firstElementChild);
pages.showPage(0);

