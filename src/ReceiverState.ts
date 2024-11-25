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
    if (value.key && value.value) {
      const dictionary = this.state[key]?.dictionary ?? ({} as Record<string, string>);

      if (dictionary[value.key] !== value.value) {
        dictionary[value.key] = value.value;
        value.dictionary = dictionary;
        this.state[key] = value;
        this.updated.push({ key, value });
      }
    } else if (this.state[key]?.raw !== value.raw) {
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
