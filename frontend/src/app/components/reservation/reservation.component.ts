import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Barber, Service, Appointment } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  barbers: Barber[] = [];
  services: Service[] = [];
  appointments: Appointment[] = [];
  selectedDate: string = '';
  availableTimes: string[] = [];
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  today: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.setTodayDate();
    this.initForm();
    this.loadBarbers();
    this.loadServices();
    this.loadAppointments();
  }

  setTodayDate(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.today = `${year}-${month}-${day}`;
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      client: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      barberId: ['', Validators.required],
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  loadBarbers(): void {
    this.apiService.getBarbers().subscribe(
      (data) => this.barbers = data,
      (error) => console.error('Error loading barbers:', error)
    );
  }

  loadServices(): void {
    this.apiService.getServices().subscribe(
      (data) => this.services = data,
      (error) => console.error('Error loading services:', error)
    );
  }

  loadAppointments(): void {
    if (this.selectedDate) {
      this.apiService.getAppointmentsByDate(this.selectedDate).subscribe(
        (data) => {
          this.appointments = data;
          this.calculateAvailableTimes();
        },
        (error) => console.error('Error loading appointments:', error)
      );
    }
  }

  onDateChange(): void {
    this.selectedDate = this.reservationForm.get('date')?.value;
    this.loadAppointments();
  }

  onBarberChange(): void {
    this.loadAppointments();
  }

  calculateAvailableTimes(): void {
    const allTimes = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    const bookedTimes = this.appointments
      .filter(apt => apt.barberId && typeof apt.barberId === 'object' 
        && apt.barberId._id === this.reservationForm.get('barberId')?.value)
      .map(apt => apt.time);

    this.availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const appointment: Appointment = {
      client: this.reservationForm.get('client')?.value,
      phone: this.reservationForm.get('phone')?.value,
      email: this.reservationForm.get('email')?.value,
      barberId: this.reservationForm.get('barberId')?.value,
      serviceId: this.reservationForm.get('serviceId')?.value,
      date: this.reservationForm.get('date')?.value,
      time: this.reservationForm.get('time')?.value,
      notes: this.reservationForm.get('notes')?.value,
      userId: this.authService.currentUser?.id
    };

    this.apiService.createAppointment(appointment).subscribe(
      (data) => {
        this.isLoading = false;
        this.successMessage = '¡Reserva creada exitosamente!';
        this.reservationForm.reset();
        this.loadAppointments();
        // Notificar a otros componentes sobre la nueva reserva
        this.appointmentService.notifyNewAppointment(data);
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear la reserva';
      }
    );
  }

  getSelectedService(): Service | undefined {
    const serviceId = this.reservationForm.get('serviceId')?.value;
    return this.services.find(s => s._id === serviceId);
  }
}
