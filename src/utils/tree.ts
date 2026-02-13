import { chain } from "ramda";

/**
 * Flattens a recursive tree structure into a single-level array.
 * Uses strict ordering: Parent -> Children (recursive).
 *
 * @template T - The node type, must include an optional `children` array.
 * @param {T[]} trees - The input array of tree nodes.
 * @returns {T[]} - A new flat array containing all nodes.
 */
export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
	return chain((node) => {
		const children = node.children || [];
		return [node, ...flattenTrees(children)];
	}, trees);
}
