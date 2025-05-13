

function Alert({openAlert}) {
    
  return (
    <div>
        <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
            <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Alert</h2>
            <p className="text-gray-700">Please log in to perform this action.</p>
            </div>
        </div>
    </div>
  )
}

export default Alert
