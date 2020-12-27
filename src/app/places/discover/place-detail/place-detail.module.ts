import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PlaceDetailPageRoutingModule} from './place-detail-routing.module';

import {PlaceDetailPage} from './place-detail.page';
import {NewBookingComponent} from '../../../bookings/new-booking/new-booking.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PlaceDetailPageRoutingModule
    ],
    declarations: [PlaceDetailPage, NewBookingComponent],
    entryComponents: [NewBookingComponent]
})
export class PlaceDetailPageModule {
}
