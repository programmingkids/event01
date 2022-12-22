var mainScene = new Phaser.Scene("mainScene");

// 初期設定
mainScene.config = function() {
    // プレイヤーの動く速度
    this.runSpeed = 300;
    // プレイヤーのジャンプパワー
    this.jumpPower = 500;
    // プレイヤーの画像
    this.playerImage = "player1";
    // ゲームオーバーフラグ
    this.gameOver = false;
    // スコアの初期値
    this.score = 0;
    // 敵の配列
    this.enemyData = ['enemy01','enemy02','enemy05','enemy07','enemy08'];
    // 敵のスピードを設定する配列
    this.enemySpeed = [-100,-50,50,100];
    // カーソルを取得する
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.windowWidth = this.game.config.width;
    this.windowHeight = this.game.config.height;
};

// マップ表示
mainScene.createMap = function() {
    // JSON形式のマップデータの読み込み　Tilemapオブジェクトの作成
    this.map = this.make.tilemap({key: 'map'});

    // タイル画像をマップデータに反映する　Tilesetオブジェクトの作成
    var groundTiles = this.map.addTilesetImage('tiles');
    // 地面レイヤー作成 DynamicTilemapLayerオブジェクト作成
    this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
    
    // 衝突判定から除外したいタイルのインデックスを配列で指定する
    // -1は空のタイルなので衝突しない。それ以外は衝突する
    this.groundLayer.setCollisionByExclusion([-1]);

    // ゲームワールドの幅と高さの設定
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
};

mainScene.createCoin = function() {
    // コイン画像の読み込み
    var coinTiles = this.map.addTilesetImage('coin');
    // コインレイヤー作成
    this.coinLayer = this.map.createDynamicLayer('Coin', coinTiles, 0, 0);
    // プレイヤーとコインレイヤーの衝突判定（すり抜けモード）
    this.physics.add.overlap(this.player, this.coinLayer);
    // コインレイヤーとの衝突処理
    this.coinLayer.setTileIndexCallback(17, this.collectCoin, this);
};

mainScene.createPlayer = function() {
    // プレイヤースプライトの表示
    this.player = this.physics.add.sprite(50, 100, this.playerImage);
    
    // 衝突サイズの調整
    this.player.body.setSize(20,25);
    
    // プレイヤーのサイズ変更
    this.player.setDisplaySize(70,70);
    
    // プレイヤーの方向
    this.player.direction = 'right';
    
    // プレイヤーの衝突時のバウンス設定
    this.player.setBounce(0);
    // プレイヤーがゲームワールドの外に出ないように衝突させる
    this.player.setCollideWorldBounds(true);
    // プレイヤーが地面レイヤーと衝突する設定
    this.physics.add.collider(this.player, this.groundLayer);

    // プレイヤーの歩行アニメーション
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames(this.playerImage, {prefix: 'sprite', start: 7, end: 9}),
        frameRate: 10,
        repeat: -1
    });
    // プレイヤーの正面を向く状態のアニメーション
    this.anims.create({
        key: 'turn',
        frames: [{key: this.playerImage, frame: 'sprite1'}],
        frameRate: 10,
    });
};

mainScene.createEnemyGroup = function() {
    // 敵グループ作成
    this.enemies = this.physics.add.group();
    
    // 最初の敵の作成
    this.createEnemy();
    // 敵はマップと衝突する
    this.physics.add.collider(this.enemies, this.groundLayer);
    // 敵はプレイヤーと衝突する
    this.physics.add.overlap(this.enemies, this.player, this.hitEnemy, null, this);
    // 1秒ごとに、新しい敵を作成する
    this.enemyTimer = this.time.addEvent({
      delay: 1000,
      callback: this.createEnemy,
      loop: true,
      callbackScope: this
    });
};

mainScene.create = function () {
    // 初期設定
    this.config();
    
    // マップ表示
    this.createMap();
    
    // プレイヤー作成
    this.createPlayer();
    
    // コイン作成
    this.createCoin();
    
    // 敵作成
    this.createEnemyGroup();
    
    // カメラはプレイヤーを追跡する。プレイヤーの移動に合わせて、カメラが表示が移動する
    this.cameras.main.startFollow(this.player);
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    // 画面左下に白色でテキスト表示
    this.text = this.add.text(this.windowWidth - 150, 50, "Score: " + this.score, {
        fontSize: '30px Open Sans',
        fill: '#ff0000'
    });
    // 文字は固定表示（カメラに合わせて移動しない）
    this.text.setScrollFactor(0);
    
    // ファイヤーグループ作成
    this.fireGroup = this.physics.add.group();
    this.physics.add.overlap(this.enemies, this.fireGroup,this.hitFire, null, this);
    this.physics.add.collider(this.fireGroup, this.groundLayer, this.hitFireGround, null, this);
    
    // スペースキーでファイヤ発射
    this.input.keyboard.on('keydown-SPACE', function() {
        // ファイヤー作成
        if (typeof this.playerAttack !== 'undefined') {
            this.playerAttack();
        }
    }, this);
    
    // 各関数をbindする
    if (typeof moveRight !== 'undefined') {
        this.moveRight = moveRight.bind(this);
    }
    if (typeof moveLeft !== 'undefined') {
        this.moveLeft = moveLeft.bind(this);
    }
    if (typeof jump !== 'undefined') {
        this.jump = jump.bind(this);
    }
    if (typeof playerAttack !== 'undefined') {
        this.playerAttack = playerAttack.bind(this);
    }
    if (typeof hitCoin !== 'undefined') {
        this.hitCoin = hitCoin.bind(this);
    }
};

mainScene.hitFire = function(enemy, fire) {
    enemy.destroy();
    fire.destroy();
};

mainScene.hitFireGround = function(fire, ground) {
    fire.destroy();
};

mainScene.update = function() {
    if(this.gameOver) {
        return false;
    }
    if (this.cursors.left.isDown) {
        if (typeof this.moveLeft !== 'undefined') {
            this.moveLeft();
            //this.player.body.setVelocityX(-this.runSpeed);
            this.player.anims.play('walk', true);
            this.player.flipX = true;
            this.player.direction = 'left';
        }
    }
    else if (this.cursors.right.isDown) {
        if (typeof this.moveRight !== 'undefined') {
            this.moveRight();
            //this.player.body.setVelocityX(this.runSpeed);
            this.player.anims.play('walk', true);
            this.player.flipX = false;
            this.player.direction = 'right';
        }
    } else {
        this.player.body.setVelocityX(0);
        this.player.anims.stop();
    }
    if (this.cursors.up.isDown && this.player.body.onFloor()) {
        if (typeof this.jump !== 'undefined') {
            this.jump();
            //this.player.body.setVelocityY(-this.jumpPower);
        }
    }
};

mainScene.createEnemy = function() {
    var enemyType = Phaser.Math.RND.pick(this.enemyData);
    var enemyPositionX = Phaser.Math.RND.between(500, 2000);

    var enemy = this.enemies.create(enemyPositionX, 100, enemyType);
    enemy.body.setSize(350,350);
    enemy.setDisplaySize(70, 70);
    var speed = Phaser.Math.RND.pick(this.enemySpeed);
    enemy.setVelocityX(speed);
};

mainScene.collectCoin = function(sprite, tile) {
    if (typeof this.hitCoin !== 'undefined') {
        this.coinLayer.removeTileAt(tile.x, tile.y);
        this.hitCoin();
    }
};

mainScene.hitEnemy = function(player, enemy) {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.stop();
    this.gameOver = true;
    this.enemyTimer.remove();
    
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    var gameover = this.add.image(cameraPositionX, cameraPositionY, 'gameover');
    gameover.setDisplaySize(500,400);
    
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};

mainScene.createFire = function(speed) {
    var x = this.player.body.center.x;
    var y = this.player.body.center.y;
    var fire = this.fireGroup.create(x, y, 'fire');
    fire.body.setSize(20,20);
    fire.setDisplaySize(80,80);
    fire.body.setAllowGravity(false);
    // プレイヤーの進行方向に発射
    if( this.player.direction == 'left' ) {
        fire.setAngle(90);
        fire.setVelocityX(-speed);
    } else {
        fire.setAngle(-90);
        fire.setVelocityX(speed);
    }
};

mainScene.scoreUp = function(value) {
    this.score += value;
    this.text.setText("Score: " + this.score);    
};
