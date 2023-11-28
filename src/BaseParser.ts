import { ParserResult } from './ParserResult';
import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';
import { StateValue } from './StateValue';

export class BaseParser {
  protected prefixMap: Record<string, Array<(data: string) => ParserResult>> = {};

  constructor(protected state: ReceiverState) {}

  static parsePassthrough(key: ReceiverSettings, value: string): ParserResult {
    return {
      handled: true,
      key,
      value: {
        raw: value,
      },
    };
  }

  static parseDelimited(key: ReceiverSettings, data: string, firstPart: string): ParserResult {
    if (data.startsWith(firstPart)) {
      const parts = data.split(' ');
      return {
        handled: true,
        key,
        value: {
          raw: parts.length > 1 ? parts[1] : '',
        },
      };
    }
    return {
      handled: false,
    };
  }

  static parseList(key: ReceiverSettings, data: string, list: string[]): ParserResult {
    if (list.indexOf(data) > -1) {
      return {
        handled: true,
        key,
        value: {
          raw: data,
        },
      };
    }
    return {
      handled: false,
    };
  }

  static parseLongPrefix(key: ReceiverSettings, data: string, ending: string): ParserResult {
    if (data.startsWith(ending)) {
      return {
        handled: true,
        key,
        value: {
          raw: data.substring(ending.length),
        },
      };
    }
    return {
      handled: false,
    };
  }

  addParser(key: string, parser: (data: string) => ParserResult) {
    let parsers: Array<(data: string) => ParserResult> = this.prefixMap[key];
    if (!parsers) {
      parsers = new Array<(data: string) => ParserResult>();
      this.prefixMap[key] = parsers;
    }
    parsers.push(parser);
  }

  addPassthroughParser(options: { prefix: string; key: ReceiverSettings }) {
    this.addParser(options.prefix, (data: string) => {
      return BaseParser.parsePassthrough(options.key, data);
    });
  }

  addDelimitedParser(options: { prefix: string; key: ReceiverSettings; firstPart: string }) {
    this.addParser(options.prefix, (data: string) => {
      return BaseParser.parseDelimited(options.key, data, options.firstPart);
    });
  }

  addListParser(options: { prefix: string; key: ReceiverSettings; list: string[] }) {
    this.addParser(options.prefix, (data: string) => {
      return BaseParser.parseList(options.key, data, options.list);
    });
  }

  addLongPrefixParser(options: { prefix: string; key: ReceiverSettings; ending: string }) {
    this.addParser(options.prefix, (data: string) => {
      return BaseParser.parseLongPrefix(options.key, data, options.ending);
    });
  }

  public parse(data: string): ParserResult {
    if (data.length > 2) {
      const prefix = data.substring(0, 2);
      const suffix = data.substring(2);
      const parsers = this.prefixMap[prefix];
      if (parsers !== undefined) {
        for (const parser of parsers) {
          const result = parser(suffix);
          if (result.handled) {
            if (result.value) {
              this.formatResult(result.value);
            }
            return result;
          }
        }
      }
    }

    return {
      handled: false,
    };
  }

  public formatResult(value: StateValue) {
    if (!value.numeric) {
      const intRaw = parseInt(value.raw);
      if (!isNaN(intRaw) && intRaw.toString() === value.raw) {
        value.numeric = intRaw;
      } else {
        const intValue = parseInt(value.value!);
        if (!isNaN(intValue) && intValue.toString() === value.value) {
          value.numeric = intValue;
        }
      }
    }
    if (!value.numeric && !value.key) {
      value.text = value.raw;
    }
    return value;
  }

  public handle(data: string): boolean {
    const parserResult = this.parse(data);
    if (parserResult.handled) {
      this.updateState(parserResult.key!, parserResult.value!);
      return true;
    }

    return false;
  }

  protected updateState(key: ReceiverSettings | undefined, value: StateValue): void {
    if (key) {
      this.state.updateState(key, value);
    }
  }
}
