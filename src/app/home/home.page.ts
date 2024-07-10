import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  lampIcon: string = 'bulb';
  lampColor: string = 'gray';
  apiUrl: string = environment.apiRepl;
  intervalId: any;
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startSync();
  }

  ngOnDestroy() {
    this.stopSync();
  }

  startSync() {
    this.getLampStatus();
    this.intervalId = setInterval(() => {
      this.getLampStatus();
    }, 5000); // Set to 5000ms (5 seconds) or any duration you prefer
  }

  stopSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscription.unsubscribe();
  }

  getLampStatus() {
    const getSubscription = this.http.get<{ status: string, data: { command: string }[] }>(this.apiUrl).subscribe(
      response => {
        if (response && response.status === 'success' && response.data.length > 0) {
          const command = response.data[0].command;
          this.updateLampColor(command);
        } else {
          console.error('Invalid response format', response);
        }
      },
      error => {
        console.error('Failed to fetch lamp status:', error);
      }
    );

    this.subscription.add(getSubscription);
  }

  updateLampColor(command: string) {
    switch (command) {
      case 'Nyalakan Lampu Merah':
        this.lampIcon = 'bulb';
        this.lampColor = 'red';
        break;
      case 'Nyalakan Lampu Hijau':
        this.lampIcon = 'bulb';
        this.lampColor = 'green';
        break;
      case 'Nyalakan Lampu Biru':
        this.lampIcon = 'bulb';
        this.lampColor = 'blue';
        break;
      default:
        this.lampIcon = 'bulb';
        this.lampColor = 'gray';
        break;
    }
  }
}