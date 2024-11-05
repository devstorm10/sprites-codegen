// TODO(adam): move this to a shared package, so it can be used by both the frontend and backend.

/**
 * ConditionContext is designed for contexts that involve logical conditions,
 * specifying the logical operator used to combine multiple conditions
 */
export interface ConditionOperatorContext {
  type: 'condition_operator' // Context type specifier for conditions

  value: 'AND' | 'OR'
}

/**
 * Variable represents an end user defined variable within the Sprites Web App or API.
 * We are intentionally not including values here, given we just need a way to save names/types to power Web App.
 * TODO(adam): The values will be stored in Redis and/or Postgres.
 */
export interface Variable {
  name: string // case-sensitive, to preserve user-defined variable names
  type: 'string' | 'number' // string/number are the only known types for now
  defaultValue?: string // coerced into the defined type
}

/**
 * BaseContext serves as the foundation for all context types within an agent,
 * defining common properties shared across different context types.
 */
export interface BaseContext {
  id: string // Unique identifier for the context
  name?: string // Optional name for the context
  type:
    | 'condition_operator' // AND/OR logic
    | 'condition_variable' // Trigger, IF/Then, etc.
    | 'flow'
    | 'flow_edge'
    | 'flow_node'
    | 'flow_post'
    | 'flow_pre'
    | 'memory_agent' // post-dialog node
    | 'memory_user' // pre-dialog node
    | 'tag'
    | 'text_prompt'
}

/**
 * TextPromptContext is specialized for contexts that involve textual content,
 * extending BaseContext with specific properties for handling text.
 */
export interface TextPromptContext extends BaseContext {
  type: 'text_prompt' // Context type specifier for text prompts

  content: string // The textual content associated with this context
}

/**
 * ConditionVariableContext is designed for contexts that involve variables,
 * including their names, values, and comparison operators.
 */
export interface ConditionVariableContext extends BaseContext {
  type: 'condition_variable' // Context type specifier for variables

  name: string // The name of the variable
  value: string // The value of the variable
  opt: '==' | '!=' | '>=' | '<=' | '>' | '<' // The comparison operator for the variable
}

/**
 * NodeContext is tailored for representing nodes within a flow,
 * including their position, type, and associated items.
 *
 * This is a renderable, click/draggable component
 */
export interface NodeContext extends BaseContext {
  type: 'flow_node' // Context type specifier for flow nodes

  // node specific properties
  nodeType: 'additional_prompt' | 'insert_line' | 'trigger' | 'action_variable'

  // UI specific properties
  x: number // X-coordinate position of the node
  y: number // Y-coordinate position of the node
}

/**
 * Update a variable's value, per the provided prompt inference
 */
export interface ActionVariableNodeContext extends NodeContext {
  nodeType: 'action_variable'

  variable: Variable
  inference: TextPromptContext
}

/**
 * Pre-pend prompt before LLM execution
 */
export interface AdditionalPromptNodeContext extends NodeContext {
  nodeType: 'additional_prompt'

  items: (FlowContext | TextPromptContext)[]
}

/**
 * Node representing, IF/Then statements
 */
export interface TriggerNodeContext extends NodeContext {
  nodeType: 'trigger'

  // NOTE: Combines with ConditionVariableContext and TextPromptContext, to be executed in order
  // e.g.
  // - [ConditionVariableContext, AND, ConditionVariableContext, OR, TextPromptContext]
  // - [ConditionVariableContext]
  // TODO(adam): validate the conditional ordering in the backend before persisting
  items: (
    | ConditionOperatorContext
    | ConditionVariableContext
    | TextPromptContext
  )[]
}

/**
 * Node representing the terminal response to the user of some verbatim copy (including variables).
 */
export interface InsertLineNodeContext extends NodeContext {
  nodeType: 'insert_line'

  // NOTE: we can create a new InsertLineTextContext as more fields are needed here.
  items: TextPromptContext[]
}

/**
 * EdgeContext defines the connections between nodes in a flow,
 * specifying the source and target nodes via their handler IDs.
 */
export interface EdgeContext extends BaseContext {
  type: 'flow_edge' // Context type specifier for flow edges

  sourceHandlerId: string // The ID of the source node handler
  targetHandlerId: string // The ID of the target node handler
}

/**
 * FlowContext is used for contexts that represent a flow,
 * encompassing a collection of nodes and edges that define the flow's structure.
 */
export interface FlowContext extends BaseContext {
  // Context type specifier for flows
  type: 'flow'

  nodes: (
    | ActionVariableNodeContext
    | AdditionalPromptNodeContext
    | InsertLineNodeContext
    | TriggerNodeContext
  )[]
  edges: EdgeContext[] // An array of edges connecting the nodes
}

export interface PreFlowContext extends BaseContext {
  type: 'flow_pre'

  nodes: (ActionVariableNodeContext | MemoryUserContext | TriggerNodeContext)[]
  edges: EdgeContext[] // An array of edges connecting the nodes
}

export interface PostFlowContext extends BaseContext {
  type: 'flow_post'

  nodes: (ActionVariableNodeContext | MemoryAgentContext | TriggerNodeContext)[]
  edges: EdgeContext[] // An array of edges connecting the nodes
}

/**
 * Pre-dialog step to signal saving the users memory
 */
export interface MemoryUserContext extends BaseContext {
  type: 'memory_user'
}

/**
 * Post-dialog step to signal saving the agent's memory
 */
export interface MemoryAgentContext extends BaseContext {
  type: 'memory_agent'
}

/**
 * TagContext is intended for contexts that involve tagging,
 * allowing for hierarchical organization by nesting contexts.
 */
export interface TagContext extends BaseContext {
  type: 'tag' // Context type specifier for tags

  items: (TextPromptContext | FlowContext)[] // contexts associated with the tag, allowing for nested structures
}

/**
 * The Agent interface represents an entity within the system,
 * identified by a unique ID and name, and associated with various contexts.
 */
export interface Agent {
  id: string // Unique identifier for the agent
  name: string // Name of the agent
  variables: Record<string, Variable>

  preContexts: PreFlowContext[]
  mainContexts: (FlowContext | TagContext | TextPromptContext)[] // An array of contexts associated with the agent, defining its capabilities and characteristics
  postContexts: PostFlowContext[]
}

////////////////////////////////////////////////////////////////////////////////////////////////
// TODO(adam): replace these with JSON unit tests, to make sure we dont break the schema.
// EXAMPLES agent schema context. Not 100% correct, just for testing types/structure.

let variableActionNodeContext: ActionVariableNodeContext = {
  id: '1',
  type: 'flow_node',
  nodeType: 'action_variable',

  x: 0,
  y: 0,
  variable: {
    name: 'foo',
    type: 'string',
  },

  inference: {
    id: '2',
    type: 'text_prompt',
    content: 'What is the value of foo?',
  },
}

let insertLineNodeContext: InsertLineNodeContext = {
  id: '3',
  type: 'flow_node',
  nodeType: 'insert_line',

  x: 0,
  y: 0,

  items: [
    {
      id: '4',
      type: 'text_prompt',
      content: 'The value of foo is: ',
    },
    {
      id: '5',
      type: 'text_prompt',
      content: 'bar {{test}}',
    },
  ],
}

// TS6133: 'agent' is declared but its value is never read.
// @ts-expect-error TS6133
let agent: Agent = {
  id: '6',
  name: 'test',

  variables: {
    foo: {
      name: 'foo',
      type: 'string',
    },
  },

  preContexts: [
    {
      id: '8',
      type: 'flow_pre',
      nodes: [
        {
          id: '9',
          type: 'memory_user',
        },
      ],
      edges: [],
    },
  ],
  mainContexts: [
    {
      id: '7',
      type: 'flow',
      nodes: [variableActionNodeContext, insertLineNodeContext],
      edges: [
        {
          id: '11',
          type: 'flow_edge',
          sourceHandlerId: '1',
          targetHandlerId: '3',
        },
      ],
    },
  ],
  postContexts: [
    {
      id: '12',
      type: 'flow_post',
      nodes: [
        {
          id: '13',
          type: 'memory_agent',
        },
      ],
      edges: [],
    },
  ],
}
