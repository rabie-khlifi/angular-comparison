import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize } from 'rxjs';
import { EchoResponse } from '../../../http-learning-api';

@Component({
  selector: 'app-http-interceptors-page',
  templateUrl: './http-interceptors-page.html',
  styleUrl: './http-interceptors-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpInterceptorsPage {
  private readonly http = inject(HttpClient);

  protected readonly loading = signal(false);
  protected readonly result = signal<EchoResponse | null>(null);
  protected readonly errorMessage = signal('No error requested yet.');

  protected sendSuccessfulRequest(): void {
    this.loading.set(true);
    this.errorMessage.set('No error.');

    // HttpClient mutation/action workflows still use Observable operators and subscribe().
    this.http
      .get<EchoResponse>('/api/interceptor-demo')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => this.result.set(response));
  }

  protected sendFailingRequest(): void {
    this.loading.set(true);
    this.result.set(null);
    const params = new HttpParams().set('fail', 'true');

    this.http
      .get<EchoResponse>('/api/interceptor-demo', { params })
      .pipe(
        // Components handle errors they can explain or recover from in their own UI.
        catchError((error: HttpErrorResponse) => {
          this.errorMessage.set(`Request failed with status ${error.status}: ${error.statusText}`);
          return EMPTY;
        }),
        // finalize runs for success, error, and unsubscription, making it suitable for loading state.
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
