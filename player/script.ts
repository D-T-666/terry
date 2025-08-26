import pages from "./modules/pages.ts";
import { getTestContent } from "../scripts/api.ts";
import "../util/browser-sim/browser-sim.js";
import "./styles.css";
import "../styles.css";
import "../player.css";
import { loadFile } from "../scripts/file-manager.ts";

const mainContent = document.getElementById("main-content")!;
const pageControls = document.getElementById("page-controls")!;
const testNameElement = document.getElementById("test-name")!;

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const currentTestId = searchParams.get("id");

if (currentTestId !== undefined) {
	const { name, content } = await loadFile(currentTestId!);

	mainContent.innerHTML = content;
	testNameElement.textContent = name!;

	pages.init({
		total: (mainContent.firstChild as HTMLElement).dataset.pages,
		container: pageControls
	});
	pages.registerElement(mainContent.firstElementChild);
	pages.showPage(0);
}
