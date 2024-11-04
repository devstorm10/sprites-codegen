/**
 * BaseContext serves as the foundation for all context types within an agent,
 * defining common properties shared across different context types.
 */
export interface BaseContext {
  id: string // Unique identifier for the context
  title?: string // Optional title for the context
  type: 'tag' | 'text' | 'flow' | 'flow_node' | 'flow_edge' | 'variable' // Specifies the type of context
}

/**
 * TextPromptContext is specialized for contexts that involve textual content,
 * extending BaseContext with specific properties for handling text.
 */
export interface TextPromptContext extends BaseContext {
  type: 'text' // Context type specifier for text prompts
  data: {
    content: string // The textual content associated with this context
  }
}

/**
 * VariableContext is designed for contexts that involve variables,
 * including their names, values, and comparison operators.
 */
export interface VariableContext extends BaseContext {
  type: 'variable' // Context type specifier for variables
  data: {
    name: string // The name of the variable
    value: string // The value of the variable
    opt: '==' | '!=' | '>=' | '<=' | '>' | '<' // The comparison operator for the variable
  }
}

/**
 * NodeContext is tailored for representing nodes within a flow,
 * including their position, type, and associated items.
 */
export interface NodeContext extends BaseContext {
  type: 'flow_node' // Context type specifier for flow nodes
  data: {
    mode: 'trigger' | 'prompt' | 'action' | 'insert_line' // The mode of the node, defining its role within the flow
    x: number // X-coordinate position of the node
    y: number // Y-coordinate position of the node
    // TODO: Need to define OR/AND relationship between Trigger/Action items (prob best to split the trigger/action nodes out into separate nodes to better define and/or VariableContexts between them)
    items: (TextPromptContext | VariableContext | FlowContext)[] // Items associated with the node, which can be various context types
  }
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
  type: 'flow' // Context type specifier for flows
  data: {
    nodes: NodeContext[] // An array of nodes within the flow
    edges: EdgeContext[] // An array of edges connecting the nodes
  }
}

/**
 * TagContext is intended for contexts that involve tagging,
 * allowing for hierarchical organization by nesting contexts.
 */
export interface TagContext extends BaseContext {
  type: 'tag' // Context type specifier for tags
  data: {
    children: (TextPromptContext | FlowContext)[] // Child contexts associated with the tag, allowing for nested structures
  }
}

export interface Variable {
  name: string // case-sensitive, to preserve user-defined variable names
  type: 'string' | 'number' // string/number are the only known types for now
  value: string // value will be cast to the type, as needed
}

/**
 * The Agent interface represents an entity within the system,
 * identified by a unique ID and name, and associated with various contexts.
 */
export interface Agent {
  id: string // Unique identifier for the agent
  name: string // Name of the agent
  variables: { [id: string]: Variable } // Where `id` is the variable name
  preContexts: FlowContext
  contexts: (TextPromptContext | FlowContext | TagContext)[] // An array of contexts associated with the agent, defining its capabilities and characteristics
  postContexts: FlowContext
}
