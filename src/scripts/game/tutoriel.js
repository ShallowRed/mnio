const menuContainer = document.getElementById("menu");

const helpBlocks = {
	fill: document.getElementById('help-block-fill'),
	move: document.getElementById('help-block-move'),
	zoom: document.getElementById('help-block-zoom'),
};

function showHelpBlock(...blocksNames) {

	for (const blockName of blocksNames) {

		helpBlocks[blockName].style.display = "block";
	}
}

function hideHelpBlock(...blocksNames) {

	for (const blockName of blocksNames) {

		helpBlocks[blockName].style.display = "none";
	}
}

export function startTutoriel(socket) {

	setTimeout(showHowToFill, 1000);

	function showHowToFill() {

		showHelpBlock("fill");

		socket.on("CONFIRM_FILL", onFirstFillInput);
	}

	function onFirstFillInput() {

		socket.removeListener("CONFIRM_FILL", onFirstFillInput);

		hideHelpBlock("fill");

		setTimeout(showHowToMove, 1000);
	}

	function showHowToMove() {

		showHelpBlock("move");

		socket.on("NEW_PLAYER_POSITION", onFirstMoveInput);
	}

	function onFirstMoveInput() {

		socket.removeListener("NEW_PLAYER_POSITION", onFirstMoveInput);

		hideHelpBlock("move");

		setTimeout(showLastInfos, 1000);
	}

	function showLastInfos() {

		menuContainer.classList.add('open');

		showHelpBlock("zoom");

		setTimeout(endTutoriel, 3000);
	}

	function endTutoriel() {

		menuContainer.classList.remove('open');

		hideHelpBlock("zoom", "move", "fill");

		listenHelpButtonClick();
	}
}

const menuHelpButton = document.getElementById('help-btn');

export function listenHelpButtonClick() {

	menuHelpButton.addEventListener("click", () => {

		menuContainer.classList.toggle('open');

		if (menuContainer.classList.contains('open')) {

			showHelpBlock("zoom", "move", "fill");

		} else {

			hideHelpBlock("zoom", "move", "fill");
		}
	});
}