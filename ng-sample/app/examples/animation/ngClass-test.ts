import {Component} from "angular2/core";
import {Observable} from "data/observable";
import {style, animate, group, sequence} from "angular2/src/core/metadata/animations";

@Component({
    selector: "main-component",
    templateUrl: "./examples/animation/ngClass-test.html",
    styleUrls: [ "./examples/animation/ngClass-test.css" ]
})
export class ngClassAnimationTest {

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