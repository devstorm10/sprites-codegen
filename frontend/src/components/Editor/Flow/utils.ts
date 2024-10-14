import ELK, { ElkNode, LayoutOptions } from 'elkjs'
import { Node, Edge, MarkerType } from 'reactflow'
import { LayoutedGraph } from './types'

const elk = new ELK()

export const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): Promise<LayoutedGraph> => {
  const isHorizontal = options['elk.direction'] === 'RIGHT'
  const graph: ElkNode = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      width: 150,
      height: 50,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
      animated: edge.animated,
    })),
  }

  const layoutedGraph = await elk.layout(graph)
  return {
    nodes: layoutedGraph.children?.map((node) => ({
      ...node,
      position: { x: node.x, y: node.y },
    })) as Node[],
    edges: layoutedGraph.edges?.map((edge) => ({
      id: edge.id,
      source: edge.sources[0],
      target: edge.targets[0],
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#FF0072',
      },
      style: {
        strokeWidth: 2,
        stroke: '#FF0072',
      },
    })) as Edge[],
  }
}
