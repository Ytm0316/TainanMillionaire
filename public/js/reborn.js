 var k=12  ; //問題數
 var q_used= new Array(k-1);
 var i;
 var player_ans=0;
 var selected=0;
 var deadtime = 3;  //總共可以死幾次(問題數)
 var rebor=document.getElementById("reborn");
 var select1=document.getElementById("select1");
 var select2=document.getElementById("select2");
 var select3=document.getElementById("select3");
 var select4=document.getElementById("select4");

 var q_ans=0;
 var q_num=0;


/*var check = function(x,y){
  var t = 10;
 
  window.setTimeout(function(){
    console.log('x、player');
    console.log(x);
    console.log(player_ans);
     if(player_ans != x){    
       jump.restart(); 
     }else{
       jump.revive();
     }
//      content.style.display="none";
        var content=document.getElementById("content" + (y));
        content.style.display="none";
        rebor.style.display="none";
        select1.style.display="none";
        select2.style.display="none";
        select3.style.display="none";
        select4.style.display="none";
        jump.start();
  }, t * 1000);
};
*/
//time count down
function check(){
  if(player_ans != q_ans){    
       jump.restart(); 
     }else{
       jump.revive();
  }
  var content=document.getElementById("content" + (0));
  content.style.display="none";
  rebor.style.display="none";
  select1.style.display="none";
  select2.style.display="none";
  select3.style.display="none";
  select4.style.display="none";
  jump.start();
  q_ans=0;
  q_num=0;
  
}


function Select1(){
 player_ans= 1;
 check();
 select2.style.display="none";
 select3.style.display="none";
 select4.style.display="none";
 
}
function Select2(){
select1.style.display="none";
select3.style.display="none";
select4.style.display="none";
 player_ans= 2;
 check();
}
function Select3(){  
 player_ans= 3;
select1.style.display="none";
select2.style.display="none";
select4.style.display="none";
 check();
}
function Select4(){  
 player_ans= 4;
 select1.style.display="none";
 select2.style.display="none";
 select3.style.display="none";
 check();
}


    for (i = 0; i < k; i++) {
        q_used[i]=0;
    }



function reborn(){
  if(deadtime > 0){   //if
    rebor.style.display="block";
   
    var question = new Array(k-1); 
  
    //問題的答案請放在數字%4+1的選項  ex:第0題答案為A  第5題答案為B
    question[0] = "李旦原是_____的漢族富商" ; 
    question[1] = "大明國和荷蘭東印度公司在_____年爆發澎湖之戰" ;
    question[2] = "在_________附近，有顏思齊上岸的紀念碑?" ;
    question[3] = "早期的臺南市西部是一片汪洋，稱之" ;
   
    question[4] = "鄭芝龍早年投靠在澳門經商的舅父黃程，習得葡萄牙語並且成為_____教徒" ;
    question[5] = "當時三大武裝海商集團有顏思齊，鄭芝龍和____";
    question[6] = "赤崁城是____人在臺灣發展時修築";
    question[7] = "1543年，葡萄牙船隻在經過臺灣海峽時，有個船員偶然遙望，發現一個青蔥翠綠的海島，禁不住喊出「Ilha Formosa」，就這樣，______，就成了西方世界對臺灣這個島嶼的稱呼。";
    
    question[8] = "鄭芝龍教名為?";
    question[9] = "荷人興築商館並拓展其規模成為西式水岸堡壘，在台江西岸的一鯤鯓沙洲興建______，做為全島的軍事中心。";
    question[10] = "荷蘭殖民當局為了開墾土地而急需勞動力，又缺乏本國移民發展殖民地，便招引大量___人移民臺灣。";
    question[11] = "荷蘭獨立戰爭爆發後，荷蘭人成立了荷蘭____公司。";
    //問題
    var RandNum = Math.floor(Math.random()*k); //←數字請填寫圖片張數的值
    if(q_used[RandNum]== -1){check();}   //?
    deadtime = deadtime - 1 ;
    q_used[RandNum] = -1;
    var ans = RandNum % 4 + 1;
    var content=document.getElementById("content" + (0));
        content.style.display="block";
        select1.style.display="block";
        select2.style.display="block";
        select3.style.display="block";
        select4.style.display="block";// 回傳函數與ans比對
        content.innerHTML = question[RandNum];
        console.log('player、x');
        console.log(player_ans);
        console.log(ans,content);
        jump.stop();
        q_ans=ans;
        q_num=RandNum;
        //check(ans,RandNum);  
 
//      content.style.display="none";
/*      rebor.style.display="none";
        select1.style.display="none";
        select2.style.display="none";
        select3.style.display="none";
        select4.style.display="none";
        jump.start();
         
        jump.revive(); */
  }else{
         for (i = 0; i < k; i++) {
         q_used[i]=0;
    }
     deadtime = k;
     jump.restart();
     console.log("456");
   } //end if
}

