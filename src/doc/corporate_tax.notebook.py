# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.2
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown]
# # Corporate tax for BV
#
# The annual corporate tax for a BV is calculated on a taxable amount which is the gross revenue minus deductibles. For example.
#
# Given:

# %%
from financial_simulator.tax.tax_bands_by_year import TaxBandsByYear

revenue = 500_000.00
deductibles = 200_000.00

# %% [markdown]
# Then:

# %%
taxable = revenue - deductibles
taxable

# %% [markdown]
# The tax payable is then calculated based on rates for bands set by the Belastingdienst each year. For example, the bands set for 2025 are:

# %%

taxBandsByYear = TaxBandsByYear('../../data/corporation_tax_bands.json')
taxBands2025 = taxBandsByYear.get_bands(2025)
print(taxBands2025)

# %% [markdown]
# Thus, the tax calculation for our example above is:

# %%
taxCalculation = taxBands2025.calculate(taxable)
print(taxCalculation)

# %%
taxCalculation.tax_due
