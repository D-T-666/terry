const menuCount = 3;
export enum Menu {
	rightClick,
	element,
	preset
};

const menus: HTMLElement[] = [
	document.getElementById("left-pane-right-click-menu")!,
	document.getElementById("element-menu")!,
	document.getElementById("preset-menu")!,
];

const heirarchy: {[child: number]: Menu} = {
	[Menu.element]: Menu.rightClick,
	[Menu.preset]: Menu.rightClick
};

let current: Menu | undefined = undefined;

export function hideMenus() {
	for (const menu of menus) {
		menu.style.visibility = 'hidden';
	}
}

export function openMenu(menu: Menu, nextTo: HTMLElement) {
	const rect = nextTo.getBoundingClientRect();
	menus[menu].style.top = `${rect.top}px`;
	menus[menu].style.left = `calc(${rect.right}px + 0.25rem)`;
	menus[menu].style.visibility = "visible";
	current = menu;
}

export function openMenuWithOptions(menu: Menu, options: string[], nextTo: HTMLElement) {
	if (options.length > 0) {
		for (const child of menus[menu].children) {
			(child as HTMLButtonElement).disabled = !options.includes(child.id);
		}
	} else {
		console.error("requested to open a menu with 0 options.")
		for (const child of menus[menu].children) {
			(child as HTMLButtonElement).disabled = false;
		}
	}
	openMenu(menu, nextTo);
}

document.addEventListener("click", function (e) {
	const keep = [];

	let c = current;

	while (c !== undefined) {
		keep.push(c);
		c = heirarchy[c];
	}

	let clickedMenu = undefined;
	for (let menu = 0; menu < menuCount; menu++) {
		if (menus[menu].contains(e.target as Node)) {
			clickedMenu = menu;
			break;
		}
	}

	while (keep.length > 0 && keep[keep.length - 1] !== clickedMenu) {
		keep.pop();
	}

	for (let menu = 0; menu < menuCount; menu++) {
		if (!keep.includes(menu)) {
			menus[menu].style.visibility = "hidden";
		}
	}
});
