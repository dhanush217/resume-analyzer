import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, X, CheckCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Upload className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Upload Your Resume
        </h3>
        <p className="text-gray-600">
          Drop your resume file here or click to browse
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {isDragActive ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-primary-600"
            >
              <Upload className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Drop your resume here!</p>
            </motion.div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Choose a file or drag & drop
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, TXT (Max 5MB)
                </p>
              </div>
              <button className="btn-secondary mx-auto">
                Browse Files
              </button>
            </>
          )}
        </div>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg"
        >
          <div className="flex items-start space-x-2">
            <X className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-danger-800">Upload Failed</p>
              {fileRejections.map(({ file, errors }) => (
                <div key={file.path} className="mt-1">
                  <p className="text-xs text-danger-600">
                    {file.path}: {errors.map(e => e.message).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Accepted Files */}
      {acceptedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          {acceptedFiles.map((file) => (
            <div
              key={file.path}
              className="flex items-center justify-between p-3 bg-success-50 border border-success-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-success-100 rounded-full">
                  <File className="w-4 h-4 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-success-800">{file.name}</p>
                  <p className="text-xs text-success-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
          ))}
        </motion.div>
      )}

      {/* Supported Formats Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Supported formats:</h4>
        <div className="flex flex-wrap gap-2">
          {['.PDF', '.DOC', '.DOCX', '.TXT'].map((format) => (
            <span
              key={format}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;
