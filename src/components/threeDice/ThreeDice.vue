<template>
<teleport to="aside">
    <div id="controlpanel">
        <a v-for="diceType of diceTypes" :key="diceType" @click="addToRoll(diceType)">
            {{diceSymbol}}{{diceType}}
        </a>
        <input type="text" v-model="formula"  />
        <button @click="roll">Throw me maybe</button>
        <button @click="clearRoll">Clear me maybe</button>
        <button @click="getUpsideValues">Get upside values</button>
    </div>
</teleport>
<div ref="diceTray" id="dicetray"></div>
</template>

<script>
import {
    reactive,
    onMounted,
    toRefs
} from 'vue'
import useDice from './diceTrayTop'

export default {
    name: "ThreeDice",
    setup() {
        const {
            initThree,
            initCannon,
            animate,
            throwDice,
            clearDice,
            getUpsideValues
        } = useDice()

        const diceTypes = [4, 6, 8, 10, 12, 20]
        const diceSymbol = 'd'

        const state = reactive({
            diceTray: null, // diceTray element
            formula: '2d6',
        })

        function addToRoll(diceType) {
            const regex = new RegExp('[0-9]+' + diceSymbol + diceType + '(?![0-9])' , 'g')
            const match = regex.exec(state.formula)

            if (!match) {
                state.formula += (state.formula ? '+' : '') + '1' + diceSymbol + diceType
            } else {
                const increment = (parseInt(match[0], 10) + 1) + diceSymbol + diceType
                // replace on the exact position in case of multiple matches
                state.formula = state.formula.slice(0, match.index)
                              + increment
                              + state.formula.slice(match.index + match[0].length)
            }
        }

        function clearRoll() {
            state.formula = ''
            clearDice()
        }

        function roll() {
            const regex = new RegExp('[0-9]+' + diceSymbol + '(100|4|8|6|10|12|20)' , 'g')
            const match = state.formula.match(regex) || []
            const diceToRoll = [];

            match.forEach((string) => {
                let count = parseInt(string, 10)
                const diceType = string.replace(count, '')

                while (count > 0) {
                   diceToRoll.push(diceType)
                   count--
                }
            })

            throwDice(diceToRoll);
        }

        onMounted(() => {
            initThree(state.diceTray)
            initCannon()
            animate()
        })

        return {
            ...toRefs(state), // destructure reactive object
            diceTypes,
            diceSymbol,
            addToRoll,
            clearRoll,
            roll,
            getUpsideValues
        }
    }
}
</script>


<style scoped>
#dicetray {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
}

#dicetray canvas {
    display: block;
    pointer-events: none;
}

#controlpanel {
    position: fixed;
    bottom: 5px;
    left: 5px;
    border: solid;
}

#controlpanel a,
#controlpanel input,
#controlpanel button {
    display: block;
    width: 100px;
    margin: 0;
}

#controlpanel a {
    cursor: pointer;
    line-height: 24px;
}
</style>
