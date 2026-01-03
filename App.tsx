import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadedImage, AppView, StylePreset, GenerationConfig } from './types';
import { DEFAULT_STYLES, VIETNAMESE_HOLIDAYS, SHOT_TYPES, ENVIRONMENTS, ACTIVITIES, LITURGICAL_COLORS } from './constants';
import * as GeminiService from './services/geminiService';

// Icons
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const MagicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.EXTRACTOR);
  
  // State for Extractor
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [trainingText, setTrainingText] = useState<string>("");
  
  // State for Remixer
  const [sourcePrompt, setSourcePrompt] = useState<string>("");
  const [remixedPrompt, setRemixedPrompt] = useState<string>("");
  const [variance, setVariance] = useState<'subtle' | 'moderate' | 'extreme'>('moderate');
  const [styles, setStyles] = useState<StylePreset[]>(DEFAULT_STYLES);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('realism');
  const [customStyleText, setCustomStyleText] = useState<string>("");
  const [isRemixing, setIsRemixing] = useState(false);

  // State for Holidays
  const [selectedHolidayId, setSelectedHolidayId] = useState<string | null>(null);
  const [holidayPromptReq, setHolidayPromptReq] = useState<string>("");
  const [generatedHolidayPrompt, setGeneratedHolidayPrompt] = useState<string>("");
  const [isGeneratingHoliday, setIsGeneratingHoliday] = useState(false);
  
  // Advanced Visual Settings for Holiday Generation
  const [genConfig, setGenConfig] = useState<GenerationConfig>({
    batchSize: 1,
    wordCount: 200,
    shotType: 'default',
    environment: 'default',
    activity: 'default',
    vestmentColor: 'default',
  });

  // When a holiday is selected, reset color to default if applicable
  useEffect(() => {
    if (selectedHolidayId) {
      setGenConfig(prev => ({...prev, vestmentColor: 'default'}));
    }
  }, [selectedHolidayId]);

  // --- Image Handling ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: UploadedImage[] = (Array.from(e.target.files) as File[]).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending'
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const files = Array.from(e.clipboardData.files) as File[];
      const newImages: UploadedImage[] = files
        .filter(file => file.type.startsWith('image/'))
        .map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
          status: 'pending'
        }));
      setImages(prev => [...prev, ...newImages]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const processImage = async (img: UploadedImage) => {
    if (img.status === 'processing') return;

    setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'processing' } : i));

    try {
      const reader = new FileReader();
      reader.readAsDataURL(img.file);
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (base64data) {
          const result = await GeminiService.extractPromptFromImage(base64data, img.file.type, trainingText);
          setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'done', extractedPrompt: result } : i));
        }
      };
    } catch (error) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'error' } : i));
    }
  };

  const processAllPending = () => {
    images.forEach(img => {
      if (img.status === 'pending') processImage(img);
    });
  };

  // --- Remix Logic ---
  const handleRemix = async () => {
    if (!sourcePrompt) return;
    setIsRemixing(true);
    try {
      const style = selectedStyleId === 'custom' 
        ? customStyleText 
        : styles.find(s => s.id === selectedStyleId)?.promptSuffix || "Standard";
        
      const result = await GeminiService.remixPrompt(sourcePrompt, style, variance, trainingText);
      setRemixedPrompt(result);
    } catch (e) {
      alert("翻版失败，请检查网络或Key");
    } finally {
      setIsRemixing(false);
    }
  };

  // --- Holiday Logic ---
  const handleHolidayGenerate = async () => {
    if (!selectedHolidayId) return;
    const holiday = VIETNAMESE_HOLIDAYS.find(h => h.id === selectedHolidayId);
    if (!holiday) return;

    setIsGeneratingHoliday(true);
    try {
      const style = selectedStyleId === 'custom' 
        ? customStyleText 
        : styles.find(s => s.id === selectedStyleId)?.promptSuffix || "Standard";

      const result = await GeminiService.generateHolidayPrompt(
        holiday, 
        style, 
        holidayPromptReq,
        genConfig
      );
      setGeneratedHolidayPrompt(result);
    } catch (e) {
      alert("生成失败");
    } finally {
      setIsGeneratingHoliday(false);
    }
  };

  // --- Render Helpers ---

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // --- Views ---

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <MagicIcon />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          灵感工坊
        </h1>
      </div>

      <button 
        onClick={() => setCurrentView(AppView.EXTRACTOR)}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentView === AppView.EXTRACTOR ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
      >
        <UploadIcon />
        <span>提词提取 (Vision)</span>
      </button>

      <button 
        onClick={() => setCurrentView(AppView.REMIXER)}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentView === AppView.REMIXER ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
      >
        <RefreshIcon />
        <span>Prompt 翻版</span>
      </button>

      <button 
        onClick={() => setCurrentView(AppView.HOLIDAYS)}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentView === AppView.HOLIDAYS ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
      >
        <BookIcon />
        <span>越南天主教节日库</span>
      </button>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <label className="block text-sm font-medium text-gray-400 mb-2">训练/系统指令 (通用)</label>
        <textarea 
          className="w-full h-32 bg-gray-950 border border-gray-700 rounded p-2 text-xs text-gray-300 focus:border-purple-500 focus:outline-none resize-none"
          placeholder="在此输入你的习惯指令，例如：'Always describe lighting first', 'Use Niji style grammar'..."
          value={trainingText}
          onChange={(e) => setTrainingText(e.target.value)}
        />
      </div>
    </div>
  );

  const renderStyleSelector = () => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-400 mb-3">AI 风格选择</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {styles.map(style => (
          <button
            key={style.id}
            onClick={() => setSelectedStyleId(style.id)}
            className={`p-2 text-sm rounded border text-left transition-all truncate ${selectedStyleId === style.id ? 'border-purple-500 bg-purple-900/20 text-purple-300' : 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
          >
            {style.name}
          </button>
        ))}
        <button
            onClick={() => setSelectedStyleId('custom')}
            className={`p-2 text-sm rounded border text-left transition-all ${selectedStyleId === 'custom' ? 'border-purple-500 bg-purple-900/20 text-purple-300' : 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
          >
            + 自定义风格
        </button>
      </div>
      {selectedStyleId === 'custom' && (
        <input 
          type="text" 
          placeholder="输入你的自定义风格描述 (例如: Polaroid vintage, heavy grain...)"
          className="mt-2 w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
          value={customStyleText}
          onChange={(e) => setCustomStyleText(e.target.value)}
        />
      )}
    </div>
  );

  const renderExtractorView = () => (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">图片描述词提取</h2>
        
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center bg-gray-900/50 hover:bg-gray-900 transition-colors relative mb-8">
          <input 
            type="file" 
            multiple 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="pointer-events-none">
            <div className="flex justify-center mb-4 text-gray-500">
              <UploadIcon />
            </div>
            <p className="text-gray-300 font-medium">点击或拖拽上传图片</p>
            <p className="text-gray-500 text-sm mt-1">支持批量上传，或直接 Ctrl+V 粘贴图片</p>
          </div>
        </div>

        {/* Action Bar */}
        {images.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm">{images.length} 张图片待处理</span>
            <button 
              onClick={processAllPending}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              全部提取
            </button>
          </div>
        )}

        {/* Image List */}
        <div className="space-y-6">
          {images.map(img => (
            <div key={img.id} className="bg-gray-800 rounded-lg p-4 flex gap-4 border border-gray-700">
              <div className="w-32 h-32 flex-shrink-0 bg-gray-900 rounded overflow-hidden relative group">
                 <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                 <button 
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-black/60 p-1 rounded hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
                 >
                   <TrashIcon />
                 </button>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    img.status === 'done' ? 'bg-green-900 text-green-300' :
                    img.status === 'processing' ? 'bg-yellow-900 text-yellow-300' :
                    img.status === 'error' ? 'bg-red-900 text-red-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {img.status === 'done' ? '提取完成' : img.status === 'processing' ? '提取中...' : img.status === 'error' ? '失败' : '待处理'}
                  </span>
                  {img.status !== 'processing' && img.status !== 'done' && (
                     <button onClick={() => processImage(img)} className="text-xs text-purple-400 hover:text-purple-300">开始提取</button>
                  )}
                </div>
                
                {img.extractedPrompt ? (
                  <div className="flex-1 relative group">
                    <textarea 
                      readOnly 
                      className="w-full h-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-gray-300 resize-none focus:outline-none"
                      value={img.extractedPrompt}
                    />
                    <button 
                      onClick={() => copyToClipboard(img.extractedPrompt!)}
                      className="absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600 p-1.5 rounded text-white shadow"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-900/50 rounded border border-gray-700/50 flex items-center justify-center text-gray-600 text-sm">
                    {img.status === 'processing' ? 'AI 正在分析画面元素...' : '等待提取...'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRemixer = () => (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Prompt 描述语翻版</h2>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-medium mb-2">原始描述语 / 想法</label>
          <textarea 
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
            placeholder="输入你想修改的Prompt，或者简单的中文描述..."
            value={sourcePrompt}
            onChange={(e) => setSourcePrompt(e.target.value)}
          />
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          {renderStyleSelector()}

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">差异度 (Variance)</label>
              <span className="text-xs text-purple-400 uppercase">{variance === 'subtle' ? '微调 (Similar)' : variance === 'moderate' ? '适中 (Balanced)' : '重构 (Different)'}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="1"
              value={variance === 'subtle' ? 0 : variance === 'moderate' ? 1 : 2}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setVariance(val === 0 ? 'subtle' : val === 1 ? 'moderate' : 'extreme');
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>相近</span>
              <span>巨大差异</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleRemix}
          disabled={!sourcePrompt || isRemixing}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {isRemixing ? 'AI 正在翻版中...' : '生成翻版 Prompt'}
        </button>

        {/* Output */}
        {remixedPrompt && (
          <div className="bg-gray-800 border border-purple-500/30 rounded-lg p-4 relative animate-in fade-in slide-in-from-bottom-4">
             <h3 className="text-purple-400 text-xs font-bold uppercase mb-2">翻版结果</h3>
             <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{remixedPrompt}</p>
             <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  onClick={() => {
                    setSourcePrompt(remixedPrompt);
                    setRemixedPrompt('');
                  }}
                  className="p-1.5 text-gray-400 hover:text-white"
                  title="以此结果再次翻版"
                >
                  <RefreshIcon />
                </button>
                <button 
                  onClick={() => copyToClipboard(remixedPrompt)}
                  className="p-1.5 text-gray-400 hover:text-white"
                >
                  <CopyIcon />
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );

  const renderHolidays = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* List / Table Panel */}
      <div className="w-1/3 border-r border-gray-800 flex flex-col bg-gray-900/50">
        <div className="p-4 border-b border-gray-800 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white">越南天主教节日库</h2>
          <p className="text-xs text-gray-500 mt-1">点击节日查看详情与生成 Prompt</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {VIETNAMESE_HOLIDAYS.map(holiday => (
            <div 
              key={holiday.id}
              onClick={() => setSelectedHolidayId(holiday.id)}
              className={`cursor-pointer p-4 rounded-lg border transition-all ${selectedHolidayId === holiday.id ? 'bg-purple-900/20 border-purple-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'}`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-bold text-sm ${selectedHolidayId === holiday.id ? 'text-purple-300' : 'text-gray-200'}`}>{holiday.name}</h3>
              </div>
               <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300 mt-2 inline-block">{holiday.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail & Generate Panel */}
      <div className="w-2/3 flex flex-col bg-gray-950 overflow-y-auto">
        {selectedHolidayId ? (
          (() => {
            const h = VIETNAMESE_HOLIDAYS.find(x => x.id === selectedHolidayId)!;
            return (
              <div className="p-6">
                <div className="mb-8 space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">{h.name}</h1>
                      <p className="text-purple-400 text-sm font-medium">{h.date}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-xs text-gray-500 uppercase">默认祭衣颜色</span>
                       <div className="flex items-center justify-end gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            h.defaultVestmentColor === 'Red' ? 'bg-red-600' :
                            h.defaultVestmentColor === 'Green' ? 'bg-green-600' :
                            h.defaultVestmentColor === 'Purple' ? 'bg-purple-600' :
                            h.defaultVestmentColor === 'Gold' ? 'bg-yellow-500' : 'bg-white'
                          }`}></div>
                          <span className="text-sm text-gray-300">{h.defaultVestmentColor}</span>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-900 p-3 rounded border border-gray-800">
                        <h4 className="text-gray-500 text-xs uppercase font-bold mb-1">节日意义</h4>
                        <p className="text-gray-300 text-sm">{h.significance}</p>
                     </div>
                     <div className="bg-gray-900 p-3 rounded border border-gray-800">
                        <h4 className="text-pink-400 text-xs uppercase font-bold mb-1">视觉元素</h4>
                        <p className="text-gray-300 text-xs">{h.visualElements}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-800 p-3 rounded border border-gray-700">
                        <h4 className="text-blue-400 text-xs uppercase font-bold mb-1">神父 (Priest)</h4>
                        <p className="text-gray-300 text-sm">{h.priestActivity}</p>
                     </div>
                     <div className="bg-gray-800 p-3 rounded border border-gray-700">
                        <h4 className="text-green-400 text-xs uppercase font-bold mb-1">信徒 (Believers)</h4>
                        <p className="text-gray-300 text-sm">{h.believerActivity}</p>
                     </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MagicIcon /> 
                    <span>节日 Prompt 生成器</span>
                  </h3>
                  
                  {renderStyleSelector()}

                  {/* Visual Control Grid */}
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 mb-6">
                    <h4 className="text-xs text-purple-400 font-bold uppercase mb-3">高级视觉设定 (Visual Settings)</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {/* Batch & Length */}
                       <div>
                          <label className="block text-xs text-gray-500 mb-1">生成数量 (Batch Size)</label>
                          <select 
                            value={genConfig.batchSize}
                            onChange={(e) => setGenConfig({...genConfig, batchSize: parseInt(e.target.value)})}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500"
                          >
                            <option value={1}>1 个 Prompt</option>
                            <option value={3}>3 个 Prompt (批量)</option>
                            <option value={5}>5 个 Prompt (批量)</option>
                            <option value={10}>10 个 Prompt (批量)</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-xs text-gray-500 mb-1">单词数量 (Word Count)</label>
                          <select 
                            value={genConfig.wordCount}
                            onChange={(e) => setGenConfig({...genConfig, wordCount: parseInt(e.target.value)})}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500"
                          >
                            <option value={100}>简短 (100 words)</option>
                            <option value={200}>标准 (200 words)</option>
                            <option value={300}>丰富 (300 words)</option>
                            <option value={400}>超长细节 (400 words)</option>
                          </select>
                       </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">神父祭衣颜色 (Vestment)</label>
                          <select 
                            value={genConfig.vestmentColor}
                            onChange={(e) => setGenConfig({...genConfig, vestmentColor: e.target.value})}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500"
                          >
                            {LITURGICAL_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">镜头/构图 (Shot)</label>
                          <select 
                            value={genConfig.shotType}
                            onChange={(e) => setGenConfig({...genConfig, shotType: e.target.value})}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500"
                          >
                            {SHOT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">环境/场景 (Environment)</label>
                          <select 
                             value={genConfig.environment}
                             onChange={(e) => setGenConfig({...genConfig, environment: e.target.value})}
                             className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500"
                          >
                            {ENVIRONMENTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">主要活动 (Activity)</label>
                          <select 
                             value={genConfig.activity}
                             onChange={(e) => setGenConfig({...genConfig, activity: e.target.value})}
                             className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500"
                          >
                            {ACTIVITIES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-1">额外要求 (可选)</label>
                    <input 
                      type="text"
                      placeholder="例如：Focus on the candlelight reflection on faces..."
                      className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-purple-500 outline-none"
                      value={holidayPromptReq}
                      onChange={(e) => setHolidayPromptReq(e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={handleHolidayGenerate}
                    disabled={isGeneratingHoliday}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all disabled:opacity-50 shadow-lg"
                  >
                    {isGeneratingHoliday ? '正在构思节日细节...' : `生成 ${genConfig.batchSize} 个描述语`}
                  </button>

                  {generatedHolidayPrompt && (
                    <div className="mt-6 relative group animate-in fade-in slide-in-from-bottom-4">
                      <div className="absolute -top-3 left-4 bg-purple-600 text-white text-xs px-2 py-1 rounded">生成结果</div>
                      <textarea 
                        readOnly
                        value={generatedHolidayPrompt}
                        className="w-full h-64 bg-black border border-purple-500/50 rounded-lg p-4 text-sm text-gray-300 focus:outline-none whitespace-pre-wrap leading-relaxed"
                      />
                       <button 
                        onClick={() => copyToClipboard(generatedHolidayPrompt)}
                        className="absolute bottom-3 right-3 bg-gray-700 hover:bg-gray-600 p-1.5 rounded text-white shadow"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
            <BookIcon />
            <p className="mt-4">请在左侧选择一个节日以查看详细资料库和生成专用 Prompt。</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans">
      {renderSidebar()}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentView === AppView.EXTRACTOR && renderExtractorView()}
        {currentView === AppView.REMIXER && renderRemixer()}
        {currentView === AppView.HOLIDAYS && renderHolidays()}
      </main>
    </div>
  );
}

export default App;