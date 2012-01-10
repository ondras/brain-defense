var Fence = OZ.Class().extend(HAF.Actor);
Fence.prototype.init = function(pos1, pos2) {
	this._pos1 = pos1;
	this._pos2 = pos2;
	this._dir = [pos2[0]-pos1[0], pos2[1]-pos1[1]];
	this._normal = [this._dir[1], -this._dir[0]];
	
	/* normalize normal */
	var norm = Math.sqrt(this._normal[0]*this._normal[0] + this._normal[1]*this._normal[1]);
	this._normal[0] /= norm;
	this._normal[1] /= norm;
}

Fence.prototype.tick = function(dt) {
	return false;
}

Fence.prototype.draw = function(context) {
	context.beginPath();
	context.moveTo(this._pos1[0], this._pos1[1]);
	context.lineTo(this._pos2[0], this._pos2[1]);
	context.stroke();
}

Fence.prototype.distanceTo = function(position) {
	/* Solve[Px == Ax+k1*Ux && Py == Ay+k1*Uy && Px == Cx+k2*Nx && Py == Cy+k2*Ny, {Px, Py, k1, k2}] */
	
	var numerator = (-this._pos1[1]*this._normal[0] + position[1]*this._normal[0] + this._pos1[0]*this._normal[1] - position[0]*this._normal[1]);
	var denominator = this._normal[0]*this._dir[1] - this._normal[1]*this._dir[0];
	var k1 = numerator/denominator;
	
	if (k1 < 0 || k1 > 1) { return 1/0; }
	
	numerator = (this._pos1[1]*this._dir[0] - position[1]*this._dir[0] - this._pos1[0]*this._dir[1] + position[0]*this._dir[1]);
	var k2 = numerator/denominator;
	return Math.abs(k2);
}
