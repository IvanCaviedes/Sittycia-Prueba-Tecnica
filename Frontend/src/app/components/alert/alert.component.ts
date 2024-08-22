import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { finalize, Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() message: string | null = null;
  @Input() type: 'error' | 'success' | 'info' | 'warning' = 'info';
  visible: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  closeAlert() {
    this.visible = false;
  }

  closeTime() {
    timer(2000)
      .pipe(
        finalize(() => {
          console.log('finalizo');

          this.visible = false;
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe();
  }

  get alertClass(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  }

  showAlert(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) {
    this.message = message;
    this.visible = true;
    this.type = type;
  }
}
