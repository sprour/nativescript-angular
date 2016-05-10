import {Component} from '@angular/core';
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "../../nativescript-angular/router/ns-router";
import {
    ROUTER_DIRECTIVES, Router, OnActivate,
    RouteSegment, RouteTree, Routes
    // OnDeactivate, CanReuse, OnReuse,
    // RouteParams, ComponentInstruction, RouteConfig 
} from '@angular/router';
import {Location, LocationStrategy} from '@angular/common';



@Component({
    selector: 'master',
    template: `
    <StackLayout>
        <Label text="Master View" style="font-size: 20; horizontal-align: center; margin: 10"></Label>
            
        <Button *ngFor="#detail of details" [text]="'Detail ' + detail" (tap)="onSelect(detail)"></Button>
    </StackLayout>
    `
})
class MasterComponent {
    public details: Array<number> = [1, 2, 3];

    constructor(private _router: Router) {
        console.log("MasterComponent.constructor()");
    }

    onSelect(val: number) {
        this._router.navigate(['../Detail', { id: val }]);
    }

    routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree): void {
        console.log("MasterComponent.routerOnActivate()")
    }

    // routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("MasterComponent.routerOnDeactivate()")
    // }
}

@Component({
    selector: 'detail',
    template: `
    <StackLayout margin="10">
        <Button text="BACK TO MASTER" (tap)="onUnselect()"></Button>
            
        <Label [text]="'Detail: ' + id"
            style="font-size: 20; horizontal-align: center; margin: 10"></Label>
    </StackLayout>
    `
})
class DetailComponent {
    public id: number;
    constructor(private _router: Router) {
        console.log("DetailComponent.constructor()");
        //this.id = parseInt(params.get("id"));
        this.id = -1;
    }

    onUnselect() {
        this._router.navigate(['../Main']);
    }

    // routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("DetailComponent.routerOnActivate() id: " + this.id)
    // }

    // routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("DetailComponent.routerOnDeactivate() id: " + this.id)
    // }
}


@Component({
    selector: 'example-group',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
<GridLayout rows="auto, auto, auto, *" columns="*, *" margin="10" backgroundColor="lightgreen">
    <Label [text]="'Component ID: ' + compId" colSpan="2" row="0"
        style="font-size: 30; horizontal-align: center"></Label>
        
    <Label [text]="'Depth: ' + depth" colSpan="2" row="1"
        style="font-size: 30; horizontal-align: center"></Label>
        
    <Button text="BACK" row="2" col="0" width="150"
        (tap)="goBack()"></Button>
        
    <Button text="FORWARD" row="2" col="1" width="150"
        [nsRouterLink]="['/Nav', { depth: depth + 1 }]"></Button>
        
    <GridLayout backgroundColor="pink" margin="10" row="3" colSpan="2">
        <router-outlet></router-outlet>
    </GridLayout>
</GridLayout>
`
})
@Routes([
    { path: '/', component: MasterComponent },
    { path: '/:id', component: DetailComponent }
])
export class NavComponent {
    static counter: number = 0;

    public compId: number;
    public depth: number;

    constructor(private location: Location) {
        console.log("NavComponent.constructor()");
        NavComponent.counter++;

        this.compId = NavComponent.counter;
        // this.depth = parseInt(params.get("depth"));
        this.depth = -1;
        console.log("NavComponent.constructor() componentID: " + this.compId)
    }

    public goBack() {
        this.location.back();
    }

    // routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("NavComponent.routerOnActivate() componentID: " + this.compId)
    // }

    // routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("NavComponent.routerOnDeactivate() componentID: " + this.compId)
    // }

    // routerCanReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     // Reuse if depth is the same.
    //     var reuse = (prevInstruction.params["depth"] === nextInstruction.params["depth"]);
    //     console.log("NavComponent.routerCanReuse() componentID: " + this.compId + " return: " + reuse);
    //     return reuse;
    // }

    // routerOnReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("NavComponent.routerOnReuse() componentID: " + this.compId);
    // }
}

@Component({
    selector: "start-nav-test",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout verticalAlignment="center">
        <Button text="Start" [nsRouterLink]="['/Nav', { depth: 1 }]"></Button>
        <Button text="Navigate to Detail" [nsRouterLink]="['/Nav', { depth: 1 }, 'Detail', { id: 3 }]"></Button>
    </StackLayout>
    `
})
class StartComponent {
    constructor() {
        console.log("StartComponent.constructor()")
    }

    // routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("StartComponent.routerOnActivate()")
    // }

    // routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
    //     console.log("StartComponent.routerOnDeactivate()")
    // }
}

@Component({
    selector: 'navigation-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
@Routes([
    { path: '/', component: StartComponent },
    { path: '/nav/:depth/...', component: NavComponent },
])
export class NavigationTest {

}
