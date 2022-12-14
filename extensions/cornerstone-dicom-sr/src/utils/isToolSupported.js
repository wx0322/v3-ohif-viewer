import dcmjs from 'dcmjs';

/**
 *  Checks if dcmjs has support to determined tool
 *
 * @param {string} toolName
 * @returns {boolean}
 */
const isToolSupported = toolName => {
  const adapter = dcmjs.adapters.Cornerstone3D;
  return !!adapter[toolName];
};

export default isToolSupported;
