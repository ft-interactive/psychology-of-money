export default () => ({ // eslint-disable-line

  // link file UUID
  id: '234ab1dc-ccf9-11e6-864f-20dcb35cede2',

  // canonical URL of the published page
  // https://ig.ft.com/sites/quiz/psychology-of-money get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/quiz/psychology-of-money/',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-01-12T05:30:00Z'),

  headline: 'Anxious investor or cash-spending gambler? Take our money psychology quiz',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Do you shop online when you feel lonely, or are you constantly worried about money? Find out what your financial behaviour says about you',

  topic: {
    name: 'Managing Yourself',
    url: 'https://www.ft.com/topics/themes/Managing_Yourself',
  },

  relatedArticle: {
    text: 'Related article »',
    url: 'https://www.ft.com/content/5e8da24c-bb09-11e6-8b45-b8b81dd5d080',
  },

  mainImage: {
    title: '',
    description: '',
    url: 'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fig.ft.com%2Fstatic%2Fpsychology-of-money%2Fanxious.jpg?source=ig&width=2048&height=1152',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Naomi Rovnick', url: 'https://www.ft.com/stream/authorsId/Q0ItMDMzNDMwNg==-QXV0aG9ycw==' },
    { name: 'David Blood', url: 'https://twitter.com/davidcblood' },
    { name: 'Claer Barrett', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMDk1Nw==-QXV0aG9ycw==' },
    { name: 'Keith Fray', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMDc1MQ==-QXV0aG9ycw==' },
  ],

  // Appears in the HTML <title>
  title: 'Anxious investor or cash-spending gambler? Take our money psychology quiz',

  // meta data
  description: 'Do you online shop when you feel lonely, or are you constantly worried about money? Find out what your financial behaviour says about you',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
  // twitterImage: '',
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // twitterHeadline:  '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
