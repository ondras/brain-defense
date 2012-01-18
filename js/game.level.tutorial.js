Game.Level.Tutorial = OZ.Class().extend(Game.Level);

Game.Level.Tutorial.prototype.init = function(game) {
	Game.Level.prototype.init.call(this, game);
	this._conf.startSpawn = 2000;
	this._currentSpawn = this._conf.startSpawn;
	this._progress = 0;
	this._tutorialEvent = null;
}

Game.Level.Tutorial.prototype.start = function() {
	this._game.setSize(this._map.getSize());
	this._engine.start();
	this._nextStep();
}

Game.Level.Tutorial.prototype._event = function(e) {
	OZ.Event.remove(this._tutorialEvent);	
	this._nextStep();
}

Game.Level.Tutorial.prototype._nextStep = function() {
	this._progress++;
	var pos = [this._map.getSize()[0], this._map.getSize()[1]/6];

	switch (this._progress) {
		case 1: /* start */
			var size = this._map.getSize();

			var enemy = new Enemy.Zombie.Tutorial([size[0]/8, size[1]/2]);
			enemy.setMap(this._map)
			enemy.setFences(this._fences)
			this._enemies.push(enemy);
			this._engine.addActor(enemy, "enemies");

			var p1 = [size[0]/4, size[1]/3];
			var p2 = [size[0]/4, 2*size[1]/3];
			var fence = new Fence(p1, p2, 1);
			this._fences.push(fence);
			this._engine.addActor(fence, "fences");

			this._tutorialEvent = OZ.Event.add(this._engine, "frame", this._event.bind(this));
		break;
		
		case 2: /* first zombie + fence drawn */
			var hint = new Hint("Well, well, well.", "What do we have here? A zombie? Trying to get to the precious yummy brain&hellip;", true);
			this._game.showHint(hint, pos);
			this._tutorialEvent = OZ.Event.add(hint, "hint-hide", this._event.bind(this));
		break;
		
		case 3: /* first hint (zombie info) dismissed */
			var hint = new Hint("Fear not!", "Luckily for us, there is a solid laser-fence in the way, so let's watch what happens&hellip;", true);
			this._game.showHint(hint, pos);
			this._tutorialEvent = OZ.Event.add(hint, "hint-hide", this._event.bind(this));
		break;

		case 4: /* second hint (fence info) dismissed */
			this._enemies[0].start(30);
			this._tutorialEvent = OZ.Event.add(this._enemies[0], "enemy-dead", this._event.bind(this));
		break;

		case 5: /* zombie died */
			var hint = new Hint("Oops?", "The zombie got blasted, but it looks like the fence is gone as well. If some other zombies appear, would you please block their way by creating additional laser fences?", true);
			this._game.showHint(hint, pos);
			this._tutorialEvent = OZ.Event.add(hint, "hint-hide", this._event.bind(this));
		break;

		case 6: /* last hint dismissed */
			this._game.enableDrawing();
			this._enableSpawn();
		break;
	}
}
