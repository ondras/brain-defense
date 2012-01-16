Fence.Particle = OZ.Class().extend(HAF.Particle);
Fence.Particle.prototype.init = function(fence) {
	this._fence = fence;
	this._time = 0;

	var position = fence.getPosition();
	var dir = [position[1][0]-position[0][0], position[1][1]-position[0][1]];
	var k = Math.random();
	
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
	
	var options = {
		velocity: velocity,
		color: fence.getColor(),
		decay: 1,
		size: 3
	}
	HAF.Particle.prototype.init.call(this, [position[0][0] + k*dir[0], position[0][1] + k*dir[1]], options);
	
}

Fence.Particle.prototype.tick = function(dt) {
	HAF.Particle.prototype.tick.call(this, dt);
	this._time += dt;
	
	var life = 1000;
	if (this._time >= life) {
		this._fence.removeParticle(this);
	}

	return true;
}
