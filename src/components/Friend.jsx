import "./styles/Friend.css";
import { HiArrowNarrowRight } from "react-icons/hi";

import { useContext } from "react";
import { LoginContext } from "./GlobalState";

import { Row, Col } from "react-bootstrap";

const Friend = () => {
  const unToggleFriend = () => {
    const mainComp = document.getElementById("friend");
    mainComp.style.width = "0px";
  };
  const { chatPartner } = useContext(LoginContext);

  return (
    <>
      <div id='friend' className='friend-right-nav'>
        <div className='navigation-profile-friend'>
          <span>
            <HiArrowNarrowRight
              onClick={() => unToggleFriend()}
              className='narrow-header-friend'
            />
          </span>
          <span className='navigation-header-friend'> Contact information</span>
        </div>

        <Row>
          <Col md={12}>
            <div className='profile-div-text-friend'>
              {chatPartner && chatPartner.name}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className='profile-avatar-wrapper  '>
              <img
                src={chatPartner && chatPartner.avatar}
                className='profile-avatar'
                alt='profile-avatar'
              />
            </div>
            <div className='profile-details-wrapper-friend'>
              <div>
                <div className='name-descr-friend'>
                  Last name
                  <div className='muted-text-friend'>Here is email</div>
                </div>
                <div className='profile-name-edit-friend'></div>
              </div>
            </div>
            <div className='profile-details-wrapper-friend'>
              <div>
                <div className='name-descr-friend'>
                  Emails
                  <div className='muted-text-friend'>Here is email</div>
                </div>
              </div>
            </div>
            <div className='profile-details-wrapper-friend'>
              <div>
                <div className='name-descr-friend'>
                  See more
                  <div className='muted-text-friend'>Other informations</div>
                </div>
                <div className='profile-name-edit-friend'></div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Friend;
