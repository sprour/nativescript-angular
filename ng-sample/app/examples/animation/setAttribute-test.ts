import {Component} from "angular2/core";
import {Observable} from "data/observable";
import {style, animate, group, sequence} from "angular2/src/core/metadata/animations";

@Component({
    selector: "main-component",
    templateUrl: "./examples/animation/SetAttribute-test.html",
    animations: {
        "setAttribute(text=Button)": [
            style({"background-color": "white"}),
            sequence([
                animate({"background-color": "green"}, 3000),
            ])
        ],
    }
})
export class SetAttributeAnimationTest {
}