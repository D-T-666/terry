export enum Menu {
	rightClick,
	element
};

const menus: HTMLElement[] = [
	document.getElementById("left-pane-right-click-menu")!,
	document.getElementById("element-menu")!
];

export function hideMenus() {
	for (const menu of menus) {
		menu.style.visibility = 'hidden';
	}
}

export function openMenu(menu: Menu, nextTo: HTMLElement) {
	const rect = nextTo.getBoundingClientRect();
	menus[menu].style.top = `${rect.top}px`;
	menus[menu].style.left = `${rect.right + 2}px`;
	menus[menu].style.visibility = "visible";
}

export function openMenuWithOptions(menu: Menu, options: string[], nextTo: HTMLElement) {
	if (options.length > 0) {
		for (const child of menus[menu].children) {
			(child as HTMLButtonElement).disabled = !options.includes(child.id);
		}
	} else {
		for (const child of menus[menu].children) {
			(child as HTMLButtonElement).disabled = false;
		}
	}
	openMenu(menu, nextTo);
}

document.addEventListener("click", function (e) {
	if (!menus[Menu.rightClick].contains(e.target as Node | null)) {
		menus[Menu.rightClick].style.visibility = "hidden";
		menus[Menu.element].style.visibility = "hidden";
	}
});
