export interface OrderCourierMovementEntity {
  id: string;
  longitudePuntoLlegada: string;
  latitudePuntoLlegada: string;
  longitudePuntoActual: string;
  latitudePuntoActual: string;
  lastUpdated: Date;
  orderId: string;
}
