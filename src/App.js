// Importing necessary libraries and components
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import OmegaMenu from "./components/OmegaMenu";
import "./App.scss";

function App() {
	/**
	 * In Old version there was no dark mode so if
	 * dataset.theme is undefined then the website
	 * is running in old ui mode is what we are
	 * assuming...
	 */
	// Defining app constants and initializing state variables
	const isOldVersion = document.querySelector("html").dataset.theme ? false : true;
	const [state, setState] = useState({
		AppConstants: {
			menuJsPath: isOldVersion
				? "div > div > div > div > div > div#navbar-right-container"
				: "#__next > div > div > div > nav > div > div > div.relative.ml-4.flex.items-center.space-x-4",
			companyTagsContainerJsPath: isOldVersion
				? "div > div > div.main__2_tD > div > div > div > div > div > div > div > div[data-key] > div"
				: "#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div",
			leaveAReviewHref:
				"https://docs.google.com/forms/d/e/1FAIpQLSeqvQfMq-3cNwTIctizWmHS84HysDYPRHqPHA8sp5wrDWd5Jw/viewform",
			githubRepoHref: "https://github.com/codedecks-in/Big-Omega-Extension",
			donateHref: "https://imjo.in/FjaHaV"
		},
		problemSlug: window.location.pathname.split("/")[2],
		isMenuOpen: true,
		theme: isOldVersion ? "light" : document.querySelector("html").dataset.theme
	});
	
	// Initializing state variable with a reference to observe theme changes
	const themeObserverRef = useRef();

	useEffect(() => {
		// window.addEventListener("api-res", (event) => {
		// 	if (event.detail.contentScriptQuery === "getTours") {
		// 		if (event.detail.status === 200) {
		// 			setState((prevState) => ({ ...prevState, savedScreenContent: event.detail.data }));
		// 		}
		// 	}
		// });
	
		// Listening to API response
		// Observing theme changes
		// Adding omega menu to the page if problem slug is present
		
		observeTheme();

		if (state.problemSlug !== "") {
			let interval = setInterval(() => {
				let btns = document.querySelector(state.AppConstants.menuJsPath);
				if (document.body && btns) {
					handleInsertOmegaMenu(btns);
					clearInterval(interval);
				}
			}, 1000);
		}
	}, [state.problemSlug]);

	useEffect(() => {
		// Handling URL change
		handleURLChange();
		window.onurlchange = (event) => {
			// e.g. /problems/flip-string-to-monotone-increasing/
			let problem = window.location.pathname.split("/")[2];
			let theme = isOldVersion ? "light" : document.querySelector("html").dataset.theme;
			setState((prevState) => ({
				...prevState,
				problemSlug: problem,
				theme: theme,
				isMenuOpen: false
			}));
		};
	}, []);

	useEffect(() => {
		// Adding omega menu to the page if theme is changed
		let btns = document.querySelector(state.AppConstants.menuJsPath);
		if (document.body && btns) {
			handleInsertOmegaMenu(btns);
		}
	}, [state.theme]);
	
	// Observing theme changes
	const observeTheme = () => {
		// Code for observing theme changes
		if (!themeObserverRef.current) {
			console.log("inside theme observer");
			themeObserverRef.current = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === "attributes") {
						let theme = isOldVersion ? "light" : document.querySelector("html").dataset.theme;
						setState((prevState) => ({
							...prevState,
							theme: theme
						}));
					}
				});
			});

			themeObserverRef.current.observe(window.document.querySelector("html"), {
				attributes: true //configure it to listen to attribute changes
			});
		}
	};
	
	// Handling URL change
	const handleURLChange = () => {
			
		// Code for handling URL change
		const hasNativeEvent = Object.keys(window).includes("onurlchange");
		if (!hasNativeEvent) {
			let oldURL = window.location.href;
			setInterval(() => {
				const newURL = window.location.href;
				if (oldURL === newURL) {
					return;
				}
				const urlChangeEvent = new CustomEvent("urlchange", {
					detail: {
						oldURL,
						newURL
					}
				});
				oldURL = newURL;
				dispatchEvent(urlChangeEvent);
			}, 25);
			window.addEventListener("urlchange", (event) => {
				if (typeof onurlchange === "function") {
					window.onurlchange(event);
				}
			});
		}
	};
	
	// Adding omega menu to the page
	const handleInsertOmegaMenu = (menuBtns) => {
		// Code for adding omega menu
		let oldMenus = document.querySelectorAll("#big-omega-menu-wrapper");
		if (oldMenus.length > 0) {
			Array.from(oldMenus).forEach((elem) => elem.remove());
		}

		let dummyElem = document.createElement("div");
		dummyElem.id = "big-omega-menu-wrapper";

		if (menuBtns) {
			menuBtns.appendChild(dummyElem);
			ReactDOM.render(
				<OmegaMenu
					problemSlug={state.problemSlug}
					isMenuOpen={state.isMenuOpen}
					theme={state.theme}
					isOldVersion={isOldVersion}
					AppConstants={state.AppConstants}
				/>,
				dummyElem
			);
		}
	};

	// const APICallingLogic = (tourContent) => {
	// 	let reqOptions = {
	// 		method: "DELETE",
	// 		headers: {
	// 			"Content-Type": "application/json"
	// 		}
	// 	};
	// 	window.dispatchEvent(
	// 		new CustomEvent("api-req", {
	// 			detail: {
	// 				contentScriptQuery: "deleteTour",
	// 				reqOptions: reqOptions,
	// 				url: `${process.env.REACT_APP_BASE_URL}/v1/api/tour?token=` + state.token + "&tourId=" + tourContent.id
	// 			}
	// 		})
	// 	);
	// };
	// Rendering the app
	return <div></div>;
}

export default App;
