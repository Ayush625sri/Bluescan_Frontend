// Updated ImageAnalysisPanel.jsx
import { useState, useRef } from 'react';
import { Play, BarChart3, Droplets, AlertTriangle, CheckCircle, Maximize2 } from 'lucide-react';
import FullscreenImageViewer from './FullscreenImageViewer';
import { analyzeImageColors, createPollutionOverlay } from '../../utils/imageColorAnalysis';
import { saveAnalysisToSession } from '../../utils/sessionStorage';
import toast from 'react-hot-toast';

const ImageAnalysisPanel = ({ image, onAnalysisComplete }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const imageRef = useRef(null);

    const startAnalysis = async () => {
        setAnalyzing(true);
        setAnalysisResults(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Analyze actual image colors
            const colorAnalysis = analyzeImageColors(imageRef.current);
            const pollutionOverlay = createPollutionOverlay(
                colorAnalysis.pollutedRegions,
                imageRef.current.naturalWidth,
                imageRef.current.naturalHeight
            );

            // const mockResults = {
            //     id: `analysis-${Date.now()}`,
            //     image_id: image.id,
            //     timestamp: new Date().toISOString(),
            //     water_quality: {
            //         overall_score: colorAnalysis.waterQuality,
            //         ph_level: (6.5 + Math.random() * 2).toFixed(1),
            //         turbidity: Math.round(100 - colorAnalysis.cleanPercentage),
            //         clean_percentage: colorAnalysis.cleanPercentage,
            //     },
            //     pollution_detected: {
            //         microplastics: {
            //             detected: colorAnalysis.cleanPercentage < 80,
            //             concentration: Math.round(100 - colorAnalysis.cleanPercentage),
            //             particles_per_liter: Math.round((100 - colorAnalysis.cleanPercentage) * 10)
            //         },
            //         chemical_pollutants: {
            //             detected: colorAnalysis.cleanPercentage < 60,
            //             types: ['Dark particles', 'Brown substances'],
            //             severity: colorAnalysis.cleanPercentage < 40 ? 'high' : 'medium'
            //         },
            //         non_blue_areas: {
            //             detected: colorAnalysis.cleanPercentage < 80,
            //             percentage: Math.round(100 - colorAnalysis.cleanPercentage),
            //             regions_count: pollutionOverlay.length
            //         }
            //     },
            //     analysis_confidence: Math.floor(Math.random() * 20) + 80,
            //     color_analysis: colorAnalysis,
            //     pollution_overlay: pollutionOverlay
            // };

            const mockResults = {
                id: `analysis-${Date.now()}`,
                image_id: image.id,
                timestamp: new Date().toISOString(),
                water_quality: {
                    overall_score: colorAnalysis.waterQuality,
                    ph_level: (6.5 + Math.random() * 2).toFixed(1),
                    turbidity: Math.round(100 - colorAnalysis.cleanPercentage),
                    clean_percentage: colorAnalysis.cleanPercentage,
                },
                pollution_detected: {
                    microplastics: {
                        detected: colorAnalysis.cleanPercentage < 80,
                        concentration: Math.round(100 - colorAnalysis.cleanPercentage),
                        particles_per_liter: Math.round((100 - colorAnalysis.cleanPercentage) * 10)
                    },
                    chemical_pollutants: {
                        detected: colorAnalysis.cleanPercentage < 60,
                        types: ['Dark particles', 'Brown substances'],
                        severity: colorAnalysis.cleanPercentage < 40 ? 'high' : 'medium'
                    },
                    non_blue_areas: {
                        detected: colorAnalysis.cleanPercentage < 80,
                        percentage: Math.round(100 - colorAnalysis.cleanPercentage),
                        regions_count: pollutionOverlay.length
                    }
                },
                analysis_confidence: Math.floor(Math.random() * 20) + 80,
                color_analysis: colorAnalysis,
                pollution_overlay: pollutionOverlay
            };
            setAnalysisResults(mockResults);
            saveAnalysisToSession(image.id, mockResults);
            onAnalysisComplete(mockResults);
            toast.success('Color analysis completed');
        } catch (error) {
            console.error('Analysis failed:', error);
            toast.error('Analysis failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const getQualityColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-4">
            {/* Selected Image */}
            <div className="border rounded-lg overflow-hidden relative group">
                <img
                    ref={imageRef}
                    src={image.url}
                    alt="Selected for analysis"
                    className="w-full h-32 object-cover"
                    crossOrigin="anonymous"
                />

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <button
                        onClick={() => setShowFullscreen(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium">{image.filename}</p>
                            <p className="text-xs text-gray-500">{new Date(image.uploaded_at).toLocaleString()}</p>
                        </div>
                        {analysisResults && (
                            <button
                                onClick={() => setShowFullscreen(true)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                <Maximize2 className="w-3 h-3 mr-1" />
                                View Analysis
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Analysis Button */}
            <button
                onClick={startAnalysis}
                disabled={analyzing}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {analyzing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Analyzing Colors...
                    </>
                ) : (
                    <>
                        <Play className="w-5 h-5 mr-2" />
                        Start Analysis
                    </>
                )}
            </button>

            {/* Analysis Results */}
            {analysisResults && (
                <div className="space-y-4 border-t pt-4">
                    <h4 className="font-semibold">Analysis Results</h4>

                    {/* Overall Score */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Water Quality</span>
                            <span className={`text-lg font-bold ${getQualityColor(analysisResults.water_quality.overall_score)}`}>
                                {analysisResults.water_quality.overall_score}/100
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${analysisResults.water_quality.overall_score >= 70 ? 'bg-green-500' :
                                    analysisResults.water_quality.overall_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${analysisResults.water_quality.overall_score}%` }}
                            />
                        </div>
                    </div>

                    {/* Color Analysis */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center mb-1">
                                <Droplets className="w-4 h-4 text-blue-600 mr-1" />
                                <span className="text-sm font-medium">Moderate Areas</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                                {analysisResults.water_quality.clean_percentage}%
                            </span>
                        </div>

                        <div className="bg-red-50 rounded-lg p-3">
                            <div className="flex items-center mb-1">
                                <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                                <span className="text-sm font-medium">Polluted Areas</span>
                            </div>
                            <span className="text-lg font-bold text-red-600">
                                {100 - analysisResults.water_quality.clean_percentage}%
                            </span>
                        </div>
                    </div>

                    {/* Pollution Detection */}
                    <div className="space-y-2">
                        <h5 className="text-sm font-semibold">Detection</h5>

                        {analysisResults.pollution_detected.non_blue_areas.detected ? (
                            <div className="px-3 py-2 rounded-md bg-red-100 text-red-800">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    {/* <span className="text-sm font-medium">Non-Blue Areas Detected</span> */}
                                </div>
                                <p className="text-xs mt-1">
                                    {analysisResults.pollution_detected.non_blue_areas.regions_count} pollution regions found
                                </p>
                            </div>
                        ) : (
                            <div className="px-3 py-2 rounded-md bg-green-100 text-green-800">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">Moderate</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View Analysis Button */}
                    <button
                        onClick={() => setShowFullscreen(true)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                    >
                        <Maximize2 className="w-4 h-4 mr-2" />
                        View Analysis Overlay
                    </button>
                </div>
            )}

            {/* Fullscreen Viewer */}
            {showFullscreen && (
                <FullscreenImageViewer
                    image={image}
                    analysisResults={analysisResults}
                    onClose={() => setShowFullscreen(false)}
                />
            )}
        </div>
    );
};

export default ImageAnalysisPanel;