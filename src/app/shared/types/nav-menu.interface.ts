export interface NavMenu {
  path: string;
  title: string;
  translateKey: string;
  type: "title" | "collapse" | "item";
  iconType?: "" | "feather" | "line-awesome";
  iconStyle?: "solid" | "regular" | "brands";
  icon?: string;
  submenu: NavMenu[];
  key: string;
  claims?: string[];
}
