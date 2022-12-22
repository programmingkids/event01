// スタート画面のシーン
var startScene = new Phaser.Scene("startScene");

startScene.create = function () {
    // スタート画像表示
    var w = this.game.config.width;
    var h = this.game.config.height;
    this.gamestart = this.add.image(w / 2, h / 2, 'gamestart');
    this.gamestart.setDisplaySize(w/2,h /2);
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('mainScene');
    }, this);
    
    this.gamestart.setInteractive({
        useHandCursor: true,
    });
    
    this.gamestart.on('pointerdown', function(){
        this.scene.start('mainScene');
    },this);
};
