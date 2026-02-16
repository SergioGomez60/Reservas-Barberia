import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Appointment, Barber, Service } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';

interface PopulatedAppointment {
  _id?: string;
  client: string;
  phone?: string;
  email?: string;
  barberId: Barber | string;
  serviceId: Service | string;
  userId?: string;
  date: Date | string;
  time: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
}

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit {
  appointments: PopulatedAppointment[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.loadMyReservations();
    
    // Escuchar nuevas reservas
    this.appointmentService.newAppointment$.subscribe(appointment => {
      if (appointment) {
        this.appointments.unshift(appointment);
      }
    });
  }

  loadMyReservations(): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) {
      this.errorMessage = 'Debes iniciar sesión para ver tus reservas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getAppointmentsByUser(userId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar las reservas';
      }
    });
  }

  getBarberName(barber: Barber | string): string {
    if (typeof barber === 'object' && barber !== null) {
      return barber.name;
    }
    return 'Barbero no disponible';
  }

  getServiceName(service: Service | string): string {
    if (typeof service === 'object' && service !== null) {
      return service.name;
    }
    return 'Servicio no disponible';
  }

  getServicePrice(service: Service | string): number {
    if (typeof service === 'object' && service !== null) {
      return service.price;
    }
    return 0;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  getStatusText(status?: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  cancelAppointment(id?: string): void {
    if (!id) return;

    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    this.isLoading = true;
    const updateData: Partial<Appointment> = { status: 'cancelled' };

    this.apiService.updateAppointment(id, updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Reserva cancelada exitosamente';
        this.loadMyReservations();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cancelar la reserva';
      }
    });
  }
}
