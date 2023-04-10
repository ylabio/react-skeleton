import React, {useContext} from "react";
import {ServicesContext} from "@src/services/provider";
import Services from '@src/services';

/**
 * Хук для доступа к сервисам
 * @return {Services}
 */
export default function useServices(): Services {
  return useContext(ServicesContext) as Services;
}
