// // context/DateContext.tsx
// import React, { createContext, useState, useContext } from 'react';

// const DateContext = createContext();

// export const DateProvider = ({ children }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // 기본값: 오늘 날짜

//   return (
//     <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
//       {children}
//     </DateContext.Provider>
//   );
// };

// // 커스텀 훅
// export const useDate = () => useContext(DateContext);
