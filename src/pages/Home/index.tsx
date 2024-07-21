import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from 'react-head';
import { JsonLd } from 'react-schemaorg';
import { HomepageLd, EirikLd } from '../../ld';
import { ProfilePage } from 'schema-dts';
import './style.css';

export const Home = () => {
  const interests = EirikLd.knowsAbout;
  interests.length satisfies 3;
  const interestsStr = `${interests[0].toLowerCase()}, ${interests[1].toLowerCase()} and ${interests[2].toLowerCase()}`;

  return (
    <>
      <Title>{HomepageLd.name}</Title>
      <JsonLd<ProfilePage>
        item={{
          '@context': 'https://schema.org',
          ...HomepageLd
        }}
      />
      <h1>{EirikLd.name}</h1>
      <p className="description">
        Tech enthusiast interested in {interestsStr}. Enjoys sci-fi and racket sports. Based in Oslo.
      </p>
      <p>
        <a className="link" href="https://github.com/ekulno">
          Github
        </a>
        <a className="link" href="https://www.linkedin.com/in/eirik-kultorp-aa0225256/">
          LinkedIn
        </a>
        <Link className="link" to="/contact">
          Contact
        </Link>
      </p>

      <img src="/portrait.png" className="portrait" />
    </>
  );
};
