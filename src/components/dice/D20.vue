<template>
    <div class="content">
      <div class="die" ref="die" @click="randomRoll">
        <figure class="face face-1"></figure>
        <figure class="face face-2"></figure>
        <figure class="face face-3"></figure>
        <figure class="face face-4"></figure>
        <figure class="face face-5"></figure>
        <figure class="face face-6"></figure>
        <figure class="face face-7"></figure>
        <figure class="face face-8"></figure>
        <figure class="face face-9"></figure>
        <figure class="face face-10"></figure>
        <figure class="face face-11"></figure>
        <figure class="face face-12"></figure>
        <figure class="face face-13"></figure>
        <figure class="face face-14"></figure>
        <figure class="face face-15"></figure>
        <figure class="face face-16"></figure>
        <figure class="face face-17"></figure>
        <figure class="face face-18"></figure>
        <figure class="face face-19"></figure>
        <figure class="face face-20"></figure>
      </div>
    </div>

    <br><br>
    <button @click="changeFace()">Change face to random</button>
</template>

<script>
import { ref } from "vue"

export default {
    name: "D20",
    setup() {
        const die = ref(null)
        const sides = 20
        const initialSide = 1
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

$faceWidth:  $containerWidth*0.5;
$faceHeight: $faceWidth*0.86;

$transitionDuration: 0.5s;
$animationDuration:  3s;

$angle: 53deg;
$ringAngle: -11deg;
$sideAngle: 360deg/5;
$opacity: 0.9;
$color: rgba(30, 180, 20, $opacity);

$rotateX: -$angle;
$translateZ: $faceWidth*0.335;
$translateY: -$faceHeight*0.15;
$translateRingZ: $faceWidth*0.75;
$translateRingY: $faceHeight*0.78 + $translateY;
$translateLowerZ: $translateZ;
$translateLowerY: $faceHeight*0.78 + $translateRingY;

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

  transform: rotateX($rotateX);

  &.rolling {
    animation: roll $animationDuration linear;
  }

  @for $i from 1 through 5 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 1;
      transform: rotateX(-$angle) rotateY($sideAngle * $angleMultiplier);
    }
  }

  @for $i from 16 through 20 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 15;
      transform: rotateX(-$angle + 180deg) rotateY(-$sideAngle * $angleMultiplier);
    }
  }

  @for $i from 6 through 10 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 6;
      transform: rotateX(-$ringAngle) rotateZ(180deg) rotateY($sideAngle * $angleMultiplier);
    }
  }

  @for $i from 11 through 15 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 8;
      transform: rotateX(-$ringAngle) rotateY(-$sideAngle * $angleMultiplier - $sideAngle/2);
    }
  }

  .face {
    $horizontalMargin: -$faceWidth*0.5;

    position: absolute;
    left: 50%;
    top: 0;
    margin: 0 $horizontalMargin;
    border-left: $faceWidth*0.5 solid transparent;
    border-right: $faceWidth*0.5 solid transparent;
    border-bottom: $faceHeight solid $color;
    width: 0px;
    height: 0px;
    transform-style: preserve-3d;
    backface-visibility: hidden;

    counter-increment: steps 1;

    &:before {
      content: counter(steps);
      position: absolute;
      top: $faceHeight*0.25;
      left: -$faceWidth;
      color: #fff;
      text-shadow: 1px 1px 3px #000;
      font-size: $faceHeight*0.5;
      text-align: center;
      line-height: $faceHeight*0.9;
      width: $faceWidth*2;
      height: $faceHeight;
    }

    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 1;
        transform: rotateY(-$sideAngle * $angleMultiplier) translateZ($translateZ) translateY($translateY) rotateX($angle);
      }
    }

    @for $i from 16 through 20 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 18;
        transform: rotateY($sideAngle * $angleMultiplier + $sideAngle/2) translateZ($translateLowerZ) translateY($translateLowerY) rotateZ(180deg) rotateX($angle);
      }
    }

    @for $i from 6 through 10 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 11;
        transform: rotateY(-$sideAngle * $angleMultiplier) translateZ($translateRingZ) translateY($translateRingY) rotateZ(180deg) rotateX($ringAngle);
      }
    }

    @for $i from 11 through 15 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 8;
        transform: rotateY($sideAngle * $angleMultiplier + $sideAngle/2) translateZ($translateRingZ) translateY($translateRingY) rotateX($ringAngle);
      }
    }
  }
}
</style>
