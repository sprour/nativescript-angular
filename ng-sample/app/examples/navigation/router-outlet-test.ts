import {Component} from '@angular/core';
import {Routes, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteSegment} from '@angular/router';
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "../../nativescript-angular/router/ns-router";

@Component({
    selector: "first",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/navigation/router-outlet-test.css"],
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
    </StackLayout>`
})
class FirstComponent { }

@Component({
    selector: "second",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/navigation/router-outlet-test.css"],
    template: `
    <StackLayout>
        <Label [text]="'Second component: ' + id" class="title"></Label>
    </StackLayout>`
})
class SecondComponent {
    public id: string;
    constructor(segment: RouteSegment) {
        this.id = segment.parameters["id"];
    }
}

@Component({
    selector: 'navigation-test',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/navigation/router-outlet-test.css"],
    template: `
        <StackLayout>
            <StackLayout class="nav">
                <Button text="First" [nsRouterLink]="['first']"></Button>
                <Button text="GO(1)" [nsRouterLink]="['second', 1 ]"></Button>
                <Button text="GO(2)" [nsRouterLink]="['second', 2 ]"></Button>
                <Button text="GO(3)" [nsRouterLink]="['second', 3 ]"></Button>
            </StackLayout>
            
            <router-outlet></router-outlet>
        </StackLayout>
    `
})
@Routes([
    { path: '/first', component: FirstComponent },
    { path: '/second/:id', component: SecondComponent },
])
export class RouterOutletTest { }
