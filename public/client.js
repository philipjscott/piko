function init(width) {
  $('#brush-size').html(width);
}

$(function(){
  if(!('getContext' in document.createElement('canvas'))){
    alert('Sorry, it looks like your browser does not support canvas!');
    return false;
  }
  var doc = $(document),
  win = $(window),
  canvas = $('#paper'),
  ctx = canvas[0].getContext('2d'),
  instructions = $('#instructions');

  //iffy
  var id = Math.round($.now()*Math.random());

  var drawing = false;
  var clients = {};
  var cursors = {};
  var socket = io();
  var color = '#000';
  var myBrushWidth = 10;

  init(myBrushWidth);

  $('#color-picker').bind('change', function(e) {
    color = e.target.value;
  });

  socket.on('moving', function (data) {
    if(! (data.id in clients)){
      cursors[data.id] = $('<div class="cursor">').appendTo($('#cursors'));
    }
    cursors[data.id].css({
      'left' : data.x,
      'top' : data.y,
      'height' : data.rad,
      'width' : data.rad,
      'margin-left' : -data.rad / 2,
      'margin-top' : -data.rad / 2
    });
    if(data.drawing && clients[data.id]){
      drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y, data.color, data.rad);
    }
    clients[data.id] = data;
    clients[data.id].updated = $.now();
  });

  var prev = {};

  $('#brush-size-btn').on('click', function() {
    myBrushWidth = $('#brush-size-input').val();
    $('#brush-size').html(myBrushWidth);
  });

  canvas.on('mousedown touchmove',function(e){
    var x = e.pageX - $(e.target).offset().left;
    var y = e.pageY - $(e.target).offset().top;
    e.preventDefault();
    drawing = true;
    prev.x = x;
    prev.y = y;

    // Hide the instructions
    instructions.fadeOut();
  });

  doc.bind('mouseup mouseleave',function(){
    drawing = false;
  });

  var lastEmit = $.now();

  canvas.on('mousemove',function(e){
    var x = e.pageX - $(e.target).offset().left;
    var y = e.pageY - $(e.target).offset().top;
    if($.now() - lastEmit > 30){
      socket.emit('mousemove',{
        'x': x,
        'y': y,
        'drawing': drawing,
        'color': color,
        'id': id,
        'rad': myBrushWidth
      });
      lastEmit = $.now();
    }
    if(drawing){
      drawLine(prev.x, prev.y, x, y, color, myBrushWidth);

      prev.x = x;
      prev.y = y;
    }
  });

  canvas.on('touchmove',function(event){
    var e = event.originalEvent.touches[0];
    var x = e.pageX - $(e.target).offset().left;
    var y = e.pageY - $(e.target).offset().top;
    if($.now() - lastEmit > 30){
      socket.emit('mousemove',{
        'x': x,
        'y': y,
        'drawing': drawing,
        'color': color,
        'id': id,
        'rad': myBrushWidth
      });
      lastEmit = $.now();
    }
    if(drawing){
      drawLine(prev.x, prev.y, x, y, color, myBrushWidth);

      prev.x = x;
      prev.y = y;
    }
  });





  setInterval(function(){
    for(ident in clients){
      if($.now() - clients[ident].updated > 10000){
        cursors[ident].remove();
        delete clients[ident];
        delete cursors[ident];
      }
    }
  },10000);

  function drawLine(fromx, fromy, tox, toy, lineColor, width){
    //beginPath needed or segments won't be diff colours
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = width;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  }
});
