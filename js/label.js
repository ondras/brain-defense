var Label = OZ.Class();
Label.prototype.init = function(text, options) {
	this._prefix = null;
	
	this._options = {
		distance: 500
	}
	for (var p in options) { this._options[p] = options[p]; }

	var prefixes = ["", "ms", "Webkit", "O", "Moz"];
	for (var i=0;i<prefixes.length;i++) {
		var p = prefixes[i];
		var prop = (p ? p + "Transform" : "transform");
		if (prop in document.body.style) { this._prefix = p; }
	}
	
	this._items = [];
	var scale = this._options.distance * 18 / (100 * text.length);
	
	for (var i=0;i<text.length;i++) {
		var node = OZ.DOM.elm("span", {innerHTML:text.charAt(i)});
		var css = "";
		
		if (this._prefix === null) {
			css = (100*scale) + "%";
		} else {
			node.style.position = "absolute";
			var angle = 100*(i-(text.length-1)/2) / text.length;
			
			var transitionProp = (this._prefix ? this._prefix + "Transition" : "transition");
			var transformProp = (this._prefix ? this._prefix + "Transform" : "transform");
			var originProp = (this._prefix ? this._prefix + "TransformOrigin" : "transformOrigin");
			var transformValue = (this._prefix ? "-"+this._prefix.toLowerCase() + "-" : "") + "transform";
			
			node.style[transitionProp] = transformValue + " 1s";
			node.style[originProp] = "50% 100%";
			node.style[transformProp] = "translate(-50%, -50%) rotate(" + angle + "deg) scale(0, 0)";
			css = "translate(-50%, -50%) rotate(" + angle + "deg) translate(0, -" + this._options.distance  + "px) scale(" + scale + "," + scale + ")";
		}
		this._items.push({
			node: node,
			css: css
		});
	}
}

Label.prototype.show = function(container) {
	var left = Math.round(container.offsetWidth/2);
	var top = Math.round(container.offsetHeight);
	var tmp = null;
	
	if (this._prefix === null) {
		tmp = OZ.DOM.elm("div", {position:"absolute", bottom:this._options.distance + "px"});
		container.appendChild(tmp);
	}
	
	
	for (var i=0;i<this._items.length;i++) {
		var item = this._items[i];
		container.appendChild(item.node);
		
		if (this._prefix === null) {
			item.node.style.fontSize = item.css;
			tmp.appendChild(item.node);
		} else {
			item.node.style.left = left+"px";
			item.node.style.top = top+"px";
		}
	}
	
	if (this._prefix === null) {
		left -= tmp.offsetWidth/2;
		tmp.style.left = left+"px";
	} else {
		setTimeout(this._start.bind(this), 0);
	}
	
	setTimeout(this._end.bind(this), 1000);
}

Label.prototype._start = function() {
	var transformProp = (this._prefix ? this._prefix + "Transform" : "transform");
	for (var i=0;i<this._items.length;i++) {
		var item = this._items[i];
		item.node.style[transformProp] = item.css;
	}
}

Label.prototype._end = function() {
	this.dispatch("done");
}
