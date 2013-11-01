// resources
//http://www.lorestrome.com/pixel_archive/main.htm

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function ()
{
	bgReady = true;
};
bgImage.src = "images/bg_big.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () 
{
	heroReady = true;
};
heroImage.src = "images/hero_animation.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () 
{
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var gameDetail = 
{
  mapx: 0,
  mapy: 0
};

var hero =
{
	speed: 256, // movement in pixels per second
  animationDirection: 0,
  animationMove: 0
};

var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function ()
{
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var changeMap = function()
{
  
}
// Check is player enters new map
var checkMap = function ()
{
  if (hero.x >= (canvas.width - 10))
  {
    hero.x = 20;
    gameDetail.mapx += 1;
  }
  if (hero.x <= 10)
  {
    hero.x = (canvas.width - 20);
    gameDetail.mapx -= 1;
    
  }
  if (hero.y >= (canvas.height - 10))
  {
    hero.y = 20;
    gameDetail.mapy += 1;
    
  }
  if (hero.y <= 10)
  {
    hero.y = (canvas.height - 20);
    gameDetail.mapy -= 1;
    
  }

}

// Update game objects
var update = function (modifier) 
{
	if (38 in keysDown)
  { // Player holding up
    if ( (gameDetail.mapy == 0 ) && (hero.y <= 20))
    { // Create boundary cases for map edge   
      hero.y += 5;
    }
    else
    {
      hero.y -= hero.speed * modifier;
      if (hero.animationDirection == 3)
      {
        hero.animationMove += 1;
        hero.animationMove = hero.animationMove % 3;
      }
      else
      {
        hero.animationDirection = 3;
        hero.animationMove = 0;
      }     
    }
	}
	if (40 in keysDown)
  { // Player holding down
    if ( (gameDetail.mapy == 3 ) && (hero.y >= canvas.height - 40))
    {    
      hero.y -= 5;
    }
    else
    {
      hero.y += hero.speed * modifier;
      if (hero.animationDirection == 0)
      {
        hero.animationMove += 1;
        hero.animationMove = hero.animationMove % 3;
      }
      else
      {
        hero.animationDirection = 0;
        hero.animationMove = 0;
      }
    }
	}
	if (37 in keysDown)
  { // Player holding left
    if ( (gameDetail.mapx == 0 ) && (hero.x <= 20))
    {    
      hero.x += 5;
    }
    else
    {
      hero.x -= hero.speed * modifier;
      if (hero.animationDirection == 1)
      {
        hero.animationMove += 1;
        hero.animationMove = hero.animationMove % 3;
      }
      else
      {
        hero.animationDirection = 1;
        hero.animationMove = 0;
      }
    }
	}
	if (39 in keysDown)
  { // Player holding right
    if ( (gameDetail.mapx == 3 ) && (hero.x >= canvas.width - 40))
    {    
      hero.x -= 5;
    }
    else
    {
      hero.x += hero.speed * modifier;
      if (hero.animationDirection == 2)
      {
        hero.animationMove += 1;
        hero.animationMove = hero.animationMove % 3;
      }
      else
      {
        hero.animationDirection = 2;
        hero.animationMove = 0;
      }
    }
	}

	// Are they touching?
	if( hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32))
  {
		++monstersCaught;
		reset();
	}
  
  // see if hero transitions to new map
  checkMap();
  
};

// Draw everything
var render = function ()
{
  var map_cut_x = gameDetail.mapx * -512;
  var map_cut_y = gameDetail.mapy * -512;
  var hero_cut_y = hero.animationDirection * 32;
  var hero_cut_x = hero.animationMove * 32;
  
	if (bgReady)
  {
		ctx.drawImage(bgImage, map_cut_x, map_cut_y);
  }

	if (heroReady)
  {
		ctx.drawImage(heroImage, hero_cut_x, hero_cut_y, 32, 32, hero.x, hero.y, 48, 48);
	}

	if (monsterReady)
  {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function ()
{
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
