import * as THREE from 'three';
import * as CANNON from 'cannon';
import { DiceManager, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20 } from './diceManager'

export default function useDice() {

  let world, camera, scene, renderer, dice=[], canvasHeight, canvasWidth;

  const objTypes = {
      '4': DiceD4,
      '6': DiceD6,
      '8': DiceD8,
      '10': DiceD10,
      '12': DiceD12,
      '20': DiceD20
  };

  function initCannon() {
      world = new CANNON.World();
      world.gravity.set(0, 0, -9.8 * 100);
      world.broadphase = new CANNON.NaiveBroadphase();
      world.solver.iterations = 16;

      // Floor
      let floorBody = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial});
      world.add(floorBody);

      // Walls
      let barrier;
      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
      barrier.position.set(0, 10, 0); // 10 calculate from height?
      world.add(barrier);

      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      barrier.position.set(0, -10, 0); // -10 calculate from height?
      world.add(barrier);

      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
      barrier.position.set(20, 0, 0); // 20 calculate from width?
      world.add(barrier);

      barrier = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
      barrier.position.set(-20, 0, 0); // -20 calculate from width?
      world.add(barrier);

      // set the dice world!
      DiceManager.setWorld(world);
  }

  function initThree(canvas) {
      scene = new THREE.Scene();
      canvasWidth = canvas.clientWidth;
      canvasHeight = canvas.clientHeight;
      camera = new THREE.PerspectiveCamera(40, canvasWidth / canvasHeight, 0.01, 200);
      camera.position.set(0, 0, 40);

      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}); // alpha = transparent background
      renderer.setClearColor( 0x000000, 0 ); // the default
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      canvas.appendChild(renderer.domElement); // add renderer inside DOM

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

  function throwDice(diceToRoll, callback) {
      clearDice();

      Object.entries(diceToRoll).forEach(entry => {
          const [dieType, count] = entry;

          for (let i = 0; i < count; i++) {
              const die = new objTypes[dieType]();

              die.getObject().position.x = -10 + i;
              die.getObject().position.y = -5 + i;
              die.getObject().position.z = 2;
              die.getObject().rotation.x = (40 + i) * Math.PI / 180;

              let yRand = Math.random() * 10; // 20
              let rand = Math.random() * 100; // 5
              die.getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
              die.getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);

              scene.add(die.getObject());
              die.updateBodyFromMesh();
              dice.push(die);
          }
      });

      DiceManager.unpreparedRoll(dice, (values) => {
          callback(values);
      })
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

      dice.forEach((die) => {
          die.updateMeshFromBody();
      });
  }

  function render() {
      renderer.render( scene, camera );
  }

  return { initThree, initCannon, animate, throwDice, clearDice };
}
