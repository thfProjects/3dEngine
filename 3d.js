var vs = new Map(); //coords of vertex on screen
var offScreenCanvas;
var ctx;

function Obj(v, l, f){
    this.v = v;
    this.l = l;
    this.f = f;
}

function Vertex(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

function Line(vi1, vi2){ //vertex index
    this.vi1 = vi1;
    this.vi2 = vi2;
}

function Face(vi1, vi2, vi3, ...args){
    this.vi = [vi1, vi2, vi3].concat(args);
}

function Camera(x, y, z, a, b, c, fov, aspect){
    this.x = x;
    this.y = y;
    this.z = z;
    this.a = a;
    this.b = b;
    this.c = c;
    this.fov = fov;
    this.aspect = aspect;
}

function initializeOffscreenCanvas(w, h){
    offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = w;
    offScreenCanvas.height = h;
    
    ctx = offScreenCanvas.getContext("2d");
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
}

function draw(canvas, camera, obj){
    
    console.time("draw");
    
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var v = obj.v;
    var l = obj.l;
    var f = obj.f;
    
    var xs;
    var ys;
    
    vs.clear();;
    
    for(var i = 0; i < v.length; i++){
        move(v[i], -camera.x, -camera.y, -camera.z);
        rotate(v[i], -camera.a, -camera.b, -camera.c);
        
        if(v[i].z > 0){
            xs = canvas.width/2 * (1 + v[i].x/(v[i].z * Math.tan(camera.fov/2)));
            ys = canvas.height/2 * (1 - v[i].y * camera.aspect/(v[i].z * Math.tan(camera.fov/2)));
            
            vs.set(i ,{x:xs, y:ys});
        }
        
        move(v[i], camera.x, camera.y, camera.z);
        rotate(v[i], camera.a, camera.b, camera.c);
        
        //ctx.beginPath();
        //ctx.arc(xs, ys, 2, 0, 2 * Math.PI, false);
        //ctx.fill(); 
    }
    
    for(var i = 0; i < l.length; i++){
        if(vs.has(l[i].vi1) && vs.has(l[i].vi2)){
            ctx.beginPath();
            ctx.moveTo(vs.get(l[i].vi1).x, vs.get(l[i].vi1).y);
            ctx.lineTo(vs.get(l[i].vi2).x, vs.get(l[i].vi2).y);
            ctx.stroke();
        }
    }
    
    console.time("f");
    
    var face;
    
    for(var i = 0; i < f.length; i++){
        face = f[i].vi;
        
        if(face.every(function(vi){return vs.has(vi)})){
            ctx.beginPath();
            ctx.moveTo(vs.get(face[face.length-1]).x, vs.get(face[face.length-1]).y);
            for(var j = 0; j < face.length; j++){
                ctx.lineTo(vs.get(face[j]).x, vs.get(face[j]).y);
            }
            ctx.stroke();
        }
    }
    
    console.timeEnd("f");
    
    //canvas.getContext("2d").putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    canvas.getContext("2d").drawImage(offScreenCanvas, 0, 0);
    
    console.timeEnd("draw");
    
    window.requestAnimationFrame(function(timestamp){
        draw(canvas, camera, o);
    });
}

function move(o, dx, dy, dz){
    o.x += dx;
    o.y += dy;
    o.z += dz;
}

function rotate(o, a, b, c){
    rotateX(o, a);
    rotateY(o, b);
    rotateZ(o, c);
}

function rotateX(o, a){
    var r = rad(a);
    var y = o.y;
    var z = o.z;
    
    o.y = y * Math.cos(r) - z * Math.sin(r);
    o.z = z * Math.cos(r) + y * Math.sin(r);
}

function rotateY(o, a){
    var r = rad(a);
    var z = o.z;
    var x = o.x;
    
    o.z = z * Math.cos(r) - x * Math.sin(r);
    o.x = x * Math.cos(r) + z * Math.sin(r);
}

function rotateZ(o, a){
    var r = rad(a);
    var x = o.x;
    var y = o.y;
    
    o.x = x * Math.cos(r) - y * Math.sin(r);
    o.y = y * Math.cos(r) + x * Math.sin(r);
}

function rad(a){
    return a * Math.PI/180;
}

function angleOnScreen(a, b){
    return Math.atan((a.y - b.y)/(b.x - a.x));
}

function moveDirectionZ(o, d, a){ //-a for on screen I think
    o.x += d * Math.cos(a);
    o.y += d * Math.sin(a);
}