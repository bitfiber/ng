import {rxHost, utilsHost} from '../';

export default {
  index: {
    title: 'Home',
    type: 'page',
    display: 'hidden',
  },
  store: {
    title: 'NgStore',
    type: 'page',
  },
  about: {
    title: 'About',
    type: 'page',
  },
  otherProjects: {
    title: 'Other Projects',
    type: 'menu',
    items: {
      rx: {
        title: 'Bitfiber Rx',
        href: rxHost,
      },
      utils: {
        title: 'Bitfiber Utils',
        href: utilsHost,
      },
    },
  },
};
