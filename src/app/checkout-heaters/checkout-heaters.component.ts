import { Component, OnInit } from '@angular/core';
import { Heater } from '../models/heater';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteInstanceTankHoseInteraction } from 'app/models/route-instance-tank-hose-interaction';

@Component({
  selector: 'app-checkout-heaters',
  templateUrl: './checkout-heaters.component.html',
  styleUrls: ['./checkout-heaters.component.css']
})
export class CheckoutHeatersComponent implements OnInit {
  heaters: any[];
  routeInstanceHeaterInteraction: RouteInstanceHeaterInteraction;
  checkedOutRouteInstanceHeaters: RouteInstanceHeaterInteraction[] = [];
  isEndOfRoute: boolean = false;
  isInitialCheckout: boolean = true;
  routeInstanceTankHoseForm : FormGroup;

  constructor(private fb:FormBuilder, private mainService: MainService, private router: Router) { 
    
  }

  ngOnInit() {
    let routeInstanceId: number = JSON.parse(window.localStorage.getItem('routeInstance'));
    if (routeInstanceId === null) {
      routeInstanceId = 0;
    }

    this.mainService.getAvailableHeaters(routeInstanceId).subscribe(heaterList => {
      this.heaters = heaterList.sort(function(heater1, heater2) {
        if (heater1.serial_number < heater2.serial_number) {
          return -1;
        }
        else if (heater1.serial_number > heater2.serial_number) {
          return 1;
        }
        else {
          return 0;
        }
      });
    }, error => console.log(error));

    if (JSON.parse(window.localStorage.getItem('checkedOutHeaters')) !== null) {
      this.checkedOutRouteInstanceHeaters = JSON.parse(window.localStorage.getItem('checkedOutHeaters'));
    }

    if (JSON.parse(window.localStorage.getItem('tankHoseInteractionId')) !== null) {
      if (JSON.parse(window.localStorage.getItem('checkedOutHeaters')) !== null) {
        if (confirm('Please press OK to check in heating equipment at the end of the route or Cancel to continue checking out heaters.')) {
          this.isEndOfRoute = true;
        }
      }
      else {
        this.isEndOfRoute = true;
      }
      
      this.isInitialCheckout = false;
    }

    if (this.isInitialCheckout && !this.isEndOfRoute) {
      this.routeInstanceTankHoseForm = this.fb.group({
        number_tanks_out: '',
        number_hoses_out: ''
      });

      this.routeInstanceTankHoseForm.get('number_tanks_out').setValidators(Validators.required);
      this.routeInstanceTankHoseForm.get('number_hoses_out').setValidators(Validators.required);
    }

    if (!this.isInitialCheckout && this.isEndOfRoute) {
      this.routeInstanceTankHoseForm = this.fb.group({
        number_tanks_in: '',
        number_hoses_in: ''
      });

      this.routeInstanceTankHoseForm.get('number_tanks_in').setValidators(Validators.required);
      this.routeInstanceTankHoseForm.get('number_hoses_in').setValidators(Validators.required);
    }
  }

  checkoutHeater(heaterId: number) {
    let isAlreadyCheckedOut: boolean;
    this.mainService.isHeaterCheckedOutOnOtherRoute(heaterId).subscribe((data: RouteInstanceHeaterInteraction[]) => {
      isAlreadyCheckedOut = data.filter(routeInstance => routeInstance.route_instance_id !== JSON.parse(window.localStorage.getItem('routeInstance'))).length > 0;

      if (!isAlreadyCheckedOut) {
        this.routeInstanceHeaterInteraction = new RouteInstanceHeaterInteraction();
      
        this.routeInstanceHeaterInteraction.heater_id = heaterId;
        this.routeInstanceHeaterInteraction.is_checked_out = true;
        this.routeInstanceHeaterInteraction.route_instance_id = JSON.parse(window.localStorage.getItem('routeInstance'));
  
        this.mainService.checkoutHeater(this.routeInstanceHeaterInteraction).subscribe((data: RouteInstanceHeaterInteraction) => {
          this.checkedOutRouteInstanceHeaters.push(data);
          window.localStorage.setItem('checkedOutHeaters', JSON.stringify(this.checkedOutRouteInstanceHeaters));
        }, error => console.log(error));
      }
      else {
        alert('This heater has already been checked out on another route.');
      }
    });
  }

  checkInHeater(heaterId: number) {
    let routeInstanceHeaterInteractionToCheckIn: RouteInstanceHeaterInteraction = this.checkedOutRouteInstanceHeaters.find(routeInstanceHeater => routeInstanceHeater.heater_id === heaterId);

    let indexToDelete: number = this.checkedOutRouteInstanceHeaters.indexOf(routeInstanceHeaterInteractionToCheckIn);
    if (indexToDelete > -1) {
      this.checkedOutRouteInstanceHeaters.splice(indexToDelete, 1);
      window.localStorage.setItem('checkedOutHeaters', JSON.stringify(this.checkedOutRouteInstanceHeaters));
    }

    routeInstanceHeaterInteractionToCheckIn.is_checked_out = false;
    this.mainService.checkInHeater(routeInstanceHeaterInteractionToCheckIn)
      .subscribe(data => { }, error => console.log(error));
  }

  isHeaterCheckedOut(heaterId: number): boolean {
    let routeInstanceHeaterInteraction: RouteInstanceHeaterInteraction = this.checkedOutRouteInstanceHeaters.find(routeInstanceHeater => routeInstanceHeater.heater_id === heaterId);
    return routeInstanceHeaterInteraction !== undefined;
  }

  next() {
    if (this.isInitialCheckout) {
      let routeInstanceTankHoseInteraction: RouteInstanceTankHoseInteraction = new RouteInstanceTankHoseInteraction();
      routeInstanceTankHoseInteraction.route_instance_id = JSON.parse(window.localStorage.getItem('routeInstance'));
      routeInstanceTankHoseInteraction.number_hoses_out = this.routeInstanceTankHoseForm.get('number_hoses_out').value;
      routeInstanceTankHoseInteraction.number_tanks_out = this.routeInstanceTankHoseForm.get('number_tanks_out').value;

      this.mainService.insertRouteInstanceTankHoseInteraction(routeInstanceTankHoseInteraction).subscribe((data: RouteInstanceTankHoseInteraction) => {
        window.localStorage.setItem('tankHoseInteractionId', JSON.stringify(data.id))
      }, error => console.log(error));

      this.router.navigate(['volunteerInfo']);
    }
    else {
      this.router.navigate(['route', JSON.parse(window.localStorage.getItem('routeId'))]);
    }
  }

  endRoute() {
    let routeInstanceTankHoseInteraction: RouteInstanceTankHoseInteraction = new RouteInstanceTankHoseInteraction();
    routeInstanceTankHoseInteraction.id = JSON.parse(window.localStorage.getItem('tankHoseInteractionId'));
    routeInstanceTankHoseInteraction.number_hoses_in = this.routeInstanceTankHoseForm.get('number_hoses_in').value;
    routeInstanceTankHoseInteraction.number_tanks_in = this.routeInstanceTankHoseForm.get('number_tanks_in').value;

    this.mainService.updateRouteInstanceTankHoseInteraction(routeInstanceTankHoseInteraction);

    window.localStorage.clear();
    this.router.navigate(['login']);
  }
}
