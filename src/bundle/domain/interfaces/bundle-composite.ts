export interface PricableAndWeightable {
  calculatePrice(): number;
  calculateWeight(): number;
}
