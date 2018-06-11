 var k=5  ; //問題數
 var q_used= new Array(k-1);
 var i;
 var selected=0;
 var deadtime = k;  //總共可以死幾次(問題數)
 var rebor=document.getElementById("reborn");
 var select1=document.getElementById("select1");
 var select2=document.getElementById("select2");
 var select3=document.getElementById("select3");
 var select4=document.getElementById("select4");
 
function Select1(){ var player_ans= 1;
                    return player_ans;
                  }
function Select2(){ var player_ans= 2;
                    return player_ans;
                  }
function Select3(){ var player_ans= 3;
                    return player_ans;
                  }
function Select4(){ var player_ans= 4;
                    return player_ans;
                  }


    for (i = 0; i < k; i++) {
        q_used[i]=0;
    }
function check(){
  RandNum = Math.floor(Math.random()*k);
  if(q_used[RandNum]== -1)
  {check();}
    }


function reborn(){
  if(deadtime > 0){
    rebor.style.display="block";
   
    var question = new Array(k-1); 
  
    //問題的答案請放在數字%4+1的選項  ex:第0題答案為A  第5題答案為B
    question[0] = "A" ; 
    question[1] = "B" ;
    question[2] = "C" ;
    question[3] = "D" ;
    question[4] = "E" ;

    var RandNum = Math.floor(Math.random()*k); //←數字請填寫圖片張數的值
    if(q_used[RandNum]== -1)
      {check();}
    deadtime = deadtime - 1 ;
    q_used[RandNum] = -1;
    var ans = RandNum % 4 + 1;
    var content=document.getElementById("content" + (RandNum));
        content.style.display="block";
        select1.style.display="block";
        select2.style.display="block";
        select3.style.display="block";
        select4.style.display="block";// 回傳函數與ans比對
        content.innerHTML = question[RandNum];
        
        console.log(player_ans);
        console.log(ans);
        jump.stop();
        var player_ans=
        while(player_ans ==0){
          select1.style.display="block";
          select2.style.display="block";
          select3.style.display="block";
          select4.style.display="block";
        //if(player_ans != ans){           //if答案是否正確
         // jump.restart(); 
          //jump.start();
          //return ;
        }
        
        console.log(player_ans);
 
        content.style.display="none";
        rebor.style.display="none";
        select1.style.display="none";
        select2.style.display="none";
        select3.style.display="none";
        select4.style.display="none";
        jump.start();
         
        jump.revive();
  }else{
         for (i = 0; i < k; i++) {
         q_used[i]=0;
    }
     deadtime = k;
     jump.restart();
     console.log("456");
   }
}

