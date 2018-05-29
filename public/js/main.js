/*
three.js
ddsloader.js
objloader.js
dat.gui.min.js
AxesHelper.js
and this
file above might has different path.  not case sensitive of jsfiles...

must be imported by index.html 

*/
			var gui;
			var gridHelper ;
			var axes_helper ; 
			var scene ;
			var camera ;
			var renderer ;
			var loader ;
			var	light ;	
			var light_helper;			
			var cube=[];// 0 for jumper .
			var frustumSize = 200;
			var jump_info={
				gaming:true,//temp
				landing_success:true,
				at_cube:1,
				ready:false,//click?
				fly: false,
				horizontal_speed: 0,
				vertical_speed:true,//true for rising,false for falling
				count:0,
				cheer:function(){
					if(this.horizontal_speed<50){
						if(this.horizontal_speed<10)
							this.horizontal_speed+=0.2;
						else if(this.horizontal_speed<20)
							this.horizontal_speed+=0.25;
						else if(this.horizontal_speed<30)
							this.horizontal_speed+=0.3;
						else if(this.horizontal_speed<40)
							this.horizontal_speed+=0.35;
						else if(this.horizontal_speed<50)
							this.horizontal_speed+=0.4;
					}//speed limit
				},
				flying:function(){
					this.count++;
					if(this.count==9){
						this.vertical_speed = false;
					}
					if(this.count==17){
						//cube[0].position.y = 0;
						//cube[0].rotation.y = 0;
						this.horizontal_speed = 0;
						this.count = 0;
						this.fly = false;
						this.vertical_speed = true;
						this.ready = false;
						this.landing();//check if landing successfully.
					}
					
				},
				landing:function(){
					if(jump_info.at_cube!=(cube.length-1)){//endpoint no need to search for next
					//note that if it's endpoint ,then game should be finished
						x_max = cube[this.at_cube+1].x_max;
						x_min = cube[this.at_cube+1].x_min;
						z_max = cube[this.at_cube+1].z_max;
						z_min = cube[this.at_cube+1].z_min;
					}
					///next
					x_cmax = cube[this.at_cube].x_max;
					x_cmin = cube[this.at_cube].x_min;
					z_cmax = cube[this.at_cube].z_max;
					z_cmin = cube[this.at_cube].z_min;
					///current
					x_c = cube[0].position.x;
					z_c = cube[0].position.z;
					if(((jump_info.at_cube!=(cube.length-1))&&(x_c<=x_max)&&(x_c>=x_min)&&(z_c<=z_max)&&(z_c>=z_min))){
						this.at_cube++;
					}
					else if(((x_c<=x_cmax)&&(x_c>=x_cmin)&&(z_c<=z_cmax)&&(z_c>=z_cmin))){
						
					}
					else{
						this.landing_success = false ;
					}
					
				},
				relife:function(){
					this.landing_success = true;
				}
			};
			
			
			
			init();					
			setTimeout(animate,100);
			
			function animate(){
			
			if(jump_info.landing_success){
				if(jump_info.fly){
				
						if(cube[jump_info.at_cube].jump_direction==0){// jump left
							cube[0].position.z -= jump_info.horizontal_speed*0.15 ;
							cube[0].rotation.x -= Math.PI*2/17;//spin  i found that will lose one frame,causing rotation. wrong... then i correct it
							//while(cube[0].rotation.x<0){cube[0].rotation.x += 2*Math.PI;}
						}
						else if(cube[jump_info.at_cube].jump_direction==1){// jump forward
							cube[0].position.x += jump_info.horizontal_speed*0.15 ;		
							cube[0].rotation.y += Math.PI*2/17;
							//while(cube[0].rotation.y>2*Math.PI){cube[0].rotation.y -= 2*Math.PI;}
						}
						else if(cube[jump_info.at_cube].jump_direction==2){// jump right
							cube[0].position.z += jump_info.horizontal_speed*0.15 ;
							cube[0].rotation.x += Math.PI*2/17;
							//while(cube[0].rotation.x2*Math.PI){cube[0].rotation.x -= 2*Math.PI;}							
						}
					if(jump_info.count == 8){
					//stop frame	
					}
					else if(jump_info.vertical_speed){// vertical 
					cube[0].position.y += 10;
					}
					else {
						cube[0].position.y -= 10;
					}						
					jump_info.flying();	
				
				//camera follow
					camera.position.set((cube[0].position.x -125) ,200,(cube[0].position.z +125 ));
					camera.lookAt(  new THREE.Vector3((cube[0].position.x+75),0,cube[0].position.z-75) );
				}
			
				if(jump_info.ready){//increase horizontal speed
					jump_info.cheer();
				}
			}
			else{// fail to land.
				if(jump_info.gaming){
					alert('NOOB');
					jump_info.gaming = false;
				}
				
			}

			
			requestAnimationFrame(animate);//call jump success or fail animation here
			renderer.render(scene,camera);
			//cube[0].rotation.y+=0.1;//note:如果我們改變物體旋轉，會一併改變該物體的相對軸，
			//cube[0].rotation.x+=0.1;//原本Scene的坐標軸便不再適用，該物體會有自己的一個旋轉軸
			//cube[0].rotation.z+=0.1;//調變該物體position時則採用Scene的坐標軸，而非自己的旋轉軸
			
			}// end of animate
			function init(){
				/*
				(function(){
					gui={}; 
					var datGui = new dat.GUI();//add control plane. no use
				})();
				*/
				gridHelper = new THREE.GridHelper( 1000, 20 );
				axes_helper = new THREE.AxesHelper(20);
				scene = new THREE.Scene();
				scene.background = new THREE.Color(0x4286f4);
				/*
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
				// use orthogono camera might be better for our game.
				*/
				var aspect = window.innerWidth / window.innerHeight;
				camera = new THREE.OrthographicCamera( frustumSize * aspect / - 1, frustumSize * aspect / 1, frustumSize / 1, frustumSize / - 1, 1, 2000 );
				
				renderer = new THREE.WebGLRenderer();
		
				loader = new THREE.OBJLoader();
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				scene.add( axes_helper);
				scene.add( gridHelper );
				camera.position.set(-200,200,200);
				camera.lookAt(new THREE.Vector3(0,0,0));
				//make some cube here. only to demo
				var bg = new THREE.BoxGeometry(50,20,50);
				var m1 = new THREE.MeshBasicMaterial({color: 0x00ff00});
				var cb1 = new THREE.Mesh(bg,m1);	
				var cb2 = new THREE.Mesh(bg,m1);
				var	cb3 = new THREE.Mesh(bg,m1);			
				scene.add(cb1);	scene.add(cb2);scene.add(cb3);
				cb1.position.set(-75,-10,75);
				cb2.position.set(0,-10,75);
	
				cb3.position.set(0,-10,150);
				cube[1] = { x_max:-50,x_min:-100,z_max:100,z_min:50,jump_direction:1,related: cb1};
				cube[2] = { x_max:25,x_min:-25,z_max:100,z_min:50,jump_direction:2,related:	cb2};
		
				cube[3] = { x_max:25,x_min:-25,z_max:175,z_min:125,jump_direction:1,related: cb3};
				//
				quickLoad('obj/horse.obj',0,
				function(obj){
					obj.position.set(-75,0,75);
					obj.rotation.x = -Math.PI/2;
					obj.traverse(
						function(child){
							if(child instanceof THREE.Mesh){

								child.material = new THREE.MeshBasicMaterial( {color: 0xa5e587} );
							}
						});
				});
					window.addEventListener( 'resize', onWindowResize, false );
		
			}
		function touchdown(){
			if(!jump_info.fly)	jump_info.ready = true; //ready to fly,increase speed
		};
		
		function touchup(){
			jump_info.fly = true; //fly!
		};
		function mousedown(){
			if(!jump_info.fly)	jump_info.ready = true; //ready to fly,increase speed
		};
		
		function mouseup(){
			jump_info.fly = true; //fly!
		};
		
		function quickLoad(url,num,callback){
			loader.load(
			url,// resource URL
			function(object){
				/* 
					who can make the horse 's rotation point in the center.Please help
				*/
				callback(object);
				cube[num] = object;
				scene.add(cube[num]);
			},
			function(xhr){// called when loading is in progresses
				console.log ((xhr.loaded/xhr.total*100)+'% loaded');
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
		}
		//THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
		//require ddsloader and mtlloader
		function quickLoadWithMTL(target,setpath_mtl,mtl_name,setpath_obj,obj_name,callback){
			new THREE.MTLLoader()
				.setPath( setpath_mtl ) //'models/obj/male02/'
				.load( mtl_name, function ( materials ) {
					materials.preload();
					new THREE.OBJLoader()
						.setMaterials( materials )
						.setPath( setpath_obj )
						.load( obj_name, function ( object ) {
							callback(object);//object is the thing we want, use callback to adjust its property
							cube[target] = object;
							scene.add( cube[target] );
						}, onProgress, onError );
				} );
		}
		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
			}
		};
		var onError = function ( xhr ) { };
		/* for perpectivecamera
		function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
		}
		*/
		function onWindowResize() {
				var aspect = window.innerWidth / window.innerHeight;
				camera.left   = - frustumSize * aspect / 1;
				camera.right  =   frustumSize * aspect / 1;
				camera.top    =   frustumSize / 1;
				camera.bottom = - frustumSize / 1;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
