export default function stringToNodes(keyword, value) {
  const nodes = []
  if (value.toUpperCase().startsWith(keyword.toUpperCase())) {
    const key1 = value.slice(0, keyword.length)
    const key2 = value.slice(keyword.length)
    const node1 = {
      name: 'span',
      attrs: { style: 'color: #26ce8a; font-size: 14px;' },
      children: [{ type: 'text', text: key1 }]
    }
    const node2 = {
      name: 'span',
      attrs: { style: 'color: #000; font-size: 14px;' },
      children: [{ type: 'text', text: key2 }]
    }
    nodes.push(node1)
    nodes.push(node2)
  } else {
    const node = {
      name: 'span',
      attrs: { style: 'color: #000; font-size: 14px;' },
      children: [{ type: 'text', text: value }]
    }
    nodes.push(node)
  }
  return nodes
}