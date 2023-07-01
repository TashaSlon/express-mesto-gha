class NotAuthError extends Error {
  constructor(err) {
    super(err);
    this.message = err.body;
    this.statusCode = 401;
  }
}

module.exports = NotAuthError;
