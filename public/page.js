//variable

var ifstart=0;


var logo=document.getElementById("logo");
var slogan=document.getElementById("slogan");
var fb=document.getElementById("fb");
var skip=document.getElementById("skip");
var sign=document.getElementById("sign");
var signintitle=document.getElementById("signintitle");
var Email=document.getElementById("email");
var Password=document.getElementById("password");
var signin=document.getElementById("signin");
var createaccount=document.getElementById("createaccount");
var welcome=document.getElementById("welcome");
var welcomepagesubtitle=document.getElementById("welcomepagesubtitle");
var example=document.getElementById("example");
var go=document.getElementById("go");

logo.display="block";
slogan.style.display="block";
fb.style.display="block";
skip.style.display="block";
sign.style.display="block";
signintitle.style.display="none";
Email.style.display="none";
Password.style.display="none";
signin.style.display="none";
createaccount.style.display="none";
welcome.style.display="none";
welcomepagesubtitle.style.display="none";
example.style.display="none";
go.style.display="none";

skip.onclick = function(){
	logo.style.display="none";
	slogan.style.display="none";
	fb.style.display="none";
	skip.style.display="none";
	sign.style.display="none";
	welcome.style.display="block";
	welcomepagesubtitle.style.display="block";
	example.style.display="block";
	go.style.display="block";
}

go.onclick = function(){
	welcome.style.display="none";
	welcomepagesubtitle.style.display="none";
	example.style.display="none";
	go.style.display="none";
	ifstart=1;
}
