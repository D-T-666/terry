var s={current:void 0,total:void 0,container:void 0,elementsOfPage:void 0,pageRadio:void 0,init({total:t,container:e}){this.total=t,this.container=e,this.elementsOfPage=[],this.pageRadio=[];for(let r=0;r<this.total;r++){let n=document.createElement("input");n.type="radio",n.name="current-page",n.addEventListener("change",i=>{i.target.checked&&(this.hidePage(),this.showPage(r))}),this.pageRadio.push(n);let a=document.createElement("label");a.innerText=r+1,a.appendChild(n),this.container.appendChild(a),this.elementsOfPage.push([])}},hidePage(){for(let t of this.elementsOfPage[this.current])t.classList.remove("current")},showPage(t){this.current=t,this.pageRadio[t].checked=!0;for(let e of this.elementsOfPage[this.current])e.classList.add("current","visited")},registerElement(t){switch(t.dataset.visibilityType||"always"){case"only":let r=Number(t.dataset.visibleOnlyOn);this.trackElementOnly(t,r);break;case"range":let n=Number(t.dataset.visibleFrom),a=Number(t.dataset.visibleTo);this.trackElementRange(t,n,a);break}for(let r of t.children)this.registerElement(r)},untrackElement(t){for(let e of this.elementsOfPage){let r=e.indexOf(t);r>=0&&e.splice(r,1)}},trackElementOnly(t,e,r=!0){this.untrackElement(t),this.elementsOfPage[e-1].push(t)},trackElementRange(t,e,r){this.untrackElement(t);for(let n=e;n<=r;n++)this.elementsOfPage[n-1].push(t)}};var v=`
div.browser-sim-container {
	&:has(.tab) .header {
		box-sizing: border-box;

		& .tabs {
			padding: 3px 3px 0 3px;

			& .tab {
				padding: 4px 10px;
				background: white;
				box-sizing: border-box;
				display: inline-block;
				border-radius: 4px 4px 0 0;
				position: relative;

				& button {
					background: none;
					border: none;
					padding: 0;

					& + & {
						margin-left: 6px;
						color: gray;

						&:hover {
							color: black;
						}
					}
				}

				&.current {
					background-color: #ddd;
				}

				&:not(.current) {
					&+&::before {
						content: "";
						display: block;
						position: absolute;
						width: 1px;
						height: 1.4rem;
						background-color: #ddd;
						left: 0;
						top: 4px;
					}

					&:hover {
						background-color: #eee;
					}
				}
			}
		}

		& .url {
			background-color: white;
			border: 3px solid #ddd;
			margin-bottom: 0;
			padding: 2px 0.5rem;
		}
	}

	&:has(.tab) .pages {
		aspect-ratio: 16 / 9;
	}

	&:not(:has(.tab)) .pages {
		&::before {
			display: block;
			content: "browser";
			color: gray;
			width: fit-content;
			margin: auto;
		}
	}

	& .pages {
		overflow-y: auto;

		& browser-page {
			padding: 10px;
			display: block;
			position: relative;
			box-sizing: border-box;

			&:not(.current) {
				display: none;
			}
		}
	}
}

browser-link {
	color: blue;
	cursor: pointer;
	text-decoration: underline;
}
`,c=class extends HTMLElement{constructor(){super()}connectedCallback(){let e=this.attachShadow({mode:"closed"}),r=new CSSStyleSheet;r.replaceSync(v),e.adoptedStyleSheets=[r],this.tabs=document.createElement("div"),this.tabs.classList.add("tabs"),this.urlBar=document.createElement("div"),this.urlBar.classList.add("url");let n=document.createElement("div");n.classList.add("header"),n.append(this.tabs,this.urlBar),this.pages=document.createElement("div"),this.pages.classList.add("pages"),this.pages.innerHTML=this.innerHTML,this.innerHTML="";let a=document.createElement("div");a.classList.add("browser-sim-container"),a.append(n,this.pages),e.append(a),this.pagesByURL={};for(let o of this.pages.children)this.pagesByURL[o.getAttribute("url")]=o;this.visibleTabs={},this.currentPageUrl=void 0;let i=!0;for(let o of this.pages.children)o.getAttribute("visible")!==null&&(this.createTab(o.getAttribute("url")),i&&(this.showPage(o.getAttribute("url")),i=!1))}showPage(e){this.currentPageUrl!==void 0&&(this.pagesByURL[this.currentPageUrl].classList.remove("current"),this.visibleTabs[this.currentPageUrl]&&this.visibleTabs[this.currentPageUrl].classList.remove("current")),this.pagesByURL[e].classList.add("current"),this.visibleTabs[e]===void 0&&this.createTab(e),this.visibleTabs[e].classList.add("current"),this.urlBar.innerText=`https://${e}`,this.currentPageUrl=e}createTab(e){let r=document.createElement("span");r.classList.add("tab");let n=document.createElement("button");if(n.innerText=this.pagesByURL[e].getAttribute("title"),n.addEventListener("click",a=>this.showPage(e)),r.appendChild(n),this.pagesByURL[e].getAttribute("nonclosable")===null){let a=document.createElement("button");a.innerHTML="&#10005;",a.addEventListener("click",i=>{if(this.visibleTabs[e].remove(),delete this.visibleTabs[e],this.currentPageUrl===e&&(this.pagesByURL[e].classList.remove("current"),this.currentPageUrl=void 0,this.urlBar.innerText="",Object.keys(this.visibleTabs).length>0)){let o=Object.keys(this.visibleTabs)[0];this.showPage(o)}}),r.appendChild(a)}this.tabs.appendChild(r),this.visibleTabs[e]=r}},g=class extends HTMLElement{constructor(){super(),this.addEventListener("click",this.click)}connectedCallback(){let e=this.getAttribute("browser");if(e!==null)this.targetBrowser=document.getElementById(e);else{let r=this;for(;r.parentElement;)if(r=r.parentElement,r.tagName==="BROWSER-SIM"){this.targetBrowser=r;break}}}click(e){this.targetBrowser.showPage(this.getAttribute("url")),this.targetBrowser.scrollIntoView({block:"nearest",behavior:"smooth"})}},p=class extends HTMLElement{constructor(){super()}};customElements.define("browser-sim",c);customElements.define("browser-link",g);customElements.define("browser-page",p);function u(){let t=localStorage.getItem("authToken");return t?{Authorization:`Bearer ${t}`}:{}}var l=class extends Error{};var b="https://terryapi.dimitri.ge/api";async function m(t){let e=await fetch(`${b}/test/${t}`,{headers:u()});if(!e.ok){if(e.status===401)throw new l;{let n=JSON.stringify(await e.json());throw new Error(n)}}let r=await e.json();return{id:t,...r}}var d;async function f(t){if(t!==void 0)try{return d=await m(t),d}catch(r){console.log(r)}let e=localStorage.getItem("currentFile");return e!=null?d=JSON.parse(e):d={content:'<div data-type="container" data-name="\u10DB\u10D7\u10D0\u10D5\u10D0\u10E0\u10D8 \u10D9\u10DD\u10DC\u10E2\u10D4\u10D8\u10DC\u10D4\u10E0\u10D8" id="0" data-pages="1"></div>'},d}var h=document.getElementById("main-content"),T=document.getElementById("page-controls"),E=document.getElementById("test-name"),x=document.getElementById("go-back"),L=window.location.search,k=new URLSearchParams(L),y=k.get("id"),w=k.get("page");if(y!==void 0){let{name:t,content:e}=await f(y);h.innerHTML=e,E.textContent=t,s.init({total:h.firstChild.dataset.pages,container:T}),s.registerElement(h.firstElementChild),s.showPage(0),w?s.showPage(Number(w)-1):x.remove()}x.addEventListener("click",()=>(window.history.go(-1),!1));
