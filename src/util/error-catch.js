import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

//异常捕获
if (process.env.NODE_ENV !== 'development' &&
  window.location.hostname.indexOf('rapa.vip') > -1) {
  Sentry.init({
    dsn: 'https://f52e5d198aae4679bf8e7379cfe442f8@sentry.io/1459697',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: false,
      }),
    ],
  });
}
