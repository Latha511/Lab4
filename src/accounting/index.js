const readlineSync = require('readline-sync');

class DataProgram {
  constructor() {
    this.storageBalance = 1000.0;
  }

  execute(operationType, balance) {
    if (operationType === 'READ') {
      return this.storageBalance;
    }

    if (operationType === 'WRITE') {
      this.storageBalance = balance;
      return this.storageBalance;
    }

    return balance;
  }
}

class Operations {
  constructor(dataProgram, io) {
    this.dataProgram = dataProgram;
    this.io = io;
    this.finalBalance = 1000.0;
  }

  execute(passedOperation) {
    const operationType = passedOperation;

    if (operationType === 'TOTAL ') {
      this.finalBalance = this.dataProgram.execute('READ', this.finalBalance);
      this.io.log(`Current balance: ${formatBalance(this.finalBalance)}`);
      return;
    }

    if (operationType === 'CREDIT') {
      this.io.log('Enter credit amount: ');
      const amount = readAmount(this.io.question);
      this.finalBalance = this.dataProgram.execute('READ', this.finalBalance);
      this.finalBalance += amount;
      this.dataProgram.execute('WRITE', this.finalBalance);
      this.io.log(`Amount credited. New balance: ${formatBalance(this.finalBalance)}`);
      return;
    }

    if (operationType === 'DEBIT ') {
      this.io.log('Enter debit amount: ');
      const amount = readAmount(this.io.question);
      this.finalBalance = this.dataProgram.execute('READ', this.finalBalance);

      if (this.finalBalance >= amount) {
        this.finalBalance -= amount;
        this.dataProgram.execute('WRITE', this.finalBalance);
        this.io.log(`Amount debited. New balance: ${formatBalance(this.finalBalance)}`);
      } else {
        this.io.log('Insufficient funds for this debit.');
      }
    }
  }
}

function formatBalance(balance) {
  return balance.toLocaleString('en-US', {
    minimumIntegerDigits: 6,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}

function readAmount(questionFn) {
  const raw = questionFn('');
  const amount = Number.parseFloat(raw);

  if (Number.isNaN(amount)) {
    return 0;
  }

  return amount;
}

function runAccountManagement() {
  const io = {
    question: readlineSync.question,
    log: console.log,
  };

  return runAccountManagementWithIO(io);
}

function runAccountManagementWithIO(io) {
  let continueFlag = 'YES';
  const operations = new Operations(new DataProgram(), io);

  while (continueFlag !== 'NO') {
    io.log('--------------------------------');
    io.log('Account Management System');
    io.log('1. View Balance');
    io.log('2. Credit Account');
    io.log('3. Debit Account');
    io.log('4. Exit');
    io.log('--------------------------------');
    io.log('Enter your choice (1-4): ');

    const userChoiceRaw = io.question('');
    const userChoice = Number.parseInt(userChoiceRaw, 10);

    switch (userChoice) {
      case 1:
        operations.execute('TOTAL ');
        break;
      case 2:
        operations.execute('CREDIT');
        break;
      case 3:
        operations.execute('DEBIT ');
        break;
      case 4:
        continueFlag = 'NO';
        break;
      default:
        io.log('Invalid choice, please select 1-4.');
        break;
    }
  }

  io.log('Exiting the program. Goodbye!');
}

if (require.main === module) {
  runAccountManagement();
}

module.exports = {
  DataProgram,
  Operations,
  formatBalance,
  readAmount,
  runAccountManagement,
  runAccountManagementWithIO,
};
