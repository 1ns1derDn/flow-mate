;(function () {
	const wow = new WOW({
		boxClass: "wow",
		animateClass: "animated",
		offset: 0,
		mobile: false,
	})

	wow.init()

	const burger = document.querySelector(".js-burger")

	if (burger) {
		burger.addEventListener("click", function () {
			const body = this.closest("body")
			body.classList.toggle("header--active")
		})
	}

	const tabButtons = document.querySelectorAll(".tabs__button")

	if (tabButtons) {
		tabButtons.forEach((tabButton) => {
			tabButton.addEventListener("click", function () {
				tabButtons.forEach((item) => item.classList.remove("tabs__button--active"))
				this.classList.add("tabs__button--active")
				const tabs = this.closest(".tabs")
				const tabsImages = tabs.querySelectorAll(".tabs__contents-image")
				tabsImages.forEach((item) => item.classList.remove("tabs__contents-image--active"))
				const tabsContentId = this.dataset.contentTab
				tabsImages.forEach((item) =>
					tabsContentId === item.dataset.contentTab
						? item.classList.add("tabs__contents-image--active")
						: null
				)
			})
		})
	}

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
})()
