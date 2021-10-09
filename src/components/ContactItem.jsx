import React, { useContext, useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";

import { FaUserCheck } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { LoginContext } from "./GlobalState";
const ContactItem = ({ item }) => {
  const { setGroup, group } = useContext(LoginContext);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (group.find((id) => id === item._id)) {
      setSelected(true);
    } else setSelected(false);
  }, [group]);

  return (
    <ListGroup.Item className='d-flex flex-row justify-content-between align-content-center'>
      <div className=''>
        <span className='avatar-div'>
          <img
            src={item.profile.avatar}
            className='avatar-img'
            alt='contact-avatar'
          />
        </span>
      </div>
      <div className=''>{item.profile.firstName} </div>
      <div
        className='add-to-group'
        onClick={() => {
          if (selected) {
            setGroup(group.filter((id) => id !== item._id));
          } else {
            setGroup([...group, item._id]);
          }
          setSelected(!selected);
        }}>
        {selected ? <FaUserCheck size={22} /> : <HiUserAdd size={22} />}
      </div>
    </ListGroup.Item>
  );
};

export default ContactItem;
