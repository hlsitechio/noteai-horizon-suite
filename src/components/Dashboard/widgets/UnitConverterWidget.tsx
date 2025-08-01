import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Calculator } from 'lucide-react';

interface ConversionCategory {
  name: string;
  units: { [key: string]: number }; // conversion factor to base unit
}

const conversionCategories: { [key: string]: ConversionCategory } = {
  length: {
    name: 'Length',
    units: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34
    }
  },
  weight: {
    name: 'Weight',
    units: {
      g: 1,
      kg: 1000,
      oz: 28.3495,
      lb: 453.592,
      ton: 1000000
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      'C': 1,
      'F': 1,
      'K': 1
    }
  },
  volume: {
    name: 'Volume',
    units: {
      ml: 0.001,
      l: 1,
      gal: 3.78541,
      qt: 0.946353,
      pt: 0.473176,
      cup: 0.236588,
      'fl oz': 0.0295735
    }
  }
};

interface UnitConverterProps {
  title?: string;
  defaultCategory?: string;
}

export const UnitConverterWidget: React.FC<UnitConverterProps> = ({
  title = "Unit Converter",
  defaultCategory = 'length'
}) => {
  const [category, setCategory] = useState(defaultCategory);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  // Initialize units when category changes
  useEffect(() => {
    const units = Object.keys(conversionCategories[category].units);
    setFromUnit(units[0] || '');
    setToUnit(units[1] || units[0] || '');
    setFromValue('');
    setToValue('');
  }, [category]);

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius = value;
    
    // Convert to Celsius first
    if (from === 'F') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'K') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'F') {
      return celsius * 9/5 + 32;
    } else if (to === 'K') {
      return celsius + 273.15;
    }
    
    return celsius;
  };

  const performConversion = (value: string, from: string, to: string): string => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    if (category === 'temperature') {
      const result = convertTemperature(numValue, from, to);
      return result.toFixed(2);
    } else {
      const categoryData = conversionCategories[category];
      const fromFactor = categoryData.units[from];
      const toFactor = categoryData.units[to];
      
      if (!fromFactor || !toFactor) return '';
      
      // Convert to base unit, then to target unit
      const baseValue = numValue * fromFactor;
      const result = baseValue / toFactor;
      
      return result.toFixed(6).replace(/\.?0+$/, '');
    }
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    const converted = performConversion(value, fromUnit, toUnit);
    setToValue(converted);
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);
    const converted = performConversion(value, toUnit, fromUnit);
    setFromValue(converted);
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const availableUnits = Object.keys(conversionCategories[category].units);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(conversionCategories).map(([key, cat]) => (
              <SelectItem key={key} value={key}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* From Unit */}
        <div className="space-y-2">
          <label htmlFor="from-unit-value" className="text-sm font-medium">From</label>
          <div className="flex gap-2">
            <Input
              id="from-unit-value"
              type="number"
              placeholder="Enter value"
              value={fromValue}
              onChange={(e) => handleFromValueChange(e.target.value)}
              className="flex-1"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map(unit => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={swapUnits}
            className="h-8 w-8 p-0"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* To Unit */}
        <div className="space-y-2">
          <label htmlFor="to-unit-value" className="text-sm font-medium">To</label>
          <div className="flex gap-2">
            <Input
              id="to-unit-value"
              type="number"
              placeholder="Result"
              value={toValue}
              onChange={(e) => handleToValueChange(e.target.value)}
              className="flex-1"
            />
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map(unit => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Conversion Info */}
        {fromValue && toValue && (
          <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
            {fromValue} {fromUnit} = {toValue} {toUnit}
          </div>
        )}
      </CardContent>
    </Card>
  );
};