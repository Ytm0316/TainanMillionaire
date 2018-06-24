 var k=12  ; //問題數
 var q_used= new Array(k-1);
 var i;
 var player_ans=0;
 var selected=0;
 var deadtime = 1;  //總共可以死幾次(問題數)
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
       deadtime=1;
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
}
function Select2(){
 player_ans= 2;
 check();
}
function Select3(){  
 player_ans= 3;
 check();
}
function Select4(){  
 player_ans= 4;
 check();
}


    for (i = 0; i < k; i++) {
        q_used[i]=0;
    }



function reborn(){
  if(deadtime > 0){   //if
    rebor.style.display="block";
   
    var question = new Array(k-1); 
    var selectA = new Array(k-1);
    var selectB = new Array(k-1);
    var selectC = new Array(k-1);
    var selectD = new Array(k-1);
    //問題的答案請放在數字%4+1的選項  ex:第0題答案為A  第5題答案為B
    question[0] = "李旦原是_____的漢族富商" ; 
    selectA[0] = "菲律賓";
    selectB[0] = "冰島";
    selectC[0] = "非洲";
    selectD[0] = "泰國";
   
    question[1] = "大明國和荷蘭東印度公司在_____年爆發澎湖之戰" ;
    selectA[1] = "2000";
    selectB[1] = "1623";
    selectC[1] = "1994";
    selectD[1] = "2018";
   
    question[2] = "在_________附近，有顏思齊上岸的紀念碑?" ;
    selectA[2] = "成功大學";
    selectB[2] = "台南大天后宮";
    selectC[2] = "雲林北港朝天宮";
    selectD[2] = "高雄巨蛋";
  
    question[3] = "早期的臺南市西部是一片汪洋，稱之" ;
    selectA[3] = "偉大航道";
    selectB[3] = "安平內海";
    selectC[3] = "亞馬遜河";
    selectD[3] = "台江內海";
   
    question[4] = "鄭芝龍早年投靠在澳門經商的舅父黃程，習得葡萄牙語並且成為_____教徒" ;
    selectA[4] = "天主教";
    selectB[4] = "基督教";
    selectC[4] = "睡教";
    selectD[4] = "如來神教";
   
    question[5] = "當時三大武裝海商集團有顏思齊，鄭芝龍和____";
    selectA[5] = "李白";
    selectB[5] = "李旦";
    selectC[5] = "李小龍";
    selectD[5] = "李聖傑";
   
    question[6] = "赤崁城是____人在臺灣發展時修築";
    selectA[6] = "外星人";
    selectB[6] = "非洲人";
    selectC[6] = "荷蘭人";
    selectD[6] = "日本人";
   
    question[7] = "1543年，葡萄牙船隻在經過臺灣海峽時，有個船員偶然遙望，發現一個青蔥翠綠的海島，禁不住喊出「Ilha Formosa」，就這樣，______，就成了西方世界對臺灣這個島嶼的稱呼。";
    selectA[7] = "福爾摩摩";
    selectB[7] = "福爾摩三";
    selectC[7] = "福爾摩斯";
    selectD[7] = "福爾摩沙";
   
    question[8] = "鄭芝龍教名為?";
    selectA[8] = "尼可拉斯";
    selectB[8] = "尼可拉斯凱吉";
    selectC[8] = "G DRAGON";
    selectD[8] = "厭世寶寶";
   
    question[9] = "荷人興築商館並拓展其規模成為西式水岸堡壘，在台江西岸的一鯤鯓沙洲興建______，做為全島的軍事中心。";
    selectA[9] = "紅毛城";
    selectB[9] = "熱蘭遮城";
    selectC[9] = "土雞城";
    selectD[9] = "台灣省城";
   
    question[10] = "荷蘭殖民當局為了開墾土地而急需勞動力，又缺乏本國移民發展殖民地，便招引大量___人移民臺灣。";
    selectA[10] = "日本人";
    selectB[10] = "黑人";
    selectC[10] = "漢人";
    selectD[10] = "喵星人";
    
    question[11] = "荷蘭獨立戰爭爆發後，荷蘭人成立了荷蘭____公司。";
    selectA[11] = "北印度";
    selectB[11] = "西印度";
    selectC[11] = "南印度";
    selectD[11] = "東印度";
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
        select1.innerHTML = selectA[RandNum];
        select2.innerHTML = selectB[RandNum];
        select3.innerHTML = selectC[RandNum];
        select4.innerHTML = selectD[RandNum];
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
     deadtime = 1;
     jump.restart();
     console.log("456");
   } //end if
}

