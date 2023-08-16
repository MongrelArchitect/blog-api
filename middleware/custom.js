const { isValidObjectId } = require('mongoose');
const jwt = require('jsonwebtoken');

exports.checkValidPostId = (req, res, next) => {
  // ensure we've got a legit mongodb id
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(404).json({
      status: 404,
      message: `Post not found (${id})`,
    });
  } else {
    next();
  }
};

exports.verifyUser = (req, res, next) => {
  // check for auth header and verify user
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, authInfo) => {
      if (authInfo) {
        // add to request if jwt verified
        req.user = authInfo.user;
      }
    });
  }

  // check if verified user was added to the request
  if (req.user) {
    next();
  } else {
    res.status(403).json({
      status: 403,
      message: 'Forbidden - authorization required',
    });
  }
};
