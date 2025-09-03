import React, { useState, useRef } from 'react';
import { AppSettings, PageCreatorResult } from '../types';
import { generatePageContent } from '../services/geminiService';
import { MagicIcon, ClipboardIcon, CheckCircleIcon } from './icons';

interface PageCreatorProps {
    settings: AppSettings;
}

const LoadingSkeleton = () => (
    <div className="p-4 bg-gray-900/30 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-700/50 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
    </div>
);

const PageCreator: React.FC<PageCreatorProps> = ({ settings }) => {
    const [pageType, setPageType] = useState('درباره ما');
    const [platform, setPlatform] = useState('وب‌سایت عمومی');
    const [topic, setTopic] = useState('');
    const [contextUrl, setContextUrl] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [outputFormat, setOutputFormat] = useState<'html' | 'text'>('html');
    
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PageCreatorResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [htmlCopyStatus, setHtmlCopyStatus] = useState(false);
    const [textCopyStatus, setTextCopyStatus] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('لطفاً موضوع اصلی صفحه را مشخص کنید.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const details = {
                pageType,
                platform,
                topic,
                contextUrl,
                imageUrls: imageUrls.split('\n').filter(url => url.trim() !== ''),
            };
            const apiResult = await generatePageContent(details, settings.aiInstructions['page-creator']);
            setResult(apiResult);
        } catch (err) {
            console.error(err);
            setError('خطا در تولید محتوای صفحه. لطفاً دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (content: string, type: 'html' | 'text') => {
        navigator.clipboard.writeText(content);
        if (type === 'html') {
            setHtmlCopyStatus(true);
            setTimeout(() => setHtmlCopyStatus(false), 2000);
        } else {
            setTextCopyStatus(true);
            setTimeout(() => setTextCopyStatus(false), 2000);
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1 p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 shadow-xl shadow-cyan-500/10 space-y-6">
                <h2 className="text-xl font-bold text-cyan-300">عامل هوشمند صفحه‌ساز</h2>
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">نوع صفحه</label>
                        <select value={pageType} onChange={e => setPageType(e.target.value)} className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg text-white p-2.5">
                            <option>درباره ما</option>
                            <option>خدمات</option>
                            <option>تماس با ما</option>
                            <option>صفحه محصول</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">پلتفرم هدف</label>
                        <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg text-white p-2.5">
                            <option>وب‌سایت عمومی</option>
                            <option>پروفایل گیت‌هاب (Markdown)</option>
                            <option>پروفایل لینکدین</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">موضوع و لحن</label>
                        <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={4} placeholder="توضیح دهید صفحه درباره چیست و چه لحنی داشته باشد..." className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg text-white p-2.5"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">لینک سایت برای تحلیل (اختیاری)</label>
                        <input type="url" value={contextUrl} onChange={e => setContextUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg text-white p-2.5"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">لینک تصاویر اسلایدشو (اختیاری)</label>
                        <textarea value={imageUrls} onChange={e => setImageUrls(e.target.value)} rows={3} placeholder="هر لینک در یک خط جداگانه..." className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg text-white p-2.5"/>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition">
                        <MagicIcon className="w-5 h-5"/>
                        {isLoading ? 'در حال ساخت...' : 'بساز'}
                    </button>
                </form>
            </div>
            {/* Result Panel */}
            <div className="lg:col-span-2 space-y-4">
                 <h3 className="text-xl font-bold text-cyan-300">خروجی تولید شده</h3>
                 {isLoading && <LoadingSkeleton />}
                 {error && <div className="p-4 bg-red-900/20 text-red-300 rounded-lg">{error}</div>}
                 {!isLoading && !result && <div className="flex items-center justify-center h-full p-6 bg-gray-800/30 border border-gray-600/30 rounded-lg text-gray-400"><p>خروجی صفحه شما در اینجا نمایش داده خواهد شد.</p></div>}
                 {result && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="p-4 bg-gray-800/50 rounded-lg">
                            <h4 className="font-semibold text-cyan-200 mb-2">پیش‌نمایش زنده</h4>
                             <div className="w-full h-64 border border-gray-600 rounded-md bg-white overflow-y-auto">
                                <iframe srcDoc={result.htmlContent} className="w-full h-full" title="Preview" />
                             </div>
                        </div>
                        
                         <div className="p-4 bg-gray-800/50 rounded-lg">
                            <h4 className="font-semibold text-cyan-200 mb-2">پالت رنگی پیشنهادی</h4>
                            <div className="flex gap-2">
                                {Object.entries(result.suggestedPalette).map(([name, color]) => (
                                    <div key={name} className="flex-1 text-center">
                                        <div className="w-full h-10 rounded" style={{ backgroundColor: color }}></div>
                                        <p className="text-xs mt-1 capitalize">{name}</p>
                                    </div>
                                ))}
                            </div>
                         </div>

                        <div className="bg-gray-800/50 rounded-lg">
                            <div className="flex border-b border-gray-700">
                                <button onClick={() => setOutputFormat('html')} className={`px-4 py-2 text-sm ${outputFormat === 'html' ? 'bg-gray-700/50 text-cyan-300' : 'text-gray-400'}`}>کد HTML</button>
                                <button onClick={() => setOutputFormat('text')} className={`px-4 py-2 text-sm ${outputFormat === 'text' ? 'bg-gray-700/50 text-cyan-300' : 'text-gray-400'}`}>متن ساده</button>
                            </div>
                            <div className="p-4 relative group">
                                {outputFormat === 'html' ? (
                                    <>
                                        <pre className="text-xs text-cyan-200 bg-gray-900/50 p-2 rounded max-h-64 overflow-auto"><code>{result.htmlContent}</code></pre>
                                        <button onClick={() => handleCopy(result.htmlContent, 'html')} className="absolute top-6 right-6 p-1.5 bg-gray-900/70 rounded-full text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="کپی کد HTML">
                                            {htmlCopyStatus ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                                        </button>
                                    </>
                                ) : (
                                     <>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed max-h-64 overflow-auto">{result.plainText}</p>
                                        <button onClick={() => handleCopy(result.plainText, 'text')} className="absolute top-2 right-2 p-1.5 bg-gray-900/70 rounded-full text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="کپی متن">
                                            {textCopyStatus ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default PageCreator;
