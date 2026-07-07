import { Service, Type } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs';
import { DomainEvent } from './domain-event.base';

@Service()
export class EventBusService {
  private readonly eventBus = new Subject<DomainEvent>();

  emit(event: DomainEvent): void {
    this.eventBus.next(event);
  }

  on<T extends DomainEvent>(eventClass: Type<T>): Observable<T> {
    return this.eventBus.asObservable().pipe(
      filter((e): e is T => e instanceof eventClass)
    );
  }
}
