import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronDown } from 'lucide-react';

const JobRoleSelector = ({ jobRoles, selectedJobRole, onJobRoleChange, loading = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 max-w-md mx-auto"
    >
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
          <Briefcase className="w-6 h-6 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Select Target Job Role
        </h3>
        <p className="text-sm text-gray-600">
          Choose the role you're applying for to get tailored analysis
        </p>
      </div>

      <div className="relative">
        <select
          value={selectedJobRole}
          onChange={(e) => onJobRoleChange(e.target.value)}
          className="form-select appearance-none cursor-pointer"
          disabled={loading}
        >
          <option value="">{loading ? 'Loading job roles...' : 'Select a job role...'}</option>
          {jobRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {selectedJobRole && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200"
        >
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-primary-800">
                Selected: {selectedJobRole}
              </p>
              <p className="text-xs text-primary-600 mt-1">
                Analysis will be optimized for this role's requirements
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobRoleSelector;
