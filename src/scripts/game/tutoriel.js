import { isMobile, messages } from './components/help';

const menuContainer = document.getElementById("menu");

const menuHelpButton = document.getElementById('help-btn');

const helpBlocksContainer = document.getElementById('help');

const helpBlocks = {
	fill: document.getElementById('help-block-fill'),
	move: document.getElementById('help-block-move'),
	zoom: document.getElementById('help-block-zoom'),
};

function showHelpBlock(...blockNames) {

	blockNames.forEach(blockName => {

		helpBlocks[blockName].style.visibility = "visible";
	});
};

function hideHelpBlock(...blockNames) {

	blockNames.forEach(blockName => {

		helpBlocks[blockName].style.visibility = "hidden";
	});
};

export function initTutoriel() {

	for (const blockNames in helpBlocks) {

		helpBlocks[blockNames].innerHTML = messages[blockNames][isMobile ? "mobile" : "desktop"];
	}
}

export function startTutoriel(socket) {

	initTutoriel();

	helpBlocksContainer.style.display = "block";

	setTimeout(showHowToFill, 1000);

	function showHowToFill() {

		showHelpBlock("fill");

		socket.on("CONFIRM_FILL", onFirstFillInput);
	};

	function onFirstFillInput() {

		socket.removeListener("CONFIRM_FILL", onFirstFillInput);

		hideHelpBlock("fill");

		setTimeout(showHowToMove, 1000);
	}

	function showHowToMove() {

		showHelpBlock("move");

		socket.on("NEW_PLAYER_POSITION", onFirstMoveInput);
	};

	function onFirstMoveInput() {

		socket.removeListener("NEW_PLAYER_POSITION", onFirstMoveInput);

		hideHelpBlock("move");

		setTimeout(showLastInfos, 1000);
	}

	function showLastInfos() {

		menuContainer.classList.add('open');

		showHelpBlock("zoom");

		setTimeout(() => {

			helpBlocksContainer.style.display = "none";

			menuContainer.classList.remove('open');

			endTutoriel();

		}, 3000);
	};
}

export function endTutoriel() {

	showHelpBlock("zoom", "move", "fill");

	menuHelpButton.addEventListener("click", () => {

			menuContainer.classList.toggle('open');

			helpBlocksContainer.classList.toggle("visible");
		});
}