import {Directive, Input, HostBinding, OnDestroy, HostListener} from '@angular/core';
import {Location} from '@angular/common';
import {Router, RouteSegment} from '@angular/router';
import { log } from "./common";
import {isString, isArray, isPresent} from '@angular/core/src/facade/lang';
import {ObservableWrapper} from '@angular/core/src/facade/async';

/**
 * The NSRouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:
 * ```
 * @RouteConfig([
 *   { path: '/user', component: UserCmp, as: 'User' }
 * ]);
 * class MyComp {}
 * ```
 *
 * When linking to this `User` route, you can write:
 *
 * ```
 * <a [nsRouterLink]="['./User']">link to user component</a>
 * ```
 *
 * RouterLink expects the value to be an array of route names, followed by the params
 * for that level of routing. For instance `['/Team', {teamId: 1}, 'User', {userId: 2}]`
 * means that we want to generate a link for the `Team` route with params `{teamId: 1}`,
 * and with a child route `User` with params `{userId: 2}`.
 *
 * The first route name should be prepended with `/`, `./`, or `../`.
 * If the route begins with `/`, the router will look up the route from the root of the app.
 * If the route begins with `./`, the router will instead look in the current component's
 * children for the route. And if the route begins with `../`, the router will look at the
 * current component's parent.
 */
@Directive({
    selector: '[nsRouterLink]',
})
export class NSRouterLink implements OnDestroy {
  @Input() target: string;
  private _commands: any[] = [];
  private _subscription: any;

  // the url displayed on the anchor element.
  @HostBinding() href: string;
  @HostBinding('class.router-link-active') isActive: boolean = false;

//   constructor(private _routeSegment: RouteSegment, private _router: Router) {
  constructor(private _router: Router) {
    // because auxiliary links take existing primary and auxiliary routes into account,
    // we need to update the link whenever params or other routes change.
    this._subscription =
        ObservableWrapper.subscribe(_router.changes, (_) => { this._updateTargetUrlAndHref(); });
  }

  ngOnDestroy() { ObservableWrapper.dispose(this._subscription); }

  @Input()
  set nsRouterLink(data: any[] | any) {
    if (isArray(data)) {
      this._commands = <any[]>data;
    } else {
      this._commands = [data];
    }
    this._updateTargetUrlAndHref();
  }


  @HostListener("tap")
  onTap(): boolean {
    // If no target, or if target is _self, prevent default browser behavior
    if (!isString(this.target) || this.target == '_self') {
    //   this._router.navigate(this._commands, this._routeSegment);
      this._router.navigate(this._commands);
      return false;
    }
    return true;
  }

  private _updateTargetUrlAndHref(): void {
    // let tree = this._router.createUrlTree(this._commands, this._routeSegment);
    let tree = this._router.createUrlTree(this._commands);
    if (isPresent(tree)) {
      this.href = this._router.serializeUrl(tree);
      this.isActive = this._router.urlTree.contains(tree);
    } else {
      this.isActive = false;
    }
  }
}