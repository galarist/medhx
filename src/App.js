import React, {useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './main.css'
import axios from 'axios';
import Header from './header';
import Dashboard from './routes/dashboard';
import LandingPage from './routes';
import NewPatient from './routes/signup';
import MyDocs from './routes/docs';
import Meds from './routes/meds';
import Guide from './routes/guide';
import globeEndpointPath from './GlobalVar';
/**
 * Checking if token is exists
 */
const getUser = () => {
  const loggedInUser = localStorage.getItem('admin');
  if (loggedInUser) {
    const foundUser = loggedInUser;
    return foundUser
  } else {
    return null
  }
}
const App = () => {
  useEffect(() => {
    const sendGetRequest = async () => {
      axios({
        method: "get",
        url: globeEndpointPath+"ip.php",
        dataType: "JSON",
      })
      .then((response) => {
        localStorage.setItem('myIP', response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
    }
    localStorage.setItem("localhost", "127.0.0.1");
    sendGetRequest();
  },[])
  /**
   * Creating a protected routes function that applies 
   * below the code (render).
   * If the user not logged in, the page will be redirected
   * to the homepage.
   */
  const [user] = React.useState(() => getUser());
  const ProtectedRoute = ({
    user,
    redirectPath = '/',
    children,
  }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };

  return (
    <>
      <Header />
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tutorial" element={<Guide />} />
        <Route
          path="meds"
          element={
            <ProtectedRoute user={user}>
              <Meds />
            </ProtectedRoute>
          }
        />
        <Route
          path="docs"
          element={
            <ProtectedRoute user={user}>
              <MyDocs />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute user={user}>
              <NewPatient/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>404, Pill Not Found!</p>} />
      </Routes>
    </>
  );
};
export default App;