import React, { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [nickname, setNickname] = useState('ゲスト');
  const [icon, setIcon] = useState('https://via.placeholder.com/150'); // Default icon

  const updateProfile = (newNickname, newIcon) => {
    setNickname(newNickname);
    setIcon(newIcon);
  };

  return (
    <ProfileContext.Provider value={{ nickname, icon, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);