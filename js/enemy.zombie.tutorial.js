Enemy.Zombie.Tutorial = OZ.Class().extend(Enemy.Zombie);

Enemy.Zombie.Tutorial.prototype.init = function(position) {
	Enemy.Zombie.prototype.init.call(this, position);
	this._speed = 0;
}

Enemy.Zombie.Tutorial.prototype.start = function(speed) {
	this._speed = speed;
	this._waypoint = null;
}
