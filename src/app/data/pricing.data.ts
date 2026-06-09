export type ServiceType = 'awaria' | 'montaz' | 'wymiana' | 'instalacja';

export interface ServiceRates {
  type: ServiceType;
  label: string;
  robociznaBase: number;
  robociznaPerHour: number;
  materialyEstimate: number;
}

export const PRICING_RATES: Record<ServiceType, ServiceRates> = {
  awaria: {
    type: 'awaria',
    label: 'Naprawa awarii',
    robociznaBase: 200,
    robociznaPerHour: 120,
    materialyEstimate: 80,
  },
  montaz: {
    type: 'montaz',
    label: 'Montaż armatury',
    robociznaBase: 150,
    robociznaPerHour: 100,
    materialyEstimate: 150,
  },
  wymiana: {
    type: 'wymiana',
    label: 'Wymiana elementów',
    robociznaBase: 180,
    robociznaPerHour: 110,
    materialyEstimate: 250,
  },
  instalacja: {
    type: 'instalacja',
    label: 'Nowa instalacja',
    robociznaBase: 350,
    robociznaPerHour: 130,
    materialyEstimate: 500,
  },
};

export const BASE_DOJAZD = 50;
export const DOJAZD_AFTER_HOURS_SURCHARGE = 30; // PLN extra at night/weekend
export const DOJAZD_URGENT_SURCHARGE = 50; // PLN extra for immediate response

export interface PricingBreakdown {
  dojazd: number;
  robocizna: number;
  materialy: number;
  razem: number;
}
