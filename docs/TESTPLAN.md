# COBOL Student Account Test Plan

This test plan validates the current business logic and implementation behavior of the COBOL application so stakeholders can confirm expected behavior before and during Node.js migration.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Application starts and displays menu options | Application is compiled into accountsystem executable | 1. Run ./accountsystem<br>2. Observe startup screen | Menu is displayed with options 1 View Balance, 2 Credit Account, 3 Debit Account, 4 Exit | TBD | TBD | Validates entry point and user prompt |
| TC-002 | Exit flow from main menu | App is running at menu prompt | 1. Enter 4 | Program sets continue flag to NO and prints exit message Goodbye | TBD | TBD | Confirms termination path in main loop |
| TC-003 | Invalid menu choice handling | App is running at menu prompt | 1. Enter 9<br>2. Observe message<br>3. Enter 4 to exit | Invalid choice message is shown and app continues showing menu until user exits | TBD | TBD | Verifies WHEN OTHER branch |
| TC-004 | View balance at initial state | Fresh app run, no prior credit or debit in same run | 1. Start app<br>2. Enter 1<br>3. Enter 4 to exit | Current balance shown as 001000.00 (or equivalent formatted 1000.00) | TBD | TBD | Confirms initial in-memory balance from data layer |
| TC-005 | Credit account with valid amount | App running, starting balance 1000.00 | 1. Enter 2<br>2. Enter 100.00<br>3. Enter 1 to view balance<br>4. Enter 4 to exit | Credit success message shown and viewed balance becomes 001100.00 | TBD | TBD | Verifies read-add-write flow |
| TC-006 | Debit account with sufficient funds | App running, starting balance 1000.00 | 1. Enter 3<br>2. Enter 100.00<br>3. Enter 1 to view balance<br>4. Enter 4 to exit | Debit success message shown and viewed balance becomes 000900.00 | TBD | TBD | Verifies read-check-subtract-write flow |
| TC-007 | Debit account with insufficient funds | App running, starting balance 1000.00 | 1. Enter 3<br>2. Enter 1000.01<br>3. Enter 1 to view balance<br>4. Enter 4 to exit | Insufficient funds message shown and balance remains unchanged at 001000.00 | TBD | TBD | Core business rule: no overdraft |
| TC-008 | Multiple operations persist within one runtime session | App running, starting balance 1000.00 | 1. Enter 2 and credit 250.00<br>2. Enter 3 and debit 50.00<br>3. Enter 1 to view balance<br>4. Enter 4 to exit | Final balance in same run is 001200.00 | TBD | TBD | Confirms DataProgram WRITE then READ consistency |
| TC-009 | Balance resets on new app run (runtime-only persistence) | Complete one run with balance modified, then start app again | 1. Run app and credit 100.00<br>2. Exit app<br>3. Start app again<br>4. Enter 1<br>5. Enter 4 | New run starts from initial balance 001000.00 | TBD | TBD | Confirms no external persistence |
| TC-010 | Credit with zero amount | App running, starting balance 1000.00 | 1. Enter 2<br>2. Enter 0.00<br>3. Enter 1<br>4. Enter 4 | Credit path executes and balance remains 001000.00 | TBD | TBD | Documents current implementation behavior (no input validation) |
| TC-011 | Debit with zero amount | App running, starting balance 1000.00 | 1. Enter 3<br>2. Enter 0.00<br>3. Enter 1<br>4. Enter 4 | Debit path executes as sufficient funds, and balance remains 001000.00 | TBD | TBD | Documents current implementation behavior (no input validation) |
| TC-012 | Credit with negative amount is accepted by implementation | App running, starting balance 1000.00 | 1. Enter 2<br>2. Enter -100.00 (if runtime accepts signed numeric input)<br>3. Enter 1<br>4. Enter 4 | If accepted, credit operation decreases balance to 000900.00 due to ADD negative value | TBD | TBD | Important migration rule: undefined policy, currently implementation-dependent |
| TC-013 | Debit with negative amount is accepted by implementation | App running, starting balance 1000.00 | 1. Enter 3<br>2. Enter -100.00 (if runtime accepts signed numeric input)<br>3. Enter 1<br>4. Enter 4 | If accepted, sufficient-funds check passes and subtracting negative amount increases balance to 001100.00 | TBD | TBD | Important migration rule: undefined policy, currently implementation-dependent |
| TC-014 | Numeric precision with two decimal places | App running, starting balance 1000.00 | 1. Enter 2 and amount 0.25<br>2. Enter 3 and amount 0.10<br>3. Enter 1<br>4. Enter 4 | Final balance shown as 001000.15 (two decimal precision retained) | TBD | TBD | Validates PIC 9(6)V99 behavior |
| TC-015 | Maximum integer digits accepted in amount field | App running | 1. Enter 2<br>2. Enter 999999.99<br>3. Observe behavior<br>4. Exit | Amount at field boundary is accepted according to PIC 9(6)V99 limits (subject to runtime display formatting) | TBD | TBD | Captures boundary behavior for Node.js validation rules |
| TC-016 | Non-numeric amount entry handling | App running at credit or debit amount prompt | 1. Enter 2<br>2. At amount prompt, type non-numeric input (example ABC)<br>3. Observe behavior and app stability | Behavior is compiler/runtime dependent; system should be observed and documented for migration baseline | TBD | TBD | Not explicitly handled in code, must be validated empirically |

## Coverage Notes

- Main menu routing logic is covered by TC-001, TC-002, TC-003.
- View, credit, and debit operation paths are covered by TC-004 through TC-008.
- Core no-overdraft rule is covered by TC-007.
- Data layer read/write and in-session persistence are covered by TC-005, TC-006, TC-008.
- Runtime-only persistence reset across executions is covered by TC-009.
- Input edge and boundary behavior in current implementation is covered by TC-010 through TC-016.
