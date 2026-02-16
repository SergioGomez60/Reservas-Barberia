import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Si no hay datos del usuario, intentar obtener el perfil
    if (!this.authService.currentUser) {
      this.authService.getProfile().subscribe({
        next: (user) => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          // Si hay error, redirigir al login
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
