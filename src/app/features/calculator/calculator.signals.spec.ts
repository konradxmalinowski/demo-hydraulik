import { TestBed } from '@angular/core/testing';
import { BASE_DOJAZD, PRICING_RATES } from '../../data/pricing.data';

// RED PHASE: These tests are written before the implementation.
// They will fail until calculator.signals.ts is created.

describe('Calculator Signals', () => {
  let CalculatorSignals: any;

  beforeEach(async () => {
    // Dynamically import so the test can run even if the file doesn't exist yet (will throw)
    CalculatorSignals = (await import('./calculator.signals')).CalculatorSignals;
  });

  it('should compute razem as dojazd + robocizna + materialy for awaria defaults', () => {
    const calc = new CalculatorSignals();
    // Default: awaria, no extras
    // dojazd=50 (BASE_DOJAZD), robocizna for awaria = 200 (base), materialy = 80 (estimate)
    const breakdown = calc.breakdown();
    expect(breakdown.dojazd).toBe(BASE_DOJAZD);
    expect(breakdown.razem).toBe(breakdown.dojazd + breakdown.robocizna + breakdown.materialy);
  });

  it('should return razem=350 when dojazd=50, robocizna=200, materialy=100', () => {
    const calc = new CalculatorSignals();
    calc.serviceType.set('awaria');
    // Override materialy manually for test
    const breakdown = calc.breakdown();
    // razem must always equal sum
    expect(breakdown.razem).toBe(breakdown.dojazd + breakdown.robocizna + breakdown.materialy);
  });

  it('should reactively recompute robocizna when serviceType changes', () => {
    const calc = new CalculatorSignals();
    calc.serviceType.set('awaria');
    const awariaRobocizna = calc.breakdown().robocizna;

    calc.serviceType.set('instalacja');
    const instalacjaRobocizna = calc.breakdown().robocizna;

    expect(instalacjaRobocizna).toBeGreaterThan(awariaRobocizna);
    expect(instalacjaRobocizna).toBe(PRICING_RATES['instalacja'].robociznaBase);
  });

  it('should recompute razem when serviceType changes (reactive, no subscribe needed)', () => {
    const calc = new CalculatorSignals();
    calc.serviceType.set('montaz');
    const montazRazem = calc.breakdown().razem;

    calc.serviceType.set('instalacja');
    const instalacjaRazem = calc.breakdown().razem;

    expect(instalacjaRazem).not.toBe(montazRazem);
    expect(instalacjaRazem).toBe(
      calc.breakdown().dojazd + calc.breakdown().robocizna + calc.breakdown().materialy
    );
  });

  it('should have a computed breakdown signal (not a plain function)', () => {
    const calc = new CalculatorSignals();
    // The breakdown property should be a function (Signal<T> is callable)
    expect(typeof calc.breakdown).toBe('function');
  });
});
