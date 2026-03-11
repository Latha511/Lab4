const { runAccountManagementWithIO } = require('./index');

function runScenario(inputs) {
  const queue = [...inputs];
  const output = [];

  const io = {
    question: () => {
      if (queue.length === 0) {
        throw new Error('Input queue exhausted');
      }

      return String(queue.shift());
    },
    log: (message) => output.push(String(message)),
  };

  runAccountManagementWithIO(io);
  return output;
}

function countMenuHeaders(output) {
  return output.filter((line) => line === 'Account Management System').length;
}

describe('COBOL parity test plan scenarios', () => {
  test('TC-001: app starts and displays menu options', () => {
    const output = runScenario(['4']);

    expect(output).toContain('Account Management System');
    expect(output).toContain('1. View Balance');
    expect(output).toContain('2. Credit Account');
    expect(output).toContain('3. Debit Account');
    expect(output).toContain('4. Exit');
  });

  test('TC-002: exit flow from main menu', () => {
    const output = runScenario(['4']);
    expect(output[output.length - 1]).toBe('Exiting the program. Goodbye!');
  });

  test('TC-003: invalid menu choice handling', () => {
    const output = runScenario(['9', '4']);

    expect(output).toContain('Invalid choice, please select 1-4.');
    expect(countMenuHeaders(output)).toBe(2);
  });

  test('TC-004: view balance at initial state', () => {
    const output = runScenario(['1', '4']);
    expect(output).toContain('Current balance: 001000.00');
  });

  test('TC-005: credit account with valid amount', () => {
    const output = runScenario(['2', '100.00', '1', '4']);

    expect(output).toContain('Amount credited. New balance: 001100.00');
    expect(output).toContain('Current balance: 001100.00');
  });

  test('TC-006: debit account with sufficient funds', () => {
    const output = runScenario(['3', '100.00', '1', '4']);

    expect(output).toContain('Amount debited. New balance: 000900.00');
    expect(output).toContain('Current balance: 000900.00');
  });

  test('TC-007: debit account with insufficient funds', () => {
    const output = runScenario(['3', '1000.01', '1', '4']);

    expect(output).toContain('Insufficient funds for this debit.');
    expect(output).toContain('Current balance: 001000.00');
  });

  test('TC-008: operations persist within one runtime session', () => {
    const output = runScenario(['2', '250.00', '3', '50.00', '1', '4']);
    expect(output).toContain('Current balance: 001200.00');
  });

  test('TC-009: balance resets on new app run', () => {
    const firstRun = runScenario(['2', '100.00', '4']);
    const secondRun = runScenario(['1', '4']);

    expect(firstRun).toContain('Amount credited. New balance: 001100.00');
    expect(secondRun).toContain('Current balance: 001000.00');
  });

  test('TC-010: credit with zero amount', () => {
    const output = runScenario(['2', '0.00', '1', '4']);
    expect(output).toContain('Current balance: 001000.00');
  });

  test('TC-011: debit with zero amount', () => {
    const output = runScenario(['3', '0.00', '1', '4']);

    expect(output).toContain('Amount debited. New balance: 001000.00');
    expect(output).toContain('Current balance: 001000.00');
  });

  test('TC-012: credit with negative amount', () => {
    const output = runScenario(['2', '-100.00', '1', '4']);
    expect(output).toContain('Current balance: 000900.00');
  });

  test('TC-013: debit with negative amount', () => {
    const output = runScenario(['3', '-100.00', '1', '4']);
    expect(output).toContain('Current balance: 001100.00');
  });

  test('TC-014: numeric precision with two decimal places', () => {
    const output = runScenario(['2', '0.25', '3', '0.10', '1', '4']);
    expect(output).toContain('Current balance: 001000.15');
  });

  test('TC-015: maximum integer digits amount', () => {
    const output = runScenario(['2', '999999.99', '1', '4']);
    expect(output).toContain('Current balance: 1000999.99');
  });

  test('TC-016: non-numeric amount entry handling', () => {
    const output = runScenario(['2', 'ABC', '1', '4']);

    expect(output).toContain('Amount credited. New balance: 001000.00');
    expect(output).toContain('Current balance: 001000.00');
    expect(output[output.length - 1]).toBe('Exiting the program. Goodbye!');
  });
});
