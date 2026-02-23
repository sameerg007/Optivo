import React, { useState } from 'react';
import { mockGroups, mockMembers, simplifyDebts } from '@/dummyfolder/splitwiseMockData';

export default function GroupedExpense() {
  const [groups, setGroups] = useState([...mockGroups]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.groupId || '');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: '', splitWith: [] });

  const selectedGroup = groups.find(g => g.groupId === selectedGroupId);

  // Add new group
  const handleAddGroup = () => {
    if (!newGroupName || newGroupMembers.length === 0) return;
    const groupId = 'g' + (groups.length + 1);
    setGroups([...groups, { groupId, groupName: newGroupName, members: newGroupMembers, expenses: [] }]);
    setNewGroupName('');
    setNewGroupMembers([]);
    setSelectedGroupId(groupId);
  };

  // Add expense to selected group
  const handleAddExpense = () => {
    if (!selectedGroup || !newExpense.description || !newExpense.amount || !newExpense.paidBy || newExpense.splitWith.length === 0) return;
    const updatedGroups = groups.map(g =>
      g.groupId === selectedGroupId
        ? { ...g, expenses: [...g.expenses, { ...newExpense, amount: parseFloat(newExpense.amount) }] }
        : g
    );
    setGroups(updatedGroups);
    setNewExpense({ description: '', amount: '', paidBy: '', splitWith: [] });
  };

  // Debts for selected group
  const settlements = selectedGroup ? simplifyDebts(selectedGroup.expenses, selectedGroup.members) : [];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Group Expense (Splitwise Logic)</h2>
      <div style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h3>Create Group</h3>
        <input
          placeholder="Group Name"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <span>Add Members: </span>
        {mockMembers.map(m => (
          <label key={m} style={{ marginRight: 4 }}>
            <input
              type="checkbox"
              checked={newGroupMembers.includes(m)}
              onChange={e => {
                if (e.target.checked) {
                  setNewGroupMembers([...newGroupMembers, m]);
                } else {
                  setNewGroupMembers(newGroupMembers.filter(x => x !== m));
                }
              }}
            />
            {m}
          </label>
        ))}
        <button onClick={handleAddGroup} style={{ marginLeft: 8 }}>Create Group</button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Select Group</h3>
        <select value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}>
          {groups.map(g => (
            <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
          ))}
        </select>
      </div>
      {selectedGroup && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <h3>Add Expense to {selectedGroup.groupName}</h3>
            <input
              placeholder="Description"
              value={newExpense.description}
              onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
              style={{ marginRight: 8 }}
            />
            <input
              placeholder="Amount"
              type="number"
              value={newExpense.amount}
              onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
              style={{ marginRight: 8 }}
            />
            <select
              value={newExpense.paidBy}
              onChange={e => setNewExpense({ ...newExpense, paidBy: e.target.value })}
              style={{ marginRight: 8 }}
            >
              <option value="">Paid By</option>
              {selectedGroup.members.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <span>Split With: </span>
            {selectedGroup.members.map(m => (
              <label key={m} style={{ marginRight: 4 }}>
                <input
                  type="checkbox"
                  checked={newExpense.splitWith.includes(m)}
                  onChange={e => {
                    if (e.target.checked) {
                      setNewExpense({ ...newExpense, splitWith: [...newExpense.splitWith, m] });
                    } else {
                      setNewExpense({ ...newExpense, splitWith: newExpense.splitWith.filter(x => x !== m) });
                    }
                  }}
                />
                {m}
              </label>
            ))}
            <button onClick={handleAddExpense} style={{ marginLeft: 8 }}>Add Expense</button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <h3>Expenses in {selectedGroup.groupName}</h3>
            <ul>
              {selectedGroup.expenses.map((exp, idx) => (
                <li key={idx}>
                  {exp.description} - ₹{exp.amount} paid by {exp.paidBy}, split with {exp.splitWith.join(', ')}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Simplified Debts</h3>
            <ul>
              {settlements.length === 0 && <li>No debts to settle.</li>}
              {settlements.map((s, idx) => (
                <li key={idx}>
                  {s.from} pays {s.to} ₹{s.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
