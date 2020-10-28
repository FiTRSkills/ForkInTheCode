const { validationResult } = require('express-validator');

//route middleware ensuring proper validation
function isValidated(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send('Failed Validation.');
    } else {
      return next();
    }
  }


  module.exports = isValidated;