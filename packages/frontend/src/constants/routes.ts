export enum InternalRoutes {
  Home = '/congress',
  About = '/about',
  Legislator = '/congress/lawmaker',
  Topic = '/congress/topic',
  Speech = '/congress/a',
  Search = '/search',
  Council = '/council',
  Bill = '/council/bill',
  // councilor routes: /council/<region>/lawmaker/:slug
  Councilor = '/lawmaker',
  // council topic routes: /council/<region>/topic/:slug
  CouncilTopic = '/topic',
}

export enum ExternalRoutes {
  Medium = 'https://medium.com/twreporter',
  Subscription = 'https://www.twreporter.org/account/email-subscription',
  Support = 'https://support.twreporter.org/',
  AboutTwreporter = 'https://www.twreporter.org/about-us',
  TwReporter = 'https://www.twreporter.org',
  SubscribePodcast = 'https://solink.soundon.fm/twreporter-U7Q',
}
