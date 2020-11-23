import * as THREE from 'three';
import * as CANNON from 'cannon';
import { DiceManager, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20 } from './diceManager'

export default function useDice() {

  let world, camera, scene, renderer, dice=[];

  function initCannon() {
      world = new CANNON.World();
      // world.gravity.set(0, 0, -9.8 * 800);
      world.gravity.set(0, -9.82 * 20, 0);
      world.broadphase = new CANNON.NaiveBroadphase();
      world.solver.iterations = 16;

      //Floor
      let floorBody = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial});
      floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      world.add(floorBody);
  }

  function initThree(canvas) {
      scene = new THREE.Scene()
      var SCREEN_WIDTH = canvas.clientWidth, SCREEN_HEIGHT = canvas.clientHeight;
      var VIEW_ANGLE = 40, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.01, FAR = 20000;
      camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
      camera.position.set(0, 10, 40);
      // camera.position.set(0,30,30);

      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      canvas.appendChild(renderer.domElement) // add renderer inside DOM

      // // If you want a transparent background in three.js, you need pass in the alpha parameter to the WebGLRenderer constructor.
      // var renderer = new THREE.WebGLRenderer( { alpha: true } );
      // // You can leave the clear color at the default value.
      // renderer.setClearColor( 0x000000, 0 ); // the default

      // make canvas responsive
      window.addEventListener('resize', () => {
          renderer.setSize(canvas.clientWidth, canvas.clientHeight)
          camera.aspect = canvas.clientWidth/canvas.clientHeight
          camera.updateProjectionMatrix()
      })

      let ambient = new THREE.AmbientLight(0xf0f5fb, 0.3);
      scene.add(ambient);
      let directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
      directionalLight.position.x = -1000;
      directionalLight.position.y = 1000;
      directionalLight.position.z = 1000;
      scene.add(directionalLight);

      let light = new THREE.SpotLight(0xefdfd5, 1.3);
      light.position.y = 100;
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
      light.shadow.camera.near = 50;
      light.shadow.camera.far = 110;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      scene.add(light);

      var floorMaterial = new THREE.MeshPhongMaterial( { color: '#00aa00', side: THREE.DoubleSide } );
      var floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.receiveShadow  = true;
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);
  }

  function initDice() {
      DiceManager.setWorld(world);

      var colors = ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'];
        for (var i = 0; i < 5; i++) {
            var die = new DiceD6({size: 1.5, backColor: colors[i]});
            scene.add(die.getObject());
            dice.push(die);
        }


         // setInterval(randomDiceThrow, 3000);
         var diceValues = [];
         for (i = 0; i < dice.length; i++) {
             let yRand = Math.random() * 20
             dice[i].getObject().position.x = -15 - (i % 3) * 1.5;
             dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
             dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
             dice[i].getObject().quaternion.x = (Math.random()*90-45) * Math.PI / 180;
             dice[i].getObject().quaternion.z = (Math.random()*90-45) * Math.PI / 180;
             dice[i].updateBodyFromMesh();
             let rand = Math.random() * 5;
             dice[i].getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
             dice[i].getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);

             diceValues.push({dice: dice[i], value: 3});
         }

         // DiceManager.prepareValues(diceValues);

         requestAnimationFrame( animate );

      const diceTypes = [
          { obj: DiceD4, color: '#ff0000'},
          { obj: DiceD4, color: '#00ff00'},
          { obj: DiceD6, color: '#0000ff'},
          { obj: DiceD6, color: '#ff0000'},
          { obj: DiceD8, color: '#00ff00'},
          { obj: DiceD8, color: '#0000ff'},
          { obj: DiceD10, color: '#ff0000'},
          { obj: DiceD10, color: '#00ff00'},
          { obj: DiceD12, color: '#0000ff'},
          { obj: DiceD12, color: '#ff0000'},
          { obj: DiceD20, color: '#00ff00'},
          { obj: DiceD20, color: '#0000ff'},
      ];

      console.log(diceTypes);
      // diceTypes.forEach((dieType) => {
      //     const die = new dieType.obj({size: 1.5, backColor: dieType.color});
      //     scene.add(die.getObject());
      //     dice.push(die);
      // });
  }

  function throwDice(diceToRoll) {

      console.log(diceToRoll)


      // var diceValues = [];
      for (var i = 0; i < dice.length; i++) {
          // dice[i].getObject().position.x = -15 - (i % 3) * 1.5;
          // dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
          // dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
          // dice[i].getObject().quaternion.x = (Math.random()*90-45) * Math.PI / 180;
          // dice[i].getObject().quaternion.z = (Math.random()*90-45) * Math.PI / 180;
          // dice[i].updateBodyFromMesh();

          // let yRand = Math.random() * 20
          // let rand = Math.random() * 5;
          // dice[i].getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
          // dice[i].getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);
          dice[i].emulateThrow(function(asd){
              console.log(asd)
          });


          // diceValues.push({dice: dice[i], value: 3});
      }

      // DiceManager.prepareValues(diceValues);


  }

  function clearDice() {
      dice.forEach((die) => {
          scene.remove(die.getObject());
      });

      dice = [];
  }

  // function randomDiceThrow() {
  //     var diceValues = [];
  //
  //     for (var i = 0; i < dice.length; i++) {
  //         let yRand = Math.random() * 20
  //         dice[i].getObject().position.x = -15 - (i % 3) * 1.5;
  //         dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
  //         dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
  //         dice[i].getObject().quaternion.x = (Math.random()*90-45) * Math.PI / 180;
  //         dice[i].getObject().quaternion.z = (Math.random()*90-45) * Math.PI / 180;
  //         dice[i].updateBodyFromMesh();
  //         let rand = Math.random() * 5;
  //         dice[i].getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
  //         dice[i].getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);
  //
  //         diceValues.push({dice: dice[i], value: 1});
  //     }
  //
  //     DiceManager.prepareValues(diceValues);
  // }

  function animate() {
      updatePhysics();
      render();
      requestAnimationFrame( animate );
  }

  function updatePhysics() {
      world.step(1.0 / 60.0);

      for (var i in dice) {
          dice[i].updateMeshFromBody();
      }
  }

  function render() {
      renderer.render( scene, camera );
  }

  return { initThree, initCannon, initDice, animate, throwDice, clearDice };
}
