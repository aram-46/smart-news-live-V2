

import React, { useState, useCallback } from 'react';
import { AppSettings } from '../../types';
import { generateSeoKeywords, suggestWebsiteNames, suggestDomainNames, generateArticle, generateImagesForArticle } from '../services/geminiService';
import { MagicIcon, ClipboardIcon, CheckCircleIcon, ImageIcon } from './icons';
import PageCreator from './PageCreator';

interface ContentCreatorProps {
    settings: AppSettings;
}

type ContentCreatorTab = 'seo-tools' | 'page-creator';

const ResultCard: React.FC<{
    title: string;
    content: string | string[];
    isLoading: boolean;
    isList?: boolean;
}> = ({ title, content, isLoading, isList = false }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = Array.isArray(content) ? content.join('\n') : content;
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="h-20 bg-gray-700/50 rounded animate-pulse"></div>;
        }
        if (Array.isArray(content) && content.length === 0) {
            return <p className="text-xs text-gray-500">موردی برای نمایش وجود ندارد.</p>;
        }
        if (isList && Array.isArray(content)) {
            return (
                <ul className="space-y-1 list-disc list-inside">
                    {content.map((item, index) => <li key={index} className="text-sm">{item}</li>)}
                </ul>
            );
        }
        return <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>;
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg relative group">
            <h4 className="font-semibold text-cyan-200 mb-2">{title}</h4>
            <div className="text-gray-300 max-h-48 overflow-y-auto">
                {renderContent()}
            </div>
            {content && (content as any).length > 0 && !isLoading && (
                 <button onClick={handleCopy} className="absolute top-2 left-2 p-1.5 bg-gray-900/70 rounded-full text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="کپی">
                    {isCopied ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
};

const SeoAndArticleTools: React.FC<{ settings: AppSettings }> = ({ settings }) => {
    // SEO Tools State
    const [seoTopic, setSeoTopic] = useState('');
    const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
    const [websiteNames, setWebsiteNames] = useState<string[]>([]);
    const [domainNames, setDomainNames] = useState<string[]>([]);
    const [seoLoading, setSeoLoading] = useState<'keywords' | 'names' | 'domains' | null>(null);

    // Article Generator State
    const [articleTopic, setArticleTopic] = useState('');
    const [wordCount, setWordCount] = useState(300);
    const [articleText, setArticleText] = useState('');
    const [articleKeywords, setArticleKeywords] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [imageCount, setImageCount] = useState(1);
    const [imageType, setImageType] = useState('in-content');
    const [articleLoading, setArticleLoading] = useState<'article' | 'keywords' | 'images' | null>(null);

    const handleSeoGeneration = useCallback(async (type: 'keywords' | 'names' | 'domains') => {
        if (!seoTopic.trim()) return;
        setSeoLoading(type);
        try {
            let result: string[] = [];
            if (type === 'keywords') result = await generateSeoKeywords(seoTopic, settings.aiInstructions['seo-keywords']);
            if (type === 'names') result = await suggestWebsiteNames(seoTopic, settings.aiInstructions['website-names']);
            if (type === 'domains') result = await suggestDomainNames(seoTopic, settings.aiInstructions['domain-names']);
            
            if (type === 'keywords') setSeoKeywords(result);
            if (type === 'names') setWebsiteNames(result);
            if (type === 'domains') setDomainNames(result);
        } catch (err) { console.error(err); } finally { setSeoLoading(null); }
    }, [seoTopic, settings]);

    const handleGenerateArticle = useCallback(async () => {
        if (!articleTopic.trim()) return;
        setArticleLoading('article');
        setArticleText('');
        setArticleKeywords([]);
        try {
            const article = await generateArticle(articleTopic, wordCount, settings.aiInstructions['article-generation']);
            setArticleText(article);
            const keywords = await generateSeoKeywords(articleTopic, settings.aiInstructions['seo-keywords']);
            setArticleKeywords(keywords);
        } catch (err) { console.error(err); } finally { setArticleLoading(null); }
    }, [articleTopic, wordCount, settings]);

    const handleGenerateImages = useCallback(async () => {
        if (!articleTopic.trim() && !articleText.trim()) return;
        setArticleLoading('images');
        setImages([]);
        try {
            const prompt = `یک تصویر برای مقاله‌ای با موضوع "${articleTopic}". سبک تصویر: ${imageType}. توضیحات بیشتر: ${articleText.substring(0, 200)}`;
            const resultImages = await generateImagesForArticle(prompt, imageCount, "");
            setImages(resultImages);
        } catch (err) { console.error(err); } finally { setArticleLoading(null); }
    }, [articleTopic, articleText, imageCount, imageType]);
    
     return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SEO & Naming Tools */}
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 shadow-xl shadow-cyan-500/10 space-y-6">
                 <h2 className="text-xl font-bold text-cyan-300">ابزارهای سئو و نام‌گذاری</h2>
                 <div className="space-y-4">
                    <textarea value={seoTopic} onChange={e => setSeoTopic(e.target.value)} rows={2} placeholder="موضوع اصلی سایت یا کسب و کار خود را وارد کنید..." className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg text-white p-2.5"/>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button onClick={() => handleSeoGeneration('keywords')} disabled={!!seoLoading} className="flex items-center justify-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm disabled:opacity-50"><MagicIcon className="w-4 h-4"/> کلمات کلیدی</button>
                        <button onClick={() => handleSeoGeneration('names')} disabled={!!seoLoading} className="flex items-center justify-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm disabled:opacity-50"><MagicIcon className="w-4 h-4"/> نام سایت</button>
                        <button onClick={() => handleSeoGeneration('domains')} disabled={!!seoLoading} className="flex items-center justify-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm disabled:opacity-50"><MagicIcon className="w-4 h-4"/> نام دامنه</button>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <ResultCard title="کلمات کلیدی سئو" content={seoKeywords} isLoading={seoLoading === 'keywords'} isList />
                    <ResultCard title="نام‌های پیشنهادی سایت" content={websiteNames} isLoading={seoLoading === 'names'} isList />
                    <ResultCard title="دامنه‌های پیشنهادی" content={domainNames} isLoading={seoLoading === 'domains'} isList />
                 </div>
            </div>

            {/* Article Generation */}
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 shadow-xl shadow-cyan-500/10 space-y-6">
                <h2 className="text-xl font-bold text-cyan-300">تولید محتوای مقاله</h2>
                <div className="space-y-4">
                     <textarea value={articleTopic} onChange={e => setArticleTopic(e.target.value)} rows={2} placeholder="موضوع مقاله را وارد کنید..." className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg text-white p-2.5"/>
                     <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">تعداد کلمات: {wordCount}</label>
                        <input type="range" min="100" max="1000" step="50" value={wordCount} onChange={e => setWordCount(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
                     </div>
                     <button onClick={handleGenerateArticle} disabled={!!articleLoading} className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 text-black font-bold py-2 px-4 rounded-lg transition">
                        <MagicIcon className="w-5 h-5"/> تولید مقاله و کلمات کلیدی
                     </button>
                </div>
                 <ResultCard title="متن مقاله" content={articleText} isLoading={articleLoading === 'article'} />
                 <ResultCard title="کلمات کلیدی مقاله" content={articleKeywords} isLoading={articleLoading === 'article'} isList />

                 <div className="p-4 bg-gray-800/50 rounded-lg space-y-4">
                    <h4 className="font-semibold text-cyan-200 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> تولید تصویر برای مقاله</h4>
                    <div className="flex gap-4 items-center">
                        <div className="flex-grow">
                            <label className="block text-xs font-medium text-gray-300 mb-1">تعداد عکس: {imageCount}</label>
                            <input type="range" min="1" max="4" step="1" value={imageCount} onChange={e => setImageCount(Number(e.target.value))} className="w-full"/>
                        </div>
                        <div className="flex-grow">
                             <label className="block text-xs font-medium text-gray-300 mb-1">نوع عکس</label>
                             <select value={imageType} onChange={e => setImageType(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg text-white p-2 text-xs">
                                <option value="thumbnail">انگشتی (Thumbnail)</option>
                                <option value="in-content">داخل محتوا (In-content)</option>
                                <option value="slideshow">اسلایدشو (Slideshow)</option>
                             </select>
                        </div>
                    </div>
                    <button onClick={handleGenerateImages} disabled={!articleTopic && !articleText} className="w-full text-sm p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">تولید عکس</button>
                    {articleLoading === 'images' && <div className="h-24 bg-gray-700/50 rounded animate-pulse"></div>}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {images.map((imgSrc, i) => <img key={i} src={imgSrc} alt={`Generated image ${i+1}`} className="w-full h-auto rounded-md" />)}
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
}

const ContentCreator: React.FC<ContentCreatorProps> = ({ settings }) => {
    const [activeTab, setActiveTab] = useState<ContentCreatorTab>('seo-tools');

    const renderTabButton = (tabId: ContentCreatorTab, label: string) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-300 border-b-2 ${
                activeTab === tabId
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
             <div className="flex border-b border-cyan-400/20 mb-6 overflow-x-auto">
                {renderTabButton('seo-tools', 'ابزارهای سئو و مقاله')}
                {renderTabButton('page-creator', 'صفحه‌ساز')}
            </div>

            {activeTab === 'seo-tools' && <SeoAndArticleTools settings={settings} />}
            {activeTab === 'page-creator' && <PageCreator settings={settings} />}
        </div>
    );
};

export default ContentCreator;
