import vercel from '@sveltejs/adapter-vercel';

const config = {
  kit: {
    adapter: vercel(),
    // Optional: If you set paths.base for GitHub Pages, remove or conditionally handle it for Vercel
  }
};

export default config;
