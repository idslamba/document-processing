import { inject } from '@angular/core';
import { HttpRequest, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { ProgressBarService } from './progress-bar.service';
export const httpInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const progressBarService = inject(ProgressBarService);
    progressBarService.show();
    return next(req).pipe(finalize(() => progressBarService.hide()));
};