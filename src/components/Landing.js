import React from 'react';
import { withRouter } from 'react-router-dom';

const Landing = ({ history }) => {
  const goToHome = () => {
    history.push(`/chemical`);
  };

  return (
    <div className='landing-container'>
      <div className='landing-upper-container'>
        <div className='landing-upper-content'>
          <div className='landing-logo-container'>
            <img src='images/logo-white.svg' width='350px' />
          </div>
          <div className='landing-text-container'>
            <div className='w-100 landing-text-container-upper'>
              The everyday lives of contemporary youth are awash with chemicals
              to boost pleasure, moods, sexual performance, appearance and
              health. What do pills, drinks, sprays, powders and lotions do for
              youth? What effects are they seeking? How can we understand the
              ways chemicals affect young bodies and minds? <br />
              <br />
              Instead of focusing on illegal drug use with the purpose of
              controlling it, we study the pervasive use of chemicals in
              everyday life – ethnographically, from the perspective of youth
              themselves.
            </div>
            <div
              className='landing-text-container-lower'
              style={{ marginRight: '2%' }}
            >
              We draw on medical anthropology and studies of science, technology
              and contemporary youth culture to research the lived effects of
              chemicals. By ‘lived effects’, we mean the combination of
              chemicals’ pharmaceutical properties, beliefs and expectations
              surrounding their use, and users’ experimentation with various
              techniques. Our ethnographic fieldwork, based on participant
              observation and long-term immersion in the field, takes place in
              the Netherlands, France, Indonesia and the Philippines.
            </div>
            <div
              className='landing-text-container-lower'
              style={{ marginLeft: '2%' }}
            >
              This website is dynamic, experimental and rich, like the methods
              used and insights produced during our innovative, tentacular
              project.
              <br />
              <br />
              The first phase of ChemicalYouth has ended, but our work continues
              and this website will keep growing. We have many publications in
              the oven, and numerous small and big projects are still in the
              works. It is likely that you will find something new every time
              you visit us.
            </div>
          </div>
        </div>
      </div>
      <div className='landing-lower'>
        <div
          className='landing-lower-link rainbow-line'
          onClick={() => goToHome()}
        >
          Explore the project
          <span>
            <img src='images/arrow-right.svg' width='20px' />
          </span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Landing);
