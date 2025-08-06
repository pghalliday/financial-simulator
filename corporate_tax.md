# Corporate tax for BV

The annual corporate tax for a BV is calculated on a taxable amount which is the gross revenue minus deductibles. For example.

Given:


```python
from financial_simulator.tax.tax_bands_by_year import TaxBandsByYear

revenue = 500_000.00
deductibles = 200_000.00
```

Then:


```python
taxable = revenue - deductibles
taxable
```




    300000.0



The tax payable is then calculated based on rates for bands set by the Belastingdienst each year. For example, the bands set for 2025 are:


```python

taxBandsByYear = TaxBandsByYear('../../data/corporation_tax_bands.json')
taxBands2025 = taxBandsByYear.get_bands(2025)
print(taxBands2025)
```

    ┌───────────────────────────────────────┬────────┐
    │ For the portion of the taxable amount │   Rate │
    ├───────────────────────────────────────┼────────┤
    │ up to 200_000                         │ 19.00% │
    │ above 200_000                         │ 25.80% │
    └───────────────────────────────────────┴────────┘


Thus, the tax calculation for our example above is:


```python
taxCalculation = taxBands2025.calculate(taxable)
print(taxCalculation)
```

    ┌───────────────────────────────────────┬────────┬─────────────────┬───────────┐
    │ For the portion of the taxable amount │   Rate │ Taxable portion │   Tax Due │
    ├───────────────────────────────────────┼────────┼─────────────────┼───────────┤
    │ up to 200_000                         │ 19.00% │      200_000.00 │ 38_000.00 │
    │ above 200_000                         │ 25.80% │      100_000.00 │ 25_800.00 │
    ├───────────────────────────────────────┼────────┼─────────────────┼───────────┤
    │                                       │  Total │      300_000.00 │ 63_800.00 │
    └───────────────────────────────────────┴────────┴─────────────────┴───────────┘



```python
taxCalculation.tax_due
```




    63800.0


