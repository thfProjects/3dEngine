var vs = []; //coords of vertex on screen

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

function draw(canvas, camera, obj){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2;
    
    var v = obj.v;
    var l = obj.l;
    var f = obj.f;
    
    var xs;
    var ys;
    
    vs = [];
    
    for(var i = 0; i < v.length; i++){
        move(v[i], -camera.x, -camera.y, -camera.z);
        rotate(v[i], -camera.a, -camera.b, -camera.c);
        
        xs = canvas.width/2 * (1 + v[i].x/(v[i].z * Math.tan(camera.fov/2)));
        ys = canvas.height/2 * (1 - v[i].y * camera.aspect/(v[i].z * Math.tan(camera.fov/2)));
        
        move(v[i], camera.x, camera.y, camera.z);
        rotate(v[i], camera.a, camera.b, camera.c);
        
        //ctx.beginPath();
        //ctx.arc(xs, ys, 2, 0, 2 * Math.PI, false);
        //ctx.fill();
        
        vs.push({x:xs, y:ys});
    }
    
    for(var i = 0; i < l.length; i++){
        ctx.beginPath();
        ctx.moveTo(vs[l[i].vi1].x, vs[l[i].vi1].y);
        ctx.lineTo(vs[l[i].vi2].x, vs[l[i].vi2].y);
        ctx.stroke();
    }
    
    for(var i = 0; i < f.length; i++){
        ctx.beginPath();
        ctx.moveTo(vs[f[i].vi[f[i].vi.length-1]].x, vs[f[i].vi[f[i].vi.length-1]].y);
        for(var j = 0; j < f[i].vi.length; j++){
            ctx.lineTo(vs[f[i].vi[j]].x, vs[f[i].vi[j]].y);
        }
        ctx.save();
        ctx.clip();
        ctx.stroke();
        ctx.restore();
    }
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