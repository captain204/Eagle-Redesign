import React from 'react';

interface RichTextProps {
    content?: any;
    data?: any;
    className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ content, data, className }) => {
    const rawContent = content || data;
    if (!rawContent) return null;

    // Handle string content (fallback)
    if (typeof rawContent === 'string') {
        return <div className={`prose max-w-none ${className || ''}`} dangerouslySetInnerHTML={{ __html: rawContent }} />;
    }

    // Handle Lexical content
    if (rawContent.root && rawContent.root.children) {
        return (
            <div className={`rich-text leading-relaxed text-gray-800 ${className || ''}`}>
                {rawContent.root.children.map((node: any, index: number) => renderNode(node, index))}
            </div>
        );
    }

    return null;
};

const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null;

    switch (node.type) {
        case 'paragraph':
            return (
                <p key={index} className="mb-5 text-gray-700 leading-relaxed text-base md:text-lg">
                    {node.children?.map((child: any, i: number) => renderChild(child, i))}
                </p>
            );
        case 'heading': {
            const tag = (node.tag || 'h2').toLowerCase();
            const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? tag : 'h2') as keyof JSX.IntrinsicElements;
            const headingClasses: Record<string, string> = {
                h1: 'text-2xl md:text-4xl font-bold mt-8 mb-4 text-gray-900 tracking-tight leading-tight',
                h2: 'text-xl md:text-3xl font-bold mt-7 mb-3 text-gray-900 tracking-tight leading-snug',
                h3: 'text-lg md:text-2xl font-bold mt-6 mb-3 text-gray-900 leading-normal',
                h4: 'text-base md:text-xl font-semibold mt-5 mb-2 text-gray-900',
                h5: 'text-sm md:text-lg font-semibold mt-4 mb-2 text-gray-900',
                h6: 'text-xs md:text-base font-semibold uppercase tracking-wider mt-4 mb-2 text-gray-600',
            };
            return (
                <Tag key={index} className={headingClasses[tag] || headingClasses.h2}>
                    {node.children?.map((child: any, i: number) => renderChild(child, i))}
                </Tag>
            );
        }
        case 'quote':
            return (
                <blockquote
                    key={index}
                    className="border-l-4 border-primary pl-4 py-2 my-6 italic text-gray-700 bg-orange-50/50 rounded-r-lg font-medium"
                >
                    {node.children?.map((child: any, i: number) => renderChild(child, i))}
                </blockquote>
            );
        case 'list': {
            const isNumbered = node.listType === 'number';
            const ListTag = isNumbered ? 'ol' : 'ul';
            const listClasses = isNumbered ? 'list-decimal' : 'list-disc';
            return (
                <ListTag key={index} className={`list-inside ${listClasses} mb-5 ml-2 space-y-2 text-gray-700 text-base md:text-lg`}>
                    {node.children?.map((child: any, i: number) => renderNode(child, i))}
                </ListTag>
            );
        }
        case 'listitem':
            return (
                <li key={index} className="leading-relaxed">
                    {node.children?.map((child: any, i: number) => renderChild(child, i))}
                </li>
            );
        case 'upload': {
            const uploadValue = node.value;
            const imageUrl = uploadValue?.url || uploadValue?.sizes?.card?.url || '';
            const altText = uploadValue?.alt || uploadValue?.filename || 'Article image';
            if (!imageUrl) return null;
            return (
                <figure key={index} className="my-8">
                    <img
                        src={imageUrl}
                        alt={altText}
                        className="rounded-xl max-w-full h-auto shadow-md mx-auto object-cover"
                    />
                    {uploadValue?.alt && (
                        <figcaption className="text-center text-xs md:text-sm text-gray-500 mt-2 italic">
                            {uploadValue.alt}
                        </figcaption>
                    )}
                </figure>
            );
        }
        case 'horizontalrule':
            return <hr key={index} className="my-8 border-gray-200" />;
        case 'linebreak':
            return <br key={index} />;
        default:
            if (node.children && Array.isArray(node.children)) {
                return (
                    <div key={index} className="mb-4">
                        {node.children.map((child: any, i: number) => renderNode(child, i) || renderChild(child, i))}
                    </div>
                );
            }
            return null;
    }
};

const renderChild = (child: any, index: number): React.ReactNode => {
    if (!child) return null;

    if (child.type === 'text') {
        let textNode: React.ReactNode = child.text;
        const format = child.format || 0;

        // Bitwise formatting in Lexical
        if (format & 1) textNode = <strong key={`b-${index}`} className="font-bold text-gray-900">{textNode}</strong>;
        if (format & 2) textNode = <em key={`i-${index}`}>{textNode}</em>;
        if (format & 4) textNode = <s key={`s-${index}`}>{textNode}</s>;
        if (format & 8) textNode = <u key={`u-${index}`}>{textNode}</u>;
        if (format & 16) textNode = (
            <code key={`c-${index}`} className="px-1.5 py-0.5 bg-gray-100 text-primary font-mono text-sm rounded border border-gray-200">
                {textNode}
            </code>
        );
        if (format & 32) textNode = <sub key={`sub-${index}`}>{textNode}</sub>;
        if (format & 64) textNode = <sup key={`sup-${index}`}>{textNode}</sup>;

        return <React.Fragment key={index}>{textNode}</React.Fragment>;
    }

    if (child.type === 'link') {
        const url = child.fields?.url || child.url || '#';
        const newTab = child.fields?.newTab || child.newTab;
        return (
            <a
                key={index}
                href={url}
                target={newTab ? '_blank' : undefined}
                rel={newTab ? 'noopener noreferrer' : undefined}
                className="text-primary hover:text-primary/80 underline font-semibold transition-colors"
            >
                {child.children?.map((c: any, i: number) => renderChild(c, i))}
            </a>
        );
    }

    if (child.type === 'linebreak') {
        return <br key={index} />;
    }

    // Nested children fallback
    if (child.children && Array.isArray(child.children)) {
        return (
            <span key={index}>
                {child.children.map((c: any, i: number) => renderChild(c, i))}
            </span>
        );
    }

    return null;
};
