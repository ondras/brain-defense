var Game = OZ.Class();
Game.prototype.init = function() {
	this._downPoint = null;
	this._tmpFence = null;
	this._ecDraw = [];
	this._ecMove = [];
	this._engine = null;
	this._dom = {};

	this._initDOM();
	this._initHAF();
}

Game.prototype.setSize = function(size) {
	this._engine.setSize(size);
	this._dom.container.style.width = size[0]+"px";
	this._dom.container.style.height = size[1]+"px";
}

Game.prototype.setScore = function(score) {
	this._dom.score.innerHTML = "Score: " + score;
	this._dom.score.style.display = (score ? "" : "none");
}

Game.prototype.getEngine = function() {
	return this._engine;
}

Game.prototype.play = function(level) {
	this._level = new level(this);
	this._level.start();
}

Game.prototype.gameOver = function() {
	this._dom.shade.style.display = "";
	
	var label = new Label("GAME OVER");
	OZ.Event.add(label, "label-done", this._gameOverDone.bind(this));
	label.show(this._dom.container);
}

Game.prototype.enableDrawing = function() {
	if (this._ecDraw.length) { return; }
	this._ecDraw.push(OZ.Event.add(this._engine.getContainer(), "mousedown", this._down.bind(this)));
	this._ecDraw.push(OZ.Event.add(this._engine.getContainer(), "touchstart", this._down.bind(this)));
}

Game.prototype.disableDrawing = function() {
	while (this._ecDraw.length) { OZ.Event.remove(this._ecDraw.pop()); }
}

Game.prototype.showHint = function(hint, position) {
	hint.show(this._dom.container, position);
}

Game.prototype._initDOM = function() {
	this._dom = {
		container: OZ.DOM.elm("div", {id:"game", position:"relative"}),
		shade: OZ.DOM.elm("div", {id:"shade", position:"absolute", left:"0px", top:"0px", width:"100%", height:"100%"}),
		score: OZ.DOM.elm("div", {id:"score", position:"absolute"}),
		button: OZ.DOM.elm("input", {type:"button", position:"absolute", value:"Again"})
	}
	
	this._dom.shade.style.display = "none";
	this._dom.button.style.display = "none";
	
	this._engine = new HAF.Engine();
	
	OZ.DOM.append(
		[document.body, this._dom.container],
		[this._dom.container, this._engine.getContainer(), this._dom.shade, this._dom.score, this._dom.button]
	);
	
	OZ.Event.add(this._dom.button, "click", function() { location.reload(); } );
	OZ.Event.add(this._dom.button, "touchstart", function() { location.reload(); } );
	
	this.setScore(0);
}

Game.prototype._initHAF = function() {
	this._engine.addCanvas("map");
	this._engine.addCanvas("enemies");
	this._engine.addCanvas("fences");

	/* debug */
	var monitor = new HAF.Monitor(this._engine, [200, 100]);
	monitor = monitor.getContainer();
	monitor.style.position = "absolute";
	monitor.style.left = "0px";
	monitor.style.top = "0px";
	this._dom.container.appendChild(monitor);
	/* */
}

Game.prototype._gameOverDone = function() {
	this._dom.button.style.display = "";
	var left = this._dom.container.offsetWidth - this._dom.button.offsetWidth;
	var top = this._dom.container.offsetHeight - this._dom.button.offsetHeight;
	this._dom.button.style.left = Math.round(left/2) + "px";
	this._dom.button.style.top = Math.round(top/2) + "px";
}

Game.prototype._down = function(e) {
	OZ.Event.prevent(e);
	if (this._downPoint) { return; } /* first point already created */
	
	var obj = (e.touches ? e.touches[0] : e);
	this._downPoint = this._getPoint(obj);
	
	var container = this._engine.getContainer();
	this._ecMove.push(OZ.Event.add(container, "mousemove", this._move.bind(this)));
	this._ecMove.push(OZ.Event.add(container, "touchmove", this._move.bind(this)));
	this._ecMove.push(OZ.Event.add(container, "mouseup", this._up.bind(this)));
	this._ecMove.push(OZ.Event.add(container, "touchend", this._up.bind(this)));
	
}

Game.prototype._move = function(e) {
	OZ.Event.prevent(e);
	var obj = (e.touches ? e.touches[0] : e);
	var point = this._getPoint(obj);
	
	if (this._tmpFence) {
		this._tmpFence.setPosition(this._downPoint, point);
	} else {
		this._tmpFence = new Fence(this._downPoint, point);
		this._engine.addActor(this._tmpFence, "fences");
	}
	
}

Game.prototype._up = function(e) {
	OZ.Event.prevent(e);
	if (e.touches && e.touches.length > 0) { return; } /* there are touches remaining */

	while (this._ecMove.length) { OZ.Event.remove(this._ecMove.pop()); }
	this._downPoint = null;

	if (!this._tmpFence) { return; } /* not moved at all */
	this._engine.removeActor(this._tmpFence, "fences");

	if (this._tmpFence.getLength() < 10) { return; } /* too short */
	this._level.addFence(this._tmpFence);
	this._tmpFence = null;
}

Game.prototype._getPoint = function(e) {
	var scroll = OZ.DOM.scroll();
	var pos = OZ.DOM.pos(this._engine.getContainer());
	return [e.clientX-pos[0], e.clientY-pos[1]];
}
