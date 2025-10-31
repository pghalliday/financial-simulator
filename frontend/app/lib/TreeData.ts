import type {KeysOfType} from "~/lib/types";

export interface TreeNodeFields<Node> {
    id: KeysOfType<Node, string>
    parentId: KeysOfType<Node, string | null>
    children: KeysOfType<Node, Node[]>
    label: KeysOfType<Node, string>
}

export class TreeData<Node extends {}> {
    private readonly index: Record<string, number[]>

    constructor(
        readonly nodes: Node[],
        private readonly fields: TreeNodeFields<Node>,
    ) {
        this.index = {}
        this.fillIndex(this.index, [], nodes)
    }

    getId(node: Node): string {
        return node[this.fields.id] as string
    }

    getIdFromPath(path: Node[]): string | null {
        if (path.length === 0) return null
        return path[path.length - 1][this.fields.id] as string
    }

    getParentId(node: Node): string | null {
        return node[this.fields.parentId] as string | null
    }

    getParentIdFromPath(path: Node[]): string | null {
        if (path.length === 0) throw new Error("Must have a node to get a parent ID")
        return path[path.length - 1][this.fields.parentId] as string | null
    }

    getChildren(node: Node): Node[] {
        return node[this.fields.children] as Node[]
    }

    getChildrenFromPath(path: Node[]): Node[] {
        if (path.length === 0) return this.nodes
        return path[path.length - 1][this.fields.children] as Node[]
    }

    getLabel(node: Node): string {
        return node[this.fields.label] as string
    }

    getPath(id: string | null): Node[] {
        if (id === null) return []
        let indices = this.index[id]
        if (indices === undefined) {
            // Maybe we're still loading data
            return []
        }
        if (indices.length === 0) {
            throw new Error(`Corrupt index: index entries should not be empty: "${id}"`)
        }
        let nodes = this.nodes
        const path: Node[] = []
        while (indices.length > 0) {
            const node = nodes[indices[0]]
            if (node === undefined) {
                throw new Error(`Corrupt index: no node found: "${id}"`)
            }
            indices = indices.slice(1)
            nodes = this.getChildren(node)
            path.push(node)
        }
        if (this.getIdFromPath(path) !== id) {
            throw new Error(`Corrupt index: found node with incorrect id while looking for: "${id}": "${this.getIdFromPath(path)}"`)
        }
        return path
    }

    newTreeDataWith(node: Node): TreeData<Node> {
        const parentId = this.getParentId(node)
        const parentIndices = parentId === null ? [] : this.index[parentId]
        if (parentIndices === undefined) {
            throw new Error(`Unknown parent id: "${parentId}"`)
        }
        return new TreeData<Node>(
            this.nodesWith(this.nodes, parentIndices, node),
            this.fields,
        )
    }

    newTreeDataWithout(node: Node): TreeData<Node> {
        const id = this.getId(node)
        const indices = this.index[id] || []
        return new TreeData<Node>(
            this.nodesWithout(this.nodes, indices, id),
            this.fields,
        )
    }

    private fillIndex(
        index: Record<string, number[]>,
        parentPath: number[],
        nodes: Node[],
    ) {
        for (const [idx, node] of nodes.entries()) {
            const path = parentPath.concat(idx)
            index[this.getId(node)] = path
            this.fillIndex(index, path, this.getChildren(node))
        }
    }

    private nodesWith(nodes: Node[], parentIndices: number[], node: Node): Node[] {
        if (parentIndices.length > 0) {
            const currentIndex = parentIndices[0]
            const currentAncestor = nodes[currentIndex]
            if (currentAncestor === undefined) {
                throw new Error(`Corrupt index: no parent found: "${currentIndex}"`)
            }
            return [
                ...nodes.slice(0, currentIndex),
                {
                    ...currentAncestor,
                    [this.fields.children]: this.nodesWith(
                        this.getChildren(currentAncestor),
                        parentIndices.slice(1),
                        node
                    )
                },
                ...nodes.slice(currentIndex + 1),
            ]
        }
        return nodes.concat(node)
    }

    private nodesWithout(nodes: Node[], indices: number[], id: string): Node[] {
        if (indices.length > 0) {
            const currentIndex = indices[0]
            if (indices.length === 1) {
                return [
                    ...nodes.slice(0, currentIndex),
                    ...nodes.slice(currentIndex + 1),
                ]
            }
            const currentAncestor = nodes[currentIndex]
            if (currentAncestor === undefined) {
                throw new Error(`Corrupt index: no node found: "${id}"`)
            }
            return [
                ...nodes.slice(0, currentIndex),
                {
                    ...currentAncestor,
                    [this.fields.children]: this.nodesWithout(
                        this.getChildren(currentAncestor),
                        indices.slice(1),
                        id
                    )
                },
                ...nodes.slice(currentIndex + 1),
            ]
        }
        throw new Error(`Unknown node: "${id}"`)
    }
}
