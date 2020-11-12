<template>
        <div id="control_panel" class="control_panel">
            <h6>Teal dice</h6>
            <p id="loading_text">Loading libraries, please wait a bit...</p>
            <p id="info_text">... info text ...</p>
        </div>

        <div id="info_div" style="display: none">
            <div class="center_field">
                <span id="label"></span>
            </div>
            <div class="center_field">
                <div class="bottom_field">
                    <span id="labelhelp">click to continue or tap and drag again</span>
                </div>
            </div>
        </div>

        <div id="selector_div" style="display: none">
            <div class="center_field">
                <div id="sethelp">
                    choose your dice set by clicking the dices or by direct input of notation,<br/>
                    tap and drag on free space of screen or hit throw button to roll
                </div>
            </div>
            <div class="center_field">
                <input type="text" id="set" value="4d6"><br/>
                <button id="clear">clear</button>
                <button style="margin-left: 0.6em" id="throw">throw</button>
            </div>
        </div>
        <div id="canvas"></div>
</template>

<script>
import Teal from './libs/teal'
import { MyDiceObj, parse_notation, stringify_notation } from './libs/dice'

export default {
    name: "Teal",
    mounted() {

        const container = document.body;

        Teal.remove(Teal.id('loading_text'));

        var canvas = Teal.id('canvas');
        canvas.style.width = window.innerWidth - 1 + 'px';
        canvas.style.height = window.innerHeight - 1 + 'px';
        var label = Teal.id('label');
        var set = Teal.id('set');
        var selector_div = Teal.id('selector_div');
        var info_div = Teal.id('info_div');
        on_set_change();

        // Teal.dice.use_true_random = false;

        function on_set_change() { set.style.width = set.value.length + 3 + 'ex'; }
        Teal.bind(set, 'keyup', on_set_change);
        Teal.bind(set, 'mousedown', function(ev) { ev.stopPropagation(); });
        Teal.bind(set, 'mouseup', function(ev) { ev.stopPropagation(); });
        Teal.bind(set, 'focus', function() { Teal.set(container, { class: '' }); });
        Teal.bind(set, 'blur', function() { Teal.set(container, { class: 'noselect' }); });

        Teal.bind(Teal.id('clear'), ['mouseup', 'touchend'], function(ev) {
            ev.stopPropagation();
            set.value = '0';
            on_set_change();
        });

        var params = {};
        // var params = Teal.get_url_params();
        // if (params.chromakey) {
        //     Teal.dice.desk_color = 0x00ff00;
        //     info_div.style.display = 'none';
        //     Teal.id('control_panel').style.display = 'none';
        // }
        // if (params.shadows == 0) {
        //     Teal.dice.use_shadows = false;
        // }
        // if (params.color == 'white') {
        //     Teal.dice.dice_color = '#808080';
        //     Teal.dice.label_color = '#202020';
        // }

        // var box = new Dice.dice_box(canvas, { w: 500, h: 300 });
        var box = new MyDiceObj(canvas, { w: 500, h: 300 });
        box.animate_selector = false;

        Teal.bind(window, 'resize', function() {
            canvas.style.width = window.innerWidth - 1 + 'px';
            canvas.style.height = window.innerHeight - 1 + 'px';
            box.reinit(canvas, { w: 500, h: 300 });
        });

        function show_selector() {
            info_div.style.display = 'none';
            selector_div.style.display = 'inline-block';
            box.draw_selector();
        }

        function before_roll(vectors, notation, callback) {
            info_div.style.display = 'none';
            selector_div.style.display = 'none';
            // do here rpc call or whatever to get your own result of throw.
            // then callback with array of your result, example:
            // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
            callback();
        }

        function notation_getter() {
            return parse_notation(set.value);
        }

        function after_roll(notation, result) {
            if (params.chromakey || params.noresult) return;
            var res = result.join(' ');
            if (notation.constant) {
                if (notation.constant > 0) res += ' +' + notation.constant;
                else res += ' -' + Math.abs(notation.constant);
            }
            if (result.length > 1) res += ' = ' +
                    (result.reduce(function(s, a) { return s + a; }) + notation.constant);
            label.innerHTML = res;
            info_div.style.display = 'inline-block';
        }

        box.bind_mouse(container, notation_getter, before_roll, after_roll);
        box.bind_throw(Teal.id('throw'), notation_getter, before_roll, after_roll);

        Teal.bind(container, ['mouseup', 'touchend'], function(ev) {
            ev.stopPropagation();
            if (selector_div.style.display == 'none') {
                if (!box.rolling) show_selector();
                box.rolling = false;
                return;
            }
            var name = box.search_dice_by_mouse(ev);
            if (name != undefined) {
                var notation = parse_notation(set.value);
                notation.set.push(name);
                set.value = stringify_notation(notation);
                on_set_change();
            }
        });

        if (params.notation) {
            set.value = params.notation;
        }
        if (params.roll) {
            Teal.raise_event(Teal.id('throw'), 'mouseup');
        }
        else {
            show_selector();
        }
    }
}
</script>


<style scoped>
#svg *, .svg * {
    -moz-user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -o-user-select: none;
    user-select: none;
}

#waitform {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10000;
    cursor: wait;
}

a {
    color: gray;
}

em {
    border: 1px rgba(0, 0, 0, 0.2) solid;
    font-style: normal;
    padding: 0px 3px;
    background-color: rgba(0, 0, 0, 0.08);
    border-radius: 3px;
}

body {
    font-family: Georgia;
}

h6 {
    font-size: 100%;
    font-weight: normal;
    margin: 0px;
}

p {
    font-size: 80%;
    margin-top: 5px;
    margin-bottom: 0px;
}

.control_panel {
    padding: 15px;
    padding-bottom: 0px;
    position: absolute;
    z-index: 10;
}

.center_field {
    position: absolute;
    text-align: center;
    height: 100%;
    width: 100%;
}

.center_field * {
    position: relative;
    font-family: Trebuchet MS;
    background-color: rgba(255, 255, 255, 0.6);
    padding: 5px 15px;
}

.center_field br {
    background-color: rgba(0, 0, 0, 0);
}

.bottom_field {
    position: absolute;
    text-align: center;
    bottom: 5px;
    width: inherit;
    padding: 0px;
}

#label {
    font-size: 32pt;
    word-spacing: 0.5em;
    padding: 5px 15px;
    color: rgba(21, 26, 26, 0.6);
    top: 45%;
}

#labelhelp {
    font-size: 12pt;
    padding: 5px 15px;
    color: rgba(21, 26, 26, 0.5);
    bottom: 50px;
}

#set {
    text-align: center;
    font-size: 26pt;
    border: none;
    color: rgba(0, 0, 0, 0.8);
    background-color: rgba(255, 255, 255, 0);
    top: 60%;
}

#sethelp {
    font-size: 12pt;
    color: rgba(21, 26, 26, 0.5);
    background: none;
    top: 25%;
}

#selector_div button {
    font-size: 20pt;
    color: rgb(255, 255, 255);
    background-color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    border: none;
    width: 5em;
    top: 62%;
}

.dice_place {
    position: absolute;
    border: solid black 1px;
}
</style>
