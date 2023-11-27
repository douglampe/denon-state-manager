import { ReceiverSettings } from './ReceiverSettings';

export class ReceiverState {
  public state: { [key in ReceiverSettings]?: string } = {};
  private updated: ReceiverSettings[] = [];

  isUpdated(): boolean {
    return this.updated.length > 0;
  }

  updateState(key: ReceiverSettings, value: string): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.updated.push(key);
    }
  }

  getState(key: ReceiverSettings): string | undefined {
    return this.state[key];
  }

  popUpdated(): ReceiverSettings | undefined {
    return this.updated.pop();
  }

  clearUpdated(): void {
    this.updated = [];
  }
}
