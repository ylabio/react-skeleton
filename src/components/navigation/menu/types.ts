export interface MenuItem {
  key: number,
  link: string,
  title: string
}

export interface Props {
  items?: MenuItem[];
  onNavigate?: (item: MenuItem) => void;
}
