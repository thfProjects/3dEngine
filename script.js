/*eslint-env browser*/
var o;

$(document).ready(function(){
    
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    
    initializeOffscreenCanvas(canvas.width, canvas.height);
    
    var camera = new Camera(0, 0, -3, 0, 0, 0, 90, 1);
    
    o = createCube();
    
    //draw(canvas, camera, o);
    window.requestAnimationFrame(function(timestamp){
        draw(canvas, camera, o);
    });
    
    var lastmousex = 0; 
    var lastmousey = 0;
    
    var dragging = false;
    
    var canvasoffsetx = Math.round($("#myCanvas").offset().left);
    var canvasoffsety = Math.round($("#myCanvas").offset().top);
    
    var showingvInfo = false;
    
    $("#myCanvas").mousedown(function(){
        dragging = true;
    }).mousemove(function(event) {
        var x = event.pageX - lastmousex;
        var y = event.pageY - lastmousey;

        if(lastmousex > 0 && dragging){
            for(i = 0; i < o.v.length; i++){
                rotate(o.v[i], y/2, x/2, 0);
            }
            //draw(canvas, camera, o);
        }

        
        lastmousex = event.pageX;
        lastmousey = event.pageY;
        
        /*if(showingvInfo){
            draw(canvas, camera, o);
            showingvInfo = false;
        }
        
        var canvasx = lastmousex - canvasoffsetx;
        var canvasy = lastmousey - canvasoffsety;
        /*
        for(var i = 0;i < o.v.length;i++){
            if(d(canvasx, canvasy, vs[i].x, vs[i].y) < 2){
                context.fillStyle = "#AAAAFF";
                context.font = '10px serif';
                context.fillText("v" + i + " " + o.v[i].x.toFixed(2) + ", " + o.v[i].y.toFixed(2) + ", " + o.v[i].z.toFixed(2), canvasx + 10, canvasy + 10);
                showingvInfo = true;
            }
        }*/
    }).mouseup(function(){
        lastmousex = 0;
        lastmousey = 0;
        dragging = false;
    }).mouseleave(function(){
        lastmousex = 0;
        lastmousey = 0;
        dragging = false;
    }).mousewheel(function(event) {
        camera.z += event.deltaY;
        //draw(canvas, camera, o);
    });
    
    $("#file").change(function(){
        var file =  $("#file").prop("files")[0];
        
        var v = [];
        var l = [];
        var f = [];
        
        fr = new FileReader();
        fr.onload = function () {
            var lines = fr.result.split('\n');
            
            for(var i = 0; i < lines.length; i++){
                switch(lines[i].substring(0, 2)){
                    case "v ":
                        var values = lines[i].trim().split(/ +/).slice(1).map(Number);
                        v.push(new Vertex(...values));
                        break;
                    case "l ":
                        var values = lines[i].trim().split(/ +/).slice(1).map(Number).map(function(item){return item - 1});
                        l.push(new Line(...values));
                        break;
                    case "f ":
                        var values = lines[i].trim().split(/ +/).slice(1).map(function(item){return item.split("/")[0]}).map(Number).map(function(item){return item - 1});
                        f.push(new Face(...values));
                        break;
                }
            }
            
            o = new Obj(v, l, f);
            //draw(canvas, camera, o);
        };
        fr.readAsText(file);
    });
});

function createCube(){
    var v = [];
    var l = [];
    var f = []
    
    v.push(new Vertex(-1, -1, -1)); //0
    v.push(new Vertex(1, -1, -1)); //1
    v.push(new Vertex(-1, -1, 1)); //2
    v.push(new Vertex(1, -1, 1)); //3
    v.push(new Vertex(-1, 1, -1)); //4
    v.push(new Vertex(1, 1, -1)); //5
    v.push(new Vertex(-1, 1, 1)); //6
    v.push(new Vertex(1, 1, 1)); //7
    /*
    l.push(new Line(0, 1));
    l.push(new Line(0, 2));
    l.push(new Line(0, 4));
    l.push(new Line(1, 3));
    l.push(new Line(1, 5));
    l.push(new Line(2, 3));
    l.push(new Line(2, 6));
    l.push(new Line(3, 7));
    l.push(new Line(4, 5));
    l.push(new Line(4, 6));
    l.push(new Line(5, 7));
    l.push(new Line(6, 7));*/
    
    f.push(new Face(0, 1, 3, 2));
    f.push(new Face(0, 1, 5, 4));
    f.push(new Face(1, 3, 7, 5));
    f.push(new Face(3, 2, 6, 7));
    f.push(new Face(2, 0, 4, 6));
    f.push(new Face(4, 5, 7, 6));
    
    return new Obj(v, l, f);
}
        
function d(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
}