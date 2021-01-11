var flag = 0;
var win = 0;
var time=0;
var set_timer;
$(document).ready(function (){
    innit();
})

//初始化表格
function innit() {
    win = 0;
    flag = 0;
    time = 0;
    document.getElementById("Wins").innerHTML = ""; //清空上一局出现的提示“恭喜完成游戏”
    clearInterval(set_timer);
    document.getElementById("timer").innerHTML = "计时：0 分 0 秒";
    if(win == 0){
        document.getElementById("begin").innerHTML = "开始";
    }
    $("#begin").attr("onclick","start()");
    var num = document.getElementById("inputnum").value;
    if (num == ""){
        num = 3;
    }
    num = Number(num);
    if (num < 3 || num > 9){
        alert("请输入正确范围的n值！");
        document.getElementById("inputnum").value = "";
        return false;
    }
    var i = 0;
    $('#picbox').empty();
    for(var i=0;i<num;i++){//添加行数
        $('#picbox').append("<tr></tr>");
    }
    for(i=0;i<num;i++){//添加列数
        $('#picbox').children().append("<td></td>");
    }
    var tds = $('#picbox').children().children();//获得td的数组
    for(i=0;i<tds.length;i++) {//为每个td加id和点击事件
        id=i+1;
        tds[i].setAttribute("id",id);
        tds[i].setAttribute("onclick","move("+id+")");
        tds[i].setAttribute("onkeyup","moveBykeyBoard(event)");
    }
    var arr = [];
    for(i=0;i<tds.length;i++) { //形成1-16的数组
        arr[i] = i + 1;
    }
    var randar = resetgame(arr);//打乱图片顺序
    startgame(randar); //形成拼图游戏
}

//打乱图片顺序
function resetgame(arr) {
    var top =arr.length;
    if(top) {
       for(var i = 0;i<top;i++){
           arr[i] = Math.floor(Math.random() * top) + 1;
           while (isIndex(i,arr)  == true){
             arr[i] = Math.floor(Math.random() * top) + 1;
           }    
       }
    }
    return arr;
}

function isIndex(i,arr) {
    var j;
    for(j=0;j<i;j++){
        if(arr[j] == arr[i]){
            return true;
        }
    }
    return false;
}

//值为16的单元格应该赋值为空
function  startgame(randar) {
    var tds = $('#picbox').children().children();//获得td的数组
    for(var i=1;i<=tds.length;i++) {
        if(randar[i-1] == tds.length){
            document.getElementById(i).innerHTML = "";
            $('#'+i).css("background-color","white");
        }
        else {
            document.getElementById(i).innerHTML = randar[i-1];
            $('#'+i).css("background-color","rgb(40, 135, 243)");
        }        
    }
}

//判断四个方向的表格是不是为空
function move(id) {
    if (flag == 0){
        return false;
    }
    var pic = $('#picbox').children().children().length;
    pic = Math.sqrt(pic);
    if((id > pic) && deterNull(id - pic)){ //上
        movepic(id,id - pic);
    }
    if((id <= pic*(pic-1)) && deterNull(id + pic)){ //下
        movepic(id,id + pic);
    }
    if((id % pic != 1) && deterNull(id - 1)){   //左
        movepic(id,id - 1);
    }
    if((id % pic != 0) && deterNull(id + 1)){   //右
        movepic(id,id + 1);
    }
    iswin();
}

//判断表格是否为空
function deterNull(id) {
    var dr = document.getElementById(id).innerHTML;
    if (dr == ""){
        return true;
    }
    else{
        return false;
    }
}

//移动函数
function movepic(ida,idb) {
    var a = document.getElementById(ida).innerHTML;
    document.getElementById(ida).innerHTML = document.getElementById(idb).innerHTML;
    document.getElementById(idb).innerHTML = a;
    $('#'+ida).css("background-color","white");
    $('#'+idb).css("background-color","rgb(40, 135, 243)");
}

//判断是否完成游戏
function iswin() {
    var pic = $('#picbox').children().children();
    var len = pic.length;
    var i =0;
    while(i < len){
        if( i == len - 1){
            if(pic[i].innerHTML != ""){
                return false;
            }
        }
        else {
            if(pic[i].innerHTML != i+1){
                return false;
            }
        }
        i++;
    }
    debugger;
    win = 1;
    document.getElementById("inputnum").value = "";
    document.getElementById("Wins").innerHTML = "恭喜完成游戏";
    document.getElementById("begin").innerHTML = "开始";
    clearInterval(set_timer);
    flag = 0;
    $("#begin").attr("onclick","start()");
}

//计时函数
function gotime()//开始计时
{
    time+=1;//一秒钟加一，单位是秒
    var min=parseInt(time/60);//把秒转换为分钟，一分钟60秒，取商就是分钟
    var sec=time%60;//取余就是秒
    document.getElementById("timer").innerHTML="计时："+min+" 分 "+sec+" 秒";//然后把时间更新显示出来
}

//开始按钮按下后
function start(){
    debugger;
    if(win == 1){//判断是不是赢了游戏，重新开一局
        innit();
    }
    flag = 1;
    document.getElementById("begin").innerHTML = "暂停";
    $("#begin").attr("onclick","stop()");
    set_timer=setInterval(gotime,1000);
}

//暂停按钮按下后
function stop(){
    flag = 0;
    document.getElementById("begin").innerHTML = "继续";
    $("#begin").attr("onclick","start()");
    clearInterval(set_timer);
}

//监听函数，键盘的上下键输入后的事件
function moveBykeyBoard(event) {
    if (flag == 0){  //如果现在状态是在暂停状态下
        return false;
    }
    var num=0;
    var keynum;
    var id;
    var pic = $('#picbox').children().children().length;
    pic = Math.sqrt(pic);
	if (window.event){ // IE
		keynum = event.keyCode;
    } 
    else if (event.which){ // Netscape/Firefox/Opera
		keynum = event.which;
    }
    switch (keynum) {
        case 37://左
        for(id = 1;id<=pic*pic;id++){
            if((id % pic != 1) && deterNull(id - 1)){
                if(num == 0){
                    movepic(id,id - 1);
                    num = 1;
                }   
            }
        }
        num = 0;
        break;
        case 38://上
        for(id = 1;id<=pic*pic;id++){
            if((id > pic) && deterNull(id - pic)){ 
                if(num == 0){
                    movepic(id,id - pic);
                    num = 1;
                }
            }
        }
        num = 0;
        break;
        case 39: //右
        for(id = 1;id<=pic*pic;id++){
            if((id % pic != 0) && deterNull(id + 1)){  
                if(num == 0){
                    movepic(id,id + 1);
                    num = 1;
                } 
            }
        }
        num = 0;
        break;
        case 40: //下
        for(id = 1;id<=pic*pic;id++){
            if((id <= pic*(pic-1)) && deterNull(id + pic)){ 
                if(num == 0){
                    movepic(id,id + pic);
                    num = 1;
                } 
            }
        }
        num = 0;
        break;
    }
    iswin();
}
