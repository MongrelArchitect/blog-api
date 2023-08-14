const jwt = require('jsonwebtoken');

exports.getPosts = (req, res) => {
  res.json({ message: 'GET all posts' });
};

exports.postNewPost = [
  // authenticate user & add to request
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, authInfo) => {
        if (authInfo) {
          req.user = authInfo.user;
        }
      });
    }
    next();
  },

  (req, res) => {
    // we only have a user if jwt is verified
    if (req.user) {
      // XXX 
      // Handle actual post creation
      res.json({ message: 'POST new post' });
    } else {
      res.status(403).json({
        status: 403,
        message: 'Forbidden - authorization required',
      });
    }
  },
];
