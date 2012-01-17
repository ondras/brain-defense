var Enemy = OZ.Class().extend(HAF.AnimatedSprite);

Enemy.zombie = OZ.DOM.elm("img", {src:"img/zombie.png"});

Enemy.prototype.init = function(position, visual) {
	HAF.AnimatedSprite.prototype.init.call(this, visual.image, visual.size, visual.frames);

	this._speed = 10 + Math.random()*40; /* pixels per second */
	this._animation.fps = this._speed / 8;
	this._size = Math.sqrt(visual.size[0]*visual.size[0]+visual.size[1]*visual.size[1]);

	this._position = position; /* exact position */
	this._velocity = [];
	this._direction = null;
	this._waypoint = null;
	this._alive = true;
	this._deathTime = null;

	this._map = Game.game.getMap();
	this._fences = Game.game.getFences();
}

Enemy.prototype.isAlive = function() {
	return this._alive;
}

Enemy.prototype.tick = function(dt) {
	if (this._alive) { /* alive: check animation, try moving, check fences */
		var spriteChanged = this._tickSprite(dt);
		var moved = this._move(dt);
		this._checkFences();
		return spriteChanged || moved || !this._alive;
	} else { /* dead: just animate */
		var time = Date.now();
		if (time - this._deathTime > 1000*10) { /* FIXME configurable? automatic? */
			Game.game.removeEnemy(this);
			return false;
		}
		return this._tickSprite(dt);
	}
}

Enemy.prototype._tickSprite = function(dt) {
	return HAF.AnimatedSprite.prototype.tick.call(this, dt);
}

/**
 * @returns {bool} moved by >= 1 pixel?
 */
Enemy.prototype._move = function(dt) {
	if (this._waypoint) { /* try walking current direction */

		/* current distance from waypoint */
		var distance = this._distance(this._position, this._waypoint);
		
		/* try next distance in this direction */
		var position = [];
		position[0] = this._position[0] + dt * this._velocity[0] / 1000;
		position[1] = this._position[1] + dt * this._velocity[1] / 1000;
		
		if (this._distance(position, this._waypoint) > distance) { /* too far, reset waypoint */
			this._waypoint = null; 
		} else { /* okay, step in that direction */
			this._position = position;
		}
	}
		
	if (!this._waypoint) {  /* first time or distance worse: ask for next waypoint */
		this._waypoint = this._map.getWaypoint(this._position);
		if (!this._waypoint) { /* already there! */
			Game.game.gameOver();
			return false; 
		} 
		
		/* compute direction */
		var norm = Math.sqrt(this._distance(this._position, this._waypoint));
		this._velocity[0] = (this._waypoint[0] - this._position[0]) * this._speed / norm;
		this._velocity[1] = (this._waypoint[1] - this._position[1]) * this._speed / norm;

		var angle = Math.atan2(this._velocity[1], this._velocity[0]) - Math.PI*0.75;
		if (angle < 0) { angle += 2*Math.PI; }
		this._direction = Math.round(8 * angle / (2*Math.PI)) % 8;
		
		/* compute new position */
		this._position[0] += dt * this._velocity[0] / 1000;
		this._position[1] += dt * this._velocity[1] / 1000;
	}
	
	var changed = false;
	for (var i=0;i<2;i++) { /* if pixel position changed, redraw will be necessary */
		var px = Math.round(this._position[i]);
		if (px != this._sprite.position[i]) { 
			this._sprite.position[i] = px;
			changed = true;
		}
	}

	return changed;
}

Enemy.prototype._distance = function(a, b) {
	var dx = a[0]-b[0];
	var dy = a[1]-b[1];
	return dx*dx+dy*dy;
}

/**
 * @returns {bool} died?
 */
Enemy.prototype._checkFences = function() {
	for (var i=0;i<this._fences.length;i++) {
		var fence = this._fences[i];
		if (fence.distanceTo(this._position) < this._sprite.size[0]/3) {
			fence.damage();
			return this._die();
		}
	}
}

Enemy.prototype._die = function() {
	this._alive = false;
	this._deathTime = Date.now();
	this.dispatch("death");
}

