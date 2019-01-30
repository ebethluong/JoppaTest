import { Component, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../models/location';
import { MainService } from '../services/main.service';
import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { LocationCamp } from "app/models/location-camp";
import { Appearance } from 'app/models/appearance';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-location-camp',
  templateUrl: './location-camp.component.html',
  styleUrls: ['./location-camp.component.css']
})
export class LocationCampComponent implements OnInit {
  route : Route = new Route();
  location: Location = new Location();
  locationId: number;
  clients: Client[] = [];
  locationCamp: LocationCamp = new LocationCamp();
  heatRoute: boolean = false;

  constructor(private store: Store<IMainStore>, private service: MainService, private clientService: ClientService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    this.store.select('user').subscribe(data => {
      if (data.selectedRoute != undefined && data.selectedLocation != undefined) {
        this.route = data.selectedRoute;
        this.location = data.selectedLocation;
      } else {
        const routeId = window.localStorage.getItem('routeId');
        const locationId = window.localStorage.getItem('locationId');

        this.service.getRoute(routeId).subscribe(response => {
          this.route = response;
          this.store.dispatch({type: '', payload: response});
        }, error => console.log('error getting route in location detail'));

        this.service.getRouteLocation(locationId).subscribe(data => {
          this.location = data;
        }, error => console.log('error getting location in location detail'));
      }
    })
    let locationCampId = this.activatedRoute.snapshot.params['id'];
    this.service.getLocationCamp(locationCampId).subscribe(data => {
      this.locationCamp = data;
      localStorage.setItem('locationCampId', this.locationCamp.id.toString());
      this.store.dispatch({type: 'LOCATION_CAMP_SELECTED', payload: data});
    }, error => {console.log('error getting location camp')});

    window.localStorage.setItem('locationCampId', locationCampId);
    this.service.getClientsForLocationCamp(locationCampId).subscribe((data: Client[]) => {
      console.log('returned clients');
      console.log(data);
      if (this.heatRoute) {
        this.clients = data.filter(client => client.dwelling !== "Vehicle" && client.dwelling !== "Under Bridge" && client.dwelling !== "Streets");
      }
      else {
        this.clients = data;
      }
    });
  }

  ngOnInit() {
    this.heatRoute = JSON.parse(window.localStorage.getItem('heatRoute'));
  }

  editedCamp(theCamp: LocationCamp) {
    this.locationCamp = theCamp;
  }

  clientSelected(client: Client) {
    this.clients.push(client);

    let clientInteraction: Appearance = new Appearance();
    clientInteraction.client_id = client.id;
    clientInteraction.location_camp_id = JSON.parse(this.activatedRoute.snapshot.params['id']);
    clientInteraction.still_lives_here = true;
    this.clientService.insertClientAppearance(clientInteraction);
  }

  createClient() {
    this.router.navigate(['/createClient']);
  }

  viewClient(theClient: Client) {
    localStorage.setItem('selectedClient', theClient.id.toString());
    this.router.navigate(['/serviceClient']);
  }
  
  back() {
    console.log('location during back');
    console.log(this.location);
    if(this.location == undefined || this.location.id == undefined)
    {
      this.router.navigate(['/routes']);
    }
    else{
      this.router.navigate([`/location`, this.location.id]);
    }
    
  }
}
