$(function(){
	var selected;
	$('.ajudador')
	.live('mousedown', function(e){
	    if (e.shiftKey) {
			selected.draggable('option', 'grid', [10, 10]);
		}
        $(this).css('position', 'absolute')
		try{
		selected.css('z-index', selected.data('z-index'));
		}catch(e){}
        
        $(this).data('z-index', $(this).css('z-index'));
		selected = $(this).css('z-index', 1000);
        selected.focus();
	})
    .live('mouseup', function(){
        $(this).css('z-index', $(this).data('z-index'));
	})
    .live('onlive', function(){
        $(this)
        .resizable({handles:'all'})
        .draggable({ opacity: 0.7, snap: true, grid: [1, 1] })
				.bind('dragstart', function(event, ui) {
					//$(this).trigger('mousedown');
				})
				.bind('dragstop', function(event, ui) {
				    $(this).css('z-index', $(this).data('z-index'));
					$(this).css({
						top: (Math.floor($(this).css('left'))),
						left: (Math.floor($(this).css('top')))
					});
				});
    });
	selected = $('.ajudador').eq(0);			
	$(document).bind('keydown', function(e){
		if (e.shiftKey) {
			selected.draggable('option', 'grid', [10, 10]);
		}
        if(e.ctrlKey){
            selected.resizable('option', 'grid', [10, 10]);  
        }
	});
	$(document).bind('keyup', function(e){
		if (e.keyCode) {
			//console.log('Ajudador', 'keyup, shift');
			selected.draggable('option', 'grid', [1, 1]);
            selected.resizable('option', 'grid', [1, 1]);
		}
	});

	$(document).bind('keydown', 'alt+down', function(e){
		//console.log('Ajudador', 'keydown, shift+down');
		selected.css('z-index', Number(selected.css('z-index'))-1);
        selected.data('z-index', selected.css('z-index'));
	});
	$(document).bind('keydown', 'alt+up', function(e){
		//console.log('Ajudador', 'keydown, shift+up');
		selected.css('z-index', Number(selected.css('z-index'))+1);
        selected.data('z-index', selected.css('z-index'));
	});
	$(document).bind('keydown', 'shift+down', function(e){
		//console.log('Ajudador', 'keydown, shift+down');
		selected.css({top: Number(selected.css('top').replace('px',''))+ 10 });
	});
	$(document).bind('keydown', 'down', function(){
		//console.log('Ajudador', 'keydown, down');
		//selected.css({top: Number(selected.css('top').replace('px',''))+ 1 });
	});
	
	$(document).bind('keydown', 'shift+up', function(e){
		//console.log('Ajudador', 'keydown, shift+up');
		selected.css({top: Number(selected.css('top').replace('px',''))- 10 });
	});
	$(document).bind('keydown', 'up', function(){
		//console.log('Ajudador', 'keydown, up');
		//selected.css({top: Number(selected.css('top').replace('px',''))- 1 });
	});
	
	$(document).bind('keydown', 'shift+left', function(){
		//console.log('Ajudador', 'keydown, shift+left');
		selected.css({left: Number(selected.css('left').replace('px',''))- 10 });
	});
	$(document).bind('keydown', 'left', function(){
		//console.log('Ajudador', 'keydown, left');
		//selected.css({left: Number(selected.css('left').replace('px',''))- 1 });
	});
	
	$(document).bind('keydown', 'shift+right', function(){
		//console.log('Ajudador', 'keydown, shift+right');
		selected.css({left: Number(selected.css('left').replace('px',''))+ 10 });
	});
	$(document).bind('keydown', 'right', function(){
		//console.log('Ajudador', 'keydown, right');
		//selected.css({left: Number(selected.css('left').replace('px',''))+ 1 });
	});
    $.registerEvents('append','prepend','after', 'before', 'addClass');
});
(function(){
	$.registerEvents = function() {
		$.each( arguments, function(i,n) {
			if (!$.fn[n]) return;
			var old = $.fn[n];
            
			$.fn[n] = function() {
				var r = old.apply(this, arguments);
                r.find('.ajudador').andSelf().trigger('onlive');
				return r;
			}
            
		});
	}
})(jQuery);
