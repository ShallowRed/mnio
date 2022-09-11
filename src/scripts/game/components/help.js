const isIpad = /Macintosh/i.test(navigator.userAgent) &&
	navigator.maxTouchPoints &&
	navigator.maxTouchPoints > 1;

export const isMobile =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isIpad;


export const messages = {

	fill: {
		mobile: `<h3>Colorier</h3>`,
		desktop: `
      <h3>Colorier</h3>
	  <p>Ou : <span class="key"> Espace </span></p>
      <p>Changer de couleur :</p>
      <p><span class="key">Ctrl</span> / <span class="key">Cmd</span> + <span class="key">&#8593;</span>  <span class="key">&#8595;</span></p>
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
    	<h3>Zoom</h3>
    `,
		desktop: `
    	<h3>Zoomer / dézoomer </h3>
      `
	}
};