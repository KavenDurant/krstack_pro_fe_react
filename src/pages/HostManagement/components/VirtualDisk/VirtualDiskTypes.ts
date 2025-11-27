export interface VirtualDiskItem {
  key: string;
  name: string;
  iso?: string;
  usedGB: number;
  totalGB: number;
  location: string;
  category: "系统盘" | "数据盘";
}
