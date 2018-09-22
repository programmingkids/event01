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
        Container.core.onload = function () {
            // draw ground
            let ground = new Ground(Container.core);
            // draw mario
            let mario = new Mario(Container.core, Setting.mario.x, Setting.mario.y);
        }
        Container.core.start();
    },
};

var Ground = Class.create(Sprite, {
    initialize: function (core) {
        let ground_height = core.height - (Setting.mario.y + 80);
        Sprite.call(this, core.width, ground_height);
        this.image = Container.core.assets['./images/ground.png'];
        this.x = 0;
        this.y = Setting.mario.y + 80;
        core.rootScene.addChild(this);
    }
});

var Mario = Class.create(Sprite, {
    init: function (core, x, y) {
        Sprite.call(this, 80, 80);
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
        this.image = core.assets['./images/mario_right.png'];
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
            if (this.y > this.posy) {
                this.frame = 0;
                // mario is on ground
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
        // add mario to core
        Container.core.rootScene.addChild(this);
    },
    calcFrame: function () {
        return [0, 1, 0, 2][Math.floor(this.age / 2) % 4];
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
            // if mario is on ground
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
