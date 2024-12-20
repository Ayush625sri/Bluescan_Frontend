
const Card = ({ 
    title, 
    children, 
    className = '', 
    headerActions,
    footer 
  }) => {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        {title && (
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            {headerActions && <div>{headerActions}</div>}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    );
  };

  export default Card