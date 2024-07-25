import { ContactPage, Person, ProfilePage } from 'schema-dts';

export const EirikLd = {
  '@type': 'Person',
  '@id': 'https://ekul.no/eirik',
  name: 'Eirik Kultorp',
  givenName: 'Eirik',
  familyName: 'Kultorp',
  alumniOf: 'https://www.wikidata.org/wiki/Q1065414',
  knowsAbout: ['Computer science', 'Software engineering', 'Knowledge representation'],
  sameAs: [
    'https://github.com/ekulno',
    'https://www.linkedin.com/in/eirik-kultorp-aa0225256/',
    'https://triplydb.com/eirik'
  ],
  homeLocation: 'https://www.wikidata.org/wiki/Q585'
} as const;
EirikLd satisfies Person;

export const HomepageLd = {
  '@type': 'ProfilePage',
  url: 'https://ekul.no',
  mainEntity: EirikLd,
  name: "Eirik's homepage"
} as const;

HomepageLd satisfies ProfilePage;

export const ContactpageLd = {
  '@type': 'ContactPage',
  url: 'https://ekul.no/contact',
  name: 'Contact Eirik'
} as const;

ContactpageLd satisfies ContactPage;
