import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [studentName, setStudentName]       = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear]     = useState('');
  const [answers, setAnswers]               = useState({});
  const [score, setScore]                   = useState(null);
  const [breakdown, setBreakdown]           = useState([]);
  const [questions, setQuestions]           = useState([]);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [yearModalOpen, setYearModalOpen]   = useState(false);

  return (
    <AppContext.Provider value={{
      studentName, setStudentName,
      selectedSubject, setSelectedSubject,
      selectedYear, setSelectedYear,
      answers, setAnswers,
      score, setScore,
      breakdown, setBreakdown,
      questions, setQuestions,
      sidebarOpen, setSidebarOpen,
      yearModalOpen, setYearModalOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
