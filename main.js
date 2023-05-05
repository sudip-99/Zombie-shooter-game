//  !OPTIMIZED 
// FULL_OF_BUG = true
p = console.log
const canvas = document.getElementById('canvas')

const sound = document.createElement('audio')
sound.src = 'shooting-sound.wav'
const explosion_sound = document.createElement('audio')
explosion_sound.src = 'explosion.wav'
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = innerWidth
const CANVAS_HEIGHT = canvas.height = 250
let gameFrame = 0
let SCORE = 0
const staggerFrame_1 = 40
const staggerFrame_2 = 60
let gameOver = false

const IMAGES = {
  spaceShip : new Image,
  raven : new Image,
  fly : new Image,
  egg : new Image,
  zombie : new Image,
  raven : new Image,
  worm : new Image ,
  smoke : new Image,
  missile: [new Image,new Image],
  bullet : new Array(),
  INIT()
  {
    this.spaceShip.src = 'SpaceShip.png'
    this.raven.src = 'raven.png'
    this.missile[0].src = 'frame1.png'
    this.missile[1].src = 'frame2.png'
    this.fly.src = "enemy_fly.png"
    this.egg.src = 'egg.png'
    for (let i = 0; i < 8; ++i) {
      this.bullet.push(new Image())
      this.bullet[i].src = `0${i+1}.png`
    }
    this.zombie.src = 'zombie.png'
    this.raven.src = 'raven.png'
    this.worm.src = 'worm.png'
    this.smoke.src = 'smokeExplosion.png'
  }
}
IMAGES.INIT()


const backgroundImg = new Image
backgroundImg.src = "background-image.jpg"
class Player {

  constructor (game, x, y, width, height) {
    this.game = game
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.frame = 0
    this.fps = 20
    this.shootFps = 10
    this.health = 200
    this.playerSize = 60
    this.gravity = 0
    this.velY = 0
    this.canJump = false
    this.jumpCounter = 0 
    this.shootEvent = false
    this.jumpUpFrame = 0
    this.jumpDownFrame = 0
    this.maxJumpFrame = 3
    this.maxJumpHeight = 80
    this.shootFrame = 0
    this.deadFrame = 0 
    this.maxDeadFrame = 8
    this.dead = false
    this.maxShootFrame = 1
    this.ox = 12 
    this.oy = 5
    this.idleImages = new Array()
    this.bulletArray = new Array()
    this.jumpUpImages = new Array()
    this.jumpDownImages = new Array()
    this.deathImages = new Array()
    this.shootingImages = new Array()
    this.healthBar = new HealthBar(190,10, this.health, '#fcff5b95')
    for (let i = 0; i < 10; ++i) {
      // shootingImages & idleImages setup
      if (i < 3) {
        this.shootingImages.push(new Image)
        this.shootingImages[i].src = `Shoot (${i+1}).png`

        this.idleImages.push(new Image)
        this.idleImages[i].src = "idle.png"
      }
      // jumpupImages setup
      if (i<5){
      this.jumpUpImages.push(new Image)
      this.jumpUpImages[i].src = `Jump (${i+1}).png`
      }else {
        this.jumpDownImages.push(new Image)
        this.jumpDownImages[this.jumpDownImages.length-1].src =`Jump (${i+1}).png` 
        
      }


      // deathImages setup
      this.deathImages.push(new Image)
      this.deathImages[i].src = `Dead (${i+1}).png`

    }
  }

  draw () {

    this.healthBar.draw(20,CANVAS_HEIGHT*0.1)
        ctx.fillStyle = 'rgba(0,0,0,0)' 
    ctx.fillRect(this.x+this.ox, this.y+this.oy, this.width, this.height)
   this.death()
   if (this.shootEvent) this.shoot()
    this.jump()
    this.update()
  }

  update() {
    this.bulletArray = this.bulletArray.filter(obj => !obj.markForDeletion)
  }
  
  shoot(){
    if (this.shootEvent){
      ctx.drawImage(this.shootingImages[this.shootFrame],this.x,this.y,this.playerSize,this.playerSize)
      if(!(gameFrame%this.shootFps))
      this.shootFrame>this.maxShootFrame ?
      (this.shootEvent = false,this.shootFrame=0): this.shootFrame++
    }
  }
  
  death(){
    if (this.health<=0){
      showText ("GAME OVER !!",CANVAS_WIDTH*0.15,CANVAS_HEIGHT/2,50)
      this.dead = true
      ctx.drawImage(this.deathImages[this.deadFrame],this.x,this.y,this.playerSize,this.playerSize)
      if (!(gameFrame%this.fps))
      this.deadFrame>this.maxDeadFrame ?
      gameOver = true : this.deadFrame++
    }
  }

  jump () {
    if (this.y >= CANVAS_HEIGHT-this.playerSize) {
      this.gravity = 0
      this.velY = 0
      if (!this.dead)
      this.idleImages.forEach(image => {
        ctx.drawImage(image, this.x, this.y, this.playerSize, this.playerSize)
      })

    }

    if (this.canJump) {

      if (this.y > this.maxJumpHeight) {
       // p ("jump up")
     if(!(gameFrame%this.fps)){ 
     ctx.drawImage(this.jumpUpImages[this.jumpUpFrame], this.x, this.y, this.playerSize, this.playerSize)
     this.jumpUpFrame > this.maxJumpFrame ?
     this.jumpUpFrame=0 : this.jumpUpFrame++
     }
     this.y -= 5

     } else {
       this.canJump = false
      
       this.gravity = 3
       this.velY = 1
    
        }

      }
      if (this.y<CANVAS_HEIGHT-this.playerSize){
       
      ctx.drawImage(this.jumpDownImages[this.jumpDownFrame], this.x, this.y, this.playerSize, this.playerSize)

      this.y += this.velY + this.gravity
    if(!(gameFrame%this.fps))
    this.jumpDownFrame>this.maxJumpFrame ?
    this.jumpDownFrame=0:this.jumpDownFrame++
    
      }
    }

  

}


class Bullet {

  constructor(player) {
    this.player = player
    this.x = this.player.x+47
    this.y = this.player.y+24
    this.width = 4
    this.height = 2
    this.velX = 0.01
    this.speed = 2
    this.offfset = 10
    this.bulletSize = 25
    this.markForDeletion = false
    this.image = IMAGES.bullet[Math.floor
    (Math.random()*IMAGES.bullet.length)]
  }

  draw () {
    ctx.drawImage(this.image, this.x-this.offfset, this.y-this.offfset, this.bulletSize, this.bulletSize)
    this.update()
  }

  update() {
    if (this.x > CANVAS_WIDTH*0.8) {
      this.markForDeletion = true
    }
    this.x += this.speed + this.velX
    this.velX += 0.01
  }
}

class Raven {
  constructor(game) {
    this.game = game
    this.x = CANVAS_WIDTH - (271/6)
    this.y = Math.floor(Math.random()*50)
    this.speed = 1.5
    this.velX = 0.01
    this.raven_width = 271
    this.raven_height = 194
    this.RAVEN_WIDTH = 271/6
    this.RAVEN_HEIGHT = 194/6
    this.maxFrame = 4
    this.frameX = 0
    this.frameY = 0
    this.fps = 4
    this.addEgg = true
    this.markForDeletion = false
    this.eggLayPosition = Math.floor(Math.random()*CANVAS_WIDTH/2) + CANVAS_WIDTH/2
  }

  draw() {
    ctx.drawImage(IMAGES.raven, this.raven_width*this.frameX,this.frameY, this.raven_width, this.raven_height, this.x, this.y, this.RAVEN_WIDTH,this.RAVEN_HEIGHT)
    if (!(gameFrame%this.fps)) {
      this.frameX > this.maxFrame ? this.frameX = 0: this.frameX++
    }
    if (this.addEgg)
         this.layEgg()
    this.update()
  }

  update() {
    if (this.x<-(this.raven_width/2)){
      this.markForDeletion = true
}
    this.x -= this.speed + this.velX
    this.velX += 0.01
  }

  layEgg() {
    if (this.x<=this.eggLayPosition) {
      this.game.eggs.push(new Egg(this.game,this.x+18,this.y+13))
      this.addEgg = false 
    }
  }
}


class Egg {
  constructor (game,x,y) {
    this.game = game
    this.x = x
    this.y = y
    this.width = 10
    this.height = 10
    this.speed = 1
    this.gravity = 0.3
    this.eggSize = 30
    this.addWorm = true
    this.markForDeletion = false 
  }

  draw() {
    ctx.drawImage(IMAGES.egg, this.x, this.y, this.eggSize,this.eggSize)
    this.update()
  }

  update() {

    if (this.y > CANVAS_HEIGHT-this.eggSize-this.gravity) {
      this.speed = this.gravity = 0
      this.markForDeletion = true
      if (this.addWorm) {
        this.game.worms.push(new Worm(this.game, this.x, this.y))
        this.addWorm = false
      }
    }
    this.y += this.speed + this.gravity
    this.gravity += 0.3
  }
}



class Worm {
  constructor(game, x, y) {
    this.game = game
    this.x = x
    this.y = y 
    this.worm_width = 80.33333333333
    this.worm_height = 60
    this.width = this.worm_width/2
    this.height = this.worm_height/2
    this.frameX = 0
    this.frameY = 0
    this.ox = 5
    this.maxFrame = 4
    this.fps = 10
    this.speed = 0.5
    this.velX = 0.01
    this.markForDeletion = false
  }

  draw() {
     ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.fillRect(this.x, this.y, this.width-this.ox, this.height)
    
    ctx.drawImage(IMAGES.worm,this.worm_width*this.frameX, this.frameY, this.worm_width, this.worm_height, this.x, this.y, this.width,this.height)

    this.update()
  }


  update() {
    if (this.x < -this.worm_width) {
      this.markForDeletion = true
    }
    if (!(gameFrame%this.fps)) {
      this.frameX > this.maxFrame ? this.frameX = 0: this.frameX++
    }
    this.x -= this.speed + this.velX
    this.velX += 0.01
  }
}


class Zombie {
  constructor (game) {
    this.game = game
    this.width = 30
    this.height = 50
    this.size = 50
    this.x = CANVAS_WIDTH+(this.width*2)
    this.y = CANVAS_HEIGHT-this.size
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 6
    this.zombie_width = 292
    this.zombie_height = 410
    this.health = 40
    this.cox = 55 
    this.coy = 75
    this.collision_size = 200
    this.fps = 4
    this.speed = 0.1
    this.velX = 0.01
    this.offsetX = 15
    this.markForDeletion = false
    this.healthBar = new HealthBar(30,5, this.health, "green")
  }

  draw() {
    ctx.drawImage(IMAGES.zombie, this.zombie_width*this.frameX,this.frameY, this.zombie_width, this.zombie_height, this.x-this.offsetX, this.y,this.size,this.size)
    this.healthBar.draw(this.x, this.y-this.offsetX)
    this.update()
  }

  update() {
    if (this.health <= 0) {
      SCORE++
      this.markForDeletion = true 
      let x = ((this.x + this.size)/2)-this.cox
      let y = this.y - this.coy
      this.game.smokeExplosion.push(new CollisionAnimation(x,y,this.collision_size))
    }
    if (this.x<-this.width) {
      this.markForDeletion = true
    }
    if (!(gameFrame%this.fps)) {
      this.frameX > this.maxFrame ? this.frameX = 0: this.frameX++
    }
    this.x -= this.speed + this.velX
    this.velX += 0.01
  }

}

class HealthBar {

  constructor (width, height, maxHealth, color) {
    this.width = width
    this.height = height
    this.color = color
    this.maxHealth = maxHealth
  }

  draw(x, y) {
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.fillStyle = this.color
    ctx.fillRect(x, y, this.width, this.height)
    ctx.strokeRect(x, y, this.width, this.height)
  }

  update (hitPoint) {
    this.width = (hitPoint/this.width) * this.width
  }
}


class Whale {
  constructor (game, width, height) {
    this.game = game
    this.x = CANVAS_WIDTH + (width*2)
    this.y = Math.floor(Math.random()*CANVAS_WIDTH)*0.2
    this.width = width
    this.height = height
    this.whale_width = 60
    this.whale_height = 44
    this.frameX = 0
    this.fps = 5
    this.maxFrame = 4
    this.offsetX = 8
    this.health = 50
    this.hox = 10
    this.hoy = 10
    this.cox = 20
    this.coy = 75
    this.collision_size = 200
    this.speed = 0.1
    this.velX = 0.001
    this.markForDeletion = false
    this.healthBar = new HealthBar(30, 4, this.health, "#f6ff0e95")
  }

  draw () {
    ctx.drawImage(IMAGES.fly, this.whale_width*this.frameX, 0, this.whale_width, this.whale_height,this.x,this.y,60,44)
    this.healthBar.draw(this.x+this.hox, this.y-this.hoy)
    this.update()
  }

  update() {
  if(this.health<=0){
    explosion_sound.play()
    let x=(this.x+(this.whale_width/3))/2+this.cox
    let y = this.y - this.coy
  this.game.smokeExplosion.push(new CollisionAnimation(x,y,this.collision_size))
  this.markForDeletion=true
 }
    
 if(!(gameFrame%this.fps))
 (this.frameX > this.maxFrame) ? this.frameX = 0: this.frameX++

    if (this.x < -this.whale_width) {
      this.markForDeletion = true
    }

    this.x -= this.speed + this.velX
    this.velX += 0.001
  }
}

class CollisionAnimation {
  constructor(x, y, explosionSize) {
    this.x = x
    this.y = y
    this.explosionSize = explosionSize
    this.img_width = 200
    this.img_height = 200
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 6
    this.fps = 3
    this.markForDeletion = false
  }

  draw() {
    ctx.drawImage (IMAGES.smoke, this.img_width*this.frameX, this.frameY, this.img_width, this.img_height, this.x, this.y, this.explosionSize, this.explosionSize)
    this.update()
  }

  update() {

    if (!(gameFrame%this.fps))
      this.frameX > this.maxFrame ? (this.markForDeletion = true): this.frameX++
  }
}


class SpaceShip {
  constructor (game,x,y, width,height) {
    this.game = game 
    this.x = x 
    this.y = y 
    this.speedX = 0
    this.speedY = 0
    this.resetPos = -60
    this.width = 99.5
    this.height = 50.8
    this.frontStopPos = CANVAS_WIDTH*0.2
    this.backStopPos = -this.width
    this.maxUpPos = 0
    this.maxDownPos = CANVAS_HEIGHT*0.3
  }
  
  draw() {
    
    ctx.drawImage(IMAGES.spaceShip,this.x,this.y,this.width,this.height)
    this.update()
  }
  
  update(){
    if (this.game.whales.length){
      if (this.x<this.frontStopPos){
        this.speedX = 1
      }else{
        this.speedX = 0
      }
        
    }
    else {
      
      if (this.x>-this.width){
        this.speedY = 0
        this.speedX = -1
      }else {
        this.y = this.resetPos
        this.speedX = 0
      }
    }
    if (this.x>=this.frontStopPos && this.speedY==0 ){
      this.speedY = 1
    }
    
    if (this.x>=this.frontStopPos){
     if (this.y>=this.maxDownPos) {
        this.speedY = -1
      }
      if (this.y<=this.maxUpPos){
        this.speedY = 1
      }
    }
    
  this.x += this.speedX 
  this.y += this.speedY
  }
  
}


class Missile {
  constructor (game){
    this.game = game 
    this.x = game.spaceShip.x + this.game.spaceShip.width-15
    this.y = game.spaceShip.y + game.spaceShip.height/2
    this.width = 990/28
    this.height = 640/28
    this.velX = 0.01
    this.speed = 0.1
    this.exceleration = 1
    this.fps = 10
    this.frame = 0
    this.markForDeletion = false
  }
  
  draw(){
        ctx.drawImage(IMAGES.missile[this.frame],this.x,this.y,this.width,this.height)
      if (!(gameFrame%this.fps))
      this.frame>0?this.frame=0:this.frame++
    
    this.update()
  }
  
  update(){
    if (this.x>CANVAS_WIDTH+this.width) {
      this.markForDeletion = true 
    }
    this.x += this.speed + this.velX + this.exceleration 
    this.velX += 0.01
  }
}

// Main class

class Game {
  constructor() {
    this.player = new Player(this, 50, CANVAS_HEIGHT-60, 25, 30)
    this.spaceShip = new SpaceShip (this,-100,-60,50,50)
    this.ravenArray = new Array()
    this.missiles = new Array()
    this.worms = new Array()
    this.zombies = new Array()
    this.whales = new Array()
    this.eggs = new Array()
    this.smokeExplosion = new Array()
    this.fps = 80

  }

  isColliding(obj1, obj2) {
    return (
      (obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x) &&
      (obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y)
    )
  }
  
  renderMissile(){
    this.addMissile()
    this.missiles = this.missiles.filter(missile => !missile.markForDeletion)
    this.missiles.forEach(missile=>missile.draw())
  }
  
  addMissile(){
    if (this.whales.length){
      if (!(gameFrame%this.fps))
        this.missiles.push(new Missile(this))
    }
  }
  
  renderPlayer() {
    this.updatePlayerHealth()
    this.player.draw()
    this.renderBullets()
  }

  renderBullets() {
    this.updateZombieHealth()
    this.player.bulletArray.forEach(bullet => bullet.draw())
  }

  renderBirds() {
    this.ravenArray = this.ravenArray.filter(bird => !bird.markForDeletion)
    this.ravenArray.forEach(bird => bird.draw())
   this.renderEggs()
  }
  
  renderEggs(){
    this.eggs = this.eggs.filter(egg=>!egg.markForDeletion)
    this.eggs.forEach(egg=>egg.draw())
    
  }

  renderWorms () {
    this.worms = this.worms.filter(worm => !worm.markForDeletion)
    this.worms.forEach(worm => worm.draw())
  }

  renderZombies() {
    this.zombies = this.zombies.filter(zombie => !zombie.markForDeletion)
    this.zombies.forEach(zombie => zombie.draw())
  }

  renderWhales() {
    this.whales = this.whales.filter(whale => !whale.markForDeletion)
    this.whales.forEach(whale => whale.draw())
  }

  updatePlayerHealth(){
    this.worms.forEach(worm=>{
      if (this.isColliding(this.player,worm)){
        worm.markForDeletion = true
        this.smokeExplosion.push(new CollisionAnimation(worm.x-40,worm.y-60,150))
        this.player.healthBar.update(this.player.health-=10)
      }
    })
    
    this.zombies.forEach (obj=>{
      if (obj.x<this.player.x+this.player.width){
        obj.markForDeletion = true 
      let x = ((obj.x + obj.size)/2)-obj.cox
      let y = obj.y - obj.coy
        this.smokeExplosion.push(new CollisionAnimation(x,y,obj.collision_size))
        this.player.healthBar.update(this.player.health-=20)
      }
    })
  }

  updateZombieHealth() {
    this.player.bulletArray.forEach(bullet => {
      this.zombies.forEach(zombie => {
        if (this.isColliding(bullet, zombie)) {
          bullet.markForDeletion = true
          zombie.healthBar.update(zombie.health -= 10)
        }
      })
    })
  }
  
  updateWhaleHealth () {
    this.missiles.forEach (missile =>{
      this.whales.forEach (whale=>{
        if (this.isColliding(missile,whale)){
          whale.healthBar.update(whale.health-= 20)
          missile.markForDeletion = true 
        }
      })
    })
  }


  renderSmokeExplosion() {
    this.smokeExplosion = this.smokeExplosion.filter(smoke=>!smoke.markForDeletion)
    this.smokeExplosion.forEach(smoke => smoke.draw())
  }
}



const game = new Game()
function animate() {
  ctx.drawImage(backgroundImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  if (Math.random() > 0.9) {
    if (!(gameFrame%staggerFrame_1))
      game.zombies.push(new Zombie(game))

    if (!(gameFrame%staggerFrame_2)){
     game.ravenArray.push(new Raven(game))
      game.whales.push(new Whale(game, 50, 50))
    }

  }

  game.renderPlayer()
  game.renderZombies()
  game.renderWhales()
  game.renderSmokeExplosion()
  game.spaceShip.draw()
  game.renderMissile()
  game.updateWhaleHealth()
  game.renderBirds()
  game.renderWorms()
  showText("SCORE : "+SCORE,20,15,20)

  gameFrame++
  if(!gameOver)
  requestAnimationFrame(animate)
}
animate()

function fireButton() {
  game.player.bulletArray.push(new Bullet(game.player))
  sound.play()
  game.player.shootEvent = true
}

function jumpButton() {
  if (game.player.y<CANVAS_HEIGHT-game.player.playerSize) return
  game.player.canJump = true 

}

//addEventListener('mousedown',e=>p('click'))

function showText (text,x,y,fontSize){
  ctx.fillStyle = "white"
  ctx.font = `${fontSize}px Bangers`
  ctx.fillText(text,x,y)
}