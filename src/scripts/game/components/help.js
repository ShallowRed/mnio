const menuCaptions = document.querySelectorAll('#menu p');

const helpContainer = document.getElementById('help');

const helpIcon = document.querySelector('#help-btn img');

const helpBlocks = {
	fill: document.getElementById('help-block-fill'),
	move: document.getElementById('help-block-move'),
	zoom: document.getElementById('help-block-zoom'),
};

const arrows = document.querySelectorAll("#help svg");

const messages = {

	fill: {
		mobile: `<h2>Colorier</h2>`,
		desktop: `
      <h3>Colorier</h3>
	  <p>Ou : <span class="key"> Espace </span></p>
      <p>Pour changer de couleur :</p>
      <p>Ctrl / Cmd + <span class="key">&#8593;</span>  <span class="key">&#8595;</span></p>
      `
	},

	move: {
		mobile: `
      <h3>Se déplacer</h3>
      <p>Swiper : <span class="key">&#8592;</span> <span class="key">&#8593;</span> <span class="key">&#8594;</span> <span class="key">&#8595;</span></p>
      `,
		desktop: `
      <h3>Se déplacer</h3>
      <p>Flèches directionnelles </p>
	  <p class="arrow-keys"><span class="key left">&#8592;</span> <span class="key up">&#8593;</span> <span class="key right">&#8594;</span> <span class="key down">&#8595;</span></p>
      `
	},

	zoom: {
		mobile: `
    	<h2>Zoomer / dézoomer </h2>
    `,
		desktop: `
    	<h2>Zoomer / dézoomer </h2>
      `
	}
};

const Help = {

	init() {

		for (const [key, domEl] of Object.entries(helpBlocks)) {

			domEl.innerHTML = messages[key][isMobile ? "mobile" : "desktop"];

		}
	},

	listenBtn() {

		const helpBtn = document.getElementById('help-btn');

		helpBtn.addEventListener("click", () => {

			const toggleVisibility = helpContainer.style.display !== "none" ?
				"hide" : "show";

			this[toggleVisibility]();
		})
	},

	hide() {

		helpIcon.src = `/assets/img/help.svg`;

		[helpContainer, ...menuCaptions].forEach(el => {

			el.style.display = "none";
		});
	},

	show() {

		helpIcon.src = `/assets/img/close.svg`;

		[helpContainer, ...menuCaptions].forEach(el => {
			el.style.display = "block";
		});
	}
}

const isIpad = /Macintosh/i.test(navigator.userAgent) &&
	navigator.maxTouchPoints &&
	navigator.maxTouchPoints > 1;

const isMobile =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isIpad;

export {
	Help,
	helpBlocks,
	helpContainer,
	menuCaptions,
	arrows
}