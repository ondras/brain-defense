var Label = OZ.Class();
Label.prototype.init = function(text, options) {
	this._transform = (OZ.CSS3.getProperty("transform") !== null);
	
	this._options = {
		distance: 500
	}
	for (var p in options) { this._options[p] = options[p]; }

	this._items = [];
	var scale = this._options.distance * 3 / (100 * text.length);
	
	for (var i=0;i<text.length;i++) {
		var node = OZ.DOM.elm("span", {innerHTML:text.charAt(i)});
		var css = "";
		
		if (this._transform) {
			node.style.position = "absolute";
			var angle = 100*(i-(text.length-1)/2) / text.length;
			
			OZ.CSS3.set(node, "transition", OZ.CSS3.getProperty("transform") + " 1s");
			OZ.CSS3.set(node, "transformOrigin", "50% 100%");
			OZ.CSS3.set(node, "transform", "translate(-50%, -50%) rotate(" + angle + "deg) scale(0.01, 0.01)");
			
			css = "translate(-50%, -50%) rotate(" + angle + "deg) translate(0, -" + this._options.distance  + "px) scale(" + scale + "," + scale + ")";
		} else {
			css = (5*100*scale) + "%";
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
	
	if (!this._transform) {
		tmp = OZ.DOM.elm("div", {position:"absolute", bottom:this._options.distance + "px"});
		container.appendChild(tmp);
	}
	
	
	for (var i=0;i<this._items.length;i++) {
		var item = this._items[i];
		container.appendChild(item.node);
		
		if (this._transform) {
			item.node.style.left = left+"px";
			item.node.style.top = top+"px";
		} else {
			item.node.style.fontSize = item.css;
			tmp.appendChild(item.node);
		}
	}

	if (this._transform) {
		setTimeout(this._start.bind(this), 0);
	} else {
		left -= tmp.offsetWidth/2;
		tmp.style.left = left+"px";
	}

	setTimeout(this._end.bind(this), 1000);
}

Label.prototype._start = function() {
	for (var i=0;i<this._items.length;i++) {
		var item = this._items[i];
		OZ.CSS3.set(item.node, "transform", item.css);
	}
}

Label.prototype._end = function() {
	this.dispatch("label-done");
}
