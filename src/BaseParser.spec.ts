import { BaseParser } from './BaseParser';
import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';
import { StateValue } from './StateValue';

class TestParser extends BaseParser {
  getParsers(key: string) {
    return this.prefixMap[key];
  }
}

describe('BaseParser', () => {
  describe('parsePassthrough()', () => {
    it('should return value', () => {
      const result = BaseParser.parsePassthrough(ReceiverSettings.MainPower, 'ON');
      expect(result).toEqual({
        handled: true,
        key: ReceiverSettings.MainPower,
        value: { raw: 'ON' },
      });
    });
  });

  describe('parseDelimited()', () => {
    it('should return value after delimiter if first part matches', () => {
      const result = BaseParser.parseDelimited(ReceiverSettings.ChannelVolume, 'CVFL 50', 'CVFL');
      expect(result).toEqual({
        handled: true,
        key: ReceiverSettings.ChannelVolume,
        value: { raw: '50' },
      });
    });

    it('should return empty value if no value', () => {
      const result = BaseParser.parseDelimited(ReceiverSettings.ChannelVolume, 'CVFL', 'CVFL');
      expect(result).toEqual({
        handled: true,
        key: ReceiverSettings.ChannelVolume,
        value: { raw: '' },
      });
    });

    it('should ignore if first part does not match', () => {
      const result = BaseParser.parseDelimited(ReceiverSettings.ChannelVolume, 'CVFR 50', 'CVFL');
      expect(result).toEqual({
        handled: false,
      });
    });
  });

  describe('parseList()', () => {
    it('should handle listed values', () => {
      const result = BaseParser.parseList(ReceiverSettings.MainPower, 'ON', ['ON', 'OFF']);
      expect(result).toEqual({
        handled: true,
        key: ReceiverSettings.MainPower,
        value: { raw: 'ON' },
      });
    });

    it('should ignore if not in list', () => {
      const result = BaseParser.parseList(ReceiverSettings.MainPower, 'AUTO', ['ON', 'OFF']);
      expect(result).toEqual({
        handled: false,
      });
    });
  });

  describe('parseLongPrefix()', () => {
    it('should return value after prefix', () => {
      const result = BaseParser.parseLongPrefix(ReceiverSettings.Standby, 'BYON', 'BY');
      expect(result).toEqual({
        handled: true,
        key: ReceiverSettings.Standby,
        value: { raw: 'ON' },
      });
    });

    it('should ignore if prefix does not match', () => {
      const result = BaseParser.parseLongPrefix(ReceiverSettings.Standby, 'BXON', 'BY');
      expect(result).toEqual({
        handled: false,
      });
    });
  });

  describe('addParser()', () => {
    it('should add parser', () => {
      const testParser = new TestParser(new ReceiverState());
      const parser = jest.fn();
      testParser.addParser('ZM', (data: string) => parser(data));
      const parsers = testParser.getParsers('ZM');
      expect(parsers.length).toEqual(1);
      parsers[0]('ON');
      expect(parser).toHaveBeenCalledWith('ON');
    });
  });

  describe('addPassthroughParser()', () => {
    it('should call parsePassthrough', () => {
      const testParser = new TestParser(new ReceiverState());
      testParser.addPassthroughParser({ prefix: 'ZM', key: ReceiverSettings.Power });
      const parser = jest.spyOn(BaseParser, 'parsePassthrough');
      testParser.parse('ZMON');
      expect(parser).toHaveBeenCalledWith(ReceiverSettings.Power, 'ON');
    });
  });

  describe('addDelimitedParser()', () => {
    it('should parseDelimited', () => {
      const testParser = new TestParser(new ReceiverState());
      testParser.addDelimitedParser({ prefix: 'MV', key: ReceiverSettings.MaxVolume, firstPart: 'MAX' });
      const parser = jest.spyOn(BaseParser, 'parseDelimited');
      testParser.parse('MVMAX 90');
      expect(parser).toHaveBeenCalledWith(ReceiverSettings.MaxVolume, 'MAX 90', 'MAX');
    });
  });

  describe('addListParser()', () => {
    it('should call parseList', () => {
      const testParser = new TestParser(new ReceiverState());
      testParser.addListParser({ prefix: 'ZM', key: ReceiverSettings.Power, list: ['ON', 'OFF'] });
      const parser = jest.spyOn(BaseParser, 'parseList');
      testParser.parse('ZMON');
      expect(parser).toHaveBeenCalledWith(ReceiverSettings.Power, 'ON', ['ON', 'OFF']);
    });
  });

  describe('addLongPrefixParser()', () => {
    it('should call parseLongPrefix', () => {
      const testParser = new TestParser(new ReceiverState());
      testParser.addLongPrefixParser({ prefix: 'ST', key: ReceiverSettings.Standby, ending: 'BY' });
      const parser = jest.spyOn(BaseParser, 'parseLongPrefix');
      testParser.parse('STBYON');
      expect(parser).toHaveBeenCalledWith(ReceiverSettings.Standby, 'BYON', 'BY');
    });
  });

  describe('formatResult()', () => {
    const testParser = new TestParser(new ReceiverState());
    it('should parse raw value integers', () => {
      const result: StateValue = { raw: '123', numeric: 123 };
      testParser.formatResult(result);
      expect(result).toEqual({
        raw: '123',
        numeric: 123,
      });
    });

    it('should parse raw value decimals', () => {
      const result: StateValue = { raw: '123', decimal: true };
      testParser.formatResult(result);
      expect(result).toEqual({
        raw: '123',
        numeric: 12.3,
        decimal: true,
      });
    });

    it('should parse value integers', () => {
      const result: StateValue = { raw: 'FL 123', key: 'FL', value: '123' };
      testParser.formatResult(result);
      expect(result).toEqual({
        raw: 'FL 123',
        key: 'FL',
        value: '123',
        numeric: 123,
      });
    });
  });

  describe('handle()', () => {
    it('should call parser', () => {
      const state = new ReceiverState();
      const testParser = new TestParser(state);
      testParser.addPassthroughParser({ prefix: 'ZM', key: ReceiverSettings.Power });
      const result = testParser.handle('ZMON');
      expect(result).toBeTruthy();
      expect(state.isUpdated()).toBeTruthy();
    });

    it('return false if no parsers vound', () => {
      const state = new ReceiverState();
      const testParser = new TestParser(state);
      testParser.addPassthroughParser({ prefix: 'ZM', key: ReceiverSettings.Power });
      const result = testParser.handle('Z2ON');
      expect(result).toBeFalsy();
      expect(state.isUpdated()).toBeFalsy();
    });
  });
});
