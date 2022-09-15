export default function listenServerEvents() {

	this.socket.on("NEW_SELF_POSITION", this.events["NEW_SELF_POSITION"].bind(this));

	this.socket.on("NEW_POSITION", this.events["NEW_POSITION"].bind(this));

	this.socket.on("NEW_FILL", this.events["NEW_FILL"].bind(this));

	this.socket.on("NEW_SELF_ALLOWED_CELLS",  this.events["NEW_SELF_ALLOWED_CELLS"].bind(this));

	this.socket.on("NEW_CONFIRM_FILL", this.events["NEW_CONFIRM_FILL"].bind(this));

	this.socket.on("alert", message => {

		alert(message);
	});

	this.socket.on("reconnect_attempt", () => {

		window.location.reload(true);
	});

	this.socket.on("error", () => {

		if (!window.isReloading) {

			window.location.reload(true);
		}
	});
}