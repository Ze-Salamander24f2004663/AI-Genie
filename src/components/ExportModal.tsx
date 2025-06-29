import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, FileText, Image, Loader } from 'lucide-react';
import { ExportService, LifePlan } from '../services/export';
import toast from 'react-hot-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lifePlan: LifePlan;
}

export default function ExportModal({ isOpen, onClose, lifePlan }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'image'>('pdf');

  const exportService = new ExportService();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportType === 'pdf') {
        const pdfBlob = await exportService.exportLifePlanAsPDF(lifePlan);
        exportService.downloadBlob(pdfBlob, `${lifePlan.title.replace(/\s+/g, '-')}-life-plan.pdf`);
        toast.success('📄 Life Plan PDF downloaded successfully!');
      } else {
        const imageBlob = await exportService.exportLifePlanAsImage(lifePlan);
        exportService.downloadBlob(imageBlob, `${lifePlan.title.replace(/\s+/g, '-')}-life-plan.png`);
        toast.success('🖼️ Life Plan image downloaded successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsExporting(true);
    
    try {
      const imageBlob = await exportService.exportLifePlanAsImage(lifePlan);
      const shareText = `🧞 Check out my AI Genie Life Plan: "${lifePlan.title}"\n\nGenerated with AI-powered guidance at aigenie.app`;
      
      await exportService.shareToSocial(imageBlob, shareText);
      toast.success('🚀 Ready to share your Life Plan!');
    } catch (error: any) {
      toast.error(error.message || 'Share preparation failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
            
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Download className="text-white" size={24} />
                </motion.div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Export Life Plan
                </h2>
                <p className="text-gray-600 mt-2">
                  Share your journey with the world
                </p>
              </div>

              {/* Life Plan Preview */}
              <div className="bg-white/60 rounded-xl p-4 mb-6 border border-white/30">
                <h3 className="font-bold text-gray-900 mb-2">{lifePlan.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{lifePlan.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{lifePlan.goals.length} goals</span>
                  <span>{lifePlan.insights.length} insights</span>
                  <span>{lifePlan.recommendations.length} recommendations</span>
                </div>
              </div>

              {/* Export Type Selection */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900">Choose Export Format</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setExportType('pdf')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      exportType === 'pdf'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white/60 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className={`mx-auto mb-2 ${exportType === 'pdf' ? 'text-primary-600' : 'text-gray-600'}`} size={24} />
                    <div className="text-sm font-semibold">PDF Document</div>
                    <div className="text-xs text-gray-500">Detailed report</div>
                  </motion.button>

                  <motion.button
                    onClick={() => setExportType('image')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      exportType === 'image'
                        ? 'border-secondary-500 bg-secondary-50'
                        : 'border-gray-200 bg-white/60 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image className={`mx-auto mb-2 ${exportType === 'image' ? 'text-secondary-600' : 'text-gray-600'}`} size={24} />
                    <div className="text-sm font-semibold">Social Image</div>
                    <div className="text-xs text-gray-500">Perfect for sharing</div>
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isExporting ? 1 : 1.02 }}
                  whileTap={{ scale: isExporting ? 1 : 0.98 }}
                >
                  {isExporting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="animate-spin" size={18} />
                      <span>Exporting...</span>
                    </div>
                  ) : (
                    <>
                      <Download size={18} className="inline mr-2" />
                      Download {exportType === 'pdf' ? 'PDF' : 'Image'}
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  disabled={isExporting}
                  className="w-full bg-gradient-to-r from-secondary-500 to-accent-500 text-white font-semibold py-3 rounded-xl hover:from-secondary-600 hover:to-accent-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isExporting ? 1 : 1.02 }}
                  whileTap={{ scale: isExporting ? 1 : 0.98 }}
                >
                  {isExporting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="animate-spin" size={18} />
                      <span>Preparing...</span>
                    </div>
                  ) : (
                    <>
                      <Share2 size={18} className="inline mr-2" />
                      Share on Social
                    </>
                  )}
                </motion.button>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 text-xs text-gray-500">
                <p>✨ Exported plans include AI Genie branding</p>
                <p>🚀 Help others discover their potential!</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}