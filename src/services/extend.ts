import I18nService from "@src/services/i18n";
import {TServices} from "@src/services/types";

export default function serviceFabric(services: TServices, env: ImportMetaEnv) {
  return {
    i18n() {
      return new I18nService({}, services, env);
    }
  };
}
