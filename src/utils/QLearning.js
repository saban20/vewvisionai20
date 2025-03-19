// src/utils/QLearning.js
const num_states = 10; // Mock states
const num_actions = 5; // Mock actions
const Q = Array(num_states).fill().map(() => Array(num_actions).fill(0));

const updateQTable = (state, action, reward) => {
  const learning_rate = 0.1;
  const gamma = 0.9;
  Q[state][action] += learning_rate * (reward + gamma * Math.max(...Q[state]) - Q[state][action]);
  console.log('Q-table updated:', Q);
};

export default { updateQTable }; 