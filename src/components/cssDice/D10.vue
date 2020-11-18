<template>
    <div class="content">
      <div class="die" ref="die" @click="randomRoll">
        <figure class="face face-0"></figure>
        <figure class="face face-1"></figure>
        <figure class="face face-2"></figure>
        <figure class="face face-3"></figure>
        <figure class="face face-4"></figure>
        <figure class="face face-5"></figure>
        <figure class="face face-6"></figure>
        <figure class="face face-7"></figure>
        <figure class="face face-8"></figure>
        <figure class="face face-9"></figure>
      </div>
    </div>

    <br><br>
    <button @click="changeFace()">Change face to random</button>
</template>

<script>
import { ref } from "vue"

export default {
    name: "D10",
    setup() {
        const die = ref(null)
        const sides = 10
        const initialSide = 0
        const animationDuration = 3000

        let lastFace = null
        let timeoutId = null

        function randomFace() {
          const face = Math.floor((Math.random() * sides)) + initialSide
          lastFace = face == lastFace ? randomFace() : face

          return face
        }

        function rollTo(face) {
          clearTimeout(timeoutId)
          die.value.dataset.face = face
        }

        function reset() {
          die.value.dataset.face = null
          die.value.classList.remove('rolling')
        }

        function changeFace(face = null) {
          reset()
          rollTo(face ? face : randomFace())

          // die.value.dataset.face = face ? face : randomFace()
          // timeoutId = setTimeout(function () {
          //    die.value.dataset.face = face ? face : randomFace()
          // }, 500)
        }

        function randomRoll() {
          die.value.classList.add('rolling')
          clearTimeout(timeoutId)

          timeoutId = setTimeout(function () {
             reset()
             rollTo(randomFace())
          }, animationDuration)
        }

        return {
          die,
          randomRoll,
          changeFace
        }
    }
}
</script>


<style lang="scss" scoped>
$containerWidth: 200px;
$containerHeight: $containerWidth;

$upperHeight: $containerWidth*0.5;
$lowerHeight: $containerWidth*0.12;
$internalWidth: $upperHeight*0.52;

$transitionDuration: 0.5s;
$animationDuration:  3s;

$angle: 45deg;
$sideAngle: 360deg/5;
$opacity: 0.75;
$color: rgba(30, 180, 20, $opacity);

$translateZ: $upperHeight*0.34;
$translateY: $lowerHeight*0.29;
$translateLowerZ: -$translateZ;
$translateLowerY: -$translateY;
$rotateX: $angle;

@keyframes roll {
  10% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) }
  // 30% { transform: rotateX(120deg) rotateY(240deg) rotateZ(0deg) translateX(40px) translateY(40px) }
  // 50% { transform: rotateX(240deg) rotateY(480deg) rotateZ(0deg) translateX(-40px) translateY(-40px) }
  30% { transform: rotateX(120deg) rotateY(240deg) rotateZ(0deg) }
  50% { transform: rotateX(240deg) rotateY(480deg) rotateZ(0deg) }
  70% { transform: rotateX(360deg) rotateY(720deg) rotateZ(0deg) }
  90% { transform: rotateX(480deg) rotateY(960deg) rotateZ(0deg) }
}

.content {
  margin: auto auto;
  position: relative;
  width: $containerWidth;
  height: $containerHeight;
  perspective: 1500px;
}

.die {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform $transitionDuration ease-out;
  cursor: pointer;

  transform: rotateX(-$angle);

  &.reset {
    transition: transform 0.1s ease-out;
    transform: rotateX(0);
  }

  &.rolling {
    animation: roll $animationDuration linear;
  }

  @for $i from 0 through 9 {
    &[data-face="#{$i}"] {
      @if $i % 2 == 0 {
        $angleMultiplier: $i / 2;
        transform: rotateX(-$angle) rotateY($sideAngle * $angleMultiplier);
      } @else {
        $angleMultiplier: ($i + 1) / 2;
        transform: rotateX(-180deg - $angle) rotateY(-$sideAngle * $angleMultiplier);
      }
    }

    .face.face-#{$i} {

      @if $i % 2 == 0 {
        // even sides are in the upper position of the die

        $angleMultiplier: $i / 2;
        transform: rotateY(-$sideAngle * $angleMultiplier) translateZ($translateZ) translateY($translateY) rotateX($angle);

      } @else {

        // odd sides are in the lower position of the die
        top: $upperHeight;

        $angleMultiplier: ($i + 1) / 2;
        transform: rotateY($sideAngle * $angleMultiplier) translateZ($translateLowerZ) translateY($translateLowerY) rotateZ(180deg) rotateY(180deg) rotateX($angle);

      }

    }
  }

  .face {
    $horizontalMargin: -$internalWidth;

    position: absolute;
    left: 50%;
    top: 0;
    margin: 0 $horizontalMargin;
    border-left: $internalWidth solid transparent;
    border-right: $internalWidth solid transparent;
    border-bottom: $upperHeight solid $color;
    width: 0px;
    height: 0px;
    transform-style: preserve-3d;;
    backface-visibility: hidden;;

    counter-increment: steps 1;

    &:first-child {
      counter-increment: steps 0;
    }

    &:before {
      content: counter(steps);
      position: absolute;
      top: $upperHeight*0.25;
      left: -$internalWidth;
      color: #fff;
      text-shadow: 1px 1px 3px #000;
      font-size: $upperHeight*0.6;
      text-align: center;
      line-height: $upperHeight;
      width: $internalWidth*2;
      height: $upperHeight;
    }

    &:after {
      content: "";
      position: absolute;
      bottom: -($upperHeight + $lowerHeight);
      left: -$internalWidth;
      border-left: $internalWidth solid transparent;
      border-right: $internalWidth solid transparent;
      border-top: $lowerHeight solid $color;
      width: 0px;
      height: 0px;
    }
  }
}
</style>
