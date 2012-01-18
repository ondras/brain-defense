var Hint = OZ.Class();
Hint.first = true;

Hint.prototype.init = function(title, description, forever) {
	this._padding = 10;
	this._length = description.length;
	this._node = OZ.DOM.elm("div", {position:"absolute", className:"hint", opacity:0});
	this._node.innerHTML = "<h2>" + title + "</h2>" + description;
	
	OZ.CSS3.set(this._node, "transition", "opacity 0.3s");
	
	this._ec = [];
	this._ec.push = OZ.Event.add(this._node, "click", this._click.bind(this));
	this._id = null;
	this._forever = forever;
	
}

Hint.prototype.show = function(container, position) {
	if (Hint.first) {
		this._node.appendChild(OZ.DOM.elm("p", {innerHTML:"(click/touch this box to continue)"}));
		Hint.first = false;
	}

	this._node.style.visibility = "hidden";
	container.appendChild(this._node);
	
	var left = Math.max(position[0], this._padding);
	left = Math.min(left, container.offsetWidth-this._node.offsetWidth-this._padding);
	var top = Math.max(position[1], this._padding);
	top = Math.min(top, container.offsetHeight-this._node.offsetHeight-this._padding);
	
	this._node.style.left = Math.round(left) + "px";
	this._node.style.top = Math.round(top) + "px";
	
	this._node.style.visibility = "";
	this._node.style.opacity = "";
	this.dispatch("hint-show");

	if (!this._forever) {
		this._id = setTimeout(this._timeout.bind(this), Math.round(this._length * 80));
	}
}

Hint.prototype.hide = function() {
	this._node.parentNode.removeChild(this._node);
	while (this._ec.length) { OZ.Event.remove(this._ec.pop()); }
	if (this._id) { clearTimeout(this._id); }
	this.dispatch("hint-hide");
}

Hint.prototype._click = function(e) {
	this.hide();
}

Hint.prototype._timeout = function() {
	this._id = null;
	this.hide();
}
