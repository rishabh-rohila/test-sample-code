//  Calculate the extracted value
  const handleCalculateClick = () => {
    const extractedValues = extractValues(text);
    const calculationResult = evaluateExpression(extractedValues);
    const extractedValuesText = `Extracted Values: ${extractedValues.join(' ')}`;
    const calculationResultText = `Result: ${calculationResult}`;
    setText(`${extractedValuesText}\n${calculationResultText}`);
  };

  // evaluating the give expressing and providing correct result
const evaluateExpression = (values) => {
  try {
    // value joining without any ,
    let expression = values.join('');

    // Remove parentheses that contain an operator without an operand
    expression = expression.replace(/\([^()]*[+*/-][^()]*\)/g, '');

    // Remove empty parentheses
    expression = expression.replace(/\(\)/g, '');
    
    // Remove extra spaces between values
    expression = expression.replace(/\s+/g, '');

    // Replace vector (^) with Math.pow() for exponentiation
    expression = expression.replace(/\^/g, '**');

    // Remove parentheses at the end of the expression
    expression = expression.replace(/\(\)$/g, '');

    // Handle the case of division with a positive number following a single slash
    expression = expression.replace(/\/(?!\d)/g, '/(');
    expression = expression.replace(/\/\+/g, '/(');

    // Evaluate the expression using math.evaluate() from math.js
    const result = evaluate(expression);

    // Round the result to 2 decimal places if it's a decimal number
    if (Number.isFinite(result) && !Number.isInteger(result)) {
      return result.toFixed(2);
    }

    return result.toString();
  } catch (error) {
    return 'Invalid expression';
  }
};
