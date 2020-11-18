import * as THREE from 'three';
import * as CANNON from 'cannon';
import { DiceManager, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20 } from './diceManager'

export default function useDice() {

  let world, camera, scene, renderer, dice=[];

  function initCannon() {
      world = new CANNON.World();
      world.gravity.set(0, 0, -9.8 * 200);
      world.broadphase = new CANNON.NaiveBroadphase();
      world.solver.iterations = 16;

      // Floor
      let floorBody = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial});
      world.add(floorBody);

      // Walls
      // TODO: fix barrier positioning
      let barrier;
      barrier = new CANNON.Body(0, new CANNON.Plane(), DiceManager.barrierBodyMaterial);
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
      barrier.position.set(0, 500 * 0.93, 0);
      world.add(barrier);

      barrier = new CANNON.Body(0, new CANNON.Plane(), DiceManager.barrierBodyMaterial);
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      barrier.position.set(0, -500 * 0.93, 0);
      world.add(barrier);

      barrier = new CANNON.Body(0, new CANNON.Plane(), DiceManager.barrierBodyMaterial);
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
      barrier.position.set(1000 * 0.93, 0, 0);
      world.add(barrier);

      barrier = new CANNON.Body(0, new CANNON.Plane(), DiceManager.barrierBodyMaterial);
      barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
      barrier.position.set(-1000 * 0.93, 0, 0);
      world.add(barrier);
  }

  function initThree(canvas) {
      scene = new THREE.Scene()
      const SCREEN_WIDTH = canvas.clientWidth;
      const SCREEN_HEIGHT = canvas.clientHeight;
      camera = new THREE.PerspectiveCamera(40, SCREEN_WIDTH / SCREEN_HEIGHT, 0.01, 200);
      camera.position.set(0, 0, 40);

      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}) // alpha = transparent background
      renderer.setClearColor( 0x000000, 0 ); // the default
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
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
      const floorGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT, 1, 1);
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.receiveShadow  = true;
      scene.add(floor);
  }

  function initDice() {
      DiceManager.setWorld(world);

      // const diceTypes = [
      //     { obj: DiceD4, color: '#ff0000'},
      //     { obj: DiceD4, color: '#00ff00'},
      //     { obj: DiceD6, color: '#0000ff'},
      //     { obj: DiceD6, color: '#ff0000'},
      //     { obj: DiceD8, color: '#00ff00'},
      //     { obj: DiceD8, color: '#0000ff'},
      //     { obj: DiceD10, color: '#ff0000'},
      //     { obj: DiceD10, color: '#00ff00'},
      //     { obj: DiceD12, color: '#0000ff'},
      //     { obj: DiceD12, color: '#ff0000'},
      //     { obj: DiceD20, color: '#00ff00'},
      //     { obj: DiceD20, color: '#0000ff'},
      // ];
      //
      // diceTypes.forEach((dieType) => {
      //     const die = new dieType.obj({size: 1.5, backColor: dieType.color});
      //     scene.add(die.getObject());
      //     dice.push(die);
      // });
  }

  function throwDice(diceToRoll) {

      const objTypes = {
          'd4': DiceD4,
          'd6': DiceD6,
          'd8': DiceD8,
          'd10': DiceD10,
          'd12': DiceD12,
          'd20': DiceD20
      };

      diceToRoll.forEach((dieType) => {
          const die = new objTypes[dieType]();
          scene.add(die.getObject());

          die.getObject().position.x = -10;
          die.getObject().position.y = 0;
          die.getObject().position.z = 4;
          die.getObject().rotation.x = 40 * Math.PI / 180;
          die.updateBodyFromMesh();

          let yRand = Math.random() * 20
          let rand = Math.random() * 5;
          die.getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
          die.getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);

          dice.push(die);
      });

      return dice;
  }

  function clearDice() {
      dice.forEach((die) => {
          scene.remove(die.getObject());
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

  return { initThree, initCannon, initDice, animate, throwDice, clearDice };
}
