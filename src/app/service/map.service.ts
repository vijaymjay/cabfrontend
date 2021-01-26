import { Injectable,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject,Observable,timer, Subscription,  } from 'rxjs';
import { switchMap, tap, share, retry, takeUntil } from 'rxjs/operators';
import { environment } from './../../environments/environment';
 
export interface CabInfo {
   id: Number;
   name: String;
   lat:Number;
   lon:Number;
   available:boolean;
}

@Injectable({
  providedIn: 'root'
})

export class MapService implements OnDestroy{

	private allCabs$: Observable<CabInfo[]>;
	
	 private stopPolling = new Subject();

  constructor(private http: HttpClient) {
	  
	  this.allCabs$ = timer(1, 3000).pipe(
       switchMap(() => http.get<CabInfo[]>(`${environment.apiUrl}/cabs`)),
       retry(),
       share(),
       takeUntil(this.stopPolling)
    );
	
  }
  
  getAllCabs(): Observable<CabInfo[]> {
      return this.allCabs$.pipe(   
		tap(() => console.log('data sent to subscriber'))
	 );

  }
  
  ngOnDestroy() {
     this.stopPolling.next();
  }
  
  
}
