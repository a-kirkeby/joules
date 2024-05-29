
# Source: https://sustainablewebdesign.org/calculating-digital-emissions/

# Specific Data Points
We used these data points to define the formulas below:

Annual Internet Energy: 1988 TWh
Annual End User Traffic: 2444 EB
Annual Internet Energy / Annual End User Traffic = 0.81 tWh/EB or 0.81 kWh/GB
Carbon factor (global grid): 442 g/kWh
Carbon factor (renewable energy source): 50 g/kWh
Emissions Calculation Formulas
Using the above data, we came up with these formulas: 

# Energy per visit in kWh (E):
E = [Data Transfer per Visit (new visitors) in GB x 0.81 kWh/GB x 0.75] + [Data Transfer per Visit (returning visitors) in GB x 0.81 kWh/GB x 0.25 x 0.02]

# Emissions per visit in grams CO2e (C):
C = E x 442 g/kWh (or alternative/region-specific carbon factor)

# Annual energy in kWh (AE):
AE = E x Monthly Visitors x 12

# Annual emissions in grams CO2e (AC):
AC = C x Monthly Visitors x 12

## Annual Segment Energy:
Consumer device energy = AE x 0.52
Network energy = AE x 0.14
Data center energy = AE x 0.15
Production energy = AE x 0.19

## Annual Segment Emissions:
Consumer device emissions = AC x 0.52
Network emissions = AC x 0.14
Data center emission = AC x 0.15
Production emission = AC x 0.19