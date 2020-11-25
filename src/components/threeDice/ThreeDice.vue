<template>
<teleport to="aside">
    <div id="controlpanel">
        <a v-for="diceType in diceTypes" :key="diceType" @click="addDice(diceType)">
            {{diceSymbol}}{{diceType}}
        </a>
        <input type="text" v-model="formula" :disabled="rolling" @blur="formulaToDice" />
        <button @click="roll" :disabled="rolling">Throw me maybe</button>
        <button @click="clearRoll" :disabled="rolling">Clear me maybe</button>
    </div>

    <div id="resultpanel">
        <!-- <template v-for="(values, diceType) in upsideValues" :key="diceType">
            (<template v-for="val in values" :key="val">{{val}}+</template >)+
        </template >
        <a>{{ addition }}</a> -->
        RESULT: {{result}} <span v-if="addition">+ {{addition}}</span >
    </div>
</teleport>
<div ref="diceTray" id="dicetray"></div>
</template>

<script>
import {
    reactive,
    onMounted,
    toRefs,
    computed,
    watchEffect
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
            clearDice
        } = useDice()

        const diceTypes = [4, 6, 8, 10, 12, 20]
        const diceSymbol = 'd'

        const state = reactive({
            diceTray: null, // diceTray element ref
            rolling: false,
            result: computed(() => getResult()),
            formula: '',
            upsideValues: {},
            addition: 0,
            diceToRoll: {6:1} // {diceType:count}
        })

        watchEffect(() => {
          state.formula = getFormula() // dependant on diceToRoll and addition
        })

        // function isValidFormula(formula) {
        //     console.log('validating formula')
        //     let isValid = formula.trim() != state.formula
        //     const regex = new RegExp('(^[0-9]+' + diceSymbol + '(' + diceTypes.join('|') + ')$)|(^[0-9]+$)' , 'g')
        //     const formulaExpressions = formula.replace(/\s/g, '').split(/[+-]+/)
        //     formulaExpressions.forEach((expression) => {
        //         if (!expression.match(regex)) {
        //             isValid = false
        //         }
        //     })
        //
        //     return isValid
        // }

        function formulaToDice() {
            console.log('setting formula')
            const regex = new RegExp('[0-9]+' + diceSymbol + '(' + diceTypes.join('|') + ')' , 'g')
            const match = state.formula.match(regex) || []
            const diceToRoll = {}
            let formula = state.formula.slice()

            match.forEach((string) => {
                formula = formula.replace(string, '')
                let count = parseInt(string, 10)
                const diceType = string.replace(count, '').replace(diceSymbol, '')

                while (count > 0) {
                   diceToRoll[diceType] = diceToRoll[diceType] || 0
                   diceToRoll[diceType]++
                   count--
                }
            })

            state.diceToRoll = {...diceToRoll}
            state.addition = getAddition(formula)
        }

        function getAddition(formula) {
            console.log('getting addition')
            let addition = 0;
            const regex = new RegExp('[+|-][0-9]+', 'g')
            const match = formula.replace(/\s/g, '').match(regex) || []
            match.forEach((string) => {
                const num = parseInt(string, 10)
                addition += num
            })

            return addition;
        }

        function getFormula() {
            console.log('getting formula')
            let formula = ''
            Object.entries(state.diceToRoll).forEach(entry => {
                const [dieType, count] = entry;
                formula += (formula ? ' + ' : '') + count + diceSymbol + dieType
            })

            return formula.slice() + (state.addition ? ' + ' + state.addition : '')
        }

        function addDice(diceType) {
            state.diceToRoll[diceType] = state.diceToRoll[diceType] || 0
            state.diceToRoll[diceType]++
        }

        function getResult() {
            console.log('getting result')
            let result = 0
            Object.values(state.upsideValues).forEach(values => {
                values.forEach(val => {
                    result += val
                })
            })

            return result
        }

        function clearRoll() {
            state.upsideValues = {}
            state.diceToRoll = {}
            state.addition = 0
            clearDice()
        }

        function roll() {
            state.rolling = true

            throwDice(state.diceToRoll, (values) => {
                state.upsideValues = values
                state.rolling = false
            });
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
            addDice,
            clearRoll,
            formulaToDice,
            roll
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
