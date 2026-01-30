import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UndoService {
  private history: string[] = [];

  addAction(action: string) {
    this.history.push(action);
  }

  undo(): string | null {
    return this.history.pop() ?? null;
  }

  clearHistory() {
    this.history = [];
  }
}
