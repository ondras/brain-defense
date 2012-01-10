var Game = OZ.Class();
Game.config = {
	maxFences: 3
}
Game.prototype.init = function() {
	this.constructor.game = this;
	
	this._enemies = [];
	this._fences = [];
	this._map = new Map();
	
	this._engine = new HAF.Engine(this._map.getSize());
	
	this._engine.addCanvas("map");
	this._engine.addCanvas("enemies");
	this._engine.addCanvas("fences");
	
	this._engine.addActor(this._map, "map");
	
	for (var i=0;i<20;i++) {
		this.createEnemy();
	}
	this.createFence([0, 300], [400, 300]);
	this.createFence([410, 300], [600, 300]);
	
	var monitor = new HAF.Monitor(this._engine, [200, 100]);
	document.body.appendChild(monitor.getContainer());

	document.body.appendChild(this._engine.getContainer());
	this._engine.start();
}

Game.prototype.getMap = function() {
	return this._map;
}

Game.prototype.getFences = function() {
	return this._fences;
}

Game.prototype.createEnemy = function() {
	var rx = Math.round(Math.random() * this._map.getSize()[0]);
	var enemy = new Enemy([rx, 0]);
	this._enemies.push(enemy);
	this._engine.addActor(enemy, "enemies");
	return enemy;
}

Game.prototype.createFence = function(pos1, pos2) {
	var fence = new Fence(pos1, pos2);
	this._fences.push(fence);
	this._engine.addActor(fence, "fences");
	return fence;
}
