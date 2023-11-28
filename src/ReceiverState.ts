import { ReceiverSettings } from './ReceiverSettings';
import { StateUpdate } from './StateUpdate';
import { StateValue } from './StateValue';

export class ReceiverState {
  public state: { [key in ReceiverSettings]?: StateValue } = {};
  private updated: StateUpdate[] = [];

  isUpdated(): boolean {
    return this.updated.length > 0;
  }

  updateState(key: ReceiverSettings, value: StateValue): void {
    if (this.state[key]?.raw !== value.raw) {
      this.state[key] = value;
      this.updated.push({ key, value });
    }
  }

  getState(key: ReceiverSettings): StateValue | undefined {
    return this.state[key];
  }

  popUpdated(): StateUpdate | undefined {
    return this.updated.shift();
  }

  clearUpdated(): void {
    this.updated = [];
  }
}
