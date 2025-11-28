
import React from 'react';
import type { AnalysisResult, FeatureAnalysis } from '../types';
import { Classification, RiskLevel } from '../types';
import { ShieldCheckIcon, ShieldAlertIcon, ShieldQuestionIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon } from './icons';

interface ResultDisplayProps {
    result: AnalysisResult;
}

const classificationConfig = {
    [Classification.LEGITIMATE]: {
        title: 'Legitimate',
        Icon: ShieldCheckIcon,
        colorClasses: 'from-green-500 to-teal-500',
        textColor: 'text-green-300',
        borderColor: 'border-green-500/50',
        bgColor: 'bg-green-900/30'
    },
    [Classification.PHISHING]: {
        title: 'Phishing',
        Icon: ShieldAlertIcon,
        colorClasses: 'from-red-500 to-orange-500',
        textColor: 'text-red-300',
        borderColor: 'border-red-500/50',
        bgColor: 'bg-red-900/30'
    },
    [Classification.SUSPICIOUS]: {
        title: 'Suspicious',
        Icon: ShieldQuestionIcon,
        colorClasses: 'from-yellow-500 to-amber-500',
        textColor: 'text-yellow-300',
        borderColor: 'border-yellow-500/50',
        bgColor: 'bg-yellow-900/30'
    },
};

const riskConfig = {
    [RiskLevel.HIGH]: { Icon: XCircleIcon, color: 'text-red-400' },
    [RiskLevel.MEDIUM]: { Icon: AlertTriangleIcon, color: 'text-yellow-400' },
    [RiskLevel.LOW]: { Icon: InfoIcon, color: 'text-blue-400' },
    [RiskLevel.NONE]: { Icon: CheckCircleIcon, color: 'text-green-400' },
};

const FeatureItem: React.FC<{ item: FeatureAnalysis }> = ({ item }) => {
    const { Icon, color } = riskConfig[item.risk] || riskConfig[RiskLevel.LOW];
    return (
        <li className="flex items-start p-4 bg-gray-800 rounded-lg">
            <Icon className={`w-6 h-6 mr-4 flex-shrink-0 mt-1 ${color}`} />
            <div>
                <h4 className="font-semibold text-gray-200">{item.feature}: <span className="font-normal text-gray-300">{item.status}</span></h4>
                <p className="text-gray-400 text-sm">{item.details}</p>
            </div>
        </li>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    const config = classificationConfig[result.classification] || classificationConfig[Classification.SUSPICIOUS];
    const confidencePercent = (result.confidenceScore * 100).toFixed(0);

    return (
        <div className={`rounded-2xl p-6 shadow-lg border ${config.borderColor} ${config.bgColor}`}>
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                <config.Icon className={`w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-0 md:mr-6 flex-shrink-0 bg-gradient-to-br ${config.colorClasses} p-4 rounded-full text-white`} />
                <div>
                    <h2 className={`text-3xl font-bold ${config.textColor}`}>{config.title}</h2>
                    <p className="text-lg text-gray-300 mt-1">Overall Risk Level: <strong>{result.riskLevel}</strong></p>
                    <p className="text-gray-400 mt-2">{result.summary}</p>

                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                      <div className={`bg-gradient-to-r ${config.colorClasses} h-2.5 rounded-full`} style={{ width: `${confidencePercent}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 text-right">Confidence: {confidencePercent}%</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-200">Detailed Analysis</h3>
                <ul className="space-y-3">
                    {result.featureAnalysis.map((item, index) => (
                        <FeatureItem key={index} item={item} />
                    ))}
                </ul>
            </div>

            {result.groundingUrls && result.groundingUrls.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
                        <InfoIcon className="w-4 h-4 mr-2" />
                        Verified Sources & Search Context
                    </h4>
                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                        {result.groundingUrls.map((url, i) => (
                            <a 
                                key={i} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-blue-400 hover:text-blue-300 hover:underline truncate bg-gray-900/50 p-2 rounded border border-gray-700 block transition-colors"
                            >
                                {url}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
