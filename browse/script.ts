import { renderTestListing } from "./modules/elements.ts";
import { openTestDetails } from "./modules/test-details.ts";
import { loadTests } from "./modules/data.ts";
import { createNewTest } from "../scripts/api.ts";
import { AttributeSelectorElement } from "../util/attribute-selector/main.ts";
import "../util/attribute-selector/main.ts";

import "./styles.css";
// import "https://necolas.github.io/normalize.css/8.0.1/normalize.css";
import "./css/tag-colors.css";

const list = document.getElementById("list")!;
const attributeSelector = document.getElementById(
  "attributes",
) as AttributeSelectorElement;

list.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).classList.contains("open")) {
    const id = (event.target as HTMLElement).parentElement!.parentElement!
      .dataset.id!;
    console.log(id);
    openTestDetails(id);
  }
});

const newTestButton = document.getElementById("new-test") as HTMLButtonElement;
newTestButton.addEventListener("click", async () => {
	const res = await createNewTest();
	if (!res.ok) {
		console.error("Unauthorized request to create a test");
	}
});

async function initialize() {
  const tests = await loadTests();

  for (const test of tests) {
    const t = renderTestListing(test);
    list.appendChild(t.cloneNode(true));
  }

  attributeSelector.options = {
    "საფეხური": ["დაწყებითი", "საბაზისო", "საშუალო"],
    "კვლევა": ["PISA", "TIMSS", "PIRLS"],
    "საგანი": ["მათემატიკა", "ფიზიკა", "კითხვა", "ბუნებისმეტყველება"],
    "კლასი": ["1", "2"],
    "ენა": ["ქართული"],
    "ხილვადობა": ["საჯარო", "შეზღუდული", "დამალული"],
  };
}

initialize();
