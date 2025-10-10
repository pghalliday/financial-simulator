from decimal import Decimal

from pytest import raises

from financial_simulator.lib.util import create_bands, Band


def test_create_bands():
    bands = create_bands({Decimal('0.0'): 'band 1',
                          Decimal('1000.0'): 'band 2',
                          Decimal('3000.0'): 'band 3', })
    assert bands == ((Band(lower=Decimal('0.0'), size=Decimal('1000.0')), 'band 1'),
                     (Band(lower=Decimal('1000.0'), size=Decimal('2000.0')), 'band 2'),
                     (Band(lower=Decimal('3000.0'), size=None), 'band 3'))


def test_create_bands_start_above_zero():
    bands = create_bands({Decimal('500.0'): 'band 1',
                          Decimal('1000.0'): 'band 2',
                          Decimal('3000.0'): 'band 3', })
    assert bands == ((Band(lower=Decimal('500.0'), size=Decimal('500.0')), 'band 1'),
                     (Band(lower=Decimal('1000.0'), size=Decimal('2000.0')), 'band 2'),
                     (Band(lower=Decimal('3000.0'), size=None), 'band 3'))


def test_create_bands_start_below_zero():
    with raises(ValueError, match='Lower bound must be greater than or equal to 0.0'):
        create_bands({Decimal('-500.0'): 'band 1',
                      Decimal('1000.0'): 'band 2',
                      Decimal('3000.0'): 'band 3', })


def test_band_portion_full():
    band = Band(lower=Decimal('1000.0'), size=Decimal('1000.0'))
    assert tuple(band.portion((Decimal('3000.0'),))) == (Decimal('1000.0'),)


def test_band_portion_lower():
    band = Band(lower=Decimal('1000.0'), size=Decimal('1000.0'))
    assert tuple(band.portion((Decimal('500.0'),))) == (Decimal('0.0'),)


def test_band_portion_middle():
    band = Band(lower=Decimal('1000.0'), size=Decimal('1000.0'))
    assert tuple(band.portion((Decimal('1500.0'),))) == (Decimal('500.0'),)


def test_band_portion_spread():
    band = Band(lower=Decimal('1000.0'), size=Decimal('1000.0'))
    assert tuple(band.portion((Decimal('500.0'),
                               Decimal('1000.0'),
                               Decimal('1000.0'),
                               Decimal('1000.0')))) == (Decimal('0.0'),
                                                        Decimal('500.0'),
                                                        Decimal('500.0'),
                                                        Decimal('0.0'))
