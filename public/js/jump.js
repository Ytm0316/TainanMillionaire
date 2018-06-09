var Jump = function(){
	this.config = {
		isMobile:false,
		jumper_length:30,
		jumper_width:18,
		jumper_height:46,//該數值影響落點判斷的難度
		frustumSize:200,
		hell_ground:-40,
		ground_thick:10,
		light_ref: new THREE.Vector3(100,300,100),
		//light2_ref: new THREE.Vector3(200, 400, 200),
		aspect:window.innerWidth / window.innerHeight
	};
	this.falling = {
		end:false,
		speed:1.2,
		x_speed_nodir:0.5,
		collide_nodir:false,
		collide_out:false,
		collide_type_confirm:false
	}
	this.cube_set = {
		cheater:[],
		horse:[],
		cube_color_order:1,//for horse
		cube:[],
		floor:[],
		cube_sp:[],
		color_order:[1,1,1,1,1,1],
		spc_default:[
		{ size : 40 , y:-30},
		{ size : 40 , y:-26},
		{ size : 60 , y:-30},
		{ size : 40 , y:-30},
		{ size : 40 , y:-30},
		{ size : 40 , y:-15}
		]
	};
	this.light_set ={
		light	:	new THREE.PointLight( 0xffffff, 1.5, 500),
		//light2	:	new THREE.PointLight( 0xffffff, 1, 500),
		ambient : 	new THREE.AmbientLight(0xfffd87,1.1)
	};
	this.helpers = {
		light_helper	: new THREE.CameraHelper( this.light_set.light.shadow.camera ),
		//light2_helper	: new THREE.CameraHelper( this.light_set.light2.shadow.camera ),
		gridHelper 		: new THREE.GridHelper( 1000, 20 ),
		axes_helper 	: new THREE.AxesHelper(20)
	}
	this.jumperStat = {
		jump_pos_reset:false,
		ready:	false,
		h_speed:	0,
		y_speed:	0,
		position :new THREE.Vector3(0,0,0),
	};
	this.cubeStat = {
		recovered:true
	};
	this.CubeDir = {
		former:'forward',
		current:'forward'
	};
	this.land_info ={
		result:0,
		distance:0,//the distance when you landed on next cube.
		type:0 //0 for absolute failure. 1 for error increasing.
	//result : 	0 落在空白區
	//			1 落在原本區域 成功
	//			2 落在原本區域 失敗
	//			3 落在下個區域 成功
	//			4 落在下個區域 失敗W
	};
	this.cameraPos = {
		current:new THREE.Vector3(-200,200,200),
		next:new THREE.Vector3(-200,200,200)
	};
	this.play = false;
	this.stage_info = {
		score:0,
		stage:0,
		cube:0
	};
	this.mouseEvents = {
		down:'',
		up:''
	};
	this.scene = new THREE.Scene();
	this.renderer = new THREE.WebGLRenderer();
	this.loader = new THREE.OBJLoader();
	this.camera = new THREE.OrthographicCamera( this.config.frustumSize * this.config.aspect / - 1, this.config.frustumSize * this.config.aspect / 1, this.config.frustumSize / 1, this.config.frustumSize / - 1, 1, 2000 );			
	//this.scene.add( this.light_set.light2);			
	this.scene.add( this.light_set.ambient);
	this.scene.add( this.light_set.light );	
};
	Jump.prototype = {
		init:function(){
			this.stop();//before load the horse.
			this.checkUserAgent();
			//this.createHelpers();//create helpers	
			this.LightSetup();//create lights.
			this.RendererSetup();
			this.CameraSetup();
			this.SceneSetup();
			this.createfloor();
			this.createCheater();
			//this.createCube();     combination with quickload...horse_create
			//this.createCube();     combination with quickload...horse_create
			this.horse_create();//create horse
			this.specialCubeLoad();
			//this.updateCamera();   combination with quickload...horse_create
			//this.testani();
	
			var canvas = document.querySelector('canvas');
			var game = this;
			game.downevent = function(){game.mousedown();};//add two property...
			game.upevent = function(){game.mouseup();};//
			canvas.addEventListener(game.mouseEvents.down, 	game.downevent);
			canvas.addEventListener(game.mouseEvents.up, 	game.upevent);
			window.addEventListener( 'resize', function(){game.onWindowResize();}, false );	
		},
		testani:function(){
			this.renderer.render(this.scene,this.camera);
			requestAnimationFrame(this.testani.bind(this));
		},
		checkUserAgent: function() {//done  with mouse event 
			var n = navigator.userAgent;
			if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i)) {
				this.config.isMobile = true
			}
			if(this.config.isMobile){
				this.mouseEvents = {
					down:'touchstart',
					up:'touchend'
				};
			}else{
				this.mouseEvents = {
					down:'mousedown',
					up:'mouseup'
				};
			}
			
		},
		fail_fall:function(){//done falling rotate using.  //better for x,z direction in both every condition
			var game = this;
			var horse = {
				x:(this.CubeDir.current=='foward') ? game.cube_set.horse.position.x-game.config.jumper_length/2 : game.cube_set.horse.position.x,
				z:(this.CubeDir.current=='foward') ? game.cube_set.horse.position.z : (
				  (this.CubeDir.current=='left')   ? game.cube_set.horse.position.z + game.config.jumper_length/2 : 
											 game.cube_set.horse.position.z - game.config.jumper_length/2
				)
			};			
			var cube_next=	this.cube_set.cube[this.cube_set.cube.length-1];
			if(game.land_info.result == 0){
				game.falling_rotate('no');
			}else if(game.land_info.result == 2){
				if(game.CubeDir.current == 'forward'){
					game.falling_rotate('up');
				}else if(game.CubeDir.current == 'left'){
					game.falling_rotate('left');
				}else{
					game.falling_rotate('right');
				}
			}else if(game.land_info.result==4){
				if(game.land_info.type==1){
					if(game.CubeDir.current == 'forward'){
						if(horse.z > cube_next.position.z){
							game.falling_rotate('right');
						}else{
							game.falling_rotate('left');
						}
					}else{
						if(horse.x > cube_next.position.x){
							game.falling_rotate('up');
						}else{
							game.falling_rotate('down');
						}
					}
				}else{//type 0
					if(game.CubeDir.current == 'forward'){
						if(horse.x > cube_next.position.x){
							game.falling_rotate('up');
						}else{
							game.falling_rotate('down');
						}
					}else{
						if(horse.z > cube_next.position.z){
							game.falling_rotate('right');
						}else{
							game.falling_rotate('left');
						}
					}
				}
				
			}
		},
		falling_rotate:function(dir){//done with fail fall
			var game = this;
			var size_horse = (game.land_info.result=='forward')? game.config.jumper_length:game.config.jumper_width;
			var cube_width = game.cube_set.cube[game.cube_set.cube.length-1].geometry.parameters.width;
			var offset = size_horse/2  + cube_width/2 - game.land_info.distance;
			var rotateAxis ;
			var rotate ;//rotating speed
			var rotateTo;//to specific angle
			var fallingTo = game.config.hell_ground + game.config.jumper_width/2 + game.config.ground_thick/2;//toground.
			if(dir=='up'){
				rotateAxis = 'y';
				rotate = game.cube_set.horse.rotation[rotateAxis] + 0.1;
				rotateTo = game.cube_set.horse.rotation[rotateAxis] < Math.PI/2;
				game.cube_set.horse.translateX = offset;//move horse out of the cube area
			}else if(dir=='down'){
				rotateAxis = 'y';
				rotate = game.cube_set.horse.rotation[rotateAxis] - 0.1;
				rotateTo = game.cube_set.horse.rotation[rotateAxis] > -Math.PI/2;
				game.cube_set.horse.translateX = -offset;//move horse out of the cube area
			}else if(dir=='left'){
				rotateAxis = 'x';
				rotate = game.cube_set.horse.rotation[rotateAxis] - 0.1;
				rotateTo = game.cube_set.horse.rotation[rotateAxis] > -Math.PI;
				game.cube_set.horse.translateZ = offset;//move horse out of the cube area
			}else if(dir=='right'){
				rotateAxis = 'x';
				rotate = game.cube_set.horse.rotation[rotateAxis] + 0.1;
				rotateTo = game.cube_set.horse.rotation[rotateAxis] < 0;
				game.cube_set.horse.translateZ = -offset;//move horse out of the cube area
			}else if(dir=='no'){//no sink a lot
				rotateTo = false;
				fallingTo = game.config.hell_ground + game.config.ground_thick/2;
				/*collide. for cube edge start*/
				//if collide type is out,no need to collide.only move...
				if(!game.falling.collide_type_confirm){
					var horse = game.cube_set.horse.position;
					var cube = game.cube_set.cube[game.cube_set.cube.length-1].position;
					if(game.CubeDir.current=='forward'){
						if(horse.x>cube.x){
							game.falling.collide_out = true;
						}
					}else if(game.CubeDir.current=='left'){
						if(horse.z<cube.z){
							game.falling.collide_out = true;
						}
					}else{
						if(horse.z>cube.z){
							game.falling.collide_out = true;
						}
					}					
					game.falling.collide_type_confirm = true;
				}//confirm finished
				if(game.CubeDir.current=='forward'){
					if(!game.falling.collide_nodir||game.falling.collide_out){
						game.cube_set.horse.position.x += game.falling.x_speed_nodir;
					}else {
						game.cube_set.horse.position.x -= game.falling.x_speed_nodir/1.5;
					}
				}else if(game.CubeDir.current=='left'){
					if(!game.falling.collide_nodir||game.falling.collide_out){
						game.cube_set.horse.position.z -= game.falling.x_speed_nodir;
					}else{
						game.cube_set.horse.position.z += game.falling.x_speed_nodir/1.5;
					}
				}else{
					if(!game.falling.collide_nodir||game.falling.collide_out){
						game.cube_set.horse.position.z += game.falling.x_speed_nodir;
					}else{
						game.cube_set.horse.position.z -= game.falling.x_speed_nodir/1.5;
					}
				}
				///collide..
				if(!game.falling.collide_nodir&&!game.falling.collide_out){
					var cube = game.cube_set.cube;
					var horse = game.cube_set.horse;
					var dir_c = game.CubeDir.current;
					var offset = game.config.jumper_length/2;
					//(dir_c=='forward')? game.config.jumper_length/2 : game.config.jumper_width/2;
					var cube_width = cube[cube.length-1].geometry.parameters.width;
					var horse_pos = horse.position;
					var cube_pos = cube[cube.length-1].position;
					var horse_pos_ref = (dir_c=='forward')? horse_pos.x : horse_pos.z;
					var cube_pos_ref = (dir_c=='forward')? cube_pos.x : cube_pos.z;
					var collided = (dir_c=='forward') ? ( ( cube_pos_ref - ( horse_pos_ref /*+ offset */) ) < cube_width ) : (
								   (dir_c=='left') ? ( ( cube_pos_ref - ( horse_pos_ref - offset ) ) < cube_width ) : 
								   ( ( cube_pos_ref - ( horse_pos_ref + offset ) ) < cube_width ) );
					
					if(collided){
						if(dir_c=='forward'){
							horse.position.x -= 0.2;
						}else if(dir_c=='left'){
							horse.position.z += 0.2;
						}else{
							horse.position.z -= 0.2;
						}
						game.falling.collide_nodir = true;
					}
				}
				/*collide. for cube edge end*/
			}else{
				throw Error('Arguments Error');
			}
			if(!game.falling.end){
				if(rotateTo){
					game.cube_set.horse.rotation[rotateAxis] = rotate;
				}else if(game.cube_set.horse.position.y > fallingTo){
					game.cube_set.horse.position.y -= game.falling.speed;
				}else{
					game.falling.end = true;
				}
				game.renderer.render(game.scene,game.camera);
				requestAnimationFrame(function(){
					game.fail_fall();
				});
			}else{
				//
				var canvas = document.querySelector('canvas');
				canvas.addEventListener(game.mouseEvents.down, 	game.downevent);
				canvas.addEventListener(game.mouseEvents.up, 	game.upevent);
				//
				if(game.failedCallback){
					game.failedCallback();
				}
			}
		},
		checkcube:function(){//done    //forward only check x direction. left and right only check z direction. 
							//better check both direction in all condition
			if(this.cube_set.cube.length>1){
				var pointH = {//horse position. note that the reference point get translated
					x: (this.CubeDir.current=='forward')?this.cube_set.horse.position.x-this.config.jumper_length/2:this.cube_set.horse.position.x,
					z: (this.CubeDir.current=='forward')?this.cube_set.horse.position.z:(
						(this.CubeDir.current=='left')? this.cube_set.horse.position.z+this.config.jumper_length/2:this.cube_set.horse.position.z-this.config.jumper_length/2
					)
				};
				var pointC = {
					x: this.cube_set.cube[this.cube_set.cube.length - 2].position.x,
					z: this.cube_set.cube[this.cube_set.cube.length - 2].position.z
				};
				var pointN = {
					x: this.cube_set.cube[this.cube_set.cube.length - 1].position.x,
					z: this.cube_set.cube[this.cube_set.cube.length - 1].position.z
				};
				var distanceC,distanceN;
				if(this.CubeDir.current=='forward'){
					distanceC = Math.abs(pointC.x - pointH.x);
					distanceN = Math.abs(pointN.x - pointH.x);
				}else{
					distanceC = Math.abs(pointC.z - pointH.z);
					distanceN = Math.abs(pointN.z - pointH.z);
				}
				var cubewidth_current= this.cube_set.cube[this.cube_set.cube.length-2].geometry.parameters.width;
				var cubewidth_next=	this.cube_set.cube[this.cube_set.cube.length-1].geometry.parameters.width;
				var offset = this.config.jumper_length;
				//(this.CubeDir.current=='forward')? (this.config.jumper_length):(this.config.jumper_width);
				var selfArea = cubewidth_current/2 + offset/2 ;
				var nextArea = cubewidth_next/2 + offset/2 ;
				var result = 0;
				//// main direction check
				if(distanceC < selfArea){
					this.land_info.distance = distanceC;
					this.land_info.type = 0;
					result = (distanceC < cubewidth_current/2)? 1:2;
				}else if(distanceN < nextArea){
					this.land_info.distance = distanceN;
					this.land_info.type = 0;
					result = (distanceN < cubewidth_next/2)? 3:4;
				}else{
					this.land_info.type = 0;
					result = 0;
				}
				if(result==3){

					if(!(this.CubeDir.current=='forward')){
						distanceN = Math.abs(pointN.x - pointH.x);
					}else{
						distanceN = Math.abs(pointN.z - pointH.z);
					}
						offset = this.config.jumper_width;
						nextArea = cubewidth_next/2 + offset/2 ;
					if(distanceN < nextArea){
						this.land_info.distance = distanceN;
						result = (distanceN < cubewidth_next/2)? 3:4;
						if(result==4){
							this.land_info.type = 1;
						}
					}else{
						this.land_info.type = 0;
						result = 0;
					}
				
				}
				///// main direction check end
				this.land_info.result = result;
				
			}
		},
		createCheater:function(){
			var geometry = new THREE.CircleGeometry( 5, 32 );
			var material = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
			var circle = new THREE.Mesh( geometry, material );
			circle.position.set(-75,0.1,75);
			circle.rotation.x = -Math.PI/2;
			this.cube_set.cheater = circle;
			//this.scene.add(this.cube_set.cheater);
		},
		cheat:function(h_speed,v_speed,pos_x,pos_z){
			var distance=0,x=0,z=0,y=0;
			while(y>=0){
				distance += h_speed;
				y += v_speed;
				v_speed -= 0.04;
			}
			if(this.CubeDir.current=='forward'){
				x = pos_x + distance;
				z = pos_z;
			}else if(this.CubeDir.current=='left'){
				x = pos_x;
				z = pos_z - distance;
			}else{
				x = pos_x;
				z = pos_z + distance;
			}
			this.cube_set.cheater.position.set(x,0.1,z);
			if(this.cube_set.cheater.parent==null){
				this.scene.add(this.cube_set.cheater);
			}
		},
		mousedown:function(){//game config need to be editted.
			var game = this;		
			var cube_cur = game.cube_set.cube[game.cube_set.cube.length-2];
			if(!game.jumperStat.ready&&game.cube_set.horse.scale.z>0.5&&game.play){
				game.cube_set.horse.scale.z -= 0.01;
				game.jumperStat.h_speed += 0.035;
				game.jumperStat.y_speed += 0.04;
				game.cheat(game.jumperStat.h_speed , game.jumperStat.y_speed , game.cube_set.horse.position.x , game.cube_set.horse.position.z);
				game.cube_set.horse.position.y -=0.1;//squeeze effect.
				cube_cur.position.y -=0.1;
				cube_cur.scale.x +=0.002;
				cube_cur.scale.z +=0.002;
				game.cubeStat.recovered = false;
				game.jumperStat.jump_pos_reset = false;
				
				game.falling.x_speed_nodir = game.jumperStat.h_speed;//fail.no direction.type copy the speed.
				
				
				console.log('down');
				game.renderer.render(game.scene,game.camera);
				requestAnimationFrame(function(){
					game.mousedown();
				});
			}
		},
		
		mouseup:function(){//working... with fail fall
			var game = this;
			
			var canvas = document.querySelector('canvas');
			canvas.removeEventListener(game.mouseEvents.down, 	game.downevent);
			canvas.removeEventListener(game.mouseEvents.up, 	game.upevent);
		if(game.play){
			if(!game.cubeStat.recovered){
				game.cubeRecover();
			}
			game.jumperStat.ready = true;
			console.log('up');
			if(game.cube_set.horse.position.y>=0){
				if(game.CubeDir.current=='forward'){
					game.cube_set.horse.position.x += game.jumperStat.h_speed;
				}else if(game.CubeDir.current=='left'){
					game.cube_set.horse.position.z -= game.jumperStat.h_speed;
				}else{
					game.cube_set.horse.position.z += game.jumperStat.h_speed;
				}
				game.cube_set.horse.position.y += game.jumperStat.y_speed;
				game.jumperStat.y_speed -=0.04;
				if(game.cube_set.horse.scale.z<1){
					game.cube_set.horse.scale.z +=0.02;
				}
				game.renderer.render(game.scene,game.camera);
				requestAnimationFrame(function(){
					game.mouseup();
				});
			}else{
				game.scene.remove(game.cube_set.cheater);
				game.jumperStat.ready = false;
				game.jumperStat.h_speed = 0;
				game.jumperStat.y_speed = 0;
				game.cube_set.horse.position.y = 0;
				game.checkcube();
				var canvas = document.querySelector('canvas');
			
				if(game.land_info.result == 3){
					canvas.addEventListener(game.mouseEvents.down, 	game.downevent);
					canvas.addEventListener(game.mouseEvents.up, 	game.upevent);
					game.createCube();
					game.updateCamera();
					game.stage_info.cube++;
					if(game.successCallback){
						game.successCallback();
					}
					
				}else if(game.land_info.result == 1){
					//nothing. on current cube.no create cube
					canvas.addEventListener(game.mouseEvents.down, 	game.downevent);
					canvas.addEventListener(game.mouseEvents.up, 	game.upevent);
				}else{
					game.fail_fall();
				}
			}
		}
		},
		updateHorseDir:function(){
			var horse = this.cube_set.horse;
			var pos = this.jumperStat.position;
			var to_z ;
			var to_x ; 
			var rotateDone = false;
			if(this.CubeDir.former==this.CubeDir.current){
				//no need to change direction
			}else{
				if(this.CubeDir.former=='left'){
					horse.rotation.z -= 0.1;
					////
					to_z = pos.z + this.config.jumper_length/2;
					to_x = pos.x + this.config.jumper_length/2;
					if(horse.position.z<to_z){
						horse.position.z += this.config.jumper_length/14;
						horse.position.x += this.config.jumper_length/14;
					}else{
						horse.position.z = to_z;
						horse.position.x = to_x;
					}
					////
					if(Math.abs(horse.rotation.z)<=0.1){
						horse.rotation.z = 0;
						rotateDone = true;
					}
				}else if(this.CubeDir.former=='right'){
					horse.rotation.z += 0.1;
					////
					to_z = pos.z - this.config.jumper_length/2;
					to_x = pos.x + this.config.jumper_length/2;
					if(horse.position.z>to_z){
						horse.position.z -= this.config.jumper_length/14;
						horse.position.x += this.config.jumper_length/14;
					}else{
						horse.position.z = to_z;
						horse.position.x = to_x;
					}
					////
					if(Math.abs(horse.rotation.z)<=0.1){
						horse.rotation.z = 0;
						rotateDone = true;
					}
				}else{
					if(this.CubeDir.current=='left'){
						horse.rotation.z += 0.1;
						////
						to_z = pos.z - this.config.jumper_length/2;
						to_x = pos.x - this.config.jumper_length/2;
						if(horse.position.z>to_z){
							horse.position.z -= this.config.jumper_length/14;
							horse.position.x -= this.config.jumper_length/14;
						}else{
							horse.position.z = to_z;
							horse.position.x = to_x;
							
						}
						////
						if(Math.abs(horse.rotation.z-Math.PI/2)<=0.1){
							horse.rotation.z = Math.PI/2;
							rotateDone = true;
						}	
					}else{
						horse.rotation.z -= 0.1;
						////
						to_z = pos.z + this.config.jumper_length/2;
						to_x = pos.x - this.config.jumper_length/2;
						if(horse.position.z<to_z){
							horse.position.z += this.config.jumper_length/14;
							horse.position.x -= this.config.jumper_length/14;
						}else{
							horse.position.z = to_z;
							horse.position.x = to_x;
						}
						////
						if(Math.abs(horse.rotation.z+Math.PI/2)<=0.1){
							horse.rotation.z = -Math.PI/2;
							rotateDone = true;
						}
					}
					
				}
				if(!rotateDone){
					var game = this;
					this.renderer.render(this.scene,this.camera);
					requestAnimationFrame(function(){
						game.updateHorseDir();
					});
				}else{
					this.renderer.render(this.scene,this.camera);
				}
			}
		},
		updateCameraPos:function(){//done
			var lastIndex = this.cube_set.cube.length - 1;
			var pointA = {
				x:this.cube_set.cube[lastIndex].position.x,
				z:this.cube_set.cube[lastIndex].position.z
			};
			var pointB = {
				x:this.cube_set.cube[lastIndex-1].position.x,
				z:this.cube_set.cube[lastIndex-1].position.z
			};
			var pointR = new THREE.Vector3();
			pointR.x = (pointA.x+pointB.x)/2;
			pointR.y = 0;
			pointR.z = (pointA.z+pointB.z)/2;
			this.cameraPos.next = pointR;
		},
		updateCamera:function(){//done... floor change too light change too
			var game = this;
			var c = {
				x: game.cameraPos.current.x,
				y: game.cameraPos.current.y,
				z: game.cameraPos.current.z
			};
			var n = {
				x: game.cameraPos.next.x,
				y: game.cameraPos.next.y,
				z: game.cameraPos.next.z
			};
			if(n.x>c.x||n.z>c.z||n.z<c.z){
				game.cameraPos.current.x +=3;
				if(n.z>=c.z){
					game.cameraPos.current.z += 3;
				}else if(n.z<=c.z){
					game.cameraPos.current.z -= 3;
				}
				if(Math.abs(game.cameraPos.current.x - game.cameraPos.next.x)<3.5){
					game.cameraPos.current.x = game.cameraPos.next.x;
				}
				if(Math.abs(game.cameraPos.current.z - game.cameraPos.next.z)<3.5){
					game.cameraPos.current.z = game.cameraPos.next.z;
				}
				game.camera.position.set(c.x-200,200,c.z+200);
				game.camera.lookAt(c.x,0,c.z);
				var light1 = this.config.light_ref;
				//var light2 = this.config.light2_ref;
				game.light_set.light.position.set(c.x + light1.x , light1.y , c.z + light1.z);
				//game.light_set.light2.position.set(c.x + light2.x , light2.y , c.z + light2.z);
				game.renderer.render(game.scene,game.camera);
				game.floor.position.set(c.x,this.config.hell_ground,c.z);
				requestAnimationFrame(function() {
					game.updateCamera();
				});
			}
		},
		getRandomColor:function() {
			var letters = '0123456789ABCDEF';
			var color = '#';
			for (var i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
				return color;
		},
		createCube:function(){//done
			var rand = Math.random();
			var size = rand*20+30;//size from 30 to 50
			var col = this.getRandomColor();
			var material = new THREE.MeshStandardMaterial({color: col});
			var geometry = new THREE.BoxBufferGeometry(size,20,size);				
			var mesh = new THREE.Mesh(geometry,material);
			//mesh.level = 'normal';
			mesh.to_y = -10;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			if(this.cube_set.cube.length){
				var dir;
				if(this.CubeDir.current=='forward'){
					var dir_rand = Math.random();
					dir = (dir_rand>0.66) ? 'right':( (dir_rand>0.33) ? 'forward':'left' );

				}else if(this.CubeDir.current=='left'){
					var dir_rand = Math.random();
					dir = (dir_rand>0.5) ? 'left':'forward';	

				}else{
					var dir_rand = Math.random();
					dir = (dir_rand>0.5) ? 'right':'forward';
				}
				this.CubeDir.former = this.CubeDir.current;//update direction
				this.CubeDir.current = dir;
				this.jumperStat.position.x = this.cube_set.horse.position.x;
				this.jumperStat.position.y = this.cube_set.horse.position.y;
				this.jumperStat.position.z = this.cube_set.horse.position.z;
				this.updateHorseDir();
				
				///////////////////////////
				var destiny = Math.random();
				var special = (destiny>=0.1)&&(this.cube_set.cube_sp.length==6);
				var magicbox;
				if(special){
					magicbox = this.createCubeSpecial();
					mesh = magicbox.mesh;
					var rsize = 0.75+Math.random()/4;
					mesh.scale.x = mesh.scale.x*rsize;
					mesh.scale.y = mesh.scale.y*rsize;
					mesh.scale.z = mesh.scale.z*rsize;
					mesh.geometry.parameters.width = mesh.geometry.parameters.width*rsize;
					mesh.to_y = mesh.to_y*rsize;// i think no need to create magicbox.y...
					magicbox.y = magicbox.y*rsize;
				}
				if(this.CubeDir.current=='forward'){
					mesh.position.x = 	mesh.geometry.parameters.width/2 + 
										this.cube_set.cube[this.cube_set.cube.length-1].geometry.parameters.width/2+
										this.cube_set.cube[this.cube_set.cube.length-1].position.x+
										Math.random()*90+45;
					mesh.position.y =  (special) ? magicbox.y:-10;
					mesh.position.z =  this.cube_set.cube[this.cube_set.cube.length-1].position.z;				
				}else if(this.CubeDir.current=='left'){
					mesh.position.x =  this.cube_set.cube[this.cube_set.cube.length-1].position.x;
					mesh.position.y =  (special) ? magicbox.y:-10;
					mesh.position.z =  (-mesh.geometry.parameters.width/2)-
										this.cube_set.cube[this.cube_set.cube.length-1].geometry.parameters.width/2+
										this.cube_set.cube[this.cube_set.cube.length-1].position.z
										-Math.random()*90-45;
				}else{
					mesh.position.x =  this.cube_set.cube[this.cube_set.cube.length-1].position.x;
					mesh.position.y =  (special) ? magicbox.y:-10;
					mesh.position.z =  (mesh.geometry.parameters.width/2)+
										this.cube_set.cube[this.cube_set.cube.length-1].position.z+
										this.cube_set.cube[this.cube_set.cube.length-1].geometry.parameters.width/2+
										Math.random()*90+45;
				}	
			}else{
				mesh.position.set(-75,-10,75);//default horse position
			}
			
			this.cube_set.cube.push(mesh);
			if(this.cube_set.cube.length>6){
				this.scene.remove(this.cube_set.cube.shift());		
			}
			this.scene.add(mesh);//update camera?
			if(this.cube_set.cube.length > 1) {
				this.updateCameraPos();
			}
		},
		CameraSetup:function(){//done
			this.camera.position.set(-200,200,200);
			this.camera.lookAt(new THREE.Vector3(0,0,0));			
		},
		RendererSetup:function(){//done
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = THREE.BasicShadowMap;
			if(!this.config.isMobile){
				this.renderer.setPixelRatio( window.devicePixelRatio );
			}
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( this.renderer.domElement );						
		},
		SceneSetup:function(){//done
			this.scene.background = new THREE.Color(0x4286f4);
		},
		LightSetup:function(){//done only adjust position. no add!
			this.light_set.light.position.set(100,300,100); //= this.config.light_ref; not available
			this.light_set.light.castShadow = true;
			//this.light_set.light2.position = this.config.light2_ref;
			//this.light_set.light2.castShadow = true;
			//-----------------------------------------------
			
			this.light_set.light.shadow.mapSize.width = 512;  // default
			this.light_set.light.shadow.mapSize.height = 512; // default
			this.light_set.light.shadow.camera.near = 0.5;       // default
			this.light_set.light.shadow.camera.far = 500      // default
				
			//this.light_set.light2.shadow.mapSize.width = 512;  // default
			//this.light_set.light2.shadow.mapSize.height = 512; // default
			//this.light_set.light2.shadow.camera.near = 0.5;       // default
			//this.light_set.light2.shadow.camera.far = 500      // default
				
			//-----------------------------------------------		
		},
		createHelpers:function(){//done
			this.scene.add( this.helpers.light_helper );
			this.scene.add( this.helpers.axes_helper);
			this.scene.add( this.helpers.gridHelper );
			//this.scene.add( this.helpers.light2_helper );					
		},
		quickLoad:function(url,num,horse_or_cube,callback){//done
			game = this;
			this.loader.load(
			url,// resource URL
				function(object){
					game.cube_set.cube_color_order=1;
					callback(object);
					if(horse_or_cube==0){
						game.cube_set.horse = object;
						game.jumperStat.position.x = object.position.x;
						game.jumperStat.position.y = object.position.y;
						game.jumperStat.position.z = object.position.z;
						game.scene.add(game.cube_set.horse);
					}
					else{
						game.cube_set.cube[num] = object;
						game.scene.add(game.cube_set.cube[num]);
					}
					game.createCube();
					game.createCube();
					game.updateCamera();
					game.start();
					game.renderer.render(game.scene,game.camera);
				},
				function(xhr){// called when loading is in progresses
					console.log ((xhr.loaded/xhr.total*100)+'% loaded');
				},
				function ( error ) {
					console.log( 'An error happened' );
				}
			);
		},
		onWindowResize:function() {//done
				this.config.aspect = window.innerWidth / window.innerHeight;
				this.camera.left   = - this.config.frustumSize * this.config.aspect / 1;
				this.camera.right  =   this.config.frustumSize * this.config.aspect / 1;
				this.camera.top    =   this.config.frustumSize / 1;
				this.camera.bottom = - this.config.frustumSize / 1;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.render(this.scene,this.camera);
		},
		horse_create:function(){//done
				var game = this;
				this.quickLoad('obj/horse.obj',0,0,
				function(obj){
					obj.position.set(-75+game.config.jumper_length/2,0,75);
					obj.rotation.x = -Math.PI/2;
					//obj.rotation.z = Math.PI/2;
					//obj.rotation.y += Math.PI/2;
					obj.traverse(
						function(child){
							if(child instanceof THREE.Mesh){//child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );

								child.castShadow = true; //default is false
								child.receiveShadow = false; //default
								if(game.cube_set.cube_color_order==1){
									child.material = new THREE.MeshStandardMaterial( {color: 0xff0000} );
									game.cube_set.cube_color_order++;
								}
								
								else if(game.cube_set.cube_color_order==5){
									child.material = new THREE.MeshStandardMaterial( {color: 0xffff00} );
									game.cube_set.cube_color_order++;
									
								}
								
								else if(game.cube_set.cube_color_order==4){
									child.material = new THREE.MeshStandardMaterial( {color: 0xffbf00} );
									game.cube_set.cube_color_order++;
								}
								
								else if(game.cube_set.cube_color_order==11||game.cube_set.cube_color_order==12){
									child.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
									game.cube_set.cube_color_order++;
								}
			
								else{
									child.material = new THREE.MeshStandardMaterial( {color: 0x232323} );
									game.cube_set.cube_color_order++;
								}

							}
						});
				});				
		},
		start:function(){//done
			this.play = true;
		},
		stop:function(){//done
			this.play = false;
		},
		addSuccessFn: function(fn) {//done
			this.successCallback = fn
		},
		addFailedFn: function(fn) {//done
			this.failedCallback = fn
		},
		createfloor:function(){//done note that floor position change with updateCamera
			var geo; 
			if(this.config.isMobile){
				geo = new THREE.BoxGeometry(900,this.config.ground_thick,900);
			}else{
				geo = new THREE.BoxGeometry(1400,this.config.ground_thick,1400);
			}
			var mat = new THREE.MeshToonMaterial({color:0x7b8391});
			this.floor = new THREE.Mesh(geo,mat);
			this.floor.receiveShadow = true;
			this.floor.position.set(0,this.config.hell_ground,0);
			this.scene.add(this.floor);
		},
		restart:function(){//done 
			this.cameraPos  = {
				current:new THREE.Vector3(-200,200,200),
				next:new THREE.Vector3(-200,200,200)
			};
			this.falling = {
				end:false,
				speed:1.2,
				x_speed_nodir:0.5,
				collide_nodir:false,
				collide_out:false,
				collide_type_confirm:false
			};
			var length = this.cube_set.cube.length;
			for(var i = 0;i<length;i++){
				this.scene.remove(this.cube_set.cube.pop());
			}
			this.scene.remove(this.floor);
			this.scene.remove(this.cube_set.horse);
			this.createfloor();
			this.CameraSetup();
			this.LightSetup();
			this.createCube();
			this.createCube();
			this.horse_create();
		},
		cubeRecover:function(){
			console.log('recover');
			var target_cube = this.cube_set.cube[this.cube_set.cube.length-2];
			var to_y = target_cube.to_y;
			var scale = target_cube.scale.x;
			if(target_cube.position.y<to_y){
				var game = this;
				if(!this.jumperStat.jump_pos_reset){
					this.cube_set.horse.position.y = 0;
					this.jumperStat.jump_pos_reset = true;
				}else{
					target_cube.position.y +=0.35;
					target_cube.scale.x -=0.008;
					target_cube.scale.z -=0.008;
					if(target_cube.position.y>=to_y){
						target_cube.position.y = to_y;
						target_cube.scale.x = scale;
						target_cube.scale.z = scale;					
					}
				}
				requestAnimationFrame(function(){
					game.cubeRecover();
				});
			}else{
				this.cubeStat.recovered = true;
			}
		},
		revive:function(){
			this.falling = {
				end:false,
				speed:1.2,
				x_speed_nodir:0.5,
				collide_nodir:false,
				collide_out:false,
				collide_type_confirm:false
			};
			//i think no need to update camera...
			var r = this.cube_set.cube[this.cube_set.cube.length-2].position;
			this.cube_set.horse.position.set(r.x,0,r.z);
			this.cube_set.horse.rotation.x = -Math.PI/2;
			this.cube_set.horse.rotation.y = 0;
			this.cube_set.horse.rotation.z = (this.CubeDir.current=='left')? Math.PI/2 : (
											 (this.CubeDir.current=='forward')? 0:-Math.PI/2);
			this.renderer.render(this.scene,this.camera);
			
			
		},
		gamePropertyAdd:function(to_do){
			to_do();
		},
		quickLoadCube:function(url,callback){//done  //中間件
			game = this;
			this.loader.load(
			url,// resource URL
				function(object){
					game.cube_set.cube_color_order=1;
					callback(object);
					game.cube_set.cube_sp[game.cube_set.cube_sp.length] = object;
				},
				function(xhr){// called when loading is in progresses
					console.log ((xhr.loaded/xhr.total*100)+'% loaded');
				},
				function ( error ) {
					console.log( 'An error happened' );
				}
			);
		},
		specialCubeLoad:function(){//20,15,20 for original?
			var game = this;
			this.quickLoadCube('obj/001_take_window.obj',
			function(obj){
				
				//obj.position.y = -30;
				obj.rotating = 1;
				obj.to_y = game.cube_set.spc_default[0].y;
				obj.geometry = {
					parameters:{
						width:game.cube_set.spc_default[0].size
					}
				};
				obj.scale.set(2,2,2);//test
				obj.rotation.z = -Math.PI/2;//spin z could get different feelings!
				obj.rotation.x = -Math.PI/2;	
				obj.traverse(
					function(child){
						if(child instanceof THREE.Mesh){//child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );
							child.castShadow = true; //default is false
							child.receiveShadow = true; //default
							if(game.cube_set.color_order[0]==1){
								child.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );//方塊本體
								game.cube_set.color_order[0]++;
							}
							
							else if(game.cube_set.color_order[0]==2){
								child.material = new THREE.MeshStandardMaterial( {color: 0xf39700} );//內部
								game.cube_set.color_order[0]++;
									
							}
							else{
								child.material = new THREE.MeshStandardMaterial( {color: 0x8ec31e} );
								game.cube_set.color_order[0]++;
							}

						}
					});
					//obj.position.set(20,-30,20) ;
					//game.scene.add(obj);//test
			});	
			this.quickLoadCube('obj/002_taichi.obj',
			function(obj){//20,15,20 for original?
				//obj.position.set(-75,0,75);
				//obj.rotation.x = -Math.PI/2;
				//obj.position.y = 20;
				obj.rotating = 1;
				obj.to_y = game.cube_set.spc_default[1].y;
				obj.geometry = {
					parameters:{
						width:game.cube_set.spc_default[1].size
					}
				};
				obj.scale.set(2,2,2);
				obj.rotation.z = -Math.PI/2;//spin z to -pi or -pi/2
				obj.rotation.x = -Math.PI/2;	
				obj.traverse(
					function(child){
						if(child instanceof THREE.Mesh){//child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );
							child.castShadow = true; //default is false
							child.receiveShadow = true; //default
							if(game.cube_set.color_order[1]==1||game.cube_set.color_order[1]==9||game.cube_set.color_order[1]==10||game.cube_set.color_order[1]==13){//點點
								child.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
								game.cube_set.color_order[1]++;
							}	
							else if(game.cube_set.color_order[1]==6){//方塊本體
								child.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );//
								game.cube_set.color_order[1]++;		
							}
							else if(game.cube_set.color_order[1]==7||game.cube_set.color_order[1]==11){//藍
								child.material = new THREE.MeshStandardMaterial( {color: 0x036eb8} );//
								game.cube_set.color_order[1]++;		
							}
							else if(game.cube_set.color_order[1]==8||game.cube_set.color_order[1]==12){//gray
								child.material = new THREE.MeshStandardMaterial( {color: 0x3e3a39} );//
								game.cube_set.color_order[1]++;		
							}
							else{			
								game.cube_set.color_order[1]++;
							}

						}
				});
					//obj.position.set(20,-26,20)
					//game.scene.add(obj);//test
			});	
			this.quickLoadCube('obj/003_mortise.obj',
			function(obj){//size not sure
				//obj.position.set(-75,0,75);
				//obj.rotation.x = -Math.PI/2;
				//obj.position.y = -43;
				obj.rotating = 1;
				obj.to_y = game.cube_set.spc_default[2].y;
				obj.geometry = {
					parameters:{
						width:game.cube_set.spc_default[2].size
					}
				};
				obj.scale.set(2,2,2);
				obj.rotation.z = -Math.PI/2;//spin z to -pi or -pi/2
				obj.rotation.x = -Math.PI/2;	
				obj.traverse(
					function(child){
						if(child instanceof THREE.Mesh){//child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );
							child.castShadow = true; //default is false
							child.receiveShadow = true; //default
							if(game.cube_set.color_order[2]==1){//底座
								child.material = new THREE.MeshStandardMaterial( {color: 0x3e3e3e} );
								game.cube_set.color_order[2]++;
							}	
							
							else if(game.cube_set.color_order[2]==2){//方塊本體
								child.material = new THREE.MeshStandardMaterial( {color: 0xf39700} );//
								game.cube_set.color_order[2]++;		
							}
							else if(game.cube_set.color_order[2]==3){//方塊本體
								child.material = new THREE.MeshStandardMaterial( {color: 0x036eb8} );//
								game.cube_set.color_order[2]++;		
							}
							else if(game.cube_set.color_order[2]==4){//方塊本體
								child.material = new THREE.MeshStandardMaterial( {color: 0xff0000} );//
								game.cube_set.color_order[2]++;		
							}
							else{			
								game.cube_set.color_order[2]++;
							}

						}
				});	
					//obj.position.set(30,-30,30);//test
					//game.scene.add(obj);//test
			});	
			this.quickLoadCube('obj/004_momo.obj',
			function(obj){//20,15,20 for original?
				//obj.position.set(-75,0,75);
				//obj.rotation.x = -Math.PI/2;
				//obj.position.y = -43;
				obj.rotating = 0;
				obj.to_y = game.cube_set.spc_default[3].y;
				obj.geometry = {
					parameters:{
						width:game.cube_set.spc_default[3].size
					}
				};
				obj.scale.set(2,2,2);
				obj.rotation.z = -Math.PI/2;//spin z to 0 or -pi/2
				obj.rotation.x = -Math.PI/2;	
				obj.traverse(
					function(child){
						if(child instanceof THREE.Mesh){//child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );
							child.castShadow = true; //default is false
							child.receiveShadow = true; //default
							if(game.cube_set.color_order[3]==4){//樹枝
								child.material = new THREE.MeshStandardMaterial( {color: 0xf39700} );//
								game.cube_set.color_order[3]++;		
							}
							
							else if(game.cube_set.color_order[3]==5||game.cube_set.color_order[3]==17){//數葉
								child.material = new THREE.MeshStandardMaterial( {color: 0x81c31c} );//
								game.cube_set.color_order[3]++;		
							}
							else if(game.cube_set.color_order[3]==3||game.cube_set.color_order[3]==11){//桃子邊
								child.material = new THREE.MeshStandardMaterial( {color: 0xea5414} );//
								game.cube_set.color_order[3]++;		
							}
							else if(game.cube_set.color_order[3]==12||game.cube_set.color_order[3]==6){//ye
								child.material = new THREE.MeshStandardMaterial( {color: 0xffe100} );//
								game.cube_set.color_order[3]++;		
							}
							
							else if(game.cube_set.color_order[3]==16){//gray
								child.material = new THREE.MeshStandardMaterial( {color: 0x717071} );//
								game.cube_set.color_order[3]++;		
							}
							else{
								child.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
								game.cube_set.color_order[3]++;
							}

						}
				});	
					//obj.position.set(20,-30,20);//test
					//game.scene.add(obj);//test
			});
			this.quickLoadCube('obj/005_bdoor.obj',
			function(obj){//20,15,20 for original?
				//obj.position.set(-75,0,75);
				//obj.rotation.x = -Math.PI/2;
				//obj.position.y = -43;
				//obj.translateZ(10);
				obj.rotating = 1;
				obj.to_y = game.cube_set.spc_default[4].y;
				obj.geometry = {
					parameters:{
						width:game.cube_set.spc_default[4].size
					}
				};
				obj.scale.set(2,2,2);
				obj.rotation.z = -Math.PI/2;//spin z to 0 or -pi/2
				obj.rotation.x = -Math.PI/2;	
				obj.traverse(
					function(child){
						if(child instanceof THREE.Mesh){//child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );
							child.castShadow = true; //default is false
							child.receiveShadow = true; //default
							if(game.cube_set.color_order[4]==1){//樹枝
								child.material = new THREE.MeshStandardMaterial( {color: 0xea5414} );//
								game.cube_set.color_order[4]++;		
							}			
							else{
								child.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
								game.cube_set.color_order[4]++;
							}

						}
				});	
					//obj.position.set(20,-28,20);//test
					//game.scene.add(obj);//test
			});
			this.quickLoadCube('obj/006_dragonson.obj',
			function(obj){//20,15,20 for original?
				//obj.position.set(-75,0,75);
				//obj.rotation.x = -Math.PI/2;
				//obj.position.y = -43;
				obj.rotating = 1;//1 for rotate any angle. 0 for only two angle
				obj.to_y = game.cube_set.spc_default[5].y;//reads the default
				obj.geometry = {
					parameters:{
						width:game.cube_set.spc_default[5].size
					}
				};
				obj.scale.set(2.5,2.5,2.5);
				obj.rotation.z = -Math.PI/2;//spin z to 0 or -pi/2
				obj.rotation.x = -Math.PI/2;	
				obj.traverse(
					function(child){
						if(child instanceof THREE.Mesh){//child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );
							child.castShadow = true; //default is false
							child.receiveShadow = true; //default
							if(game.cube_set.color_order[5]==5){//深灰ㄉ
								child.material = new THREE.MeshStandardMaterial( {color: 0xffffff} );//
								game.cube_set.color_order[5]++;		
							}
							else if(game.cube_set.color_order[5]==4){//green
								child.material = new THREE.MeshStandardMaterial( {color: 0x8ec31e} );//
								game.cube_set.color_order[5]++;		
							}
							else if(game.cube_set.color_order[5]==12||game.cube_set.color_order[5]==19||game.cube_set.color_order[5]==31||game.cube_set.color_order[5]==36||game.cube_set.color_order[5]==0){//bl
								child.material = new THREE.MeshStandardMaterial( {color: 0x036eb8} );//
								game.cube_set.color_order[5]++;		
							}
							else{
								child.material = new THREE.MeshStandardMaterial( {color: 0x3e3a39} );
								game.cube_set.color_order[5]++;
							}

						}
				});	
					//obj.position.set(20,-15,20);
					//game.scene.add(obj);//test
			});
		},
		createCubeSpecial:function(){
			var random = Math.floor(Math.random()*6);
			var width = this.cube_set.cube_sp[random].size;
			var y = this.cube_set.cube_sp[random].to_y;
			var mesh = this.cube_set.cube_sp[random].clone();
			
			
				mesh.geometry = {
					parameters:{
						width:this.cube_set.cube_sp[random].geometry.parameters.width
					}
				};
				mesh.to_y = this.cube_set.cube_sp[random].to_y;
			var alldirection = this.cube_set.cube_sp[random].rotating;
			var rotated = Math.random();
			if(alldirection==0){
				mesh.rotation.z = (rotated>=0.5)? 0:(-Math.PI/2);
			}else{
				if(rotated>=0.75){
					mesh.rotation.z = 0;
				}else if(rotated>=0.5){
					mesh.rotation.z = -Math.PI/2;
				}else if(rotated>=0.25){
					mesh.rotation.z = -Math.PI/2*2;
				}else{
					mesh.rotation.z = -Math.PI/2*3;
				}
			}

			return {mesh:mesh,y:y};
			
		}
		
	};