import axios from 'axios';
import https from 'https';
import * as xml2js from 'xml2js';

export class ConfigRequestor {
  constructor(private ip: string) {}

  public async getJsonFromXmlEndpoint(path: string) {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const response = await axios.get(`https://${this.ip}:10443${path}`, { httpsAgent: agent });
    return await xml2js.parseStringPromise(response.data);
  }

  public async getConfig() {
    const zones = await this.listZones();
    const sources = await this.listSources();
    const sourceRenames = await this.listSourceRenames();

    const { FriendlyName } = await this.getJsonFromXmlEndpoint(`/ajax/globals/get_config?type=3&_=${Date.now()}`);

    for (const zone of zones) {
      const zoneSources = sources.find((s: any) => s.zone === zone.zone)?.sources;
      zone.sources = [];
      for (const source of zoneSources) {
        const renamed = sourceRenames.find((r: any) => r.renamed === source.name);
        zone.sources.push(renamed ?? { index: source.index, original: source.name, renamed: source.name });
      }
    }

    return {
      friendlyName: FriendlyName,
      zones,
    };
  }

  public async listZones() {
    const { ZoneRename } = await this.getJsonFromXmlEndpoint(`/ajax/general/get_config?type=6&_=${Date.now()}`);

    return ZoneRename.Zone.map((z: any) => {
      return { zone: z.$.index, display: z.Rename[0] };
    });
  }

  public async listSources() {
    const { SourceList } = await this.getJsonFromXmlEndpoint('/ajax/globals/get_config?type=7');

    return SourceList.Zone.map((z: any) => {
      return {
        zone: z.$.zone,
        sources: z.Source.map((i: any) => {
          return { index: i.$.index, name: i.Name[0] };
        }),
      };
    });
  }

  public async listSourceRenames() {
    const sourceRenameData = await this.getJsonFromXmlEndpoint(`/ajax/inputs/get_config?type=3&_=${Date.now()}`);

    return sourceRenameData.SourceRename.Source.map((s: any) => {
      return { index: s.$.index, original: s.Default[0], renamed: s.Rename[0] };
    });
  }
}
