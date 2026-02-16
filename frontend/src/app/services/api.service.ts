import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Barber {
  _id?: string;
  name: string;
  specialty: string;
  image?: string;
  bio?: string;
  phone?: string;
  email?: string;
  available?: boolean;
  workingHours?: any;
}

export interface Service {
  _id?: string;
  name: string;
  price: number;
  duration: number;
}

export interface Appointment {
  _id?: string;
  client: string;
  phone?: string;
  email?: string;
  barberId: string | Barber;
  serviceId: string | Service;
  userId?: string;
  date: Date | string;
  time: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Barbers
  getBarbers(): Observable<Barber[]> {
    return this.http.get<Barber[]>(`${this.apiUrl}/api/barbers`);
  }

  getBarber(id: string): Observable<Barber> {
    return this.http.get<Barber>(`${this.apiUrl}/api/barbers/${id}`);
  }

  createBarber(barber: Barber): Observable<Barber> {
    return this.http.post<Barber>(`${this.apiUrl}/api/barbers`, barber);
  }

  updateBarber(id: string, barber: Barber): Observable<Barber> {
    return this.http.put<Barber>(`${this.apiUrl}/api/barbers/${id}`, barber);
  }

  deleteBarber(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/barbers/${id}`);
  }

  // Services
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/api/services`);
  }

  getService(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/api/services/${id}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/api/services`, service);
  }

  updateService(id: string, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/api/services/${id}`, service);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/services/${id}`);
  }

  // Appointments
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/appointments`);
  }

  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/appointments/date/${date}`);
  }

  getAppointmentsByBarber(barberId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/appointments/barber/${barberId}`);
  }

  getAppointmentsByUser(userId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/appointments/user/${userId}`);
  }

  getAppointment(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/api/appointments/${id}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/api/appointments`, appointment);
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/api/appointments/${id}`, appointment);
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/appointments/${id}`);
  }

  // Auth
  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials);
  }
}
