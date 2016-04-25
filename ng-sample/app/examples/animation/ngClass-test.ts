import {Component} from "angular2/core";
import {Observable} from "data/observable";
import {style, animate, group, sequence} from "angular2/src/core/metadata/animations";

@Component({
    selector: "main-component",
    templateUrl: "./examples/animation/NgClass-test.html",
    styleUrls: [ "./examples/animation/NgClass-test.css" ]
})
export class NgClassAnimationTest {

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