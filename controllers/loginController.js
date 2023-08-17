const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
  const { tryUser } = req;
  jwt.sign(
    { user: { _id: tryUser._id, name: tryUser.name } },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
    (err, token) => {
      if (err) {
        // jwt error
        next(err);
      } else {
        res.json({
          message: `Welcome, ${tryUser.name}!`,
          token,
        });
      }
    },
  );
};
