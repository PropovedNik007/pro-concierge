import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter(),
    paths: {
      // Set base path to your repository name
      base: process.env.NODE_ENV === 'production' ? '/pro-concierge' : '',
    },
  },
};

export default config;
