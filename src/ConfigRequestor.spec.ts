import axios from 'axios';

import { ConfigRequestor } from './ConfigRequestor';

const zoneXml =
  '<?xml version="1.0" encoding="utf-8"?><ZoneRename><Zone index="1" display="3"><Rename>Living</Rename></Zone><Zone index="2" display="3"><Rename>Rumpus</Rename></Zone><Zone index="3" display="3"><Rename>Porch</Rename></Zone></ZoneRename>';
const sourceXml = `<?xml version="1.0" encoding="utf-8"?><SourceList><Zone zone="1" index="1"><Source index="1"><Name>Fire TV</Name></Source><Source index="2"><Name>AppleTV</Name></Source><Source index="3"><Name>Blu-ray</Name></Source><Source index="4"><Name>XBox</Name></Source><Source index="5"><Name>Karaoke</Name></Source><Source index="6"><Name>TV Audio</Name></Source><Source index="7"><Name>AUX1</Name></Source><Source index="8"><Name>pi</Name></Source><Source index="9"><Name>Alexa</Name></Source><Source index="10"><Name>Phono</Name></Source><Source index="11"><Name>Tuner</Name></Source><Source index="13"><Name>HEOS Music</Name></Source></Zone><Zone zone="2" index="9"><Source index="1"><Name>Fire TV</Name></Source><Source index="2"><Name>AppleTV</Name></Source><Source index="3"><Name>Blu-ray</Name></Source><Source index="4"><Name>XBox</Name></Source><Source index="5"><Name>Karaoke</Name></Source><Source index="6"><Name>TV Audio</Name></Source><Source index="8"><Name>pi</Name></Source><Source index="9"><Name>Alexa</Name></Source><Source index="10"><Name>Phono</Name></Source><Source index="11"><Name>Tuner</Name></Source><Source index="13"><Name>HEOS Music</Name></Source><Source index="19"><Name>Source</Name></Source></Zone><Zone zone="3" index="1"><Source index="1"><Name>Fire TV</Name></Source><Source index="2"><Name>AppleTV</Name></Source><Source index="3"><Name>Blu-ray</Name></Source><Source index="4"><Name>XBox</Name></Source><Source index="5"><Name>Karaoke</Name></Source><Source index="6"><Name>TV Audio</Name></Source><Source index="9"><Name>Alexa</Name></Source><Source index="10"><Name>Phono</Name></Source><Source index="11"><Name>Tuner</Name></Source><Source index="13"><Name>HEOS Music</Name></Source><Source index="19"><Name>Source</Name></Source></Zone></SourceList>`;
const sourceRenameXml =
  '<?xml version="1.0" encoding="utf-8"?><SourceRename><CharacterMax>12</CharacterMax><Source index="1"><Default>CBL/SAT</Default><Rename>Fire TV</Rename></Source><Source index="2"><Default>DVD</Default><Rename>AppleTV</Rename></Source><Source index="3"><Default>Blu-ray</Default><Rename>Blu-ray</Rename></Source><Source index="4"><Default>Game</Default><Rename>XBox</Rename></Source><Source index="5"><Default>Media Player</Default><Rename>Karaoke</Rename></Source><Source index="6"><Default>TV Audio</Default><Rename>TV Audio</Rename></Source><Source index="7"><Default>AUX1</Default><Rename>AUX1</Rename></Source><Source index="8"><Default>AUX2</Default><Rename>pi</Rename></Source><Source index="9"><Default>CD</Default><Rename>Alexa</Rename></Source><Source index="10"><Default>Phono</Default><Rename>Phono</Rename></Source></SourceRename>';
const friendlyNameXml = '<?xml version="1.0" encoding="utf-8"?><FriendlyName>Home Theater</FriendlyName>';

describe('ConfigRequestor', () => {
  jest.spyOn(axios, 'get').mockImplementation((url) => {
    if (url.indexOf('/ajax/general/get_config?type=6&_=') > 0) {
      return Promise.resolve({ data: zoneXml });
    } else if (url.indexOf('/ajax/globals/get_config?type=7') > 0) {
      return Promise.resolve({ data: sourceXml });
    } else if (url.indexOf('/ajax/inputs/get_config?type=3') > 0) {
      return Promise.resolve({ data: sourceRenameXml });
    }
    return Promise.resolve({ data: friendlyNameXml });
  });

  const configRequestor = new ConfigRequestor('192.168.1.34');

  describe('listZones()', () => {
    it('should return the list of zones with renamed values', async () => {
      const result = await configRequestor.listZones();
      expect(result).toEqual([
        { display: 'Living', zone: '1' },
        { display: 'Rumpus', zone: '2' },
        { display: 'Porch', zone: '3' },
      ]);
    });
  });

  describe('listSources()', () => {
    it('should return the list of sources', async () => {
      const result = await configRequestor.listSources();
      expect(result[0]).toEqual({
        sources: [
          { index: '1', name: 'Fire TV' },
          { index: '2', name: 'AppleTV' },
          { index: '3', name: 'Blu-ray' },
          { index: '4', name: 'XBox' },
          { index: '5', name: 'Karaoke' },
          { index: '6', name: 'TV Audio' },
          { index: '7', name: 'AUX1' },
          { index: '8', name: 'pi' },
          { index: '9', name: 'Alexa' },
          { index: '10', name: 'Phono' },
          { index: '11', name: 'Tuner' },
          { index: '13', name: 'HEOS Music' },
        ],
        zone: '1',
      });
      expect(result[1]).toEqual({
        sources: [
          { index: '1', name: 'Fire TV' },
          { index: '2', name: 'AppleTV' },
          { index: '3', name: 'Blu-ray' },
          { index: '4', name: 'XBox' },
          { index: '5', name: 'Karaoke' },
          { index: '6', name: 'TV Audio' },
          { index: '8', name: 'pi' },
          { index: '9', name: 'Alexa' },
          { index: '10', name: 'Phono' },
          { index: '11', name: 'Tuner' },
          { index: '13', name: 'HEOS Music' },
          { index: '19', name: 'Source' },
        ],
        zone: '2',
      });
      expect(result[2]).toEqual({
        sources: [
          { index: '1', name: 'Fire TV' },
          { index: '2', name: 'AppleTV' },
          { index: '3', name: 'Blu-ray' },
          { index: '4', name: 'XBox' },
          { index: '5', name: 'Karaoke' },
          { index: '6', name: 'TV Audio' },
          { index: '9', name: 'Alexa' },
          { index: '10', name: 'Phono' },
          { index: '11', name: 'Tuner' },
          { index: '13', name: 'HEOS Music' },
          { index: '19', name: 'Source' },
        ],
        zone: '3',
      });
    });
  });

  describe('listSourceRenames()', () => {
    it('should return the list of sources with renamed values', async () => {
      const result = await configRequestor.listSourceRenames();
      expect(result).toEqual([
        { index: '1', original: 'CBL/SAT', renamed: 'Fire TV' },
        { index: '2', original: 'DVD', renamed: 'AppleTV' },
        { index: '3', original: 'Blu-ray', renamed: 'Blu-ray' },
        { index: '4', original: 'Game', renamed: 'XBox' },
        { index: '5', original: 'Media Player', renamed: 'Karaoke' },
        { index: '6', original: 'TV Audio', renamed: 'TV Audio' },
        { index: '7', original: 'AUX1', renamed: 'AUX1' },
        { index: '8', original: 'AUX2', renamed: 'pi' },
        { index: '9', original: 'CD', renamed: 'Alexa' },
        { index: '10', original: 'Phono', renamed: 'Phono' },
      ]);
    });
  });

  describe('getConfig', () => {
    it('should get full config', async () => {
      const result = await configRequestor.getConfig();
      expect(result.friendlyName).toEqual('Home Theater');
      expect(result.zones[0]).toEqual({
        zone: '1',
        display: 'Living',
        sources: [
          { index: '1', original: 'CBL/SAT', renamed: 'Fire TV' },
          { index: '2', original: 'DVD', renamed: 'AppleTV' },
          { index: '3', original: 'Blu-ray', renamed: 'Blu-ray' },
          { index: '4', original: 'Game', renamed: 'XBox' },
          { index: '5', original: 'Media Player', renamed: 'Karaoke' },
          { index: '6', original: 'TV Audio', renamed: 'TV Audio' },
          { index: '7', original: 'AUX1', renamed: 'AUX1' },
          { index: '8', original: 'AUX2', renamed: 'pi' },
          { index: '9', original: 'CD', renamed: 'Alexa' },
          { index: '10', original: 'Phono', renamed: 'Phono' },
          { index: '11', original: 'Tuner', renamed: 'Tuner' },
          { index: '13', original: 'HEOS Music', renamed: 'HEOS Music' },
        ],
      });
      expect(result.zones[1]).toEqual({
        zone: '2',
        display: 'Rumpus',
        sources: [
          { index: '1', original: 'CBL/SAT', renamed: 'Fire TV' },
          { index: '2', original: 'DVD', renamed: 'AppleTV' },
          { index: '3', original: 'Blu-ray', renamed: 'Blu-ray' },
          { index: '4', original: 'Game', renamed: 'XBox' },
          { index: '5', original: 'Media Player', renamed: 'Karaoke' },
          { index: '6', original: 'TV Audio', renamed: 'TV Audio' },
          { index: '8', original: 'AUX2', renamed: 'pi' },
          { index: '9', original: 'CD', renamed: 'Alexa' },
          { index: '10', original: 'Phono', renamed: 'Phono' },
          { index: '11', original: 'Tuner', renamed: 'Tuner' },
          { index: '13', original: 'HEOS Music', renamed: 'HEOS Music' },
          { index: '19', original: 'Source', renamed: 'Source' },
        ],
      });
      expect(result.zones[2]).toEqual({
        zone: '3',
        display: 'Porch',
        sources: [
          { index: '1', original: 'CBL/SAT', renamed: 'Fire TV' },
          { index: '2', original: 'DVD', renamed: 'AppleTV' },
          { index: '3', original: 'Blu-ray', renamed: 'Blu-ray' },
          { index: '4', original: 'Game', renamed: 'XBox' },
          { index: '5', original: 'Media Player', renamed: 'Karaoke' },
          { index: '6', original: 'TV Audio', renamed: 'TV Audio' },
          { index: '9', original: 'CD', renamed: 'Alexa' },
          { index: '10', original: 'Phono', renamed: 'Phono' },
          { index: '11', original: 'Tuner', renamed: 'Tuner' },
          { index: '13', original: 'HEOS Music', renamed: 'HEOS Music' },
          { index: '19', original: 'Source', renamed: 'Source' },
        ],
      });
    });
  });
});
