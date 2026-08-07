export interface KaratPriceCardProps {
  karatLabel: string;
  stockGrams: number;
  price: number | null;
  changed: boolean;
  deltaDirection: "up" | "down" | "none";
  deltaText: string;
  onChange: (value: number | null) => void;
}
