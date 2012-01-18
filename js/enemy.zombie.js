Enemy.Zombie = OZ.Class().extend(Enemy);

Enemy.Zombie.image = OZ.DOM.elm("img", {src:"img/zombie.png"});

Enemy.Zombie.prototype.init = function(position) {
	var visual = {
		image: Enemy.Zombie.image,
		size: [64, 64],
		frames: 8
	}
	Enemy.prototype.init.call(this, position, visual);
	this._animation.running = true;
}

Enemy.Zombie.prototype._getSourceImagePosition = function() {
	if (this._alive) {
		return [4 + this._animation.frame, this._direction];
	} else {
		return [28 + this._animation.frame, this._direction];
	}
}

Enemy.Zombie.prototype._die = function() {
	Enemy.prototype._die.call(this);
	this._animation.fps = 8;
	this._animation.time = 0;
	this._animation.frame = 0;
}

Enemy.Zombie.prototype._tickSprite = function(dt) {
	if (!this._animation.running) { /* static mode (dead && died) */
		return false;
	} else if (!this._alive) { /* dying animation */
		this._animation.time += dt;
		var oldFrame = this._animation.frame;
		this._animation.frame = Math.floor(this._animation.time * this._animation.fps / 1000);
		
		if (this._animation.frame >= this._animation.frames-1) { /* dying animation finished */
			this._animation.running = false; 
			this._animation.frame = this._animation.frames-1;
			this.dispatch("enemy-dead");
		} 
		
		return (oldFrame != this._animation.frame);
		
	} else { /* alive (and happy ) */
		return HAF.AnimatedSprite.prototype.tick.call(this, dt);
	}
}
