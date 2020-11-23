import * as THREE from 'three';
import * as CANNON from 'cannon';
import { DiceManager, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20 } from './diceManager'

export default function useDice() {

  let world, camera, scene, renderer, dice=[], canvasHeight, canvasWidth;

  function initCannon() {
      world = new CANNON.World();
      world.gravity.set(0, 0, -9.8 * 100);
      world.broadphase = new CANNON.NaiveBroadphase();
      world.solver.iterations = 16;

      // Floor
      let floorBody = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial});
      world.add(floorBody);

      // Walls
      // TODO: fix barrier positioning
      let barrier;
      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
      barrier.position.set(0, canvasHeight * 0.93, 0);
      world.add(barrier);

      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      barrier.position.set(0, -canvasHeight * 0.93, 0);
      world.add(barrier);

      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
      barrier.position.set(canvasWidth * 0.93, 0, 0);
      world.add(barrier);

      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
      barrier.position.set(-canvasWidth * 0.93, 0, 0);
      world.add(barrier);

      // set the dice world!
      DiceManager.setWorld(world);
  }

  function initThree(canvas) {
      scene = new THREE.Scene()
      canvasWidth = canvas.clientWidth;
      canvasHeight = canvas.clientHeight;
      camera = new THREE.PerspectiveCamera(40, canvasWidth / canvasHeight, 0.01, 200);
      camera.position.set(0, 0, 40);

      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}) // alpha = transparent background
      renderer.setClearColor( 0x000000, 0 ); // the default
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      canvas.appendChild(renderer.domElement) // add renderer inside DOM

      // make canvas responsive
      window.addEventListener('resize', () => {
          renderer.setSize(canvas.clientWidth, canvas.clientHeight)
          camera.aspect = canvas.clientWidth/canvas.clientHeight
          camera.updateProjectionMatrix()
      })

      let ambient = new THREE.AmbientLight(0xf0f5fb, 0.3);
      scene.add(ambient);

      let light = new THREE.SpotLight(0xefdfd5, 1.3);
      light.position.x = 20;
      light.position.y = 20;
      light.position.z = 30;
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
      scene.add(light);

      // FLOOR - just to reflect shadows
      const floorMaterial = new THREE.ShadowMaterial();
      floorMaterial.opacity = 0.5;
      const floorGeometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight, 1, 1);
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.receiveShadow  = true;
      scene.add(floor);
  }

  function throwDice(diceToRoll) {
      clearDice();

      const objTypes = {
          'd4': DiceD4,
          'd6': DiceD6,
          'd8': DiceD8,
          'd10': DiceD10,
          'd12': DiceD12,
          'd20': DiceD20
      };

      const diceVals = [];
      diceToRoll.forEach((dieType, index) => {
          const die = new objTypes[dieType]();

          die.getObject().position.x = -10 + index;
          die.getObject().position.y = -10 + index*3;
          die.getObject().position.z = 2;
          die.getObject().rotation.x = (40 + index) * Math.PI / 180;

          let yRand = Math.random() * 10; // 20
          let rand = Math.random() * 100; // 5
          die.getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
          die.getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);

          scene.add(die.getObject());
          die.updateBodyFromMesh();
          dice.push(die);
          diceVals.push({dice:die, value:1});
      });

      // DiceManager.prepareValues(diceVals);
  }

  function getUpsideValues() {
      dice.forEach((die) => {
          console.log(die.getUpsideValue())
      });
  }

  function clearDice() {
      dice.forEach((die) => {
          const dieObj = die.getObject();
          scene.remove(dieObj);
          if (dieObj.body) world.remove(dieObj.body);
      });

      dice = [];
  }


  function animate() {
      updatePhysics();
      render();
      requestAnimationFrame( animate );
  }

  function updatePhysics() {
      world.step(1.0 / 60.0);

      for (let i in dice) {
          dice[i].updateMeshFromBody();
      }
  }

  function render() {
      renderer.render( scene, camera );
  }

  return { initThree, initCannon, animate, throwDice, clearDice, getUpsideValues };
}
