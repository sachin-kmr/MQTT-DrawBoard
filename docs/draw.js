var canvas, ctx,
    brush = {
        x: 0,
        y: 0,
        color: '#000000',
        size: 10,
        down: false,
    },
    strokes = [],
    currentStroke = null;

function redraw() {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.lineCap = 'round';
    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
}

function init() {
    canvas = $('#draw');
    canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    ctx = canvas[0].getContext('2d');

    function mouseEvent(e) {
        brush.x = e.pageX;
        brush.y = e.pageY;

        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        });

        redraw();
    }

    function touchEvent(e) {
        if (!e)
            var e = event;

        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                brush.x = touch.pageX - touch.target.offsetLeft;
                brush.y = touch.pageY - touch.target.offsetTop;
            }
        }

        // currentStroke = {
        //     color: brush.color,
        //     size: brush.size,
        //     points: [],
        // };

        // strokes.push(currentStroke);

        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        });

        redraw();

    }

    canvas.mousedown(function(e) {
        brush.down = true;

        currentStroke = {
            color: brush.color,
            size: brush.size,
            points: [],
        };

        strokes.push(currentStroke);

        mouseEvent(e);
    }).mouseup(function(e) {
        brush.down = false;

        mouseEvent(e);

        currentStroke = null;
    }).mousemove(function(e) {
        if (brush.down)
            mouseEvent(e);
    });

    canvas[0].addEventListener('touchstart', function(e) {
        currentStroke = {
            color: brush.color,
            size: brush.size,
            points: [],
        };

        strokes.push(currentStroke);

        touchEvent(e);
        event.preventDefault();
    }, false);

    canvas[0].addEventListener('touchmove', function(e) {
        touchEvent(e);
        event.preventDefault();
    }, false);

    $('#save-btn').click(function() {
        var win = window.open();
        win.document.write("<img src='" + canvas[0].toDataURL() + "'/>");
    });

    $('#undo-btn').click(function() {
        strokes.pop();
        redraw();
    });

    $('#clear-btn').click(function() {
        strokes = [];
        redraw();
    });

    $('#color-picker').on('input', function() {
        brush.color = this.value;
    });


    $('input[type=range]').wrap("<div class='range'></div>");
    var i = 1;

    $('.range').each(function() {
        var n = this.getElementsByTagName('input')[0].value;
        var x = (n / 100) * (this.getElementsByTagName('input')[0].offsetWidth - 8) - 12;
        this.id = 'range' + i;
        if (this.getElementsByTagName('input')[0].value == 0) {
            this.className = "range"
        } else {
            this.className = "range rangeM"
        }
        this.innerHTML += "<style>#" + this.id + " input[type=range]::-webkit-slider-runnable-track {background:linear-gradient(to right, #3f51b5 0%, #3f51b5 " + n + "%, #515151 " + n + "%)} #" + this.id + ":hover input[type=range]:before{content:'" + n + "'!important;left: " + x + "px;} #" + this.id + ":hover input[type=range]:after{left: " + x + "px}</style>";
        i++
    });

    $('#brush-size').on("input", function() {
        brush.size = this.value;
        var a = this.value;
        var p = (a / 100) * (this.offsetWidth - 8) - 12;
        if (a == 0) {
            this.parentNode.className = "range"
        } else {
            this.parentNode.className = "range rangeM"
        }
        this.parentNode.getElementsByTagName('style')[0].innerHTML += "#" + this.parentNode.id + " input[type=range]::-webkit-slider-runnable-track {background:linear-gradient(to right, #3f51b5 0%, #3f51b5 " + a + "%, #515151 " + a + "%)} #" + this.parentNode.id + ":hover input[type=range]:before{content:'" + a + "'!important;left: " + p + "px;} #" + this.parentNode.id + ":hover input[type=range]:after{left: " + p + "px}";
    })

}

$(init);