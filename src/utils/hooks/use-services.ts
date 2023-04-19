import React, {useContext} from "react";
import {ServicesContext} from "@src/services/provider";
import { IServicesModules } from "@src/services/types";

/**
 * Хук для доступа к сервисам
 * @return {IServicesModules}
 */
export default function useServices(): IServicesModules {
  return useContext(ServicesContext) as IServicesModules;
}
