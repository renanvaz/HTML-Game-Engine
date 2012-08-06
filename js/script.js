$(document).ready(function(){
	$('[game-player]').bind('hittest', function(e, obj){
		//console.log(e, );
		if(obj == $('.inimigo')[0]){
			$(this).remove();
			alert('perdeu');
		}
	});
	
	$('[game-sensor]').bind('hittest', function(e, obj){
		console.log(e, obj);
		$(this).css('background-color', '#'+Math.floor(Math.random()*16777215).toString(16));
	});
	
	function inimigoLoop(){
		$('.inimigo').animate({left: '+=100'}, 1000, function(){
			$('.inimigo').animate({left: '-=100'}, 1000, inimigoLoop);
		});
	}
	inimigoLoop();
	
	var jump = true;
	GAME.enterFrame = function(){
		if(GAME.key.left && $('[game-player]').data('inpulse').x > -4){
			$('[game-player]').addInpulse(-.1, 0);
		}
		
		if(GAME.key.right && $('[game-player]').data('inpulse').x < 4){
			$('[game-player]').addInpulse(.1, 0);
		}
		
		if(GAME.key.down){
			$('[game-player]').addInpulse(0, .5);
		}
		
		if(GAME.key.space && jump){
			$('[game-player]').addInpulse(0, -10);
			jump = false;
		}
		
		if(!GAME.key.space && !jump){
			jump = true;
		}
	}
	/*
	setInterval(function(){
		
	});
	*/
	GAME.init();
});