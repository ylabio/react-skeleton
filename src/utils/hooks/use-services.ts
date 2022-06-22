import React, {useContext} from "react";
import {ServicesContext} from "@src/services/provider";

/**
 * Хук для доступа к сервисам
 * @return {Services}
 */
export default function useServices(): any {
  return useContext(ServicesContext);
}
