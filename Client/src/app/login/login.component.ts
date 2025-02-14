import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthServiceService } from '../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [MatInputModule,MatIconModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  password!: string;

  private authService = inject(AuthServiceService);
  private snackBar = inject(MatSnackBar);
  private  router = inject(Router);

  login(){

    this.authService.login(this.email,this.password).subscribe({
          next: ()=>{
            this.authService.me().subscribe();
            this.snackBar.open("Logged in successfully", 'Close')
          },
          error:(error:HttpErrorResponse)=>{
            let err = error.error as ApiResponse<string>;
            this.snackBar.open(err.error,"Close",{duration: 3000});
          },
          complete:()=>{ this.router.navigate(['/chat'])}
        });
  }

hide = signal(false);

  togglePassword(event:MouseEvent){
    this.hide.set(!this.hide());
  }

  goToRegister(){
    this.router.navigate(['/register'])
  }
}
