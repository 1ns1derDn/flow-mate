//@ts-ignore
import WOW from "wow.js"

export function initBurger() {
	const burger = document.querySelector(".js-burger")

	if (burger) {
		burger.addEventListener("click", function (this: HTMLElement) {
			const body = this.closest("body")
			if (!body) return
			body.classList.toggle("header--active")
		})
	}
}

export function initTabs() {
	const tabButtons = document.querySelectorAll(".tabs__button")

	if (tabButtons) {
		tabButtons.forEach((tabButton) => {
			tabButton.addEventListener("click", function (this: HTMLElement) {
				tabButtons.forEach((item) => item.classList.remove("tabs__button--active"))
				this.classList.add("tabs__button--active")
				const tabs = this.closest(".tabs")
				if (!tabs) return
				const tabsImages = tabs.querySelectorAll<HTMLElement>(".tabs__contents-image")
				tabsImages.forEach((item) => item.classList.remove("tabs__contents-image--active"))
				const tabsContentId = this.dataset.contentTab
				tabsImages.forEach((item) =>
					tabsContentId === item.dataset.contentTab
						? item.classList.add("tabs__contents-image--active")
						: null
				)
				if (window.innerWidth <= 768) {
					const tabTop = this.getBoundingClientRect().top + window.scrollY
					window.scrollTo({
						top: tabTop,
						behavior: "smooth",
					})
				}
			})
		})
	}
}

export function initScroll() {
	const header = document.querySelector(".header-js")

	if (header) {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 50) {
				header.classList.add("sticky")
			} else {
				header.classList.remove("sticky")
			}
		})
	}
}

export function initWOW() {
	new WOW().init()
}

initBurger()
initTabs()
initScroll()
initWOW()
