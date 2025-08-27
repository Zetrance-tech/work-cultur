

interface LinkContentProps {
    title: string;
    links: { title?: string; url: string }[];
  }
  
  const LinkContent = ({ title, links }: LinkContentProps) => {
    return (
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-6">{title}</h3>
        {links?.length > 0 ? (
          <ol className="list-decimal list-inside space-y-2">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {link.title || link.url}
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">No links available.</p>
        )}
      </div>
    );
  };
  
  export default LinkContent;
  