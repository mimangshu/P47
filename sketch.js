var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg, restartImg
var jumpSound, checkPointSound, dieSound

var gs = 0

function preload() {
  button = loadImage("button1.png")

  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("image_cloud.png");

  obstacle1 = loadImage("obstacle_11.png");
  obstacle2 = loadImage("obstacle_12.png");
  obstacle3 = loadImage("Obstacle_3.png");
  // obstacle4 = loadImage("obstacle4.png");
  // obstacle5 = loadImage("obstacle5.png");
  // obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("game over.jpg")

 // jumpSound = loadSound("jump.mp3")
 // dieSound = loadSound("die.mp3")
 // checkPointSound = loadSound("checkPoint.mp3")
 
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  start = createSprite(width / 2, height / 2 + 200)
  start.addImage(button)
  //start.link("www.google.com")
 // createCanvas(600, 200);

 // var message = "This is a message";
  //console.log(message)

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);


  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  ground.depth = trex.depth;
  trex.depth = trex.depth + 1;

  gameOver = createSprite(300, 70);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);


  gameOver.scale = 0.3;
  restart.scale = 0.5;

  invisibleGround = createSprite(200, 180, 400, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();


  trex.setCollider("circle", 0, 0, 30)
  trex.debug = true

  score = 0;
}
function draw() {
  background("lightblue")
  textSize(100)
  fill(0)
  // str=text("WELCOME TO THE GAMING MAZE", width/4-320,height/2)
  //str.link("www.google.com")

  if (gs === 1) {
    background(191, 239, 255);
    //displaying score
    text("Score: " + score, 500, 50);


    if (gameState === PLAY) {

      gameOver.visible = false;
      restart.visible = false;

      ground.velocityX = -(4 + score / 100)
      //scoring
      score = score + Math.round(getFrameRate() / 60);

      if (score > 0 && score % 100 === 0) {
        checkPointSound.play()
      }

      if (ground.x < 0) {
        ground.x = ground.width / 2;
      }

      //jump when the space key is pressed
      if (keyDown("space") && trex.y >= 120) {
        trex.velocityY = -12;
        jumpSound.play();
      }

      //add gravity
      trex.velocityY = trex.velocityY + 0.8

      //spawn the clouds
      spawnClouds();

      //spawn obstacles on the ground
      spawnObstacles();

      if (obstaclesGroup.isTouching(trex)) {
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()

      }
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;

      //change the trex animation
      trex.changeAnimation("collided", trex_collided);

      if (mousePressedOver(restart)) {
        reset();
      }

      ground.velocityX = 0;
      trex.velocityY = 0


      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
    }


    //stop trex from falling down
    trex.collide(invisibleGround);




    drawSprites();
  }

}


function reset() {
  gameState = PLAY
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running", trex_running)
  score = 0
}


function spawnObstacles() {
  if (frameCount % 80 === 0) {
    var obstacle = createSprite(650, 165, 10, 40);
    obstacle.velocityX = -(4.3 + score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      //case 4: obstacle.addImage(obstacle4);
      //      break;
      //case 5: obstacle.addImage(obstacle5);
      //      break;
      //case 6: obstacle.addImage(obstacle6);
      //         break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.05;
    obstacle.lifetime = 300;

    obstacle.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 2;

    obstacle.depth = restart.depth;
    restart.depth = restart.depth + 1;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(700, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.07;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 300;

    //adjust the depth
    cloudsGroup.depth = trex.depth;
    trex.depth = trex.depth + 3;

    cloudsGroup.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 2;

    cloudsGroup.depth = restart.depth;
    restart.depth = restart.depth + 1;



    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

