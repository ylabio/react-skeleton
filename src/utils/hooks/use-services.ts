import {useContext} from "react";
import {ServicesContext} from "@src/services/provider";
import {TServices} from "@src/services/types";

/**
 * Хук для доступа к сервисам
 */
export default function useServices(): TServices {
  return useContext(ServicesContext) as TServices;
}
