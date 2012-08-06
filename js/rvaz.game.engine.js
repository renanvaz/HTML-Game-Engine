/* Author:

*/
(function(){
	var to;
	jQuery.fn.hitTest = function(obj){
		var tests = [],
			X = false,
			Y = false;
		
		for(var i = 0; i < obj.length; i++){
			if($(obj[i])[0] != $(this)[0]){
				var current 	= $(this).data('current_pos'),
					next 		= $(this).data('next_pos'),
					width 		= $(this).width(),
					height 		= $(this).height(),
				
					_offset		= {top: $(obj[i]).pos('top'), left: $(obj[i]).pos('left')},
					_width 		= $(obj[i]).width(),
					_height 	= $(obj[i]).height();
				
				var direction = {
					up: current.top > next.top,
					down: current.top < next.top,
					left: current.left > next.left,
					right: current.left < next.left
				}
				
				var hitTop 		= (current.top >= _offset.top + _height && next.top <= _offset.top + _height),
					hitBottom 	= (current.top + height <= _offset.top && next.top + height >= _offset.top),
					
					hitLeft 	= (current.left >= _offset.left + _width && next.left <= _offset.left + _width),
					hitRight 	= (current.left + width <= _offset.left && next.left + width >= _offset.left),
					
					hitY 		= (next.top >= _offset.top && next.top <= _offset.top + _height) || (next.top + height >= _offset.top && next.top + height <= _offset.top + _height) || (next.top < _offset.top && next.top + height > _offset.top + _height),
					hitX 		= (next.left >= _offset.left && next.left <= _offset.left + _width) || (next.left + width >= _offset.left && next.left + width <= _offset.left + _width) || (next.left < _offset.left && next.left + width > _offset.left + _width);

				if($(obj[i])[0] == $('#test')[0]){
					console.log(hitTop, hitBottom, hitLeft, hitRight, hitX, hitY, obj[i]);
					//console.log(current.left + width, _offset.left, next.left + width, _offset.left);
				}
				
				if(hitX && hitY){
					hitTop = direction.up;
					hitBottom = direction.down;
				}
				
				if(((hitTop || hitBottom) && hitX) || ((hitLeft || hitRight) && hitY)){
					if(!$(obj[i]).is('[game-sensor]')){
						var inpulse = $(this).data('inpulse');
						
						if((hitTop || hitBottom) && hitX){
							Y = true;
							if(hitTop){
								$(this).pos('top', $(obj[i]).pos('top') + _height + 1);
							}
							if(hitBottom){
								$(this).pos('top', $(obj[i]).pos('top') - height - 1);
							}
							$(this)
							.data('game', {velocity: 0})
							.data('inpulse', {x: inpulse.x, y: 0});
						}
						
						if((hitLeft || hitRight) && hitY){
							X = true;
							if(hitLeft){
								$(this).pos('left', $(obj[i]).pos('left') + _width + 1);
							}
							if(hitRight){
								$(this).pos('left', $(obj[i]).pos('left') - width - 1);
							}
							$(this)
							.data('inpulse', {x: 0, y: inpulse.y});
						}
					}
					
					tests.push({
						hitTop: hitTop,
						hitBottom: hitBottom,
						hitLeft: hitLeft,
						hitRight: hitRight,
						obj: $(obj[i])
					});
					
					$(this).trigger('hittest', $(obj[i]), tests[tests.length - 1]);
					$(obj[i]).trigger('hittest', this, tests[tests.length - 1]);
				}
			}
		};
		
		if(!Y){
			$(this).pos('top', next.top);
		}
		if(!X){
			$(this).pos('left', next.left);
		}
		
		return tests.length ? tests : false;
	}
	
	jQuery.fn.pos = function(k, val){
		if(val)
			$(this).css(k, val);
		else
			return Number($(this).css(k).replace('px', ''));
	}
	
	jQuery.fn.addInpulse = function(x, y){
		var inpulse = $(this).data('inpulse');
		x = x > 0 ? GAME.aceleration + x : -GAME.aceleration + x;
		y = y > 0 ? GAME.aceleration + y : -GAME.aceleration + y;
		$(this).data('inpulse', {x: inpulse.x + x, y: inpulse.y + y});
	}
	
	window.GAME = {
		aceleration: .2,
		FPS: 100,
		sprites: {},
		key: {left: false, up: false, right: false, down: false, space: false},
		
		init: function(){
			$('[game-sprite]')
			.data('game', {velocity: 0})
			.data('force', {x: 0, y: 2})
			.data('inpulse', {x: 0, y: 0});
			
			this.sprites.dynamic = $('[game-dynamic]');
			this.sprites.static = $('[game-static]');
			this.sprites.sensor = $('[game-sensor]');
			
			this.start();
		}, 
		
		enterFrame: function(){},
		
		start: function(){
			to = setInterval(this.draw, 1000/this.FPS);
		},
		
		drawing: false,
		draw: function(){
			if(GAME.drawing) return false;
			GAME.drawing = true;
			GAME.sprites.dynamic.each(function(){
				var $self = $(this);
				var inpulse = $(this).data('inpulse');
				var game = $(this).data('game');
				
				if(inpulse.y != 0){
					if(inpulse.y > 0){
						inpulse.y -= GAME.aceleration;
						if(inpulse.y < 0) inpulse.y = 0;
					}else{
						inpulse.y += GAME.aceleration;
						if(inpulse.y > 0) inpulse.y = 0;
					}
				}
				
				if(inpulse.x != 0){
					if(inpulse.x > 0){
						inpulse.x -= GAME.aceleration;
						if(inpulse.x < 0) inpulse.x = 0;
					}else{
						inpulse.x += GAME.aceleration;
						if(inpulse.x > 0) inpulse.x = 0;
					}
				}
				
				game.velocity += GAME.aceleration;
				
				$(this).data('current_pos', {top: $(this).pos('top'), left: $(this).pos('left')});
				$(this).data('next_pos', {top: Math.floor($(this).pos('top') + game.velocity + inpulse.y + $(this).data('force').y), left: Math.floor($(this).pos('left') + inpulse.x + $(this).data('force').x)});
				//$(this).pos('top', Math.floor($(this).pos('top') + game.velocity + inpulse.y + $(this).data('force').y));
				//$(this).pos('left', Math.floor($(this).pos('left') + inpulse.x + $(this).data('force').x));
				
				$(this).data('inpulse', inpulse);
				$(this).data('game', game);
				
				
				$(this).hitTest($('[game-sprite]'));
			});
			
			GAME.enterFrame();
			GAME.drawing = false;
		}

	}
	
	var KEYS = {left: 37, up: 38, right: 39, down: 40, space: 32};
	$(document)
	.keydown(function(e){
		var keyCode = e.keyCode || e.which;

		for(var i in KEYS){
			GAME.key[i] = KEYS[i] == keyCode ? true : GAME.key[i];
		}
		e.preventDefault();
	})
	.keyup(function(e){
		var keyCode = e.keyCode || e.which;

		for(var i in KEYS){
			GAME.key[i] = KEYS[i] == keyCode ? false : GAME.key[i];
		}
		e.preventDefault();
	})
	
	
	//setTimeout(function(){ clearInterval(to)}, 1000);
})();
