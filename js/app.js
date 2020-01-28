//Parent Class
var Character = function(sprite, x, y, name) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.name = name;
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "15px Roboto";
    ctx.textAlign = "center";
    ctx.fillText(this.name, this.x + 50, this.y + 155);
};

//Child classes

// Enemies our player must avoid
var Enemy = function(sprite, x, y, name, speed) {
    Character.call(this, sprite, x, y, name);
    this.speed = speed;
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt) {
    if (this.x < 500){
        this.x += this.speed * dt;
    }
    else {
        this.x = -2;
        this.y = Math.random() * 184 + 50;
    }
    checkCollision();
};

// Player we control
var Player = function(sprite, x, y, name, speed) {
    Character.call(this, sprite, x, y, name);
    this.speed = 50;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function(e) {

    if (e === 'left' && this.x > 0){
        this.x -= this.speed;
    }
    else if (e === 'right' && this.x < 400){
        this.x += this.speed;
    }
    else if (e === 'up'){
        if (this.y < 40){

        this.reset();
        level++;
        console.log('current level: ' + level);
        increaseLevel(level); // adds more enemies based on the level
        }
        else {
            this.y -= this.speed;
        }
    }
    else if (e === 'down' && this.y < 400){
        this.y += this.speed;
    }
};
// Player reset back to original position
Player.prototype.reset = function() {
    this.x = 100;
    this.y = 300;
};
//Level increases
var increaseLevel = function(level) {
    allEnemies.length = 0;
    // list of names for the enemy
    var name = ['vampire', 'werewolf','hybrid'];
    // new set of enemies for loop
    for (var i = 0; i < level; i++) {
        var enemy = new Enemy('images/enemy-bug.png', 0, Math.random() * 184 + 50, name[i], Math.random() * 256);
        allEnemies.push(enemy);
    }
    // Add 1 more enemy after level 5
    if (level > 5) {
        var enemybig = new Enemy('images/enemy-bug.png', 0, Math.random() * 184 + 50, name[i], Math.random() * 256);
        allEnemies.push(enemybig);
    }
};
// decreasing enemy, level and score
var decreaseLevel = function() {
    if (allEnemies.length >= 1) {
        allEnemies.pop(enemy);
        level--; // adds to the current level
    }
};
// Checking for collision
var checkCollision = function() {
    //If the player reachs enemy proximity by 40px in all directions, execute the following
    for (var i = 0; i < allEnemies.length; i++) {
        if (Math.abs(player.x - allEnemies[i].x) <= 40) {
            if (Math.abs(player.y - allEnemies[i].y) <= 40) { //Math.abs(-x) = x
                player.reset();
                decreaseLevel();
            }
        }
    }
};

// Enemies storage place
var allEnemies = [];

// Instantiate a new player
var player = new Player('images/char-boy.png', 200, 400, 'Ramya');

// Start level at 1
var level = 1;

// Instantiate one enemy in the beginning
var enemy = new Enemy('images/enemy-bug.png', -2, Math.random() * 184 + 50, 'vampire', Math.random() * 256);
allEnemies.push(enemy);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
