import type { Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Remark plugin: converts ==text== to <mark>text</mark>.
 * No extra dependencies — uses unist-util-visit already in this project.
 */
export const remarkMark: Plugin<[], Root> = () => (tree) => {
	visit(tree, "text", (node, index, parent) => {
		if (!parent || index === undefined) return;

		const re = /==([^=]+)==/g;
		const text = node.value;
		if (!re.test(text)) return;

		re.lastIndex = 0;
		const newChildren: (Text | { type: "html"; value: string })[] = [];
		let last = 0;
		let match: RegExpExecArray | null;

		while ((match = re.exec(text)) !== null) {
			if (match.index > last) {
				newChildren.push({ type: "text", value: text.slice(last, match.index) });
			}
			newChildren.push({ type: "html", value: `<mark>${match[1]}</mark>` });
			last = match.index + match[0].length;
		}

		if (last < text.length) {
			newChildren.push({ type: "text", value: text.slice(last) });
		}

		// Replace the single text node with the expanded nodes
		parent.children.splice(index, 1, ...(newChildren as typeof parent.children));
	});
};
