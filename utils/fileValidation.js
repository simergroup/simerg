export const validateFile = (file, options = {}) => {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  } = options;

  const errors = [];

  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  
  const typeMap = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
  };

  return typeMap[extension] || null;
};
