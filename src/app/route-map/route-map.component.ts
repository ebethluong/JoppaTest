import { Component, ViewChild, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { } from 'googlemaps';
import { Route } from 'app/models/route';
import { LocationCamp } from 'app/models/location-camp';

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.css']
})
export class RouteMapComponent implements OnInit {
  routeId: number;
  thisRoute: Route;
  
  constructor(private route: ActivatedRoute, private mainService: MainService, private router: Router) { }

  ngOnInit() {
    this.thisRoute = new Route();

    var mapProp = {
      center: new google.maps.LatLng(41.584, -93.610),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    let map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    this.routeId = this.route.snapshot.params['id'];
    
    this.mainService.getRoute(this.routeId).subscribe((route : Route) => {
      this.thisRoute = route;
    });

    this.mainService.getRouteCampsLongLat(this.routeId).subscribe((data: LocationCamp[]) => {
      data.forEach(function(locationCamp: LocationCamp) {
        
        var marker = new google.maps.Marker({ position: new google.maps.LatLng(locationCamp.latitude, locationCamp.longitude),
          map: map});
        
        var infoWindow = new google.maps.InfoWindow({
          content: locationCamp.name
        });
        
        infoWindow.open(map, marker);
      });
    });
  }

  back() {
    this.router.navigate(['route', this.routeId]);
  }
}
