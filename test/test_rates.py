from calendar import JANUARY
from datetime import date
from decimal import Decimal

from financial_simulator.rates import ContinuousRate, ContinuousRateCalculation, PeriodicRate, \
    PeriodicRateCalculation, create_banded_rate, BandedRateCalculation


def test_continuous_rate():
    annual_rate = Decimal('0.015')
    balance = Decimal('10_000.0')
    accrued = Decimal('500.0')
    continuous_rate = ContinuousRate(annual_rate)
    continuous_rate_calculation = continuous_rate.calculate(date(2021, JANUARY, 1),
                                                            balance,
                                                            accrued)
    daily_rate = ((1 + annual_rate) ** (1 / Decimal('365'))) - 1
    assert continuous_rate_calculation == ContinuousRateCalculation(rate=continuous_rate,
                                                                    current_date=date(2021, JANUARY, 1),
                                                                    balance=balance,
                                                                    accrued=accrued,
                                                                    daily_rate=daily_rate,
                                                                    calculation=daily_rate * (balance + accrued))


def test_continuous_rate_leap_year():
    annual_rate = Decimal('0.015')
    balance = Decimal('10_000.0')
    accrued = Decimal('500.0')
    continuous_rate = ContinuousRate(annual_rate)
    continuous_rate_calculation = continuous_rate.calculate(date(2024, JANUARY, 1),
                                                            balance,
                                                            accrued)
    daily_rate = ((1 + annual_rate) ** (1 / Decimal('366'))) - 1
    assert continuous_rate_calculation == ContinuousRateCalculation(rate=continuous_rate,
                                                                    current_date=date(2024, JANUARY, 1),
                                                                    balance=balance,
                                                                    accrued=accrued,
                                                                    daily_rate=daily_rate,
                                                                    calculation=daily_rate * (balance + accrued))


def test_periodic_rate():
    annual_rate = Decimal('0.015')
    balance = Decimal('10_000.0')
    accrued = Decimal('500.0')
    periodic_rate = PeriodicRate(annual_rate, 12)
    periodic_rate_calculation = periodic_rate.calculate(date(2021, JANUARY, 1),
                                                        balance,
                                                        accrued)
    daily_rate = (12 * ((1 + annual_rate) ** (1 / Decimal(12)) - 1)) / 365
    assert periodic_rate_calculation == PeriodicRateCalculation(rate=periodic_rate,
                                                                current_date=date(2021, JANUARY, 1),
                                                                balance=balance,
                                                                accrued=accrued,
                                                                daily_rate=daily_rate,
                                                                calculation=daily_rate * balance)


def test_periodic_rate_leap_year():
    annual_rate = Decimal('0.015')
    balance = Decimal('10_000.0')
    accrued = Decimal('500.0')
    periodic_rate = PeriodicRate(annual_rate, 12)
    periodic_rate_calculation = periodic_rate.calculate(date(2024, JANUARY, 1),
                                                        balance,
                                                        accrued)
    daily_rate = (12 * ((1 + annual_rate) ** (1 / Decimal(12)) - 1)) / 366
    assert periodic_rate_calculation == PeriodicRateCalculation(rate=periodic_rate,
                                                                current_date=date(2024, JANUARY, 1),
                                                                balance=balance,
                                                                accrued=accrued,
                                                                daily_rate=daily_rate,
                                                                calculation=daily_rate * balance)


def test_banded_rate():
    band_1_start = Decimal('0.0')
    annual_rate_1 = Decimal('0.01')
    continuous_rate_1 = ContinuousRate(annual_rate_1)
    band_2_start = Decimal('1000.0')
    annual_rate_2 = Decimal('0.02')
    continuous_rate_2 = ContinuousRate(annual_rate_2)
    band_3_start = Decimal('2000.0')
    annual_rate_3 = Decimal('0.03')
    continuous_rate_3 = ContinuousRate(annual_rate_3)
    balance = Decimal('10_000.0')
    accrued = Decimal('500.0')
    banded_rate = create_banded_rate({band_1_start: continuous_rate_1,
                                      band_2_start: continuous_rate_2,
                                      band_3_start: continuous_rate_3})
    banded_rate_calculation = banded_rate.calculate(date(2021, JANUARY, 1),
                                                    balance,
                                                    accrued)
    daily_rate_1 = ((1 + annual_rate_1) ** (1 / Decimal('365'))) - 1
    daily_rate_2 = ((1 + annual_rate_2) ** (1 / Decimal('365'))) - 1
    daily_rate_3 = ((1 + annual_rate_3) ** (1 / Decimal('365'))) - 1
    assert banded_rate_calculation == BandedRateCalculation(rate=banded_rate,
                                                            current_date=date(2021, JANUARY, 1),
                                                            balance=balance,
                                                            accrued=accrued,
                                                            calculation=((band_2_start * daily_rate_1) +
                                                                         ((
                                                                                      band_3_start - band_2_start) * daily_rate_2) +
                                                                         ((
                                                                                  balance + accrued - band_3_start) * daily_rate_3)),
                                                            calculations=(
                                                                ContinuousRateCalculation(rate=continuous_rate_1,
                                                                                          current_date=date(2021,
                                                                                                            JANUARY, 1),
                                                                                          balance=band_2_start,
                                                                                          accrued=Decimal('0.0'),
                                                                                          daily_rate=daily_rate_1,
                                                                                          calculation=band_2_start * daily_rate_1),
                                                                ContinuousRateCalculation(rate=continuous_rate_2,
                                                                                          current_date=date(2021,
                                                                                                            JANUARY, 1),
                                                                                          balance=band_3_start - band_2_start,
                                                                                          accrued=Decimal('0.0'),
                                                                                          daily_rate=daily_rate_2,
                                                                                          calculation=(
                                                                                                                  band_3_start - band_2_start) * daily_rate_2),
                                                                ContinuousRateCalculation(rate=continuous_rate_3,
                                                                                          current_date=date(2021,
                                                                                                            JANUARY, 1),
                                                                                          balance=balance - band_3_start,
                                                                                          accrued=accrued,
                                                                                          daily_rate=daily_rate_3,
                                                                                          calculation=(
                                                                                                                  balance + accrued - band_3_start) * daily_rate_3)))
