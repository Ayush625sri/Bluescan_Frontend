import { useSession } from '../../contexts/SessionContext';

const SessionCounter = () => {
  const { pendingRequests } = useSession();
  
  if (pendingRequests.length === 0) {
    return null;
  }
  
  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {pendingRequests.length}
    </div>
  );
};

export default SessionCounter;