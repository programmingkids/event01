enchant();

window.onload = function () {
    Game.initialize();
};


var Container = {
    'core': null,
    'width': window.innerWidth,
    'height': window.innerHeight,
};

var Game = {
    initialize: function () {
        Container.core = new Core(Container.width, Container.height);
        Container.core.preload(Setting.images);
        Container.core.rootScene.backgroundColor = Setting.backgroundColor;
        Container.core.scale = 1;
        // bind space key to button a
        Container.core.keybind(32, 'a');
        // rootScene
        var rootScene = Container.core.rootScene;
        rootScene.on("enter",function(){
            new Ground(Container.core);
            new Robot(Container.core, Setting.robot.x, Setting.robot.y);
            new Enemy1(Container.core, Container.width-100 , Setting.robot.y);
        });
        rootScene.on("enterframe", function() {
            if(Container.core.frame == 90 ) {
                new Enemy2(Container.core, Container.width-100 , Setting.robot.y);
            }
            if(Container.core.frame == 120 ) {
                new Enemy3(Container.core, Container.width-100 , Setting.robot.y);
            }
        });
        Container.core.start();
    },
};

var Ground = Class.create(Sprite, {
    initialize: function (core) {
        let ground_height = core.height - (Setting.robot.y + 80);
        Sprite.call(this, core.width, ground_height);
        this.name = "ground";
        this.image = Container.core.assets[IMAGE_GROUND];
        this.x = 0;
        this.y = Setting.robot.y + 80;
        core.rootScene.addChild(this);
    }
});

var Robot = Class.create(Sprite, {
    init: function (core, x, y) {
        Sprite.call(this, 80, 80);
        this.name = "robot";
        this.x = x;
        this.y = y;
        this.posy = y;
        this.vy = 0;
        this.speedX = 10;
        this.speedY = 18;
        this.jump = false;
        this.scaleX = 1;
        this.scaleY = 1;
        this.gravity = 0.98;
        this.image = core.assets[IMAGE_ROBOT];
    },
    initialize: function (core, x, y) {
        this.init(core, x, y);
        this.on('enterframe', function () {
            // left key pressed
            if (core.input.left) {
                this.moveLeft();
            }
            // right key pressed
            if (core.input.right) {
                this.moveRight()
            }
            // space key pressed
            if (core.input.a) {
                this.jumpUp();
            }
            // while do jumping
            if (this.jump === true) {
                this.jumpDown();
            }
            
            // landing
            if (this.jump && this.y > this.posy) {
                this.frame = 0;
                // robot is on ground
                this.y = this.posy;
                this.vy = 0;
                // stop jumping
                this.jump = false;
            }
            
            // reach window.left
            if (this.x < 0) {
                this.x = 0;
            }
            // reach window.right
            if (this.x > core.width - 80) {
                this.x = core.width - 80;
            }
        });

        const self = this;
        // key event onkeyup of right
        Container.core.rootScene.addEventListener(Event.RIGHT_BUTTON_UP, function () {
            self.frame = 0;
        });
        // key event onkeyup of left
        Container.core.rootScene.addEventListener(Event.LEFT_BUTTON_UP, function () {
            self.frame = 0;
        });
        // add robot to core
        Container.core.rootScene.addChild(this);
    },
    calcFrame: function () {
        var pattern = [0, 1, 2, 1];
        return pattern[Math.floor(this.age / ROBOT_ANINATION_DURATION) % pattern.length];
    },
    
    moveRight: function () {
        if (typeof moveRight !== 'undefined') {
            moveRight(this);
            this.x += this.speedX;
            this.frame = this.calcFrame();
        }
    },
    moveLeft: function () {
        if (typeof moveLeft !== 'undefined') {
            moveLeft(this);
            this.x -= this.speedX;
            this.frame = this.calcFrame();
        }
    },
    jumpUp: function () {
        if (typeof jumpUp !== 'undefined') {
            jumpUp(this);
            // if robot is on ground
            if (this.y === this.posy) {
                // do jump
                this.vy = this.speedY;
                this.jump = true;
            }
        }
    },
    jumpDown: function () {
        // move up
        this.y -= this.vy;
        if (typeof jumpDown !== 'undefined') {
            jumpDown(this);
            // move down
            this.vy -= this.gravity;
        }
    },
    turnImage: function (direction) {
        if (direction == 'left') {
            this.scaleX = -1;
        }
        if (direction == 'right') {
            this.scaleX = 1;
        }
        if (direction == 'jump') {
            this.frame = 2;
        }
    },
});

var Enemy1 = Class.create(Sprite, {
    init: function (core, x, y) {
        Sprite.call(this, 80, 80);
        this.name = "enemy1";
        this.x = x;
        this.y = y;
        this.speed = 7;
        this.vx = -this.speed;
        this.image = core.assets[IMAGE_ENEMY1];
        this.robot = null;
        var data = Container.core.rootScene;
        var children = data.childNodes;
        for(var i in children) {
            if(children[i]["name"] == "robot") {
                this.robot = children[i];
            }
        }
    },
    initialize: function (core, x, y) {
        this.init(core, x, y);
        this.on('enterframe', this.move);
        // add enemy to scene
        Container.core.rootScene.addChild(this);
    },
    move : function() {
        var vx = this.vx;
        this.moveBy(vx,0);
        if(this.x < 0) {
            this.vx = -this.vx;
        }
        if(this.x > Container.width - 80) {
            this.vx = -this.vx;
        }
        if(this.within(this.robot,60)) {
            Container.core.end();
        }
    },
});

var Enemy2 = Class.create(Sprite, {
    init: function (core, x, y) {
        Sprite.call(this, 80, 80);
        this.name = "enemy2";
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.vx = -this.speed;
        this.image = core.assets[IMAGE_ENEMY2];
        this.robot = null;
        var data = Container.core.rootScene;
        var children = data.childNodes;
        for(var i in children) {
            if(children[i]["name"] == "robot") {
                this.robot = children[i];
            }
        }
    },
    initialize: function (core, x, y) {
        this.init(core, x, y);
        this.on('enterframe', this.move);
        // add enemy to scene
        Container.core.rootScene.addChild(this);
    },
    move : function() {
        var vx = this.vx;
        this.moveBy(vx,0);
        if(this.x < 0) {
            this.vx = -this.vx;
        }
        if(this.x > Container.width - 80) {
            this.vx = -this.vx;
        }
        if(this.within(this.robot,60)) {
            Container.core.end();
        }
    },
});


var Enemy3 = Class.create(Sprite, {
    init: function (core, x, y) {
        Sprite.call(this, 80, 80);
        this.name = "enemy3";
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.vx = -this.speed;
        this.image = core.assets[IMAGE_ENEMY3];
        this.count = 0;
        this.process = this.walk;
        this.robot = null;
        var data = Container.core.rootScene;
        var children = data.childNodes;
        for(var i in children) {
            if(children[i]["name"] == "robot") {
                this.robot = children[i];
            }
        }
    },
    initialize: function (core, x, y) {
        this.init(core, x, y);
        Container.core.rootScene.addChild(this);
    },
    onenterframe: function() {
        this.process();
    },
    walk : function() {
        var vx = this.vx;
        this.moveBy(vx,0);
        this.count++;
        if( this.count > 60) {
            this.count = 0;
            this.process = this.stay;
        }
        if(this.x < 0) {
            this.vx = -this.vx;
        }
        if(this.x > Container.width - 80) {
            this.vx = -this.vx;
        }
        if(this.within(this.robot,60)) {
            Container.core.end();
        }
    },
    stay : function() {
        this.count++;
        if(this.count > 60) {
            this.count = 0;
            this.process = this.walk;
        }
        if(this.within(this.robot,60)) {
            Container.core.end();
        }
    },
});
