Game.Level = OZ.Class();
Game.Level.prototype.init = function(game) {
	this._conf = {
		maxFences: 5,
		startSpawn: 1500,
		endSpawn: 300
	}
	
	this._currentSpawn = this._conf.startSpawn;
	this._game = game;
	this._engine = this._game.getEngine();
	this._spawnInterval = null;

	this._enemies = [];
	this._fences = [];
	this._map = new Map();
	this._engine.addActor(this._map, "map");

	this._score = 0;

	OZ.Event.add(null, "enemy-death", this._enemyDeath.bind(this));
	OZ.Event.add(null, "enemy-purge", this._enemyPurge.bind(this));
	OZ.Event.add(null, "enemy-finish", this._enemyFinish.bind(this));
	OZ.Event.add(null, "fence-death", this._fenceDeath.bind(this));
}

Game.Level.prototype.start = function() {
	this._game.setSize(this._map.getSize());
	this._engine.start();
	this._game.enableDrawing();
	this._enableSpawn();
}

Game.Level.prototype.addFence = function(fence) {
	this._fences.push(fence);
	this._engine.addActor(fence, "fences");

	if (this._fences.length == this._conf.maxFences) {
		this._game.disableDrawing();
	}
}

Game.Level.prototype._enableSpawn = function() {
	this._spawnTimeout = setTimeout(this._spawn.bind(this), this._conf.spawn);
}

Game.Level.prototype._disableSpawn = function() {
	clearTimeout(this._spawnTimeout);
	this._spawnTimeout = null;
}

Game.Level.prototype._enemyDeath = function(e) {
	this._game.setScore(++this._score);
}

Game.Level.prototype._enemyPurge = function(e) {
	var enemy = e.target;
	var index = this._enemies.indexOf(enemy);
	this._enemies.splice(index, 1);
	this._engine.removeActor(enemy, "enemies");
}

Game.Level.prototype._fenceDeath = function(e) {
	var fence = e.target;
	
	var index = this._fences.indexOf(fence);
	this._fences.splice(index, 1);
	this._engine.removeActor(fence, "fences");
	
	/* we can draw again */
	if (this._fences.length + 1 == this._conf.maxFences) { this._game.enableDrawing(); }
}

Game.Level.prototype._enemyFinish = function(e) {
	this._disableSpawn();
	if (this._fences.length < this._conf.maxFences) { this._game.disableDrawing(); }
	this._engine.stop();
	this._engine.removeActors("fences");
	this._engine.removeActors("enemies");
	this._game.gameOver();
}

Game.Level.prototype._spawn = function() {
	this._createEnemy(this._map.getSpawnPoint());
	this._currentSpawn = Math.max(this._currentSpawn-5, this._conf.endSpawn);
	if (this._spawnTimeout) { this._spawnTimeout = setTimeout(this._spawn.bind(this), this._currentSpawn); }
}

Game.Level.prototype._createEnemy = function(position) {
	var enemy = new Enemy.Zombie(position);
	enemy.setMap(this._map);
	enemy.setFences(this._fences);

	this._enemies.push(enemy);
	this._engine.addActor(enemy, "enemies");
}
