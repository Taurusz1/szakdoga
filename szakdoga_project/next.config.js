/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // TODO: do NOT add '/' to the end
    API_ENDPOINT: "http://localhost:3000/api",
    GIT_USER: "Taurusz1",
    GIT_REPO: "Bom-To-CVE",
    
  },
}

module.exports = nextConfig