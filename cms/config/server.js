module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 3002),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'ba3bd67b0a78eccfd88bd755d98c4d7f'),
    },
  },
});
