export default function Page() {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center pt-25">
            <div className="absolute inset-0 opacity-20">
                <img
                    className='h-full w-full opacity-50'
                    src={"/chart.svg"}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Press '/' to Search for a crypto and start trade.
                    </h1>
                </div>
            </div>

        </div>
    )
}