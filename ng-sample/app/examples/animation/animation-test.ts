import {Component, animation, style, animate, state, transition } from '@angular/core';

@Component({
    selector: 'animation-test',
    templateUrl: "./examples/animation/animation-test.html",
    styleUrls: [ "./examples/animation/animation-test.css" ],
    animations: [
        animation('state', [
            state('void', style({ "background-color": "red" })),
            state('active', style({ "background-color": "green" })),
            state('hidden', style({ "background-color": "red" })),
            transition('active => hidden', [ animate('3000ms ease-out') ]),
            transition('hidden => active', [ animate('3000ms ease-out') ]),
        ]),
    ]
})
export class AnimationTest {
    
    isOn = false;
    text = "Normal";

    onTap() {
        this.isOn = !this.isOn;
        if (this.isOn) {
            this.text = "Toggled";
        }
        else {
            this.text = "Normal";
        }
    }
}

