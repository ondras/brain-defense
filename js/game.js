var Game = OZ.Class();
Game.prototype.init = function() {
	this.constructor.game = this;
	
	this._conf = {
		maxFences: 5,
		spawn: 700
	}
	
	this._enemies = [];
	this._fences = [];
	this._downPoint = null;
	this._tmpFence = null;
	this._events = [];
	this._map = new Map();
	this._score = 0;

	this._initDOM();
	this._initHAF();
	
	OZ.Event.add(null, "death", this._death.bind(this));
	OZ.Event.add(window, "keydown", this._keydown.bind(this));
	
	this._start();
	
//	new Hint("AAA", "BBB").show(this._engine.getContainer(), [100, 100]);
}

Game.prototype.gameOver = function() {
	this._stop();
	this._dom.shade.style.display = "";
	
	var label = new Label("GAME OVER");
	OZ.Event.add(label, "done", this._gameOverDone.bind(this));
	label.show(this._dom.container);
}

Game.prototype.getMap = function() {
	return this._map;
}

Game.prototype.getFences = function() {
	return this._fences;
}

Game.prototype.removeEnemy = function(enemy) {
	var index = this._enemies.indexOf(enemy);
	this._enemies.splice(index, 1);
	this._engine.removeActor(enemy, "enemies");
}

Game.prototype.removeFence = function(fence) {
	var index = this._fences.indexOf(fence);
	this._fences.splice(index, 1);
	this._engine.removeActor(fence, "fences");
}

Game.prototype._death = function(e) {
	this._score++;
	this._dom.score.innerHTML = "Score: " + this._score;
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
	
	var size = this._map.getSize();
	this._dom.container.style.width = size[0]+"px";
	this._dom.container.style.height = size[1]+"px";
	
	this._engine = new HAF.Engine(size);
	
	OZ.DOM.append(
		[document.body, this._dom.container],
		[this._dom.container, this._engine.getContainer(), this._dom.shade, this._dom.score, this._dom.button]
	);
	
	OZ.Event.add(this._dom.button, "click", function() { location.reload(); } );
	OZ.Event.add(this._dom.button, "touchstart", function() { location.reload(); } );
	OZ.Event.add(this._engine.getContainer(), "mousedown", this._down.bind(this));
	OZ.Event.add(this._engine.getContainer(), "touchstart", this._down.bind(this));
}

Game.prototype._initHAF = function() {
	this._engine.addCanvas("map");
	this._engine.addCanvas("enemies");
	this._engine.addCanvas("fences");
	this._engine.addActor(this._map, "map");

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

Game.prototype._keydown = function(e) {
	if (e.keyCode != "P".charCodeAt(0)) { return; }
	(this._engine.isRunning() ? this._engine.stop() : this._engine.start());
}

Game.prototype._start = function() {
	this._engine.start();
	this._spawnInterval = setInterval(this._spawn.bind(this), this._conf.spawn);
}

Game.prototype._stop = function() {
	clearInterval(this._spawnInterval);
	this._engine.stop();
}

Game.prototype._down = function(e) {
	OZ.Event.prevent(e);
	if (this._fences.length == this._conf.maxFences) { return; } /* already at max */
	if (this._downPoint) { return; } /* first point already created */
	
	var obj = (e.touches ? e.touches[0] : e);
	this._downPoint = this._getPoint(obj);
	
	var container = this._engine.getContainer();
	this._events.push(OZ.Event.add(container, "mousemove", this._move.bind(this)));
	this._events.push(OZ.Event.add(container, "touchmove", this._move.bind(this)));
	this._events.push(OZ.Event.add(container, "mouseup", this._up.bind(this)));
	this._events.push(OZ.Event.add(container, "touchend", this._up.bind(this)));
	
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

	while (this._events.length) { OZ.Event.remove(this._events.pop()); }
	this._downPoint = null;

	if (!this._tmpFence) { return; } /* not moved at all */
	
	if (this._tmpFence.getLength() < 10) { /* too short */
		this._engine.removeActor(this._tmpFence, "fences");
	} else {
		this._fences.push(this._tmpFence);
	}
	
	this._tmpFence = null;
}

Game.prototype._getPoint = function(e) {
	var scroll = OZ.DOM.scroll();
	var pos = OZ.DOM.pos(this._engine.getContainer());
	return [e.clientX-pos[0], e.clientY-pos[1]];
}

Game.prototype._spawn = function() {
	var enemy = new Enemy.Zombie(this._map.getSpawnPoint());
	this._enemies.push(enemy);
	this._engine.addActor(enemy, "enemies");
}
