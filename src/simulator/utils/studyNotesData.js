export const HIGH_QUALITY_NOTE_1 = `# Execution Context & Call Stack Architecture

JavaScript evaluates all runtime code inside an **Execution Context**. The browser engine coordinates synchronous function evaluations and asynchronous microtasks using a single-threaded **Call Stack** operating on strict LIFO (Last-In, First-Out) order.

## 1. Anatomy of an Execution Context

Whenever code runs, the V8 engine constructs an environment containing two fundamental components:

- **Memory Component (Variable Environment):** Stores declared variables and functions as key-value pairs before execution begins.
- **Code Component (Thread of Execution):** Executes source code sequentially, one line at a time.

\`\`\`
+-------------------------------------------------------------+
|                     EXECUTION CONTEXT                       |
|  +-----------------------------+-------------------------+  |
|  |     MEMORY COMPONENT        |     CODE COMPONENT      |  |
|  |     (Variable Object)       |  (Thread of Execution)  |  |
|  |                             |                         |  |
|  |  Variables  -> undefined    |  Line-by-line runtime   |  |
|  |  Functions  -> {...code}    |  evaluations, mutations |  |
|  |  this       -> window       |  and stack push/pops    |  |
|  +-----------------------------+-------------------------+  |
+-------------------------------------------------------------+
\`\`\`

## 2. The Two-Phase Execution Lifecycle

JavaScript does not execute code in a single linear pass. Every context transitions through two rigorous phases:

### Phase 1: Creation Phase (Memory Allocation)
- **Global Object Creation:** The engine instantiates \`window\` (browsers) or \`global\` (Node.js).
- **\`this\` Binding:** In the global context, \`this\` references the global object.
- **Hoisting Allocations:**
  - \`var\` declarations are assigned memory and initialized to \`undefined\`.
  - Function declarations are parsed and stored with their entire executable function body.
  - \`let\` and \`const\` are reserved in memory but flagged uninitialized in the **Temporal Dead Zone (TDZ)**.

### Phase 2: Execution Phase (Code Evaluation)
- The engine steps through instructions line-by-line.
- Variables are populated with their actual evaluated values.
- Function invocations \`()\` create brand new **Function Execution Contexts (FEC)** pushed onto the Call Stack.

| Declaration | Hoisting Allocation | Initial Value | Access Before Line |
| :--- | :--- | :--- | :--- |
| **var** | Enclosing Function/Global | \`undefined\` | Returns \`undefined\` |
| **let / const** | Block Scope in TDZ | *Uninitialized* | Throws \`ReferenceError\` |
| **function foo()** | Enclosing Scope | Function Object | Executes successfully |
| **const foo = () =>** | Block Scope in TDZ | *Uninitialized* | Throws \`ReferenceError\` |

## 3. Practical Code Simulation

\`\`\`javascript
// Global Execution Context (GEC) Created
const applicationName = "Kaevrix Runtime Virtualization";

function calculateBonus(baseRate, multiplier) {
  // Functional Execution Context 2: calculateBonus
  const taxFactor = 0.12;
  const netBonus = (baseRate * multiplier) * (1 - taxFactor);
  return netBonus;
}

function processPlayerTier(playerId, rankScore) {
  // Functional Execution Context 1: processPlayerTier
  const baseRate = 1250;
  const bonusMultiplier = rankScore > 2000 ? 1.5 : 1.1;
  
  // Call stack frame pushed for calculateBonus()
  const finalReward = calculateBonus(baseRate, bonusMultiplier);
  
  return {
    id: playerId,
    reward: finalReward,
    engine: applicationName
  };
}

// Global invocation pushes processPlayerTier() onto Call Stack
const session = processPlayerTier("TuringScholar", 2450);
console.log(\`Player Reward: \${session.reward} XP\`);
\`\`\`

## 4. Call Stack Lifecycle Step-by-Step

Understanding how frames enter and exit the stack prevents catastrophic stack overflow crashes:

- **Frame 0 (Base):** \`GlobalExecutionContext\` is placed onto the bottom of the Call Stack upon initialization.
- **Frame 1 (Push):** \`processPlayerTier("TuringScholar", 2450)\` is invoked. Its FEC is allocated and pushed to the top of the stack.
- **Frame 2 (Push):** Inside \`processPlayerTier\`, \`calculateBonus(1250, 1.5)\` is called. The engine pauses the caller frame and pushes \`calculateBonus\` to the top.
- **Frame 2 (Pop):** \`calculateBonus\` returns \`1650\`. Its stack frame is popped off and freed.
- **Frame 1 (Pop):** \`processPlayerTier\` builds the return object and terminates. Its frame is popped.
- **Frame 0 (Idle):** Execution returns to the Global Context and monitors the event loop microtask queue.

## 5. Architectural Guardrails & Common Pitfalls

- **Stack Overflow:** The Call Stack has finite allocated memory (~10,000 frames in Chromium V8). Unbounded recursion lacking an exit condition triggers: \`RangeError: Maximum call stack size exceeded\`.
- **Temporal Dead Zone (TDZ):** Always declare variables at the top of their enclosing scope. Never access \`let\` or \`const\` variables before their declaration line.
- **Lexical vs Dynamic Scope:** JavaScript evaluates variable lookups lexically based on where functions were written in code, never where they are executed.
- **Memory Retention:** Keep closure references scoped minimally so obsolete parent scope objects can be safely garbage-collected.`;

export const HIGH_QUALITY_NOTE_2 = `# Closures & Lexical Memory Architecture

A **closure** is the combination of a function bundled together with references to its surrounding lexical environment. Closures permit inner functions to access outer variables even after the outer function has finished executing.

## 1. How Closures Operate in Heap Memory

In classical stack-based languages, all local variables are erased once a stack frame returns. In JavaScript:

- When an outer function executes, its variable bindings live within a **Lexical Environment**.
- If a returned inner function retains a reference to an outer variable, the engine preserves that environment on the **Heap**.
- The parent scope cannot be collected by Mark-and-Sweep garbage collection while the inner function reference is reachable.

## 2. Practical Pattern: Encapsulated State Vault

\`\`\`javascript
function createSecureVault(initialBalance = 1000) {
  // Encapsulated private state - inaccessible from global scope
  let balance = initialBalance;
  let transactionCount = 0;

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Invalid deposit amount");
      balance += amount;
      transactionCount += 1;
      return { balance, transactionCount };
    },
    getBalance() {
      return balance;
    }
  };
}

const userVault = createSecureVault(500);
userVault.deposit(250); // { balance: 750, transactionCount: 1 }
\`\`\`

## 3. Best Practices & Memory Guardrails

- **Dangling Event Listeners:** Always detach event handlers upon component unmount (\`removeEventListener\`), or the enclosed outer scope will remain retained indefinitely in heap memory.
- **State Encapsulation:** Leverage closures for memoization caches, factories, and module singletons without polluting global state.
- **V8 Allocation Profiling:** In Chrome DevTools, inspect the **Memory** tab heap snapshot under \`(closure)\` constructor trees to identify non-garbage-collected retaining paths.`;
