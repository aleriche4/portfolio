import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";
import { ExternalLink } from "react-external-link";
import data from "../components/data/data.json";
import classes from "./PortfolioPage.module.css";
import "../images/bullet.gif";
import "../images/bullet2.gif";
// import heartbeat from "../images/thumbs/heartbeat.gif";
import "../images/thumbs/digitas.gif";
// import styled from "styled-components";

export default function PortfolioPage({post}) {

//   const NavUnlisted = styled.ul`
//   display: flex;
//   a {
//     text-decoration: underline;
//   }
//   li {
//     position: absolute;
//     font-size: 14px;
//     right: 15px;
//   }
//   .current {
//     li {
//       border-bottom: 2px solid black;
//     }
//   }
// `;

  // const [isOpen, onClose] = useState(false);
  // function clickHandlerOverlay(e) {
  //   e.preventDefault();
  //   onClose(!isOpen);
  // }
  return (
    <motion.div
      className={classes.PortfolioContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className={classes.portfolio}>
        {data &&
          data.map((Data) => {
            return (
              <div key={Data.id}>
                <div className={classes.image}>
                  <ExternalLink href={Data.link}>
                    <img src={require("../images/thumbs/" + Data.imageName)} width="100px" alt={Data.companyName} />
                  </ExternalLink>
                </div>
                <div className={classes.rightSide}>
                  <div style={{ display: Data.sample !== null ? "block" : "none" }}>
                    {/* <ul className={classes.linkSample}> */}
                    {/* <NavUnlisted> */}
                      <Link to={Data.sample !== null ? "/samples/" + Data.sample : {}}>
                        {/* <li> */}
                          <button className={classes.buttonSample}>{Data.sampleType}</button>
                        {/* </li> */}
                      </Link>
                    {/* </NavUnlisted> */}
                    {/* </ul> */}
                  </div>
                  <div className={classes.title}>{Data.companyName}</div>
                  <div className={classes.city}>&nbsp;&nbsp;{Data.city}</div>
                  <div className={classes.keys}>Position:</div>
                  <div className={classes.jobPosition}>{Data.position}</div>
                  <div className={classes.keys}>Applications used:</div>
                  <div className={classes.infoText}>{Data.application}</div>
                  <div className={classes.key2}>Technologies:</div>
                  <div className={classes.code}>{Data.technology}</div>
                  <div className={classes.keys}>Achievements:</div>
                  <div className={classes.value}>
                    <ul>
                      {Data.achievement.map((Achievement, index) => (
                        <li key={index}>
                          {Achievement /*.replace("®", "<sup>®</sup>")*/}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={classes.note}>{Data.note}</div>
                </div>
              </div>
            );
          })}
        <Outlet />
      </div>
    </motion.div>
  );
}
