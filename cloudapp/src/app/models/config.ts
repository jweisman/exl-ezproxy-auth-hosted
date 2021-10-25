import { FormGroupUtil } from "@exlibris/exl-cloudapp-angular-lib";
import { merge } from 'lodash';

export class EZProxyAuthConfig {
  apikey: string = "";
  groups: { [name: string]: string[] } = {}
}

export const configFormGroup = (config: EZProxyAuthConfig = new EZProxyAuthConfig()) => FormGroupUtil.toFormGroup(merge(new EZProxyAuthConfig(), config))