var Map = OZ.Class().extend(HAF.Actor);
Map.prototype.init = function() {
	this._size = [600, 600];
}

Map.prototype.getSize = function() {
	return this.getSize();
}

/**
 * Returns next waypoint for a given position
 */
Map.prototype.getWaypoint = function(position) {
	/* FIXME */
}

Map.prototype.tick = function(dt) {
	return false;
}

Map.prototype.draw = function(context) {
	/* FIXME */
}
