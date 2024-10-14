export const mockData = {
  nodes: [
    { id: '__start__', type: 'schema', data: '__start__' },
    { id: '__end__', type: 'schema', data: '__end__' },
    {
      id: 'ask_question',
      type: 'runnable',
      data: {
        id: ['langchain_core', 'runnables', 'base', 'RunnableLambda'],
        name: 'generate_question',
      },
    },
    {
      id: 'answer_question',
      type: 'runnable',
      data: {
        id: ['langchain_core', 'runnables', 'base', 'RunnableLambda'],
        name: 'gen_answer',
      },
    },
    {
      id: 'answer_question_route_messages',
      type: 'runnable',
      data: {
        id: ['langchain_core', 'runnables', 'base', 'RunnableLambda'],
        name: 'route_messages',
      },
    },
  ],
  edges: [
    { source: '__start__', target: 'ask_question' },
    { source: 'ask_question', target: 'answer_question' },
    { source: 'answer_question', target: 'answer_question_route_messages' },
    {
      source: 'answer_question_route_messages',
      target: 'ask_question',
      data: 'ask_question',
    },
    {
      source: 'answer_question_route_messages',
      target: 'answer_question',
      data: 'answer_question',
    },
    {
      source: 'answer_question_route_messages',
      target: '__end__',
      data: '__end__',
    },
  ],
}

const position = { x: 0, y: 0 }

export const initialNodes = mockData.nodes.map((item) => ({
  id: item.id,
  type:
    item.id === '__start__'
      ? 'input'
      : item.id === '__end__'
        ? 'output'
        : undefined,
  data: { label: item.id },
  position,
}))

export const initialEdges = mockData.edges.map((item) => ({
  id: `${item.source}->${item.target}`,
  source: item.source,
  target: item.target,
  type: 'smoothstep',
  animated: true,
}))

// export const initialNodes = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'input' },
//     position,
//   },
//   {
//     id: '2',
//     data: { label: 'node 2' },
//     position,
//   },
//   {
//     id: '2a',
//     data: { label: 'node 2a' },
//     position,
//   },
//   {
//     id: '2b',
//     data: { label: 'node 2b' },
//     position,
//   },
//   {
//     id: '2c',
//     data: { label: 'node 2c' },
//     position,
//   },
//   {
//     id: '2d',
//     data: { label: 'node 2d' },
//     position,
//   },
//   {
//     id: '3',
//     data: { label: 'node 3' },
//     position,
//   },
//   {
//     id: '4',
//     data: { label: 'node 4' },
//     position,
//   },
//   {
//     id: '5',
//     data: { label: 'node 5' },
//     position,
//   },
//   {
//     id: '6',
//     type: 'output',
//     data: { label: 'output' },
//     position,
//   },
//   { id: '7', type: 'output', data: { label: 'output' }, position },
// ];

// export const initialEdges = [
//   { id: 'e12', source: '1', target: '2', type: 'smoothstep' },
//   { id: 'e13', source: '1', target: '3', type: 'smoothstep' },
//   { id: 'e22a', source: '2', target: '2a', type: 'smoothstep' },
//   { id: 'e22b', source: '2', target: '2b', type: 'smoothstep' },
//   { id: 'e22c', source: '2', target: '2c', type: 'smoothstep' },
//   { id: 'e2c2d', source: '2c', target: '2d', type: 'smoothstep' },
//   { id: 'e45', source: '4', target: '5', type: 'smoothstep' },
//   { id: 'e56', source: '5', target: '6', type: 'smoothstep' },
//   { id: 'e57', source: '5', target: '7', type: 'smoothstep' },
// ];
