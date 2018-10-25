import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  currentUser: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = this.authService.getAuthInfo();
  }

}
