import React from "react";
import { withRouter } from "react-router-dom";

const Landing = ({ history }) => {
  const goToHome = () => {
    history.push(`/chemical`);
  };

  return (
    <React.Fragment>
      <div className="landing-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <img
                className="home-image d-block my-2 my-md-5"
                src="images/logo-white.svg"
                alt="logo"
              />
              <div className="landing-text-container-upper">
                The everyday lives of contemporary youth are awash with{" "}
                <span className="font-weight-bold">chemicals</span> to boost
                pleasure, moods, sexual performance, appearance and health. What
                do pills, drinks, sprays, powders and lotions do for youth? What
                effects are they seeking? How can we understand the ways
                chemicals affect{" "}
                <span className="font-weight-bold">young bodies</span> and{" "}
                <span className="font-weight-bold">minds</span>? Instead of
                focusing on illegal drug use with the purpose of controlling it,
                we study the pervasive use of chemicals in everyday life –
                ethnographically, from the{" "}
                <span className="font-weight-bold">perspective of youth</span>{" "}
                themselves.
              </div>
              <div className="landing-text-container-lower">
                We draw on medical anthropology and studies of science,
                technology and contemporary youth culture to research the lived
                effects of chemicals. By ‘lived effects’, we mean the
                combination of chemicals’ pharmaceutical properties, beliefs and
                expectations surrounding their use, and users’ experimentation
                with various techniques. Our ethnographic fieldwork, based on
                participant observation and long-term immersion in the field,
                takes place in the Netherlands, France, Indonesia and the
                Philippines. <br />
                This website is dynamic, experimental and rich, like the methods
                used and insights produced during our innovative, tentacular
                project. The first phase of ChemicalYouth has ended, but our
                work continues and this website will keep growing. We have many
                publications in the oven, and numerous small and big projects
                are still in the works. It is likely that you will find
                something new every time you visit us.
              </div>
              <div className="text-center">
                <div
                  className="landing-link d-inline-flex justify-content-center align-items-center"
                  onClick={() => goToHome()}
                >
                  <span>EXPLORE THE PROJECT</span>
                  <i className="ml-2 material-icons">arrow_forward</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-container">
        <div className="container py-4">
          <div className="row py-5 align-items-center">
            <div className="col-12 col-md-4">
              <p className="footer-desc mb-0">
                The ChemicalYouth project is based at the University of
                Amsterdam and received 5 years of funding from the European
                Research Council (2013-2018).
              </p>
            </div>
            <div className="col-12 col-md-8 d-flex flex-md-row flex-column align-items-center justify-content-between">
              <div className="my-3 my-md-0">
                <a href="http://aissr.uva.nl/">
                  <img
                    src="images/aissr_logoblokjesite_GRAY.png"
                    height="80px"
                    alt="logo"
                    className="mr-3"
                  />
                </a>
                <a href="http://www.uva.nl/en">
                  <img
                    src="images/uvalogo_tag_p.png"
                    height="80px"
                    alt="logo"
                    className="mr-3"
                  />
                </a>
                <a href="http://erc.europa.eu/">
                  <img
                    src="images/LOGO_ERC.png"
                    height="80px"
                    alt="logo"
                    className="mr-3"
                  />
                </a>
                <a href="http://erc.europa.eu/">
                  <img
                    src="images/europe.png"
                    height="80px"
                    alt="logo"
                    className="mr-3"
                  />
                </a>
              </div>
              <div className="text-right">
                <p className="mb-2">Designed and developed by</p>
                <a href="https://calib.ro">
                  <img src="images/calibro_logo.jpg" height="25" alt="logo" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Landing);
