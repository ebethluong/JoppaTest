import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutesComponent }   from './routes/routes.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { RouteEditComponent } from './routes/route-edit/route-edit.component';
import { LocationDetailEditComponent } from './location-detail-edit/location-detail-edit.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { CreateRouteComponent } from "app/create-route/create-route.component";
import { CreateLocationCampComponent } from './create-location-camp/create-location-camp.component';
import { LocationCampComponent } from "app/location-camp/location-camp.component";
import { ServicingClientComponent } from "app/client/servicing-client/servicing-client.component";
import { AdminHomeComponent } from 'app/admin-home/admin-home.component';
import { AdminRouteMealsComponent } from './admin-route-meals/admin-route-meals.component';
import { AdminRouteUndeliveredItemsComponent } from './admin-route-undelivered-items/admin-route-undelivered-items.component';
import { AdminRouteUnfulfilledGoalsNextStepsComponent } from './admin-route-unfulfilled-goals-next-steps/admin-route-unfulfilled-goals-next-steps.component';
import { AdminRouteUnfulfilledPrayerRequestsNeedsComponent } from './admin-route-unfulfilled-prayer-requests-needs/admin-route-unfulfilled-prayer-requests-needs.component';
import { CreateHeatingUnitComponent } from './create-heating-unit/create-heating-unit.component';

const routes: Routes = [
   
   { path: 'routes', component: RoutesComponent },
  { path: 'route/:id', component: LocationsComponent },
  { path: 'location/:id', component: LocationDetailComponent },
  { path: 'locationCamp/:id', component: LocationCampComponent},
  { path: 'routeNew', component: CreateRouteComponent },
  { path: 'routeEdit/:id', component: RouteEditComponent },
  { path: 'locationNew', component: LocationDetailEditComponent },
  { path: 'locationEdit/:id', component: LocationDetailEditComponent },
  { path: 'createClient', component: ClientEditComponent },
  { path: 'clientEdit/:id', component: ClientEditComponent },
  { path: 'locationCampNew', component: CreateLocationCampComponent },
  { path: 'serviceClient', component: ServicingClientComponent },
  { path: 'adminHome', component: AdminHomeComponent },
  { path: 'heaterNew', component: CreateHeatingUnitComponent },
  { path: 'admin/routeUndeliveredItems', component: AdminRouteUndeliveredItemsComponent },
  { path: 'admin/routeMeals', component: AdminRouteMealsComponent },
  { path: 'admin/routeUnfulfilledGoalsNextSteps', component: AdminRouteUnfulfilledGoalsNextStepsComponent },
  { path: 'admin/routeUnfulfilledPrayerRequestsNeeds', component: AdminRouteUnfulfilledPrayerRequestsNeedsComponent },
  { path: '', redirectTo: '/routes', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
