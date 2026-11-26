import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './src/pages/login.jsx';
import CreateAccount from './src/pages/createAccount.jsx';
import LiveFeed from './src/pages/liveFeed.jsx';
import CreateReport from './src/pages/createReport.jsx';
import EditReport from './src/pages/editReport.jsx';
import HeaderNav from './src/components/HeaderNav.jsx';
import Footer from './src/components/Footer.jsx';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';

const MainRouter = () => {
    return ( 
        <div style={{backgroundImage: 'url(./public/background.svg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', minHeight: '100vh'}}>
            <HeaderNav />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LiveFeed />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/log-in" element={<Login />} />

                {/* Signed-in User Routes */}
                <Route path="/create-report" element={<ProtectedRoute><CreateReport /></ProtectedRoute>} />
                <Route path="/edit-report" element={<ProtectedRoute><EditReport /></ProtectedRoute>} />

                {/* <Route path="/moderator-view" element={<ModeratorView />} /> */}
            </Routes>
            <Footer />
        </div>
    );
};

export default MainRouter;