function ShiftSquare(canvasId, resetId) {
    this.n = 5;
    this.field = this.generateField(this.n);
    this.setupGraphics(canvasId);
    this.shuffle();
    this.draw();
    this.setupControls(resetId);
}

ShiftSquare.prototype.shuffle = function() {
    for (var i = 0; i < 256; i++) {
        var row = Math.floor((this.n + 1) * Math.random());
        this.shiftHorz(row, 1);
        var col = Math.floor((this.n + 1) * Math.random());
        this.shiftVert(col, 1);
    }
}

ShiftSquare.prototype.setupGraphics = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    var self = this;
    canvas.onclick = function() {self.clickMove()};
}

ShiftSquare.prototype.setupControls = function(resetId) {
    var btn = document.getElementById(resetId);
    var self = this;
    btn.onclick = function() {
        self.shuffle();
        self.draw();
    };
}

ShiftSquare.prototype.generateField = function(n) {
    var field = [];
    for (var i = 0; i < this.n; i++) {
        field[i] = [];
        for (var j = 0; j < this.n; j++) {
            field[i][j] = i + '' + j;
        }
    }
    return field;
}

ShiftSquare.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.w, this.h);
    
    ctx.font = "20pt Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (var y = 0; y < this.n; y++) {
        var cy = Math.round(this.h * (y + 1.5) / (this.n + 2));
        for (var x = 0; x < this.n; x++) {
            var cx = Math.round(this.w * (x + 1.5) / (this.n + 2));
            var val = this.field[y][x];
            var t = parseInt(val.charAt(0)) + parseInt(val.charAt(1));
            ctx.fillStyle = t % 2 == 0 ? '#44FF44' : '#FF8888';
            ctx.fillText(val, cx, cy);
        }
    }
    
    ctx.strokeStyle = '#FFFF00';
    ctx.fillStyle = '#cccc00'
    ctx.lineWidth = 2;
    var offs = this.h / ((this.n + 2) * 2);
    for (var x = 0; x < this.n; x++) {
        cx = Math.round(this.w * (x + 1.5) / (this.n + 2));
        this.drawTriangle(cx, offs, 2);
        this.drawTriangle(cx, this.h - offs, 0);
    }
    offs = this.w / ((this.n + 2) * 2);
    for (var y = 0; y < this.n; y++) {
        cy = Math.round(this.h * (y + 1.5) / (this.n + 2));
        this.drawTriangle(offs, cy, 3);
        this.drawTriangle(this.w - offs, cy, 1);
    }
}

ShiftSquare.prototype.drawTriangle = function(x, y, rot) {
    var sz = 5;
    var pts = [[-sz, -sz], [sz, -sz], [0, 2 * sz]];
    rot *= Math.PI / 2;
    for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        pts[i] = [p[0] * Math.cos(rot) + p[1] * Math.sin(rot),
            p[1] * Math.cos(rot) - p[0] * Math.sin(rot)];
    }
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(Math.round(x + pts[0][0]), Math.round(y + pts[0][1]));
    ctx.lineTo(Math.round(x + pts[1][0]), Math.round(y + pts[1][1]));
    ctx.lineTo(Math.round(x + pts[2][0]), Math.round(y + pts[2][1]));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

ShiftSquare.prototype.clickMove = function() {
    var cellW = this.w / (this.n + 2);
    var cellH = this.h / (this.n + 2);
    var cx = (event.offsetX - 5) / cellW;
    var cy = (event.offsetY - 5) / cellH;
    this.preventSelection();
    if (Math.abs(cx - 0.5) < 0.3) {
        this.shiftHorz(Math.round(cy - 1.5), this.n - 1);
    } else if (Math.abs(cx - this.n - 1.5) < 0.3){
        this.shiftHorz(Math.round(cy - 1.5), 1);
    } else if (Math.abs(cy - 0.5) < 0.3) {
        this.shiftVert(Math.round(cx - 1.5), this.n - 1);
    } else if (Math.abs(cy - this.n - 1.5) < 0.3) {
        this.shiftVert(Math.round(cx - 1.5), 1);
    } else {
        return;
    }
    this.draw();
}

ShiftSquare.prototype.shiftHorz = function(row, offs) {
    if (row < 0 || row >= this.n) {
        return;
    }
    var t = [];
    for (var i = 0; i < this.n; i++) {
        t[(i + offs) % this.n] = this.field[row][i];
    }
    for (var i = 0; i < this.n; i++) {
        this.field[row][i] = t[i];
    }
}

ShiftSquare.prototype.shiftVert = function(col, offs) {
    if (col < 0 || col >= this.n) {
        return;
    }
    var t = [];
    for (var i = 0; i < this.n; i++) {
        t[(i + offs) % this.n] = this.field[i][col];
    }
    for (var i = 0; i < this.n; i++) {
        this.field[i][col] = t[i];
    }
}

ShiftSquare.prototype.preventSelection = function() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}
