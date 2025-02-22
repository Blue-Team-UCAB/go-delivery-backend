import axios from 'axios';
import { MovementRepository } from '../repository/movement.repository';
import { ChangeOrderStatusApplicationService } from 'src/order/application/commands/chage-order-status.application.service';

export class CourierMovement {
  constructor(
    private readonly movementRepository: MovementRepository,
    private readonly changeOrderStatusApplicationService: ChangeOrderStatusApplicationService,
  ) {}

  async getCourierMovement(
    latitude: string,
    longitude: string,
    id: string,
  ): Promise<{
    latActual: string;
    longActual: string;
    LongPuntoLlegada: string;
    LatPuntoLlegada: string;
  }> {
    const resp = await this.movementRepository.findMovementByOrderId(id);

    if (!resp) {
      const API_KEY = 'AIzaSyC1rbw0WItY-_93PSQGY0ilpHr8G3RWEdM';
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${10.50817720739761},${-66.92005179744145}&destination=${latitude},${longitude}&mode=driving&key=${API_KEY}`;

      const apiResponse = await axios.get(url);

      if (apiResponse.status !== 200) {
        throw new Error('Error al obtener la ruta de Google Maps');
      }

      if (!apiResponse.data.routes.length) {
        throw new Error('No hay rutas disponibles');
      }

      const routeSteps = apiResponse.data.routes[0].legs[0].steps;
      const steps = routeSteps.map((step: any) => step.end_location);

      await this.movementRepository.saveMovement({
        longitudePuntoLlegada: longitude,
        latitudePuntoLlegada: latitude,
        latitudePuntoActual: '10.50817720739761',
        longitudePuntoActual: '-66.92005179744145',
        lastUpdated: new Date(),
        orders: { id_Order: id } as any,
        id: 10,
        routeSteps: steps,
        currentStepIndex: 0,
      });
      return {
        latActual: '10.50817720739761',
        longActual: '-66.92005179744145',
        LongPuntoLlegada: longitude,
        LatPuntoLlegada: latitude,
      };
    }

    const { routeSteps, currentStepIndex } = resp;
    if (!routeSteps) {
      throw new Error('No hay más pasos en la ruta');
    }

    if (currentStepIndex >= routeSteps.length) {
      const respApp = await this.changeOrderStatusApplicationService.execute({ orderId: id, status: 'DELIVERED' });

      if (!respApp.isSuccess()) {
        throw new Error('Error al cambiar el estado de la orden');
      }

      return {
        latActual: resp.latitudePuntoLlegada,
        longActual: resp.longitudePuntoLlegada,
        LongPuntoLlegada: resp.longitudePuntoLlegada,
        LatPuntoLlegada: resp.latitudePuntoLlegada,
      };
    }

    const nextStep = routeSteps[currentStepIndex];
    const { lat: nextLatitude, lng: nextLongitude } = nextStep;

    resp.latitudePuntoActual = nextLatitude.toString();
    resp.longitudePuntoActual = nextLongitude.toString();
    resp.currentStepIndex = currentStepIndex + 1;

    await this.movementRepository.saveMovement(resp);

    return {
      latActual: nextLatitude.toString(),
      longActual: nextLongitude.toString(),
      LongPuntoLlegada: resp.longitudePuntoLlegada,
      LatPuntoLlegada: resp.latitudePuntoLlegada,
    };
  }
}
