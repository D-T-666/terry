let rightClickMenu = document.getElementById("left-pane-right-click-menu");
let elementMenu = document.getElementById("element-menu");

function openMenu(menu, e) {
	const rect = e.target.getBoundingClientRect();
	menu.style.top = `${rect.top}px`;
	menu.style.left = `${rect.right + 2}px`;
	menu.style.visibility = "visible";
	e.preventDefault();
}

function openMenuWithOptions(menu, options, e) {
	for (const child of menu.children) {
		child.disabled = !options.includes(child.id);
	}
	openMenu(menu, e);
}
