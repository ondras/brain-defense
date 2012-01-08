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
}

Game.prototype.getMap = function() {
	return this._map;
}

Game.prototype.getFences = function() {
	return this._fences;
}

Game.prototype.createEnemy = function() {
	var enemy = new Enemy();
	this._enemies.push(enemy);
	this._engine.addActor(enemy, "enemies");
	return enemy;
}

Game.prototype.createFence = function() {
	var fence = new Fence();
	this._fences.push(fence);
	this._engine.addActor(fence, "fences");
	return fence;
}
