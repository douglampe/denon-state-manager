import { SpeakerCodes } from './SpeakerCodes';
import { Speakers } from './Speakers';

describe('SpeakerCodes', () => {
  describe('codesToNames', () => {
    it('should convert codes to names', () => {
      const name = SpeakerCodes.codesToNames[Speakers.FrontLeft];
      expect(name).toEqual('Front Left');
    });
  });

  describe('namesToCodes', () => {
    it('should convert names to codes', () => {
      const name = SpeakerCodes.namesToCodes['Front Left'];
      expect(name).toEqual('FL');
    });
  });
});
