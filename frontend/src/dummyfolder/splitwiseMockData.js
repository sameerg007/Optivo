// Mock data for Splitwise tab

export const mockMembers = [
  'Alice', 'Bob', 'Charlie', 'David'
];

export const mockGroups = [
  {
    groupId: 'g1',
    groupName: 'Roommates',
    members: ['Alice', 'Bob', 'Charlie', 'David'],
    expenses: [
      {
        description: 'Dinner',
        amount: 1200,
        paidBy: 'Alice',
        splitWith: ['Alice', 'Bob', 'Charlie']
      },
      {
        description: 'Movie',
        amount: 900,
        paidBy: 'Bob',
        splitWith: ['Bob', 'Charlie']
      },
      {
        description: 'Groceries',
        amount: 1500,
        paidBy: 'Charlie',
        splitWith: ['Alice', 'Charlie', 'David']
      }
    ]
  },
  {
    groupId: 'g2',
    groupName: 'Office Friends',
    members: ['Alice', 'Bob'],
    expenses: [
      {
        description: 'Lunch',
        amount: 500,
        paidBy: 'Bob',
        splitWith: ['Alice', 'Bob']
      }
    ]
  }
];

// Simplify debts algorithm
export function simplifyDebts(expenses, members) {
  // Calculate net balances
  const balances = {};
  members.forEach(m => { balances[m] = 0; });
  expenses.forEach(exp => {
    const splitAmount = exp.amount / exp.splitWith.length;
    exp.splitWith.forEach(member => {
      if (member !== exp.paidBy) {
        balances[member] -= splitAmount;
        balances[exp.paidBy] += splitAmount;
      }
    });
  });

  // Prepare debts
  const debtors = Object.entries(balances).filter(([_, bal]) => bal < 0).map(([m, bal]) => ({ member: m, amount: -bal }));
  const creditors = Object.entries(balances).filter(([_, bal]) => bal > 0).map(([m, bal]) => ({ member: m, amount: bal }));

  // Simplify debts
  const settlements = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settleAmount = Math.min(debtor.amount, creditor.amount);
    settlements.push({ from: debtor.member, to: creditor.member, amount: settleAmount });
    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;
    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }
  return settlements;
}
