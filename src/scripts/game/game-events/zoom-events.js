export default {

	"ZOOM_ATTEMPT": function (direction) {

		if (
			!this.flags.isZooming &&
			!this.flags.isTranslating &&
			this.map.isZoomable(direction)
		) this.emit("ZOOM", direction);
	},

	"ZOOM": function (direction) {

		this.flags.isZooming = true;

		this.map.incrementMaxCoordsInView(direction);

		this.map.updateCellsLayout();

		this.player.updateCoordsInView();

		this.map.updateCanvasOffset();

		this.map.zoom(this.durations.zoomAnimation);

		this.player.translate(this.durations.zoomAnimation);

		this.player.setSize();

		this.players.update(this.durations.zoomAnimation);

		const onZoomAnimationEnd = () => {

			this.flags.isZooming = false;

			this.map.updateCanvasLayout();

			this.map.translate(0);

			this.map.renderCells();

			if (this.flags.zoomBtnPressed) {

				this.animationTimeout(() => {

					this.emit("ZOOM_ATTEMPT", direction);

				}, this.durations.delayBetweenZooms);
			}
		}

		this.animationTimeout(onZoomAnimationEnd, this.durations.zoomAnimation * 1.1);
	},
}