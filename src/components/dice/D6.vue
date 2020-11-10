<template>
    <h1>Click the dice to roll</h1>
    <section class="container">
      <div id="d6" ref="cube" @click="rotate">
        <div class="front">
          <span class="dot dot1"></span>
        </div>
        <div class="back">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
        </div>
        <div class="right">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
          <span class="dot dot3"></span>
        </div>
        <div class="left">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
          <span class="dot dot3"></span>
          <span class="dot dot4"></span>
        </div>
        <div class="top">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
          <span class="dot dot3"></span>
          <span class="dot dot4"></span>
          <span class="dot dot5"></span>
        </div>
        <div class="bottom">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
          <span class="dot dot3"></span>
          <span class="dot dot4"></span>
          <span class="dot dot5"></span>
          <span class="dot dot6"></span>
        </div>
      </div>
    </section>
</template>


<script>
import { ref } from "vue"

export default {
    name: "D6",
    setup() {
        const cube = ref(null);
        const min = 1;
        const max = 24;

        function rotate() {
          const xRand = getRandom(max, min);
          const yRand = getRandom(max, min);

          cube.value.style.webkitTransform = 'rotateX('+xRand+'deg) rotateY('+yRand+'deg)';
          cube.value.style.transform = 'rotateX('+xRand+'deg) rotateY('+yRand+'deg)';
        }

        function getRandom(max, min) {
          return (Math.floor(Math.random() * (max-min)) + min) * 90;
        }

        return {
          cube,
          rotate
        }
    }
}
</script>


<style scoped>
#d6 .front {
  transform:
    translateZ(100px);
}

#d6 .back {
  transform:
    rotateX(-180deg)
    translateZ(100px);
}

#d6 .right {
  transform:
    rotateY(90deg)
    translateZ(100px);
}

#d6 .left {
  transform:
    rotateY(-90deg)
    translateZ(100px);
}

#d6 .top {
  transform:
    rotateX(90deg)
    translateZ(100px);
}

#d6 .bottom {
  transform:
    rotateX(-90deg)
    translateZ(100px);
}

.container {
  width: 200px;
  height: 200px;
  position: relative;
  margin: 0 auto 40px;
  border: 1px solid #FFF;

  perspective: 1000px;
  perspective-origin: 50% 100%;
}

#d6 {
  width: 100%;
  height: 100%;
  top: 100px;
  position: absolute;

  transform-style: preserve-3d;

  transition: transform 6s;
}

#d6:hover {
  cursor: pointer;
}

#d6 div {
  background: hsla(0, 85%, 50%, 0.8);
  display: block;
  position: absolute;
  width: 200px;
  height: 100px;
  border: 2px solid #ab1a1a;

  margin: 0 auto;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 500%;
  text-align: center;
  padding: 50px 0;
}

.dot {
  display: block;
  position: absolute;
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 15px;
}

.front .dot1 { top: 85px; left: 85px; }
.back .dot1 { top: 45px; left: 45px; }
.back .dot2 { top: 125px; left: 125px; }
.right .dot1 { top: 45px; left: 45px; }
.right .dot2 { top: 85px; left: 85px; }
.right .dot3 { top: 125px; left: 125px; }
.left .dot1 { top: 45px; left: 45px; }
.left .dot2 { top: 45px; left: 125px; }
.left .dot3 { top: 125px; left: 45px; }
.left .dot4 { top: 125px; left: 125px; }
.top .dot1 { top: 45px; left: 45px; }
.top .dot2 { top: 45px; left: 125px; }
.top .dot3 { top: 85px; left: 85px; }
.top .dot4 { top: 125px; left: 45px; }
.top .dot5 { top: 125px; left: 125px; }
.bottom .dot1 { top: 45px; left: 45px; }
.bottom .dot2 { top: 45px; left: 85px; }
.bottom .dot3 { top: 45px; left: 125px; }
.bottom .dot4 { top: 125px; left: 45px; }
.bottom .dot5 { top: 125px; left: 85px; }
.bottom .dot6 { top: 125px; left: 125px; }
</style>
