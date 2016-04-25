import {Component} from "angular2/core";
import {Observable} from "data/observable";
import {style, animate, group, sequence} from "angular2/src/core/metadata/animations";

@Component({
    selector: "main-component",
    templateUrl: "./examples/animation/ngEnterLeave-test.html",
    animations: {
        "ngEnter": [
            style({"opacity": "0"}),
            sequence([
                animate({"opacity": "1"}, 2000),
            ])
        ],
        "ngLeave": [
            style({"opacity": "1"}),
            sequence([
                animate({"opacity": "0"}, 2000),
            ])
        ]
    }
})
export class ngEnterLeaveAnimationTest {

    items = [];

    onAdd() {
        for (let i = 5; i--; ) {
            this.items.push({"title": "item " + i});
        }
    }

    onClear() {
        this.items = [];
    }

    onRemoveItem(index) {
        this.items.splice(index, 1);
    }
}