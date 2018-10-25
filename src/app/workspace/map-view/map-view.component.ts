import { DataService } from './../../services/data.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral, FitBoundsAccessor } from '@agm/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, AfterViewInit {

  mapSettings = {
    center: {
      lat: 40.719585,
      lng: -122.743168,
    },
    zoom: 7
  };
  providers;
  clinics = [];
  map: AgmMap;
  mapCenter = { lat: this.mapSettings.center.lat, lng: this.mapSettings.center.lng };
  mapView = true;
  itemsPerPage = 6;
  loading = true;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    text: 'Select devices',
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect All',
    enableSearchFilter: true,
    classes: 'myclass custom-class'
  };

  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (32.5345 < position.coords.latitude && position.coords.latitude < 42
          && -124.41 < position.coords.longitude && position.coords.longitude < -114.1315) {
          this.mapSettings.center.lat = position.coords.latitude;
          this.mapSettings.center.lng = position.coords.longitude;
        }
      });
    }

    this.dataService.getDevices().subscribe(devices => {
      devices.forEach(device => {
        this.dropdownList.push({ id: this.dropdownList.length, itemName: device });
      });
    });

    this.dataService.getProviders()
      .subscribe(providers => {
        this.clinics = this.getNearestLocations(this.itemsPerPage, providers);
        this.loading = false;
        this.fitMapBounds();
      });
  }

  ngAfterViewInit() {
    this.agmMap.mapReady.subscribe(map => {
      this.map = map;
      this.addYourLocationButton(map);
    });
  }

  findClinics() {
    this.clinics = [];
    this.loading = true;
    this.dataService.getProviders(`query={"devices": { "$all": [${this.selectedItems.map(item => '"' + item.itemName + '"')}]}}`)
      .subscribe(providers => {
        this.clinics = this.getNearestLocations(this.itemsPerPage, providers);
        this.loading = false;
      });


  }

  onMapClick(event) {
    console.log(event);
    this.mapSettings.center.lat = event.coords.lat;
    this.mapSettings.center.lng = event.coords.lng;
    // this.findClinics({ lat: this.lat, lng: this.lng });
  }

  onMapCenterChange(event) {
    this.mapCenter = {...event};
    }

  onSearch() {
    this.findClinics();
  }

  getNearestLocations(number, data) {
    // TODO: move to backend
    const distances = data.map(provider => ({
      _id: provider._id,
      dist: Math.sqrt(Math.pow(provider.coordinates.lat - this.mapCenter.lat, 2)
        + Math.pow(provider.coordinates.lng - this.mapCenter.lng, 2))
    }))
      .sort((a, b) => a.dist - b.dist)
      .map(distance => ({ ...data.find(provider => provider._id === distance._id), distance: distance.dist }));

    return distances.length > number ? distances.slice(0, number) : distances;
  }

  onMapView() {
    this.mapView = true;
    this.fitMapBounds();
  }

  fitMapBounds() {
    setTimeout(() => {
      const bounds: LatLngBounds = new window['google'].maps.LatLngBounds();
      for (const clinic of this.clinics) {
          bounds.extend(new window['google'].maps.LatLng(clinic.coordinates.lat + 0.001, clinic.coordinates.lng + 0.001));
          bounds.extend(new window['google'].maps.LatLng(clinic.coordinates.lat - 0.001, clinic.coordinates.lng - 0.001));
      }
      (this.map as any).fitBounds(bounds, 0);
    }, 0);
  }

  addYourLocationButton(map) {

    const controlDiv = document.createElement('div');

    const firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    const secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    firstChild.addEventListener('click', function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const latlng = new window['google'].maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(latlng);
        });
      }
    });

    controlDiv.setAttribute('index', '1');
    map.controls[window['google'].maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  }
}
