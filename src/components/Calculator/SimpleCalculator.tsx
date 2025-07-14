import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Trash2 } from 'lucide-react';

export const SimpleCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const inputNumber = (num: string) => {
    // Trigger color animation
    setClickedButton(num);
    setTimeout(() => setClickedButton(null), 200);

    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const formatDisplayValue = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    
    // Limit display to prevent overflow
    if (value.length > 12) {
      return num.toExponential(6);
    }
    return value;
  };

  const NumberButton: React.FC<{ number: string }> = ({ number }) => (
    <Button
      variant="outline"
      size="lg"
      onClick={() => inputNumber(number)}
      className={`h-14 text-lg font-semibold transition-all duration-200 hover:scale-105 ${
        clickedButton === number
          ? 'bg-primary text-primary-foreground scale-110 shadow-lg animate-pulse'
          : 'hover:bg-primary/10'
      }`}
    >
      {number}
    </Button>
  );

  const OperationButton: React.FC<{ operation: string; onClick: () => void }> = ({ 
    operation: op, 
    onClick 
  }) => (
    <Button
      variant="default"
      size="lg"
      onClick={onClick}
      className={`h-14 text-lg font-semibold transition-all duration-200 hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white ${
        operation === op ? 'bg-blue-700 ring-2 ring-blue-400' : ''
      }`}
    >
      {op}
    </Button>
  );

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <Calculator className="h-5 w-5" />
          Simple Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-muted rounded-lg p-4 text-right">
          <div className="text-2xl font-mono font-bold min-h-8 break-all">
            {formatDisplayValue(display)}
          </div>
          {operation && previousValue !== null && (
            <div className="text-sm text-muted-foreground">
              {previousValue} {operation}
            </div>
          )}
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* First Row */}
          <Button
            variant="destructive"
            size="lg"
            onClick={clear}
            className="h-14 text-sm font-semibold transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={clearEntry}
            className="h-14 text-sm font-semibold transition-all duration-200 hover:scale-105"
          >
            CE
          </Button>
          <div></div>
          <OperationButton operation="÷" onClick={() => inputOperation('÷')} />

          {/* Second Row */}
          <NumberButton number="7" />
          <NumberButton number="8" />
          <NumberButton number="9" />
          <OperationButton operation="×" onClick={() => inputOperation('×')} />

          {/* Third Row */}
          <NumberButton number="4" />
          <NumberButton number="5" />
          <NumberButton number="6" />
          <OperationButton operation="-" onClick={() => inputOperation('-')} />

          {/* Fourth Row */}
          <NumberButton number="1" />
          <NumberButton number="2" />
          <NumberButton number="3" />
          <OperationButton operation="+" onClick={() => inputOperation('+')} />

          {/* Fifth Row */}
          <NumberButton number="0" />
          <Button
            variant="outline"
            size="lg"
            onClick={inputDecimal}
            className="h-14 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:bg-primary/10"
          >
            .
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={performCalculation}
            className="col-span-2 h-14 text-lg font-semibold transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700 text-white"
          >
            =
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};