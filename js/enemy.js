var Enemy = OZ.Class().extend(HAF.Actor);
Enemy.prototype.init = function() {
	this._speed = 1;
	this._size = 10;
	this._position = [];
	this._direction = [];
	
	this._pxPosition = [];
	
	this._alive = true;
}

Enemy.prototype.tick = function() {
	if (!this._alive) { return false; }

	var moved = this._move();
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
	var changed = false;
	for (var i=0;i<this._position.length;i++) {
		var pos = dt * this._speed * this._direction[i];
		var px = Math.round(pos);

		this._position[i] += pos;
		if (px != this._pxPosition[i])  {
			changed = true;
			this._pxPosition[i] = px;
		}
	}
	
	return changed;
}

/**
 * @returns {bool} died?
 */
Enemy.prototype._checkFences = function() {
	for (var i=0;i<this._fences.length;i++) {
		var fence = this._fences[i];
		if (fence.distanceTo(this._position) < this._size) {
			this._alive = false;
			return true;
		}
	}
	return false;
}
