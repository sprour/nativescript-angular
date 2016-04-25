import {Component} from "angular2/core";
import {Observable} from "data/observable";
import {style, animate, group, sequence} from "angular2/src/core/metadata/animations";

@Component({
    selector: "main-component",
    templateUrl: "./examples/animation/addRemoveClass-test.html",
    animations: {
         "addClass(on)": [
             style({"background-color": "white"}),
             sequence([
                animate({"background-color": "green"}, 1000),
             ])
         ],
          "removeClass(on)": [
             style({"background-color": "white"}),
             sequence([
                animate({"background-color": "red"}, 1000),
             ])
         ]
     }
})
export class addRemoveClassAnimationTest {

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