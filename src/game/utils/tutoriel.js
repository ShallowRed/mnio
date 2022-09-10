import {
	Help,
	helpBlocks,
	helpContainer,
	arrows
} from '../components/help';

const blockArrows = {
	zoom: arrows[0],
	fill: arrows[1]
}

export function init(socket) {

	const showHowToFill = () => {

		showBlock("fill");

		socket.on("CONFIRM_FILL", onFirstFill);
	};

	const onFirstFill = () => {

		socket.removeListener("CONFIRM_FILL", onFirstFill);

		hideBlock("fill");

		setTimeout(showHowToMove, 1000);
	}

	const showHowToMove = () => {

		showBlock("move");

		socket.on("NEW_PLAYER_POSITION", onFirstMove);
	};

	const onFirstMove = () => {

		socket.removeListener("NEW_PLAYER_POSITION", onFirstMove);

		hideBlock("move");

		setTimeout(showLastInfos, 1000);
	}

	const showLastInfos = () => {

		Help.show();

		showBlock("zoom");

		setTimeout(end, 3000);
	};

	helpContainer.style.display = "block";

	setTimeout(showHowToFill, 1000);
}

export function end() {

	showBlock("zoom", "move", "fill");

	Help.hide();

	Help.listenBtn();
}

const hideBlock = (...args) => {

	args.forEach(key => {

		helpBlocks[key].style.visibility = "hidden";

		if (blockArrows[key]) {

			blockArrows[key].style.visibility = "hidden";

		}
	});
};

const showBlock = (...args) => {

	args.forEach(key => {

		helpBlocks[key].style.visibility = "visible";

		if (blockArrows[key]) {

			blockArrows[key].style.visibility = "visible";

		}
	});
};