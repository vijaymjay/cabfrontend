import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Subject,Observable  } from 'rxjs';
import { MapService,CabInfo } from './service/map.service';
import { UserService,UserInfo } from './service/user.service';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
  @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  lat = 12.964557;
  lng = 80.171402;

  
  //Coordinates to set the center of the map
  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8
  };

  //Default Marker
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
	icon:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|FE6256|000000',
  });
  
  cabInfo$: Observable<CabInfo[]>;
  userInfo$:Observable<UserInfo[]>;
  
  
  constructor(private mapservice:MapService,private userservice:UserService){
	this.cabInfo$ = mapservice.getAllCabs();
	this.userInfo$ = userservice.getuserinfo();
  }

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    //Adding Click event to default marker
    this.marker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: this.marker.getTitle()
      });
      infoWindow.open(this.marker.getMap(), this.marker);
    });

    //Adding default marker to map
    this.marker.setMap(this.map);

    //Adding other markers
    this.loadAllMarkers();
  }
  
  
  markers = [];
  
  loadAllMarkers(): void {
	  
	this.cabInfo$.subscribe(x => {
		
		this.markers = [];
		x.forEach(mapitem => { 
			
			this.markers.push({position:new google.maps.LatLng(Number(mapitem.lat), Number(mapitem.lon)),map:this.map, icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png',title:mapitem.name})
		})
		
		this.markers.forEach(markerInfo => {
		  //Creating a new marker object
		  const marker = new google.maps.Marker({
			...markerInfo
		  });

		  //creating a new info window with markers info
		  const infoWindow = new google.maps.InfoWindow({
			content: marker.getTitle()
		  });

		  //Add click event to open info window on marker
		  marker.addListener("click", () => {
			infoWindow.open(marker.getMap(), marker);
		  });

		  //Adding marker to google map
		  marker.setMap(this.map);
		});
		
	});  
  }
}
