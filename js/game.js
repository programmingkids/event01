var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height:window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: [loadScene, startScene, mainScene],
};
var game = new Phaser.Game(config);

window.addEventListener("resize", (event) => {
    game.scale.resize(window.innerWidth, window.innerHeight);
},false);
