import "../styles/index.less";

class ResponsiveImageMap {
	constructor(map, img, width) {
		this.img = img;
		this.originalWidth = width;
		this.areas = [];

		for (const area of map.getElementsByTagName('area')) {
			this.areas.push({
				element: area,
				originalCoords: area.coords.split(',')
			});
		}

		window.addEventListener('resize', e => this.resize(e));
		this.resize();
	}

	resize() {
		const ratio = this.img.offsetWidth / this.originalWidth;

		for (const area of this.areas) {
			const newCoords = [];
			for (const originalCoord of area.originalCoords) {
				newCoords.push(Math.round(originalCoord * ratio));
			}
			area.element.coords = newCoords.join(',');
		}

		return true;
	};
}

function addListener (selector, event, listener) {
	const elements = document.querySelectorAll(selector);
	const elementsCount = elements.length;

	for (let i = 0; i < elementsCount; i++) {
		elements[i].addEventListener(event, listener);
	}
}

function modifyAttribute (selector, attribute, newData) {
	const elements = document.querySelectorAll(selector);
	const elementsCount = elements.length;

	for (let i = 0; i < elementsCount; i++) {
		elements[i].setAttribute(attribute, newData);
	}
}

function modifyStyle (selector, newStyle) {
	modifyAttribute(selector, "style", newStyle);
}

function modifyClass (selector, newClass) {
	modifyAttribute(selector, "class", newClass);
}

function toggleClass (selector, className) {
	const elements = document.querySelectorAll(selector);
	const elementsCount = elements.length;

	for (let i = 0; i < elementsCount; i++) {
		elements[i].classList.toggle(className);
	}
}

function sendData (formData, onSuccess, onError) {
	let xhr = new XMLHttpRequest();

	xhr.open("POST", `/ajax.php`);

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200 && xhr.response === "success") {
			if (typeof onSuccess === "function") {
				onSuccess();
			}
		} else if (xhr.readyState === 4 && typeof onError === "function") {
			onError(xhr);
		}
	};

	xhr.send(formData);
}

const emailRegexp = /^[^@\s]*[^.@\s]@[^.@\s]+(?:\.[^.@\s]+)*$/;

function validateFormField (field) {
	const isFieldValid = !((field.value === "") || (field.type === "email" && !emailRegexp.test(field.value)));
	const isFieldHasError = !!~field.className.indexOf("field-error");

	if ((isFieldValid && isFieldHasError) || (!isFieldValid && !isFieldHasError)) {
		field.classList.toggle("field-error");
	}

	return isFieldValid;
}

function validateFormFields (fields) {
	const fieldsCount = fields.length;
	let isFieldsValid = true;

	for (let i = 0; i < fieldsCount; i++) {
		if (!validateFormField(fields[i])) {
			isFieldsValid = false;
		}
	}

	return isFieldsValid;
}

document.addEventListener("DOMContentLoaded", function () {
	const map = document.getElementById('idx-head-img-hidden-map');
	const image = document.getElementById('idx-head-img-hidden');
	if (map && image) {
		new ResponsiveImageMap(map, image, 1920);
	}

	addListener(".top-menu__hamburger", "click", function () {
		modifyStyle(".top-menu-mobile", "display: block;");
	});
	addListener(".top-menu-mobile__closer", "click", function () {
		modifyStyle(".top-menu-mobile", "display: none;");
	});

	addListener(".tabs__title", "click", function (e) {
		const dataTab = e.currentTarget.getAttribute("data-tab");

		toggleClass(".tabs__title_active", "tabs__title_active");
		toggleClass(".tabs__tab_active", "tabs__tab_active");

		toggleClass(`.tabs__title[data-tab="${dataTab}"]`, "tabs__title_active");
		toggleClass(`.tabs__tab[data-tab="${dataTab}"]`, "tabs__tab_active");
	});

	addListener(".tabs__toggle", "click", function (e) {
		const tabsToggle = e.currentTarget;

		let toggleStyle = "";

		if (tabsToggle.getAttribute("style") === "") {
			toggleStyle = "transform: rotate(0deg);";
		}

		tabsToggle.setAttribute("style", toggleStyle);
		toggleClass(".tabs__title", "tabs__title_opened");
	});

	addListener(".map-toggler", "click", function (e) {
		const dataMap = e.currentTarget.getAttribute("data-map");
		const togglerClass = e.currentTarget.getAttribute("class");

		if (togglerClass === "map-toggler") {
			const togglerLabel = document.querySelector(`.map-toggler[data-map="${dataMap}"] .map-toggler__label`);

			togglerLabel.innerText = "Показать карту";
			modifyClass(`.map-toggler[data-map="${dataMap}"]`, "map-toggler_inactive");
			modifyClass(`.map[data-map="${dataMap}"]`, "map_closed");
		} else {
			const togglerLabel = document.querySelector(`.map-toggler_inactive[data-map="${dataMap}"] .map-toggler__label`);

			togglerLabel.innerText = "Скрыть карту";
			modifyClass(`.map-toggler_inactive[data-map="${dataMap}"]`, "map-toggler");
			modifyClass(`.map_closed[data-map="${dataMap}"]`, "map");
		}
	});

	const indexImages = ["electric", "water", "trifle", "heat"];
	let activeSubImage;
	let indexImagesTimeout;
	let additionalIndexImagesTimeout;

	for (let i = 0; i < 4; i++) {
		addListener(`#house-${indexImages[i]}`, "mouseover", function () {
			const newActiveSubImage = `idx-head-img-${indexImages[i]}`;
			if (indexImagesTimeout) {
				clearTimeout(indexImagesTimeout);
			}

			if (additionalIndexImagesTimeout) {
				clearTimeout(additionalIndexImagesTimeout);
			}

			if (activeSubImage) {
				additionalIndexImagesTimeout = setTimeout(function () {
					const mainHeaderSubImages = document.querySelectorAll(
						".main-header__sub-image"
					);
					const mainHeaderSubImagesCount =  mainHeaderSubImages.length;

					for (let j = 0; j < mainHeaderSubImagesCount; j++) {
						const image = mainHeaderSubImages[j];

						if (image.id !== newActiveSubImage) {
							image.setAttribute("style", "");
						}
					}
				}, 150);
			}

			activeSubImage = `#${newActiveSubImage}`;
			modifyStyle(activeSubImage, "opacity: 1; z-index: -1;");
		});

		addListener(`#house-${indexImages[i]}`, "mouseout", function () {
			modifyStyle(`#idx-head-img-${indexImages[i]}`, "opacity: 1;");

			indexImagesTimeout = setTimeout(function() {
				modifyStyle(`#idx-head-img-${indexImages[i]}`, "");
				activeSubImage = undefined;
			}, 50);
		});
	}

	addListener(".main-header__head-area", "click", function (e) {
		e.preventDefault();

		return false;
	});

	addListener(".browser__item-img", "mouseover", function (e) {
		e.currentTarget.setAttribute("style", "opacity: 0;");
	});

	addListener(".browser__item-img", "mouseout", function (e) {
		e.currentTarget.setAttribute("style", "opacity: 1;");
	});

	const convenienceButtons = [
		".main-convenience__prev",
		".main-convenience__next",
		"#browser__control_bwd",
		"#browser__control_fwd"
	];

	function browserButtonListener (e) {
		const currentImage = document.querySelector(".browser__item_active");

		if (currentImage) {
			const dataItemsCount = parseInt(
				currentImage.parentElement.getAttribute("data-items-count"),
				10
			);
			const dataIndex = parseInt(
				currentImage.getAttribute("data-index"),
				10
			);
			const dataBrowserDirection = e.currentTarget.getAttribute(
				"data-browser-direction"
			);
			let nextItemIndex;

			currentImage.setAttribute("class", "browser__item");

			if (dataBrowserDirection === "prev" && dataIndex === 1) {
				nextItemIndex = dataItemsCount;
			} else if (dataBrowserDirection === "next" && dataIndex === dataItemsCount) {
				nextItemIndex = 1;
			} else if (dataBrowserDirection === "prev") {
				nextItemIndex = dataIndex - 1;
			} else {
				nextItemIndex = dataIndex + 1;
			}

			modifyClass(
				`.browser__item[data-index="${nextItemIndex}"]`,
				"browser__item browser__item_active"
			);
		} else {
			modifyClass(
				'.browser__item[data-index="1"]',
				"browser__item browser__item_active"
			);
		}
	}

	for (let i = 0; i < 4; i++) {
		addListener(convenienceButtons[i], "click", browserButtonListener);
	}

	addListener(".modal-opener", "click", function (e) {
		const dataModal = e.currentTarget.getAttribute("data-modal");

		e.preventDefault();

		modifyAttribute(".modal__overlay", "data-modal-active", dataModal);
		modifyStyle(".modal__overlay", "display: block;");
		modifyStyle(`#modal-${dataModal}`, "display: block;");
		modifyStyle("html", "overflow: hidden;");
		setTimeout(function () {
			modifyStyle(".modal__overlay", "display: block; opacity: 1;");

			setTimeout(function () {
				modifyStyle(
					`#modal-${dataModal}`,
					"display: block; opacity: 1; margin-top: 80px;"
				);
			}, 100);
		}, 50);
	});

	addListener(".modal-close, .modal__overlay", "click", function(e) {
		e.preventDefault();

		if (e.target === e.currentTarget) {
			modifyAttribute(".modal__overlay", "data-modal-active", "");

			modifyStyle(".modal", "display: block;");
			modifyStyle(".modal__overlay", "display: block;");
			modifyStyle("html", "");

			setTimeout(function () {
				modifyStyle(".modal__overlay", "");
				modifyStyle(".modal", "");
			}, 350);
		}
	});

	addListener("form button", "click", function (e) {
		e.preventDefault();
		const form = e.currentTarget.parentElement;

		if (form) {
			const fields = form.querySelectorAll("input, textarea");
			const fieldsCount = fields.length;
			let formData = new FormData(form);

			if (validateFormFields(fields)) {
				// for (let i = 0; i < fieldsCount; i++) {
				// 	const field = fields[i];
				//
				// 	data[field.name] = field.value;
				// }

				sendData(
					formData,
					function () {
						const modalOverlay = document.querySelector(".modal__overlay");
						const successModal = form.getAttribute("data-success-modal");
						const activeModal = modalOverlay.getAttribute("data-modal-active");

						if (activeModal === "") {
							modifyAttribute(".modal__overlay", "data-modal-active", activeModal);
							modifyStyle(".modal__overlay", "display: block;");
						}

						modifyAttribute(".modal__overlay", "data-modal-active", `${successModal}-success`);
						modifyStyle(`#modal-${activeModal}`, "display: block;");
						modifyStyle(`#modal-${successModal}-success`, "display: block");

						setTimeout(function () {
							if (activeModal === "") {
								modifyStyle(".modal__overlay", "display: block; opacity: 1;");

								setTimeout(function () {
									modifyStyle(
										`#modal-${successModal}-success`,
										"display: block; opacity: 1; margin-top: 80px;"
									);

									for (let i = 0; i < fieldsCount; i++) {
										fields[i].value = "";
									}
								}, 100);
							} else {
								modifyStyle(
									`#modal-${successModal}-success`,
									"display: block; opacity: 1; margin-top: 80px"
								);

								setTimeout(function () {
									modifyStyle(`#modal-${activeModal}`, "");

									for (let i = 0; i < fieldsCount; i++) {
										fields[i].value = "";
									}
								}, 150);
							}
						}, 50);
					},
					function () {
						const modalOverlay = document.querySelector(".modal__overlay");
						const activeModal = modalOverlay.getAttribute("data-modal-active");

						if (activeModal === "") {
							modifyAttribute(".modal__overlay", "data-modal-active", activeModal);
							modifyStyle(".modal__overlay", "display: block;");
						}

						modifyAttribute(".modal__overlay", "data-modal-active", "error");
						modifyStyle(`#modal-${activeModal}`, "display: block;");
						modifyStyle("#modal-error", "display: block");

						setTimeout(function () {
							if (activeModal === "") {
								modifyStyle(".modal__overlay", "display: block; opacity: 1;");

								setTimeout(function () {
									modifyStyle("#modal-error", "display: block; opacity: 1; margin-top: 80px;");
								}, 100);
							} else {
								modifyStyle("#modal-error", "display: block; opacity: 1; margin-top: 80px;");

								setTimeout(function () {
									modifyStyle(`#modal-${activeModal}`, "");
								}, 150);
							}
						}, 50);
					}
				);
			}
		}
	});

	function onFieldChange (checkError) {
		return function (e) {
			if (!checkError || (checkError && ~e.currentTarget.className.indexOf("field-error"))) {
				validateFormField(e.currentTarget);
			}
		};
	}

	addListener("form input", "input", onFieldChange(true));
	addListener("form textarea", "input", onFieldChange(true));

	addListener("form input", "blur", onFieldChange(false));
	addListener("form textarea", "blur", onFieldChange(false));
});

window.addEventListener("load", function () {
	try {
		if (~window.location.pathname.indexOf("contacts") && mapboxgl) {
			mapboxgl.accessToken = "pk.eyJ1IjoiZy1sb3ciLCJhIjoiY2s3dm04bXFlMWhxdTNmb3VtMXlhY3R1cSJ9.R9mCaJunsJ0D8Z1YlE0oJQ";
			var mapNizhnekamsk = new mapboxgl.Map({
				container: "map__nizhnekamsk",
				style: "mapbox://styles/mapbox/dark-v10",
				center: [51.81863, 55.65006],
				zoom: 15
			});
			new mapboxgl.Marker(document.getElementById("map-marker__nizhnekamsk"))
				.setLngLat([51.81863, 55.65006])
				.addTo(mapNizhnekamsk);
			var mapInnopolis = new mapboxgl.Map({
				container: "map_innopolis",
				style: "mapbox://styles/mapbox/dark-v10",
				center: [48.75181, 55.75237],
				zoom: 15
			});
			new mapboxgl.Marker(document.getElementById("map-marker__innopolis"))
				.setLngLat([48.75181, 55.75237])
				.addTo(mapInnopolis);
			document
				.getElementById("map-toggler__innopolis")
				.appendChild(document.getElementById("map_innopolis"));
		}
	} catch (e) {
		console.log(e);
	}
});