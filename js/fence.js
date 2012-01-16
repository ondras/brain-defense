var Fence = OZ.Class().extend(HAF.Actor);
Fence.prototype.init = function(pos1, pos2) {
	this._pos1 = null;
	this._pos2 = null;
	this._dir = null;
	this._normal = null;
	this._dirty = false;
	this._maxHP = 4;  /* FIXME configurable? */
	this._hp = this._maxHP;
	
	var colors = [
		[255, 0, 0],
		[0, 255, 0],
		[0, 0, 255],
		[0, 255, 255],
		[255, 0, 255],
		[255, 255, 0]
	];
	this._color = colors[Math.floor(Math.random()*colors.length)];
	
	this._lines = [
		{width: 18, opacity:0.1},
		{width: 14, opacity:0.2},
		{width: 10, opacity:0.3},
		{width: 6, opacity:1},
		{width: 2, color: "rgb(255,255,255)"}
	];
	
	this.setPosition(pos1, pos2);
	this._compute();
	
	this._particles = [];
}

Fence.prototype.setPosition = function(pos1, pos2) {
	this._pos1 = pos1;
	this._pos2 = pos2;
	this._compute();
	this._dirty = true;
}

Fence.prototype.getPosition = function() {
	return [this._pos1, this._pos2];
}

Fence.prototype.getColor = function() {
	var color = [];
	var frac = this._hp/this._maxHP;
	for (var i=0;i<this._color.length;i++) { color.push(Math.round(this._color[i]*frac)); }
	return color;
}

Fence.prototype.tick = function(dt) {
	for (var i=0;i<this._particles.length;i++) { /* tick all particles */
		this._dirty = (this._particles[i].tick(dt) || this._dirty);
	}
	
	if (Math.random() > 0.96) {  /* create new particle */
		this._particles.push(new Fence.Particle(this)); 
		this._dirty = true;
	}
	
	return this._dirty; /* either we were repositioned, or one of our particles moved, or a new particle was created */
}

Fence.prototype.draw = function(context) {
	context.save();
	context.lineCap = "round";
	for (var i=0;i<this._lines.length;i++) {
		var line = this._lines[i];
		context.beginPath();
		context.moveTo(this._pos1[0], this._pos1[1]);
		context.lineTo(this._pos2[0], this._pos2[1]);
		context.lineWidth = line.width;
		context.strokeStyle = (line.color || "rgba("+this.getColor().join(",")+","+line.opacity+")");
		context.stroke();
	}
	context.restore();
	
	for (var i=0;i<this._particles.length;i++) { this._particles[i].draw(context); }
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

Fence.prototype.damage = function(/* FIXME parametrized? */) {
	this._hp--;
	if (!this._hp) { Game.game.removeFence(this); }
}

Fence.prototype.removeParticle = function(particle) {
	var index = this._particles.indexOf(particle);
	this._particles.splice(index, 1);
	this._dirty = true;
}

Fence.prototype._compute = function() {
	this._dir = [this._pos2[0]-this._pos1[0], this._pos2[1]-this._pos1[1]];
	this._normal = [this._dir[1], -this._dir[0]];
	
	/* normalize normal */
	var norm = Math.sqrt(this._normal[0]*this._normal[0] + this._normal[1]*this._normal[1]);
	this._normal[0] /= norm;
	this._normal[1] /= norm;
}
