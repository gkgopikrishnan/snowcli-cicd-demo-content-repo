// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Data Engineering with Snowflake, DBT',
  tagline: '',
  favicon: 'img/favicon.ico',

  url: 'https://celebrated-faun-5a3353.netlify.app',
  baseUrl: '/',

  organizationName: 'facebook',
  projectName: 'docusaurus',

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
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
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
    image: 'img/docusaurus-social-card.jpg',
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
      label: 'Webinar Topics Covered',
      to: '/docs/intro',
    },
    {
      label: 'Videos',
      position: 'left',
      items: [
        {
          label: 'Set up SnowCLI in local',
          href: 'https://youtu.be/1GEdOGOlWI8?si=RY2LUteYQJzJ-0SY',
        },
        // You can add more videos here
      ],
    },
    {
      label: 'GitHub Repo',
      href: 'https://github.com/gkgopikrishnan/devops-cicd-demo-repo',
      position: 'left',
    },
        // {to: '/blog', label: 'Blog', position: 'left'},
        // {
        //   href: 'https://github.com/facebook/docusaurus',
        //   label: 'GitHub',
        //   position: 'right',
        // },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //     },
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus',
        //     },
        //     {
        //       label: 'X',
        //       href: 'https://x.com/docusaurus',
        //     },
        //   ],
        // },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: '/blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/facebook/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Beems Technologies Pvt Ltd.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
