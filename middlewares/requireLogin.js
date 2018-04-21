module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'Tou must log in' });
  }

  next();
};
// Making sure user is infact logged in.
// next is function called when middleware is executed. Similar to done.
