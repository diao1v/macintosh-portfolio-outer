import React from 'react';
import ReactMarkdown from 'react-markdown';

interface HintTextProps {
  className?: string;
}

const markdownHint = `
# Welcome to my Macintosh portfolio!

Here are some tips to help you explore:

* **Try dragging outside the screen** to rotate the view
* **Try sending an email** through the Eudora mocking interface
* **Try creating new folder and text file** to add entropy value to the system
* **Help me find bugs** - I would appreciate any feedback!
`;

const HintText: React.FC<HintTextProps> = ({ className = '' }) => {
  return (
    <div className={`markdown-content text-sm text-black ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => (
            <h1 className='text-xl font-bold mb-2' {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className='text-lg font-bold mb-2' {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className='text-base font-bold mb-1' {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className='list-disc pl-5 mb-2' {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className='list-decimal pl-5 mb-2' {...props} />
          ),
          li: ({ ...props }) => <li className='mb-1' {...props} />,
          p: ({ ...props }) => <p className='mb-2' {...props} />,
        }}
      >
        {markdownHint}
      </ReactMarkdown>
    </div>
  );
};

export default HintText;
