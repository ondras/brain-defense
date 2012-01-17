var Mission = OZ.Class().extend(HAF.Actor);
Mission.prototype.init = function(pos1, pos2, maxHP) {
	this._pos1 = null;
	this._pos2 = null;
	this._dir = null;
	this._normal = null;
	this._dirty = false;
	this._maxHP = maxHP || 3;
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
