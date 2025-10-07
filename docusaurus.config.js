// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Setting up CI/CD Workflows for Snowflake',
  tagline: '',
  favicon: 'img/favicon.ico',

  url: 'https://celebrated-faun-5a3353.netlify.app',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // ✅ Enable Mermaid support in Markdown
  markdown: {
    mermaid: true,
  },

  // ✅ Load Mermaid theme
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
          //editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },

        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    path.resolve(__dirname, 'plugins/webpack-polyfills'),
    path.resolve(__dirname, 'plugins/webpack-aliases.js'),
  ],

  themeConfig: { 
    image: 'img/beems-social-card.jpg',
    navbar: {
      title: 'Beems Technologies',
      logo: {
        alt: 'Beems Technologies Logo',
        src: 'img/image.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Webinar Topics',
          to: '/docs',
        },
    {
      label: 'GitHub Repo',
      href: 'https://github.com/beemstec/cicd-with-snowcli-demo',
      position: 'left',
    },

      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Contact',
          items: [
            {
              label: '📞 (+91) 91769 04546',
              href: 'tel:(+91) 91769 04546',
            },
            {
              label: '✉️ contact@beems.in',
              href: 'mailto:contact@beems.in',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Beems Technologies`,
    } ,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
