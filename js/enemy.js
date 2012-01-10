var Enemy = OZ.Class().extend(HAF.Actor);
Enemy.prototype.init = function(position) {
	this._speed = 100/1000;
	this._size = 10;
	this._position = position;
	this._pxPosition = [];
	this._direction = [];
	this._waypoint = null;
	
	this._alive = true;
	this._map = Game.game.getMap();
	this._fences = Game.game.getFences();
}

Enemy.prototype.tick = function(dt) {
	if (!this._alive) { return false; }

	var moved = this._move(dt);
	var died = this._checkFences();
	return moved || died;
}

Enemy.prototype.draw = function(context) {
	var half = this._size/2;
	if (this._alive) {
		context.strokeRect(this._position[0]-half, this._position[1]-half, this._size, this._size);
	} else {
		context.fillRect(this._position[0]-half, this._position[1]-half, this._size, this._size);
	}
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
		position[0] = this._position[0] + dt * this._direction[0];
		position[1] = this._position[1] + dt * this._direction[1];
		
		if (this._distance(position, this._waypoint) > distance) { /* too far, reset waypoint */
			this._waypoint = null; 
		} else { /* okay, step in that direction */
			this._position = position;
		}
	}
		
	if (!this._waypoint) {  /* first time or distance worse: ask for next waypoint */
		this._waypoint = this._map.getWaypoint(this._position);
		
		/* compute direction */
		var norm = Math.sqrt(this._distance(this._position, this._waypoint));
		this._direction[0] = (this._waypoint[0] - this._position[0]) * this._speed / norm;
		this._direction[1] = (this._waypoint[1] - this._position[1]) * this._speed / norm;
		
		/* compute new position */
		this._position[0] += dt * this._direction[0];
		this._position[1] += dt * this._direction[1];
	}
	
	
	var changed = false;
	for (var i=0;i<2;i++) { /* if pixel position changed, redraw will be necessary */
		var px = Math.round(this._position[i]);
		if (px != this._pxPosition) { 
			this._pxPosition[i] = px;
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
		if (fence.distanceTo(this._position) < this._size/2) {
			this._alive = false;
			return true;
		}
	}
	return false;
}
