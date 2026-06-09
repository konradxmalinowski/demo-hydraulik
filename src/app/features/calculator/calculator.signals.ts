import { signal, computed, Signal, WritableSignal } from '@angular/core';
import {
  ServiceType,
  PRICING_RATES,
  BASE_DOJAZD,
  DOJAZD_URGENT_SURCHARGE,
  PricingBreakdown,
} from '../../data/pricing.data';

export type TerminType = 'natychmiast' | 'dzis' | 'jutro' | 'inny';

export class CalculatorSignals {
  // Writable input signals
  readonly serviceType: WritableSignal<ServiceType> = signal<ServiceType>('awaria');
  readonly hoursCount: WritableSignal<number> = signal<number>(1);
  readonly urgent: WritableSignal<boolean> = signal<boolean>(false);
  readonly termin: WritableSignal<TerminType> = signal<TerminType>('dzis');
  readonly extraMaterials: WritableSignal<boolean> = signal<boolean>(false);

  // Computed signal: dojazd
  readonly dojazd: Signal<number> = computed(() => {
    const base = BASE_DOJAZD;
    const urgentSurcharge = this.urgent() ? DOJAZD_URGENT_SURCHARGE : 0;
    return base + urgentSurcharge;
  });

  // Computed signal: robocizna
  readonly robocizna: Signal<number> = computed(() => {
    const rates = PRICING_RATES[this.serviceType()];
    const hours = Math.max(1, this.hoursCount());
    return rates.robociznaBase + (hours - 1) * rates.robociznaPerHour;
  });

  // Computed signal: materialy
  readonly materialy: Signal<number> = computed(() => {
    const rates = PRICING_RATES[this.serviceType()];
    const extra = this.extraMaterials() ? 100 : 0;
    return rates.materialyEstimate + extra;
  });

  // Computed signal: razem (total)
  readonly razem: Signal<number> = computed(
    () => this.dojazd() + this.robocizna() + this.materialy()
  );

  // Convenience computed: full breakdown object
  readonly breakdown: Signal<PricingBreakdown> = computed(() => ({
    dojazd: this.dojazd(),
    robocizna: this.robocizna(),
    materialy: this.materialy(),
    razem: this.razem(),
  }));
}
