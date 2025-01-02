import React from 'react';
import {DocsThemeConfig} from 'nextra-theme-docs';

import {Head, Logo, Footer, gitHost} from './';

const config: DocsThemeConfig = {
  head: <Head/>,
  logo: <Logo/>,
  footer: {content: <Footer/>},
  project: {link: gitHost},
  docsRepositoryBase: `${gitHost}tree/main/projects/docs`,
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: false,
    toggleButton: true,
  },
  feedback: {
    labels: 'feedback',
    content: () => <>Feedback</>,
    useLink: () => `${gitHost}issues`,
  },
};

export default config;
