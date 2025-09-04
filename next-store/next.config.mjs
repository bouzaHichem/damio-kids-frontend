const nextConfig = {
  images: {
    // Allow optimized remote images from Cloudinary and your backend
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'damio-kids-backend.onrender.com' },
      { protocol: 'https', hostname: '**.onrender.com' },
    ],
  },
}
export default nextConfig

