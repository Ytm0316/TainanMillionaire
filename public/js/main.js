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
			var cube=[];// 0 for jumper .
			var frustumSize = 200;
			var jump_info={
				ready:false,//click?
				fly: false,
				horizontal_speed: 0,
				vertical_speed:true,//true for rising,false for falling
				count:0,
				cheer:function(){
					if(this.horizontal_speed<50)//speed limit
					this.horizontal_speed+=0.2;
				},
				flying:function(){
					this.count++;
					if(this.count==9){
						this.vertical_speed = false;
					}
					if(this.count==17){
						//cube[0].position.y = 0;
						cube[0].rotation.y = 0;
						this.horizontal_speed = 0;
						this.count = 0;
						this.fly = false;
						this.vertical_speed = true;
						this.ready = false;
					}
					
				}
			};
			
			
			
			init();					
			setTimeout(animate,100);
			
			function animate(){
			
			if(jump_info.fly){
				//do something here
				cube[0].position.x += jump_info.horizontal_speed ;//這裡暫時使用x 這跟關卡地圖的跳躍角度有關
						
				if(jump_info.count == 8){
					
				}
				else if(jump_info.vertical_speed){// vertical 
					cube[0].position.y += 10;
				}
				else {
					cube[0].position.y -= 10;
				}
				
				
				cube[0].rotation.y += Math.PI/9;		
				jump_info.flying();	
				
				//camera follow
				camera.position.set((cube[0].position.x ) ,200,(cube[0].position.z +200 ));
				camera.lookAt(  new THREE.Vector3((cube[0].position.x+200),0,cube[0].position.z) );
			}
			if(jump_info.ready){//increase horizontal speed
				jump_info.cheer();
			}
			
			requestAnimationFrame(animate);//call jump success or fail animation here
			renderer.render(scene,camera);
			//cube[0].rotation.y+=0.1;//note:如果我們改變物體旋轉，會一併改變該物體的相對軸，
			//cube[0].rotation.x+=0.1;//原本Scene的坐標軸便不再適用，該物體會有自己的一個旋轉軸
			//cube[0].rotation.z+=0.1;//調變該物體position時則採用Scene的坐標軸，而非自己的旋轉軸
			
			}
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
				scene.background = new THREE.Color(0x000000);
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

				
				
				quickLoad('obj/horse.obj',0,
				function(obj){
					obj.position.set(-200,0,0);
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
