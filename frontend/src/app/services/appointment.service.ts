import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private newAppointmentSubject = new BehaviorSubject<any>(null);
  public newAppointment$ = this.newAppointmentSubject.asObservable();

  notifyNewAppointment(appointment: any): void {
    this.newAppointmentSubject.next(appointment);
  }
}
