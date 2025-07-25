var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// editor/src/menus.ts
var Menu = /* @__PURE__ */ function(Menu2) {
  Menu2[Menu2["rightClick"] = 0] = "rightClick";
  Menu2[Menu2["element"] = 1] = "element";
  return Menu2;
}({});
var menus = [
  document.getElementById("left-pane-right-click-menu"),
  document.getElementById("element-menu")
];
function hideMenus() {
  for (const menu of menus) {
    menu.style.visibility = "hidden";
  }
}
function openMenu(menu, nextTo) {
  const rect = nextTo.getBoundingClientRect();
  menus[menu].style.top = `${rect.top}px`;
  menus[menu].style.left = `${rect.right + 2}px`;
  menus[menu].style.visibility = "visible";
}
function openMenuWithOptions(menu, options, nextTo) {
  if (options.length > 0) {
    for (const child of menus[menu].children) {
      child.disabled = !options.includes(child.id);
    }
  } else {
    for (const child of menus[menu].children) {
      child.disabled = false;
    }
  }
  openMenu(menu, nextTo);
}
document.addEventListener("click", function(e) {
  if (!menus[Menu.rightClick].contains(e.target)) {
    menus[Menu.rightClick].style.visibility = "hidden";
    menus[Menu.element].style.visibility = "hidden";
  }
});

// editor/src/panels.ts
var treeView = document.getElementById("tree-view");
var mainContent = document.getElementById("main-content");
var rightPane = document.getElementById("right-pane");

// editor/src/pages.ts
var pageButtonsDiv = document.getElementById("page-buttons");
var addPageButton = document.getElementById("add-page");
var current = 0;
var total = 0;
var pageElements = [];
function addPage() {
  const innerElt = document.createElement("input");
  innerElt.type = "radio";
  innerElt.id = `page-${total + 1}`;
  innerElt.name = "current-page";
  const newPageIndex = total;
  innerElt.addEventListener("change", () => {
    showPage(newPageIndex);
  });
  const label = document.createElement("label");
  label.innerText = String(total + 1);
  label.appendChild(innerElt);
  pageButtonsDiv.insertBefore(label, addPageButton);
  pageElements.push([]);
  total += 1;
  mainContent.firstElementChild.dataset.pages = String(total);
}
function hidePage() {
  for (const elt of pageElements[current]) {
    elt.classList.remove("current");
  }
}
function showPage(i) {
  if (!(i < total && i >= 0)) {
    return;
  }
  hidePage();
  current = i;
  for (const elt of pageElements[current]) {
    elt.classList.add("current");
  }
}
function importElement(elt) {
  const visibilityType = elt.dataset.visibilityType || "always";
  switch (visibilityType) {
    case "only":
      const ind = Number(elt.dataset.visibleOnlyOn || "1");
      while (ind > total) {
        addPage();
      }
      trackElementOnly(elt, ind);
      break;
    case "range":
      const l = Number(elt.dataset.visibleFrom || "1");
      const r = Number(elt.dataset.visibleTo || "1");
      while (l > total) {
        addPage();
      }
      while (r > total) {
        addPage();
      }
      trackElementRange(elt, l, r);
      break;
  }
  for (const child of elt.children) {
    importElement(child);
  }
}
function untrackElement(elt) {
  for (const elts of pageElements) {
    const ind = elts.indexOf(elt);
    if (ind >= 0) {
      elts.splice(ind, 1);
    }
  }
}
function trackElementOnly(elt, i, untrackFirst = true) {
  i -= 1;
  if (!(i < total && i >= 0)) {
    return;
  }
  if (untrackFirst) {
    untrackElement(elt);
  }
  if (!pageElements[i].includes(elt)) {
    pageElements[i].push(elt);
  }
  if (i === current) {
    showPage(i);
  }
}
function trackElementRange(elt, l, r) {
  untrackElement(elt);
  for (let i = l; i <= r; i++) {
    trackElementOnly(elt, i, false);
  }
}
addPageButton.addEventListener("click", () => {
  addPage();
});

// editor/src/toolbars.ts
var typeAttributes = {
  "text": [
    "content",
    "color",
    "bold",
    "italic",
    "underline",
    "size"
  ],
  "paragraph": [
    "line-height",
    "first-line-indent",
    "spacing-above",
    "spacing-below"
  ],
  "container": [
    "layout",
    "padding",
    "border",
    "align"
  ],
  "browserPage": [
    "closable",
    "title",
    "url"
  ],
  "browserLink": [
    "browser",
    "url"
  ],
  "formula": [
    "content"
  ],
  "shortTextInput": [
    "width"
  ],
  "table": [
    "style"
  ],
  "general": [
    "visibility-type",
    "visible-only-on",
    "visible-from",
    "visible-to"
  ]
};
var typeAttributeExtractors = {
  "text": (elt) => ({
    "content": elt.innerText,
    "color": elt.style.color || "black",
    "bold": elt.style.fontWeight === "bold",
    "italic": elt.style.fontStyle === "oblique",
    "underline": elt.style.textDecoration === "underline",
    "size": (elt.style.fontSize || "12pt").slice(0, -2)
  }),
  "paragraph": (elt) => ({
    "line-height": elt.style.lineHeight.slice(0, -1),
    "first-line-indent": elt.style.lineHeight.slice(0, -1),
    "spacing-above": elt.style.marginTop.slice(0, -2),
    "spacing-below": elt.style.marginBottom.slice(0, -2)
  }),
  "container": (elt) => ({
    "layout": elt.dataset.layout,
    "padding": elt.style.padding.slice(0, -2),
    "border": elt.dataset.border,
    "align": elt.dataset.align
  }),
  "formula": (elt) => ({
    "content": elt.dataset.content
  }),
  "shortTextInput": (elt) => ({
    "width": elt.style.width.slice(0, -2)
  }),
  "browserLink": (elt) => ({
    "browser": elt.getAttribute("browser"),
    "url": elt.getAttribute("to")
  }),
  "browserPage": (elt) => ({
    "closable": elt.getAttribute("closable"),
    "title": elt.getAttribute("title"),
    "url": elt.getAttribute("url")
  }),
  "table": (elt) => ({
    "style": elt.dataset.style || "empty"
  }),
  "general": (elt) => {
    const res = {
      "visibility-type": elt.dataset.visibilityType || "always"
    };
    switch (res["visibility-type"]) {
      case "only":
        res["visible-only-on"] = elt.dataset.visibleOnlyOn || "1";
        break;
      case "range":
        res["visible-from"] = elt.dataset.visibleFrom || "1";
        res["visible-to"] = elt.dataset.visibleTo || "1";
        break;
    }
    return res;
  }
};
var toolbarOf = {};
for (const t of Object.keys(typeAttributes)) {
  const obj = {};
  for (const c of typeAttributes[t]) {
    const elt = document.getElementById(`${t}-toolbar-${c}`);
    console.log(t, c);
    obj[c] = {
      element: elt,
      addEventListener: elt.addEventListener,
      set value(value) {
        if (elt.nodeName === "INPUT") {
          const inputElt = elt;
          switch (inputElt.type) {
            case "text":
            case "number":
              inputElt.value = value;
              break;
            case "checkbox":
              inputElt.checked = value;
          }
        }
        if (elt.nodeName === "SELECT" || elt.nodeName === "TEXTAREA") elt.value = value;
        this.setTrigger(value);
      },
      setTrigger(value1) {
      }
    };
  }
  toolbarOf[t] = obj;
}
var toolbars = {
  _elements: {},
  _current: void 0,
  show(realElt) {
    if (this._current) {
      this._current.classList.remove("current");
    }
    const type = realElt.dataset.type;
    if (this._elements[type] === void 0) {
      this._elements[type] = document.getElementById(`${type}-toolbar`);
    }
    this._current = this._elements[type];
    if (type === "browserLink") {
      let traverse = function(elt) {
        if (elt.tagName === "BROWSER-SIM") {
          browsers[elt.dataset.name] = elt.id;
        }
        if (elt.tagName === "BROWSER-PAGE") {
          urls.push(elt.getAttribute("url"));
        }
        for (const c of elt.children) {
          traverse(c);
        }
      };
      const urls = [];
      const browsers = {};
      traverse(mainContent);
      toolbarOf["browserLink"]["url"].element.innerHTML = "";
      toolbarOf["browserLink"]["browser"].element.innerHTML = "";
      for (const url of urls) {
        const elt = document.createElement("option");
        elt.value = url;
        elt.innerText = url;
        toolbarOf["browserLink"]["url"].element.appendChild(elt);
      }
      for (const key of Object.keys(browsers)) {
        const elt = document.createElement("option");
        elt.value = browsers[key];
        elt.innerText = key;
        toolbarOf["browserLink"]["browser"].element.appendChild(elt);
      }
    }
    if (this._current) {
      this._current.classList.add("current");
      const attributes = typeAttributeExtractors[type](realElt);
      for (const attr of Object.keys(attributes)) {
        toolbarOf[type][attr].value = attributes[attr];
      }
      const generalAttributes = typeAttributeExtractors["general"](realElt);
      for (const attr of Object.keys(generalAttributes)) {
        toolbarOf["general"][attr].value = generalAttributes[attr];
      }
    }
  },
  hide() {
    if (this._current) {
      this._current.classlist.remove("current");
      this._current = void 0;
    }
  }
};
function initialize() {
  toolbarOf["general"]["visibility-type"].setTrigger = (value1) => {
    rightPane.dataset.visibilityType = value1;
  };
  toolbarOf["general"]["visibility-type"].element.addEventListener("change", (e) => {
    toolbarOf["general"]["visibility-type"].setTrigger(e.target.value);
    getCurrentRealElement().dataset.visibilityType = e.target.value;
  });
  toolbarOf["general"]["visible-only-on"].element.addEventListener("change", (e) => {
    getCurrentRealElement().dataset.visibleOnlyOn = e.target.value;
    importElement(getCurrentRealElement());
  });
  toolbarOf["general"]["visible-from"].element.addEventListener("change", (e) => {
    getCurrentRealElement().dataset.visibleFrom = e.target.value;
    importElement(getCurrentRealElement());
  });
  toolbarOf["general"]["visible-to"].element.addEventListener("change", (e) => {
    getCurrentRealElement().dataset.visibleTo = e.target.value;
    importElement(getCurrentRealElement());
  });
  toolbarOf["table"]["style"].element.addEventListener("change", (e) => {
    getCurrentRealElement().dataset.style = e.target.value;
  });
  toolbarOf["shortTextInput"]["width"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.width = e.target.value + "ch";
  });
  toolbarOf["formula"]["content"].element.addEventListener("keyup", (e) => {
    getCurrentRealElement().dataset.content = e.target.value;
    const math = MathJax.tex2mml(e.target.value);
    getCurrentRealElement().innerHTML = math;
    getCurrentRealElement().firstChild.setAttribute("display", "inline");
  });
  toolbarOf["browserLink"]["browser"].element.addEventListener("change", (e) => {
    getCurrentRealElement().setAttribute("browser", e.target.value);
  });
  toolbarOf["browserLink"]["url"].element.addEventListener("change", (e) => {
    getCurrentRealElement().setAttribute("to", e.target.value);
  });
  toolbarOf["browserPage"]["closable"].element.addEventListener("change", (e) => {
    getCurrentRealElement().setAttribute("closable", String(e.target.checked));
  });
  toolbarOf["browserPage"]["title"].element.addEventListener("keyup", (e) => {
    getCurrentRealElement().setAttribute("title", e.target.value);
  });
  toolbarOf["browserPage"]["url"].element.addEventListener("keyup", (e) => {
    getCurrentRealElement().setAttribute("url", e.target.value);
  });
  toolbarOf["paragraph"]["line-height"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.lineHeight = e.target.value + "%";
  });
  toolbarOf["paragraph"]["first-line-indent"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.textIndent = e.target.value + "%";
  });
  toolbarOf["paragraph"]["spacing-above"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.marginTop = e.target.value + "rem";
  });
  toolbarOf["paragraph"]["spacing-below"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.marginBottom = e.target.value + "rem";
  });
  toolbarOf["container"]["layout"].element.addEventListener("change", (e) => {
    getCurrentRealElement().dataset.layout = e.target.value;
  });
  toolbarOf["container"]["padding"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.padding = e.target.value + "px";
  });
  toolbarOf["container"]["border"].element.addEventListener("change", (e) => {
    getCurrentRealElement().dataset.border = e.target.value;
  });
  toolbarOf["container"]["align"].element.addEventListener("change", (e) => {
    getCurrentRealElement().dataset.align = e.target.value;
  });
  toolbarOf["text"]["content"].element.addEventListener("keyup", (e) => {
    getCurrentRealElement().innerText = e.target.value;
  }, false);
  toolbarOf["text"]["color"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.color = e.target.value;
  }, false);
  toolbarOf["text"]["bold"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.fontWeight = e.target.checked ? "bold" : "normal";
  }, false);
  toolbarOf["text"]["italic"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.fontStyle = e.target.checked ? "oblique" : "normal";
  }, false);
  toolbarOf["text"]["underline"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.textDecoration = e.target.checked ? "underline" : "none";
  }, false);
  toolbarOf["text"]["size"].element.addEventListener("change", (e) => {
    getCurrentRealElement().style.fontSize = e.target.value + "pt";
  }, false);
}
initialize();

// editor/src/element-manager.ts
var idCounter = 0;
function getNewID() {
  return String(idCounter++);
}
function registerID(elt) {
  const eltId = Number(elt.id);
  if (eltId >= idCounter) idCounter = eltId + 1;
  for (const child of elt.children) {
    registerID(child);
  }
}
function cloneUnique(elt) {
  const res = elt.cloneNode(true);
  function updateIDs(elt2) {
    elt2.id = getNewID();
    for (const child of elt2.children) {
      updateIDs(child);
    }
  }
  updateIDs(res);
  return res;
}
var selectedElement = void 0;
function getCurrentElement() {
  return selectedElement;
}
function deselectElement() {
  if (selectedElement) {
    selectedElement.blur();
    selectedElement.removeAttribute("id");
  }
  selectedElement = void 0;
}
function selectElement(elt) {
  deselectElement();
  selectedElement = elt;
  selectedElement.setAttribute("id", "selected");
}
function handleElementFocus(inspectorElement) {
  selectElement(inspectorElement);
  const realElt = document.getElementById(inspectorElement.dataset.id);
  selectRealElement(realElt);
  toolbars.show(realElt);
}
var selectedRealElement = void 0;
function getCurrentRealElement() {
  return selectedRealElement;
}
function deselectRealElement() {
  if (selectedRealElement) selectedRealElement.classList.remove("selected");
  selectedRealElement = void 0;
}
function selectRealElement(elt) {
  deselectRealElement();
  selectedRealElement = elt;
  selectedRealElement.classList.add("selected");
}

// editor/src/elements/simple-real-element.ts
function simpleRealElement(type, tag, id, name) {
  if (name === void 0) {
    name = `${type}-${id}`;
  }
  const elt = document.createElement(tag);
  elt.id = id;
  elt.dataset.name = name;
  elt.dataset.type = type;
  return elt;
}

// editor/src/elements/container.ts
var container_exports = {};
__export(container_exports, {
  children: () => children,
  parents: () => parents,
  predecessors: () => predecessors,
  realElement: () => realElement,
  successors: () => successors
});
function realElement() {
  return simpleRealElement("container", "div", getNewID());
}
var predecessors = [];
var successors = [];
var parents = [];
var children = [];

// editor/src/elements/paragraph.ts
var paragraph_exports = {};
__export(paragraph_exports, {
  children: () => children2,
  mounted: () => mounted,
  parents: () => parents2,
  predecessors: () => predecessors2,
  realElement: () => realElement2,
  successors: () => successors2
});

// editor/src/quill-manager.ts
var editors = {};
function registerEditor(elt) {
  let parent = elt.parentElement;
  while (parent.id !== "main-content") {
    if (editors[parent.id] !== void 0) return;
    parent = parent.parentElement;
  }
  editors[elt.id] = "1";
  elt.contentEditable = "true";
}

// editor/src/elements/paragraph.ts
function realElement2() {
  const res = simpleRealElement("paragraph", "p", getNewID());
  return res;
}
function mounted(elt) {
  registerEditor(elt);
}
var predecessors2 = [];
var successors2 = [];
var parents2 = [];
var children2 = [
  "text",
  "formula"
];

// editor/src/elements/formula.ts
var formula_exports = {};
__export(formula_exports, {
  children: () => children3,
  parents: () => parents3,
  predecessors: () => predecessors3,
  realElement: () => realElement3,
  successors: () => successors3
});
function realElement3() {
  return simpleRealElement("formula", "span", getNewID());
}
var predecessors3 = [];
var successors3 = [];
var parents3 = [];
var children3 = [];

// editor/src/elements/text.ts
var text_exports = {};
__export(text_exports, {
  children: () => children4,
  mounted: () => mounted2,
  parents: () => parents4,
  predecessors: () => predecessors4,
  realElement: () => realElement4,
  successors: () => successors4
});
function realElement4() {
  const res = simpleRealElement("text", "span", getNewID());
  return res;
}
function mounted2(elt) {
  registerEditor(elt);
}
var predecessors4 = [];
var successors4 = [];
var parents4 = [];
var children4 = [];

// editor/src/elements/short-text-input.ts
var short_text_input_exports = {};
__export(short_text_input_exports, {
  children: () => children5,
  parents: () => parents5,
  predecessors: () => predecessors5,
  realElement: () => realElement5,
  successors: () => successors5
});
function realElement5() {
  const res = document.createElement("input");
  res.type = "text";
  res.id = getNewID();
  res.dataset.name = `short-text-input-${res.id}`;
  res.dataset.type = "short-text-input";
  return res;
}
var predecessors5 = [];
var successors5 = [];
var parents5 = [];
var children5 = [];

// editor/src/elements/multiple-choice-input.ts
var multiple_choice_input_exports = {};
__export(multiple_choice_input_exports, {
  children: () => children6,
  parents: () => parents6,
  predecessors: () => predecessors6,
  realElement: () => realElement6,
  successors: () => successors6
});
function realElement6() {
  const id = getNewID();
  return simpleRealElement("multipleChoiceInput", "ol", id, `multipleChoice-${id}`);
}
var predecessors6 = [];
var successors6 = [];
var parents6 = [];
var children6 = [
  "multipleChoiceItem"
];

// editor/src/elements/multiple-choice-item.ts
var multiple_choice_item_exports = {};
__export(multiple_choice_item_exports, {
  children: () => children7,
  parents: () => parents7,
  predecessors: () => predecessors7,
  realElement: () => realElement7,
  successors: () => successors7
});
function realElement7() {
  const res = document.createElement("li");
  res.dataset.type = "multiple-choice-item";
  res.id = getNewID();
  res.dataset.name = `item-${res.id}`;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = getNewID();
  res.appendChild(checkbox);
  return res;
}
var predecessors7 = [];
var successors7 = [];
var parents7 = [];
var children7 = [
  "multiple-choice-item"
];

// editor/src/elements/browser/sim.ts
var sim_exports = {};
__export(sim_exports, {
  children: () => children8,
  parents: () => parents8,
  predecessors: () => predecessors8,
  realElement: () => realElement8,
  successors: () => successors8
});
function realElement8() {
  return simpleRealElement("browserSim", "browser-sim", getNewID());
}
var predecessors8 = [];
var successors8 = [];
var parents8 = [];
var children8 = [
  "browserPage"
];

// editor/src/elements/browser/page.ts
var page_exports = {};
__export(page_exports, {
  children: () => children9,
  parents: () => parents9,
  predecessors: () => predecessors9,
  realElement: () => realElement9,
  successors: () => successors9
});
function realElement9() {
  const res = simpleRealElement("browserPage", "browser-page", getNewID());
  res.setAttribute("closable", "true");
  return res;
}
var predecessors9 = [];
var successors9 = [];
var parents9 = [];
var children9 = [];

// editor/src/elements/browser/link.ts
var link_exports = {};
__export(link_exports, {
  children: () => children10,
  parents: () => parents10,
  predecessors: () => predecessors10,
  realElement: () => realElement10,
  successors: () => successors10
});
function realElement10() {
  return simpleRealElement("browserLink", "browser-link", getNewID());
}
var predecessors10 = [];
var successors10 = [];
var parents10 = [];
var children10 = [
  "text",
  "image"
];

// editor/src/elements.ts
function realToInspector(elt) {
  const type = elt.dataset.type;
  const id = elt.id;
  const name = elt.dataset.name;
  const children11 = [];
  for (const child of elt.children) {
    const childNode = realToInspector(child);
    if (childNode) {
      if (childNode instanceof HTMLElement) {
        children11.push(childNode);
      } else {
        children11.push(...childNode);
      }
    }
  }
  if (type !== void 0) {
    const resDiv = document.createElement("div");
    resDiv.innerHTML = children11.length === 0 ? `<div class="list" tabindex="0" data-id="${id}" data-type="${type}"><span data-type="${type}">${name}</span></div>` : `<details open class="list" tabindex="0" data-id="${id}" data-type="${type}"><summary data-type="${type}">${name}</summary></details>`;
    const res = resDiv.firstChild;
    for (const child of children11) {
      res.appendChild(child);
    }
    return res;
  } else {
    return children11;
  }
}
var types = {
  container: container_exports,
  paragraph: paragraph_exports,
  formula: formula_exports,
  text: text_exports,
  shortTextInput: short_text_input_exports,
  multipleChoiceInput: multiple_choice_input_exports,
  multipleChoiceItem: multiple_choice_item_exports,
  browserSim: sim_exports,
  browserPage: page_exports,
  browserLink: link_exports,
  table: {
    children: [
      "table-body",
      "table-head",
      "table-foot"
    ],
    realElement() {
      return simpleRealElement("table", "table", getNewID());
    }
  },
  "table-head": {
    children: [
      "table-row"
    ],
    realElement() {
      return simpleRealElement("table-head", "thead", getNewID());
    }
  },
  "table-body": {
    children: [
      "table-row"
    ],
    realElement() {
      return simpleRealElement("table-body", "tbody", getNewID());
    }
  },
  "table-foot": {
    children: [
      "table-row"
    ],
    realElement() {
      return simpleRealElement("table-foot", "tfoot", getNewID());
    }
  },
  "table-row": {
    children: [
      "table-data"
    ],
    realElement() {
      const id = getNewID();
      return simpleRealElement("table-row", "tr", id, `row-${id}`);
    }
  },
  "table-data": {
    children: [],
    realElement() {
      const id = getNewID();
      return simpleRealElement("table-data", "td", id, `cell-${id}`);
    }
  }
};
console.log(types);

// editor/src/grading.ts
var extractors = {
  "multipleChoiceInput": (e) => {
    const res = {
      options: [],
      correct: []
    };
    for (const child of e.children) {
      const checkbox = child.children[0];
      res.options.push(checkbox.id);
      res.correct.push(checkbox.checked);
    }
    return res;
  },
  "shortTextInput": (e) => {
    const res = {
      correct: e.value
    };
    return res;
  }
};
var currentScheme = void 0;
function parse(e) {
  if (e.dataset.type !== void 0 && extractors[e.dataset.type] !== void 0) {
    const extractor = extractors[e.dataset.type];
    currentScheme[e.id] = extractor(e);
    return;
  }
  for (const child of e.children) {
    parse(child);
  }
}
function getCurrentScheme() {
  currentScheme = {};
  parse(mainContent);
  return currentScheme;
}

// editor/src/files.ts
var testManager = {
  testName: void 0,
  // Returns an object containing the HTML as a string,
  // and the grading scheme (correct answers) as a string
  addInteraction(id) {
  },
  export() {
    const removeDynamicAttributes = (e) => {
      e.classList.remove("current");
      if (e.className === "") {
        e.removeAttribute("class");
      }
      for (const c of e.children) {
        removeDynamicAttributes(c);
      }
    };
    const elt = mainContent.cloneNode(true);
    removeDynamicAttributes(elt);
    const html = elt.innerHTML.trim().replaceAll(/[\s\t][\s\t]+/g, "");
    const gradingScheme = getCurrentScheme();
    localStorage.setItem("test", JSON.stringify({
      html,
      gradingScheme
    }));
    return {
      html,
      gradingScheme
    };
  },
  load({ content, gradingScheme }) {
    const obj = JSON.parse(window.localStorage.getItem("test"));
    content = obj.html;
    gradingScheme = obj.gradingScheme;
    mainContent.innerHTML = content;
    registerID(mainContent.firstChild);
    for (const id of Object.keys(gradingScheme)) {
      document.getElementById(id).value = gradingScheme[id].correct;
    }
    treeView.innerHTML = "";
    treeView.appendChild(realToInspector(mainContent.firstElementChild));
    importElement(mainContent.firstElementChild);
  },
  changeName(newName) {
  }
};
document.getElementById("load-test").addEventListener("click", (e) => {
  testManager.load({});
});
document.getElementById("save-test").addEventListener("click", (e) => {
  testManager.export();
});

// editor/script.ts
var activeAction = void 0;
var copyBuffer = void 0;
function initialize2() {
  const type = "container";
  const elt = types[type].realElement();
  mainContent.appendChild(elt);
  treeView.appendChild(realToInspector(elt));
  let shouldToggle = false;
  treeView.addEventListener("click", (e) => {
    if (getCurrentElement() === void 0) return;
    if (!getCurrentElement().contains(e.target)) {
      deselectElement();
    }
    if (!shouldToggle) {
      e.preventDefault();
    }
    shouldToggle = true;
  }, true);
  treeView.addEventListener("contextmenu", (e) => {
    const etarget = e.target;
    e.preventDefault();
    if (etarget.classList.contains("list")) selectElement(etarget);
    else if (etarget.parentElement.classList.contains("list")) selectElement(etarget.parentElement);
    else return;
    e.stopPropagation();
    const options = [
      "rcm-add-child",
      "rcm-add-sibbling",
      "rcm-copy",
      "rcm-delete",
      "rcm-rename"
    ];
    if (copyBuffer !== void 0) {
      options.push("rcm-paste-child");
      options.push("rcm-paste-above");
    }
    openMenuWithOptions(Menu.rightClick, options, etarget);
  }, true);
  treeView.addEventListener("focus", (e) => {
    let elt2 = e.target;
    if (!elt2.classList.contains("list")) elt2 = elt2.parentElement;
    if (!elt2.classList.contains("list")) return;
    handleElementFocus(elt2);
    shouldToggle = false;
  }, true);
  document.getElementById("rcm-add-child").addEventListener("click", (e) => {
    activeAction = addAChild;
    const options = types[getCurrentElement().dataset.type].children;
    openMenuWithOptions(Menu.element, options, e.target);
  }, false);
  document.getElementById("rcm-add-sibbling").addEventListener("click", (e) => {
    activeAction = addASibbling;
    const options = types[getCurrentElement().parentElement.dataset.type].children;
    openMenuWithOptions(Menu.element, options, e.target);
  }, false);
  document.getElementById("rcm-copy").addEventListener("click", (e) => {
    let dataId = getCurrentElement().dataset.id;
    copyBuffer = document.getElementById(dataId);
    hideMenus();
  }, false);
  document.getElementById("rcm-paste-child").addEventListener("click", (e) => {
    const elt2 = cloneUnique(copyBuffer);
    getCurrentRealElement().appendChild(elt2);
    getCurrentElement().parentElement.replaceChild(realToInspector(getCurrentRealElement()), getCurrentElement());
    hideMenus();
  }, false);
  document.getElementById("rcm-paste-above").addEventListener("click", (e) => {
    const elt2 = cloneUnique(copyBuffer);
    getCurrentRealElement().parentElement.insertBefore(elt2, getCurrentRealElement());
    const parentInspectorElement = realToInspector(getCurrentRealElement().parentElement);
    getCurrentElement().parentElement.parentElement.replaceChild(parentInspectorElement, getCurrentElement().parentElement);
    hideMenus();
  }, false);
  document.getElementById("rcm-delete").addEventListener("click", (e) => {
    let dataId = getCurrentElement().dataset.id;
    getCurrentElement().remove();
    deselectElement();
    document.getElementById(dataId).remove();
    hideMenus();
  }, false);
  document.getElementById("rcm-rename").addEventListener("click", (e) => {
    let dataId = getCurrentElement().dataset.id;
    const oldSpan = getCurrentElement().firstChild;
    const spanContent = oldSpan.innerText;
    const newTextInput = document.createElement("input");
    newTextInput.type = "text";
    newTextInput.value = spanContent;
    getCurrentElement().insertBefore(newTextInput, oldSpan);
    oldSpan.remove();
    newTextInput.focus();
    newTextInput.addEventListener("blur", (e2) => {
      if (!newTextInput.contains(e2.relatedTarget)) {
        oldSpan.innerText = newTextInput.value;
        document.getElementById(dataId).dataset.name = newTextInput.value;
        getCurrentElement().insertBefore(oldSpan, newTextInput);
        newTextInput.remove();
      }
    });
    newTextInput.addEventListener("click", (e2) => {
      e2.stopPropagation();
    });
    newTextInput.addEventListener("keyup", (e2) => {
      if (e2.key === "Enter" || e2.key === "Escape") {
        newTextInput.blur();
      }
    });
    oldSpan.remove();
  }, false);
  for (const type2 of Object.keys(types)) {
    const elt2 = document.getElementById(type2);
    if (elt2) {
      elt2.addEventListener("click", (e) => {
        activeAction(getCurrentElement(), type2);
        deselectElement();
      });
    }
  }
  addPage();
}
initialize2();
function addAChild(target, type) {
  const parentId = target.dataset.id;
  const parentElement_real = document.getElementById(parentId);
  const elt_real = types[type].realElement();
  parentElement_real.appendChild(elt_real);
  if (types[type].mounted) types[type].mounted(elt_real);
  target.parentElement.replaceChild(realToInspector(parentElement_real), target);
}
function addASibbling(target, type) {
  const siblingId = target.dataset.id;
  const siblingElement = document.getElementById(siblingId);
  const parentElement = siblingElement.parentElement;
  const elt_real = types[type].realElement();
  parentElement.insertBefore(elt_real, siblingElement);
  if (types[type].mounted) types[type].mounted(elt_real);
  target.parentElement.insertBefore(realToInspector(elt_real), target);
}
