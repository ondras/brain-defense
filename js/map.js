var Map = OZ.Class().extend(HAF.Actor);
Map.prototype.init = function() {
	this._size = [600, 600];
}

Map.prototype.getSize = function() {
	return this._size;
}

/**
 * Returns next waypoint for a given position
 */
Map.prototype.getWaypoint = function(position) {
	return [Math.round(this._size[0]/2), Math.round(this._size[1]/2)];
}

Map.prototype.tick = function(dt) {
	return false;
}

Map.prototype.draw = function(context) {
	/* FIXME */
}

Map.prototype.getSpawnPoint = function() {
	var rx = Math.round(Math.random()*this._size[0]);
	var ry = Math.round(Math.random()*this._size[1]);
	
	if (Math.random() > 0.5) { 
		ry = (Math.random() > 0.5 ? 0 : this._size[1]);
	} else {
		rx = (Math.random() > 0.5 ? 0 : this._size[0]);
	}
	
	return [rx, ry];
}
