var Map = OZ.Class().extend(HAF.Actor);
Map.prototype.init = function() {
	this._size = [1024, 690];
	this._center = [Math.round(this._size[0]/2), Math.round(this._size[1]/2)];
	this._dirty = false;
	this._brain = OZ.DOM.elm("img", {src:"img/brain.png"});
	OZ.Event.add(this._brain, "load", this._load.bind(this));
}

Map.prototype.getSize = function() {
	return this._size;
}

/**
 * Returns next waypoint for a given position
 */
Map.prototype.getWaypoint = function(position) {
	var dx = position[0] - this._center[0];
	var dy = position[1] - this._center[1];
	var dist = Math.sqrt(dx*dx + dy*dy);
	if (dist < 20) { return null; }
	return this._center;
}

Map.prototype.tick = function(dt) {
	return this._dirty;
}

Map.prototype.draw = function(context) {
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, this._size[0], this._size[1]);

	if (!this._dirty) { return; }
	this._dirty = false;
	
	/*
	var size = 10;
	context.beginPath();
	context.moveTo(this._center[0]-size, this._center[1]);
	context.lineTo(this._center[0]+size, this._center[1]);
	context.moveTo(this._center[0], this._center[1]-size);
	context.lineTo(this._center[0], this._center[1]+size);
	context.stroke();
	*/
	
	var target = [32, 32];
	
	context.drawImage(
		this._brain,
		0, 0, this._brain.width, this._brain.height, 
		this._center[0]-target[0]/2, this._center[1]-target[1]/2, target[0], target[1]
	);
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

Map.prototype._load = function(e) {
	this._dirty = true;
}
