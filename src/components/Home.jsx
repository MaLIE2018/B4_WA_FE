import { Container, Row, Col } from "react-bootstrap";
import LeftNav from "./LeftNav";
import MainChat2 from "./MainChat2/MainChat2";
import "../index.css";
import { useContext } from "react";
import { LoginContext } from "./GlobalState";
import Contacts from "./Contacts.jsx";
import Profile from "./Profile";
const Home = () => {
  const { user } = useContext(LoginContext);
  return (
    <Container fluid='sm' className=''>
      <Row className='main-div-home d-flex justify-content-center'>
        <Col
          md={3}
          style={{
            backgroundColor: "#f0f0f0",
            height: "100%",
            position: "relative",
          }}>
          <LeftNav
            profile={user.profile}
            chats={user.chats}
            friends={user.friends}
          />
          <Profile profile={user.profile} />
          <Contacts friends={user.friends} />
        </Col>
        <Col
          md={6}
          style={{
            backgroundColor: "#f0f0f0",
          }}>
          <div
            style={{
              position: "relative",
              zIndex: 100,
              height: "calc(100vh - 4rem)",
              overflow: "hidden",
            }}>
            <MainChat2 />
          </div>
          {/* <MainChat /> */}
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
