export const ironOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME as string, // 相当于就是sessionId
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    maxAge: 24 * 60 * 60 * 1000, // cookie有效时间，单位ms
    secure: process.env.NODE_ENV === 'production', // 在生产环境设置true，前端不能用js修改cookie
  },
};

export const githubOptions = {
  githubClientID: process.env.GITHUB_CLIENT_ID as string,
  githubSecrect: process.env.GITHUB_SECRECT as string
}
