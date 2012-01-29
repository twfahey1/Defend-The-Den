Crafty.c("SkillButton", {
    init: function() {
        this.addComponent("2D, Canvas, Mouse, KeyBoard, Sprite, skill");
        this.attr({
            x: 10,
            y: 520,
            w: 52,
            h: 52,
            z: 16
        });
        this.cooldown = 0.5;
        this.coolDownStart = 0;
        this.coolDownFinish = 0;
        this.cdon = false;
        this._coolDownCount = Crafty.e("2D, Canvas, skillCooldown").attr({
            x: this.x,
            y: this.y,
            w: this.w,
            h: 0,
            z: 19
        });
        this._keyPressSprite = Crafty.e("2D, Canvas, skillKeyPress").attr({
            x: this.x,
            y: this.y,
            w: this.w,
            h: 0,
            z: 17
        });
        this.bind("EnterFrame", function() {
            if(this.cdon) {
                var newH = (this.coolDownFinish - parseInt(new Date().getTime(), 10)) * 44 / (1000 * this.cooldown);
                var newY = this.y + (52 - newH) / 2;
                if(newH < 0) {
                    this.cdon = false;
                    newH = 0;
                    newY = 10;
                }
                this._coolDownCount.attr({
                    h: newH,
                    y: newY
                });
            }
        });
    }
});
Crafty.c("ThrowingAxe", {
    init: function() {
        this._used = false;
        this.addComponent("2D, Canvas, Collision, axe");
        this.attr({
            x: 32,
            y: 32,
            w: 42,
            h: 42
        });
        this.origin("center");
        this.bind("EnterFrame", function() {
            this.attr({
                rotation: this.rotation + 19
            });
            this.move("e", 12);
        });

        this.onHit("Pig", function(o) {
            o[0].obj.takeDamage(Crafty.randRange(45, 75));
            this.destroy();
        });
        this.bind("EnterFrame", function() {
            if(!isInViewPort(this)) {
                this.destroy();
            }
        });
        new Sound(soundResources.throwing, {
            volume: 40,
            destroyIn: 1000
        }).play();
    }
});

Crafty.c("BearTrap", {
    init: function() {
        this._used = false;
        this.addComponent("2D, Canvas, Collision, bearTrap");
        this.attr({
            x: 32,
            y: 32,
            w: 65,
            h: 65
        });
        //this.origin("center");
        this.bind("EnterFrame", function() {

        });

        
    }
});

function throwAxe() {
	
	storage.axeThrowed.set(storage.axeThrowed.get()+1);
    
    Crafty.e("ThrowingAxe").attr({
        x: DefendTheDen.wolf.x,
        y: DefendTheDen.wolf.y-30
    });
}

function bearTrap() {
	Crafty.e("BearTrap").attr({
        x: DefendTheDen.wolf.x,
        y: DefendTheDen.wolf.y
    });
}

function SkillButton(position, skillName, options) {
    this.position = position || 1;
    this.skillName = skillName || "";
    _.defaults(options, {
        sprite: "axe",
        keyBind: 1,
        cooldown: 1.5,
        action: function() {

        }
    });
    var that = this;
    this.c = Crafty.c(that.skillName + "Skill", {
        init: function() {
            this.addComponent("SkillButton");
            this.attr({
            	x: this._x+((this._x+this._w)*position)-this._w
            });
            
            this.cooldown = options.cooldown;
            this.bind('KeyUp', function(e) {
                if(e.keyCode === Crafty.keys["" + options.keyBind + ""]) {
                	this._keyPressSprite.attr({
                		h: 0
                	});
					this.checkAction();
                }
            });
            this.bind('KeyDown', function(e) {
                if(e.keyCode === Crafty.keys["" + options.keyBind + ""]) {
                    this._keyPressSprite.attr({
                		h: 54
                	});
                }
            });
            
            this.bind('MouseDown', function(e) {
            	this._keyPressSprite.attr({
            		h: 54
            	});
            });
            this.bind('MouseUp', function(e) {
            	this._keyPressSprite.attr({
            		h: 0
            	});
            	this.checkAction();
            });

            this.bindVisual();
            
            this._coolDownCount.attr({
            	x: this._x
            });
            this._keyPressSprite.attr({
            	x: this._x
            });
        },
        checkAction: function() {
            if(!this.cdon) {
                this.action();
                this.coolDownStart = parseInt(new Date().getTime(), 10);
                this.coolDownFinish = parseInt(new Date().getTime() + (this.cooldown * 1000), 10);
                this.cdon = true;
            }
        },
        bindWolf: function(wolf) {
            this._wolf = wolf;
        },
        action: function() {
        	DefendTheDen.skillChange();
            DefendTheDen.selectedSkill = that.skillName + "Skill";
            this.trigger("action");
            options.action();
        },
        bindVisual: function() {
            this._skillVisual = Crafty.e("2D, Canvas, " + options.sprite).attr({
                x: this.x + 4,
                y: this.y + 4,
                w: 42,
                h: 42,
                z: 16
            });
        }
    });
    this.e = Crafty.e(this.skillName + "Skill");
}