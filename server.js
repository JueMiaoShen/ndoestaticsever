
let http=require('http');
let fs =require('fs');
let path=require('path');
let mime=require('mime');
let cache={};

function send404(response) {
    response.writeHead(404,{'Content-Type':'text/plain'})
    response.write('Error 404 : Resource not found.')
    response.end()
}
function sendFile(response,filePath,fileContents) {
    response.writeHead(200,{'Content-Type':mime.getType(path.basename(filePath))});
    response.end(fileContents);
}
function sendStatic(response,cache,absPath) {
    if(cache[absPath]){
        sendFile(response,absPath,cache[absPath]);
    }else{
        fs.exists(absPath,function (exists) {
            if(exists){
                fs.readFile(absPath,function (err,data) {
                    if(err){
                        send404(response);
                    }else {
                        cache[absPath]=data;
                        sendFile(response,absPath,data);
                    }
                })
            }else{
                send404(response);
            }
        })
    }
}
let server=http.createServer(function (request,response) {
    response.setHeader("Access-Control-Allow-Origin","*");
    //允许的header类型
    response.setHeader("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    response.setHeader("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    let filePath=false;
    if(request.url=='/'){
        filePath='public/index.html'
    }else{
        filePath='public/'+request.url;
    }
    console.log("请求filePath"+filePath);
    let absPath='./'+filePath;
    sendStatic(response,cache,absPath);
});
server.listen(8000,function () {
    console.log("Serve listen on 8000");
})
