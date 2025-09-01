import { CardDefinition, CreateActionsFunction } from '../types';
import CarCard from './CarCard';
import CarCardForm from './CarCardForm';
import type { CarCard as CarCardType } from './types';

const createCarActions: CreateActionsFunction<CarCardType> = (card, onUpdateCard) => ({
  joinSeat: (userId: string, seatIndex: number) => {
    const occupants = card.occupants || [];

    const alreadyOccupied = occupants.find(o => o.seatIndex === seatIndex);
    const userAlreadyInCar = occupants.find(o => o.userId === userId);

    if (alreadyOccupied || userAlreadyInCar) {
      return;
    }

    const updatedCard = {
      ...card,
      occupants: [...occupants, { userId, seatIndex }],
      updatedAt: new Date().toISOString(),
    };
    onUpdateCard(updatedCard);
  },

  leaveSeat: (userId: string) => {
    const occupants = card.occupants || [];
    const updatedOccupants = occupants.filter(o => o.userId !== userId);

    const updatedCard = {
      ...card,
      occupants: updatedOccupants,
      updatedAt: new Date().toISOString(),
    };
    onUpdateCard(updatedCard);
  }
});

export const carCardDefinition: CardDefinition<CarCardType> = {
  type: 'car',
  displayName: 'Car',
  description: 'Create a car with seats that users can join',
  Component: CarCard,
  FormComponent: CarCardForm,
  createActions: createCarActions,
};

export { CarCard, CarCardForm };
export type { CarCardType };