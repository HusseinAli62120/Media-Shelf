// To protect routes that need authentication

const requireAuth = async ({ event }: { event: any }) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401, // Unauthorized
    message: "Invalid Authentication Credentials",
  });

  return user;
};

export default requireAuth;
