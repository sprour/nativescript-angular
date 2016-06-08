import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import * as Rx from 'rxjs/Observable';
import { combineLatestStatic } from 'rxjs/operator/combineLatest';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataItem, DataService } from "./data.service"

@Component({
    selector: 'list-test-async',
    styleUrls: ['examples/list/list-test-async.css'],
    providers: [DataService],
    template: `
    <GridLayout rows="* auto">
        <ListView [items]="service.items$ | async" (itemTap)="onItemTap($event)">
            <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label class="test" [text]='"index: " + item.name'></Label>
                </StackLayout>
            </template>
        </ListView>
        <button row="1" (tap)="toggleAsyncUpdates()" [text]="isUpdating ? 'stop updates' : 'start updates'"></button>
    </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTestAsync {
    public isUpdating: boolean = false;
    constructor(private service: DataService) {
    }

    public onItemTap(args) {
        console.log("--> ItemTapped: " + args.index);
    }

    public toggleAsyncUpdates() {
        if (this.isUpdating) {
            this.service.stopAsyncUpdates();
        } else {
            this.service.startAsyncUpdates();
        }

        this.isUpdating = !this.isUpdating;
    }
}

@Component({
    selector: 'list-test-async-filter',
    styleUrls: ['examples/list/list-test-async.css'],
    providers: [DataService],
    template: `
    <GridLayout rows="* auto">
        <ListView [items]="filteredItems$ | async" (itemTap)="onItemTap($event)">
            <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label class="test" [text]='"index: " + item.name'></Label>
                </StackLayout>
            </template>
        </ListView>
        <StackLayout row="1" orientation="horizontal">
            <button (tap)="toggleAsyncUpdates()" [text]="isUpdating ? 'stop updates' : 'start updates'"></button>
            <button (tap)="toogleFilter()" [text]="(filter$ | async) ? 'show all' : 'show even'"></button>
        </StackLayout>
    </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTestFilterAsync {
    public isUpdating: boolean = false;
    public filteredItems$: Rx.Observable<Array<DataItem>>;
    private filter$ = new BehaviorSubject(false);

    constructor(private service: DataService) {
        // Create filteredItems$ by combining the service.items$ and filter$
        this.filteredItems$ = combineLatestStatic(this.service.items$, this.filter$, (data, filter) => {
            return filter ? data.filter(v => v.id % 2 === 0) : data;
        });
    }

    public onItemTap(args) {
        console.log("--> ItemTapped: " + args.index);
    }

    public toggleAsyncUpdates() {
        if (this.isUpdating) {
            this.service.stopAsyncUpdates();
        } else {
            this.service.startAsyncUpdates();
        }

        this.isUpdating = !this.isUpdating;
    }

    public toogleFilter() {
        this.filter$.next(!this.filter$.value);
    }
}