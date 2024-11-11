import React, { useRef, useState } from 'react';

const WebcamControl = () => {
    const videoRef = useRef(null);
    const [posture, setPosture] = useState("");
    const [blinkCount, setBlinkCount] = useState(0);
    const [focusPercentage, setFocusPercentage] = useState(100);
    const [eventSource, setEventSource] = useState(null);

    const startWebcam = async () => {
        try {
            const response = await fetch('http://localhost:5000/start-webcam', { method: 'POST' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const es = new EventSource('http://localhost:5000/video-feed');
            setEventSource(es);

            es.onmessage = function(event) {
                const [frameData, postureData, blinkData, focusData] = event.data.split(",");

                if (videoRef.current) {
                    const imageBlob = `data:image/jpeg;base64,${frameData}`;
                    videoRef.current.src = imageBlob;
                }

                setPosture(postureData);
                setBlinkCount(Number(blinkData));
                setFocusPercentage(Number(focusData));
            };
        } catch (error) {
            console.error('Error starting webcam:', error);
        }
    };

    const stopWebcam = async () => {
        try {
            const response = await fetch('http://localhost:5000/stop-webcam', { method: 'POST' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            if (eventSource) {
                eventSource.close();
                setEventSource(null);
            }
        } catch (error) {
            console.error('Error stopping webcam:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-10">
            <div className="flex space-x-8 justify-between items-center">
                {/* Glassy Card */}
                <div className="max-w-xl w-full bg-opacity-20 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-opacity-30 border-gray-200">
                    <h1 className="text-4xl font-bold text-center mb-8 text-white">Webcam Feed</h1>
                    
                    <div className="flex justify-center items-center mb-6">
                        <img 
                            ref={videoRef} 
                            alt="Webcam Feed" 
                            className="rounded-xl shadow-lg w-full h-48 object-cover transition-transform transform hover:scale-105 duration-300 border border-gray-300 border-opacity-30"
                        />
                    </div>

                    <div className="text-center text-lg mb-6 text-gray-200">
                        <p>Posture Status: <span className="font-semibold text-white">{posture}</span></p>
                        <p>Blink Count: <span className="font-semibold text-white">{blinkCount}</span></p>
                        <p>Focus Percentage: <span className="font-semibold text-white">{focusPercentage.toFixed(2)}%</span></p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between mt-8">
                        <button 
                            className="w-full md:w-1/2 mx-2 p-3 text-white bg-[#024CAA] rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
                            onClick={startWebcam}
                        >
                            Start Webcam
                        </button>
                        <button 
                            className="w-full md:w-1/2 mx-2 p-3 text-white bg-[#B31312] rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={stopWebcam}
                        >
                            Stop Webcam
                        </button>
                    </div>
                </div>

                {/* Video Section */}
                <div className="w-full max-w-5xl h-120 bg-black rounded-3xl overflow-hidden shadow-lg">
                    <video 
                        src="https://cdn.pixabay.com/video/2024/04/20/208682_large.mp4" 
                        autoPlay 
                        loop 
                        muted 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default WebcamControl;
