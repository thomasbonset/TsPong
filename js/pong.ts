
var animation;
class CanvasDrawer {
  private canvas: HTMLCanvasElement;
  private player: Player;
  private computer: Player;
  private ball: Ball;
  static PLAYER_WIDTH: number = 5;
  static PLAYER_HEIGHT: number = 100;

  constructor(
    canvasId: string,
    player: Player,
    computer: Player,
    ball: Ball
  ) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
   this.canvas.addEventListener('mousemove', this.playerMove);
   this.player = player;
    this.computer = computer;
    this.ball = ball;
    this.init(this.canvas.height, this.canvas.width);
  }

  public draw() {
    const context: CanvasRenderingContext2D | null =
      this.canvas.getContext('2d');
    if (context) {
      //le terrain : un rectangle noir
      context.fillStyle = 'black';
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // filet
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(this.canvas.width / 2, 0);
      context.lineTo(this.canvas.width / 2, this.canvas.height);
      context.stroke();

      this.player.drawPlayer(context, this.canvas);
      this.computer.drawPlayer(context, this.canvas);
      this.ball.drawBall(context, this.canvas);
    }
  }
 onMouseMove = (event: MouseEvent) => {
	 this.playerMove(event);
 }
  public playerMove=(event: MouseEvent) => { 
    // Get the mouse location in the canvas
    var canvasLocation = this.canvas.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;
    this.player.position = mouseLocation - CanvasDrawer.PLAYER_HEIGHT / 2;
	
	if (mouseLocation < CanvasDrawer.PLAYER_HEIGHT / 2) {
    this.player.position = 0;
	} else if (mouseLocation > this.canvas.height - CanvasDrawer.PLAYER_HEIGHT / 2) {
		this.player.position = this.canvas.height - CanvasDrawer.PLAYER_HEIGHT;
	} else {
		this.player.position = mouseLocation - CanvasDrawer.PLAYER_HEIGHT / 2;
	}
}
  public stop() {
    cancelAnimationFrame(animation);
    // Set ball and players to the center
     this.init(this.canvas.height, this.canvas.width);
    
    document.querySelector('#computer-score').textContent = this.computer.score.toString();
    document.querySelector('#player-score').textContent = this.player.score.toString();
    this.draw();
}
  
  
  
  public computerMove() {
    this.computer.position += this.ball.speedY * 0.85;
}

	public hit(player : Player) {
    // The player does not hit the ball
    if (this.ball.positionY < player.position || this.ball.positionY > player.position + CanvasDrawer.PLAYER_HEIGHT) {
        // Set ball and players to the center
        this.ball.positionX = this.canvas.width / 2;
        this.ball.positionY = this.canvas.height / 2;
        this.player.position = this.canvas.height / 2 - CanvasDrawer.PLAYER_HEIGHT / 2;
        this.computer.position = this.canvas.height / 2 - CanvasDrawer.PLAYER_HEIGHT / 2;
        
		if (!player.isComputer) {
    this.computer.score++;
    document.querySelector('#computer-score').textContent = this.computer.score.toString();
} else {
    this.player.score++;
    document.querySelector('#player-score').textContent = this.player.score.toString();
}
        // Reset speed
        this.ball.speedX = 2;
    } else {
        // Increase speed and change direction
        this.ball.speedX *= -1.3;
    }
	
	
}


public ballMove() {
    
	if (this.ball.positionY > this.canvas.height || this.ball.positionY < 0) {
        this.ball.speedY *= -1;
    }
	
	if (this.ball.positionX > this.canvas.width - CanvasDrawer.PLAYER_WIDTH) {
		this.hit(this.computer);
	} else if (this.ball.positionX < CanvasDrawer.PLAYER_WIDTH) {
		this.hit(this.player);
	}
	
	this.ball.positionX += this.ball.speedX;
    this.ball.positionY += this.ball.speedY;
}

public play = () => {
    
    this.draw();
	this.computerMove();
	this.ballMove();
	animation = requestAnimationFrame(this.play);
  }
  
  public init(CanvasHeight: number, CanvasWidth: number) {
    this.player.position = CanvasHeight / 2 - CanvasDrawer.PLAYER_HEIGHT / 2;
    this.computer.position = CanvasHeight / 2 - CanvasDrawer.PLAYER_HEIGHT / 2;
    this.ball.positionX = CanvasWidth / 2;
    this.ball.positionY = CanvasHeight / 2;
	this.ball.speedX = 2;
	this.ball.speedY = 2; 
	this.player.score=0;
	this.computer.score=0;
  }
}

class Player {
  public position: number = 0;
  public isComputer: boolean;
  public score: number = 0;
  constructor( computer: boolean) {
    this.isComputer = computer;
  }
  
  
  public drawPlayer(
    context: CanvasRenderingContext2D, canvas: HTMLCanvasElement ) {
    context.fillStyle = 'yellow';
    context.fillRect(
      this.isComputer ? canvas.width - CanvasDrawer.PLAYER_WIDTH : 0,
	 
      this.position,
      CanvasDrawer.PLAYER_WIDTH,
      CanvasDrawer.PLAYER_HEIGHT
    );
  }
}


class Ball {
  public positionX: number = 0;
  public positionY: number = 0;
  public radius: number = 5;
  public speedX: number = 2;
  public speedY: number = 2;

  public drawBall(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(
      this.positionX,
      this.positionY,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    context.fill();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  
  const player: Player = new Player(false);
  const computer: Player = new Player(true);
  const ball: Ball = new Ball();
  const canvasDrawer = new CanvasDrawer('canvas', player, computer, ball);
  canvasDrawer.draw();
  document.querySelector('#start-game').addEventListener('click', canvasDrawer.play);
  document.querySelector('#stop-game').addEventListener('click', canvasDrawer.stop);
});
