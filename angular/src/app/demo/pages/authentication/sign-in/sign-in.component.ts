// angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router) {}

  login() {
    this.router.navigate(['/analytics']);
  }
}
