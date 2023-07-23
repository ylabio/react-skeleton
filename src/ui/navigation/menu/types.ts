import {ReactNode} from "react";

export interface MenuItem {
  key: number,
  link: string,
  title: string
}

export interface Props {
  items: MenuItem[];
  linkRender: (item: MenuItem, index: number) => ReactNode
  onNavigate?: (item: MenuItem) => void;
}
