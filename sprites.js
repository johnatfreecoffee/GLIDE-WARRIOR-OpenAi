/* sprites.js */

/* Sprite atlas coordinates (sprites.png) */
const SPRITES = {
  player: {
    idle:   [{x:0,y:0,w:32,h:32}],
    run:    [{x:32,y:0,w:32,h:32},{x:64,y:0,w:32,h:32},{x:96,y:0,w:32,h:32}],
    jump:   [{x:128,y:0,w:32,h:32}],
    shoot:  [{x:160,y:0,w:32,h:32}]
  },
  enemy: {
    grunt:[{x:0,y:32,w:32,h:32},{x:32,y:32,w:32,h:32}],
    flyer:[{x:64,y:32,w:32,h:32},{x:96,y:32,w:32,h:32}]
  },
  bullet: { basic:[{x:0,y:64,w:16,h:8}] },
  powerup:{ health:[{x:0,y:96,w:16,h:16}], weapon:[{x:16,y:96,w:16,h:16}] },
  tiles: { ground:{x:0,y:128,w:32,h:32} }
};

/* Player factory */
function createPlayer(x,y){
  return {
    x,y,w:32,h:32,vx:0,vy:0,frame:0,anim:"idle",dir:1,
    health:5, maxHealth:5, inv:0, jumps:1, onGround:false, shootCd:0
  };
}

function updatePlayer(){
  let p=player;
  if (keyIsDown(65)) {p.vx=-3; p.dir=-1; setAnim(p,"run");}
  else if (keyIsDown(68)){p.vx=3; p.dir=1; setAnim(p,"run");}
  else {p.vx*=0.8; setAnim(p,"idle");}

  if (keyIsDown(74) && p.shootCd<=0){
    bullets.push({x:p.x+p.w/2,y:p.y+12,w:16,h:8,vx:8*p.dir});
    sfx.shoot.play();
    setAnim(p,"shoot");
    p.shootCd=15;
  }

  p.vy+=0.6; p.x+=p.vx; p.y+=p.vy;
  if (p.shootCd>0) p.shootCd--;
  if (p.inv>0) p.inv--;
  // simple floor
  if (p.y>VIEW_H-96){ p.y=VIEW_H-96; p.vy=0; p.onGround=true; p.jumps=1; }

  p.frame=(frameCount>>3)%SPRITES.player[p.anim].length;
}

function drawPlayer(){
  let p=player;
  let spr=SPRITES.player[p.anim][p.frame];
  push();
  translate(p.x,p.y);
  scale(p.dir,1);
  image(spriteSheet,spr.x,spr.y,spr.w,spr.h, p.dir===1?0:-p.w,0,p.w,p.h);
  pop();
}

function setAnim(ent,name){ if (ent.anim!==name){ ent.anim=name; ent.frame=0; }}

/* Enemies */
function createEnemy(x,y,type="grunt"){
  return {x,y,w:32,h:32,type,frame:0,dir:-1,hp:2};
}
function updateEnemy(e){ e.x+=-1.5; e.frame=(frameCount>>4)%SPRITES.enemy[e.type].length; }
function drawEnemy(e){
  let spr=SPRITES.enemy[e.type][e.frame];
  image(spriteSheet,spr.x,spr.y,spr.w,spr.h,e.x,e.y,e.w,e.h);
}

/* Bullets */
function updateBullet(b){ b.x+=b.vx; }
function drawBullet(b){
  let spr=SPRITES.bullet.basic[0];
  image(spriteSheet,spr.x,spr.y,spr.w,spr.h,b.x,b.y,b.w,b.h);
}

/* Powerups */
function updatePowerup(p){ p.y+=sin(frameCount*0.1); }
function drawPowerup(p){
  let spr=SPRITES.powerup[p.kind][0];
  image(spriteSheet,spr.x,spr.y,spr.w,spr.h,p.x,p.y,p.w,p.h);
}

/* Tiles / platforms */
function drawTilePlatform(p){
  let spr=SPRITES.tiles.ground;
  for (let tx=0;tx<p.w;tx+=spr.w){
    image(tileSheet,spr.x,spr.y,spr.w,spr.h,p.x+tx,p.y,spr.w,spr.h);
  }
}

/* Particles */
function updateParticle(pt){ pt.life--; pt.x+=pt.vx; pt.y+=pt.vy; }
function drawParticle(pt){ stroke(255,200,0); point(pt.x,pt.y); }

/* HUD */
function drawHUD(){
  fill(0,150); rect(0,0,width,40);
  fill(255); textSize(16); text(`HP:${player.health}  Score:${score}`,20,25);
}
