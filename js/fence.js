var Fence = OZ.Class().extend(HAF.Actor);
Fence.prototype.init = function(pos1, pos2) {
	this._position1 = pos1;
	this._position2 = pos2;
}

Fence.prototype.tick = function(dt) {
	return false;
}

Fence.prototype.draw = function(context) {
	context.beginPath();
	context.moveTo(this._position1[0], this._position1[1]);
	context.lineTo(this._position2[0], this._position2[1]);
	context.stroke();
}

Fence.prototype.distanceTo = function(position) {
	/* FIXME */
}
