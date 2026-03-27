import React from 'react';

interface RichTextProps {
    content: any;
    className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ content, className }) => {
    if (!content) return null;

    // Handle string content (fallback)
    if (typeof content === 'string') {
        return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Handle Lexical content
    if (content.root && content.root.children) {
        return (
            <div className={`rich-text ${className || ''}`}>
                {content.root.children.map((node: any, index: number) => renderNode(node, index))}
            </div>
        );
    }

    return null;
};

const renderNode = (node: any, index: number) => {
    switch (node.type) {
        case 'paragraph':
            return (
                <p key={index} className="mb-4">
                    {node.children?.map((child: any, i: number) => renderChild(child, i))}
                </p>
            );
        case 'heading':
            const Tag = node.tag as keyof JSX.IntrinsicElements;
            return (
                <Tag key={index} className="font-bold mb-4">
                    {node.children?.map((child: any, i: number) => renderChild(child, i))}
                </Tag>
            );
        case 'list':
            const ListTag = node.listType === 'number' ? 'ol' : 'ul';
            return (
                <ListTag key={index} className="list-inside list-disc mb-4 ml-4">
                    {node.children?.map((child: any, i: number) => renderNode(child, i))}
                </ListTag>
            );
        case 'listitem':
            return (
                <li key={index}>
                    {node.children?.map((child: any, i: number) => renderChild(child, i))}
                </li>
            );
        default:
            return null;
    }
};

const renderChild = (child: any, index: number) => {
    if (child.type === 'text') {
        let text = child.text;
        if (child.format & 1) text = <strong key={index}>{text}</strong>;
        if (child.format & 2) text = <em key={index}>{text}</em>;
        if (child.format & 8) text = <u key={index}>{text}</u>;
        return <React.Fragment key={index}>{text}</React.Fragment>;
    }
    if (child.type === 'link') {
        return (
            <a key={index} href={child.fields?.url} target={child.fields?.newTab ? '_blank' : undefined} className="text-primary hover:underline">
                {child.children?.map((c: any, i: number) => renderChild(c, i))}
            </a>
        );
    }
    return null;
};
