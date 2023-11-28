import { MainParser } from './MainParser';
import { MessageFormatter } from './MessageFormatter';
import { ReceiverState } from './ReceiverState';
import { ZoneParser } from './ZoneParser';

export class StateManager {
  public mainState: ReceiverState;
  public zone2State: ReceiverState | undefined;
  public zone3State: ReceiverState | undefined;

  private mainParser: MainParser;
  private zone2Parser: ZoneParser;
  private zone3Parser: ZoneParser;

  constructor(options: { mainState: ReceiverState; zone2State?: ReceiverState; zone3State?: ReceiverState }) {
    this.mainState = options.mainState;
    this.zone2State = options.zone2State;
    this.zone3State = options.zone3State;

    this.mainParser = new MainParser(this.mainState);

    if (this.zone2State) {
      this.zone2Parser = new ZoneParser(this.zone2State, 'Z2');
    }

    if (this.zone3State) {
      this.zone3Parser = new ZoneParser(this.zone3State, 'Z3');
    }
  }

  public handleCommand(command: string): void {
    if (!this.mainParser.handle(command)) {
      if (!this.zone2Parser?.handle(command)) {
        this.zone3Parser.handle(command);
      }
    }
  }

  public sendUpdates(cb: (command: string) => void) {
    StateManager.sendUpdates(this.mainState, cb);

    if (this.zone2State) {
      StateManager.sendUpdates(this.zone2State, cb, 2);
    }

    if (this.zone3State) {
      StateManager.sendUpdates(this.zone3State, cb, 3);
    }
  }

  public static sendUpdates(state: ReceiverState, cb: (command: string) => void, zone?: number): void {
    let updated = state.popUpdated();

    while (updated) {
      const command = MessageFormatter.getCommand(updated.key, updated.value, zone);
      if (command) {
        cb(command);
      }
      updated = state.popUpdated();
    }
  }
}
