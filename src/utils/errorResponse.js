import {
  CONFLICT,
  MISSING_DATA,
  NOT_FOUND,
  PEER_ERROR,
  VALIDATION_ERROR,
} from '../constants/error';

export default (err, res) => {
  switch (err.message) {
    case MISSING_DATA:
      return res.status(400).json({
        error: 'Missing input parameters',
      });
    case VALIDATION_ERROR:
      return res.status(400).json({
        error: 'Validation error',
        message: err.reason,
      });
    case NOT_FOUND:
      return res.status(404).json({
        error: 'Entity not found',
      });
    case CONFLICT:
      return res.status(409).json({
        error: 'Resource already exists',
      });
    case PEER_ERROR:
      return res.status(409).json({
        error: 'Peer resource does not exist',
        message: err.reason,
      });
    default:
      return res.status(500).json({
        error: 'Generic server error',
        message: err.message,
      });
  }
};