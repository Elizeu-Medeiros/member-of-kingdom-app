import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { People } from '../models/people.model';

@Injectable({
  providedIn: 'root',
})
export class PeopleStateService {
  private readonly selectedPersonSource = new BehaviorSubject<People | null>(null);
  selectedPerson$ = this.selectedPersonSource.asObservable();

  setSelectedPerson(person: People): void {
    this.selectedPersonSource.next(person);
  }

  clearSelectedPerson(): void {
    this.selectedPersonSource.next(null);
  }

  // Método para obter o valor atual diretamente
  get selectedPerson(): People | null {
    return this.selectedPersonSource.getValue();
  }
}
