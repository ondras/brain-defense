Fence.Particle = OZ.Class().extend(HAF.Actor);
Fence.Particle.prototype.init = function(fence) {
	this._fence = fence;
	this._time = 0;
	this._color = fence.getColor();
	this._opacity = 1;
	this._size = 3;

	var position = fence.getPosition();
	var dir = [position[1][0]-position[0][0], position[1][1]-position[0][1]];
	var k = Math.random();
	this._position = [position[0][0] + k*dir[0], position[0][1] + k*dir[1]];
	
	var velocity = [-dir[1], dir[0]]; /* normal direction */

	var norm = Math.sqrt(velocity[0]*velocity[0] + velocity[1]*velocity[1]); /* normalized to 1 */
	var tmp = (Math.random() > 0.5 ? 1 : -1) /* random side */
	velocity[0] *= tmp/norm;
	velocity[1] *= tmp/norm;
	
	velocity[0] += 0.5*(Math.random()-0.5); /* slight angle randomization */
	velocity[1] += 0.5*(Math.random()-0.5);
	
	var speed = 20 + 40*Math.random(); /* random speed */
	velocity[0] *= speed;
	velocity[1] *= speed;
	
	this._velocity = velocity;
	
}

Fence.Particle.prototype.tick = function(dt) {
	this._time += dt;
	this._position[0] += dt*this._velocity[0]/1000;
	this._position[1] += dt*this._velocity[1]/1000;
	
	var life = 1000;
	if (this._time >= life) {
		this._opacity = 0;
		this._fence.removeParticle(this);
	} else {
		this._opacity = (life-this._time)/life;
	}

	return true;
}

Fence.Particle.prototype.draw = function(context) {
	context.fillStyle = "rgba(" + this._color + "," + this._opacity + ")";
	var half = this._size/2;
	context.fillRect(this._position[0]-half, this._position[1]-half, this._size, this._size); /* FIXME configurable */
}
