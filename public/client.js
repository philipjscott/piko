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

  $('#color-picker').bind('change', function(e) {
    color = e.target.value;
  });

  socket.on('moving', function (data) {
    if(! (data.id in clients)){
      cursors[data.id] = $('<div class="cursor">').appendTo($('#cursors'));
    }
    cursors[data.id].css({
      'left' : data.x,
      'top' : data.y
    });
    if(data.drawing && clients[data.id]){
      drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y, data.color);
    }
    clients[data.id] = data;
    clients[data.id].updated = $.now();
  });

  var prev = {};

  canvas.on('mousedown',function(e){
    e.preventDefault();
    drawing = true;
    prev.x = e.pageX;
    prev.y = e.pageY;

    // Hide the instructions
    instructions.fadeOut();
  });

  doc.bind('mouseup mouseleave',function(){
    drawing = false;
  });

  var lastEmit = $.now();

  doc.on('mousemove',function(e){
    if($.now() - lastEmit > 30){
      socket.emit('mousemove',{
        'x': e.pageX,
        'y': e.pageY,
        'drawing': drawing,
        'color': color,
        'id': id
      });
      lastEmit = $.now();
    }
    if(drawing){
      drawLine(prev.x, prev.y, e.pageX, e.pageY, color);

      prev.x = e.pageX;
      prev.y = e.pageY;
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

  function drawLine(fromx, fromy, tox, toy, lineColor){
    //beginPath needed or segments won't be diff colours
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  }
});
