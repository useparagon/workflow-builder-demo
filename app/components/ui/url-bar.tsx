export const UrlBar = () => {
    const domain = new URL(window.location.toString()).searchParams.get("domain");

    return (
        <div className={'absolute top-0 left-0 w-screen h-full'}>
            <div className="border rounded mb-10 relative shadow-md shadow-slate-200">
                <div className="rounded-t-md w-full flex items-center bg-slate-700 border-b h-10 sticky top-0">
                    <div className="flex items-center ml-3">
                        <div className="rounded-full h-3 w-3 mr-2 bg-red-400" />
                        <div className="rounded-full h-3 w-3 mr-2 bg-yellow-400" />
                        <div className="rounded-full h-3 w-3 bg-green-400" />
                    </div>
                    <div className="bg-slate-200 text-slate-500 w-96 h-6 rounded text-xs font-medium flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                        {domain ?? "yourapp.com"}/integrations
                    </div>
                </div>
            </div>
        </div>
    );
};
