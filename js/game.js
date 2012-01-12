var Game = OZ.Class();
Game.prototype.init = function() {
	this.constructor.game = this;
	
	this._conf = {
		maxFences: 5,
		spawn: 500
	}
	
	this._enemies = [];
	this._fences = [];
	this._downPoint = null;
	this._tmpFence = null;
	this._events = [];
	this._map = new Map();
	
	this._engine = new HAF.Engine(this._map.getSize());
	this._engine.addCanvas("map");
	this._engine.addCanvas("enemies");
	this._engine.addCanvas("fences");
	this._engine.addActor(this._map, "map");
	
	/* debug */
	var monitor = new HAF.Monitor(this._engine, [200, 100]);
	document.body.appendChild(monitor.getContainer());
	/* */

	var container = this._engine.getContainer();
	document.body.appendChild(container);

	OZ.Event.add(container, "mousedown", this._down.bind(this));
	OZ.Event.add(container, "touchstart", this._down.bind(this));

	this._start();
}

Game.prototype.gameOver = function() {
	this._stop();
	alert("GAME OVER");
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
		this._tmpFence.setPos2(point);
	} else {
		this._tmpFence = new Fence(this._downPoint, point);
		this._engine.addActor(this._tmpFence, "fences");
	}
	
}

Game.prototype._up = function(e) {
	OZ.Event.prevent(e);
	if (e.touches && e.touches.length > 0) { return; } /* there are touches remaining */

	while (this._events.length) { OZ.Event.remove(this._events.pop()); }

	if (!this._tmpFence) { return; } /* not moved at all */
	
	this._fences.push(this._tmpFence);
	this._tmpFence = null;
	this._downPoint = null;
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
