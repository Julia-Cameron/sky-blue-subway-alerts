import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import CreateAccount from './src/createAccount.jsx';
import LiveFeed from './src/liveFeed.jsx';
import CreateReport from './src/createReport.jsx';
import EditReport from './src/editReport.jsx';
import HeaderNav from './components/HeaderNav.jsx';
import ModeratorView from './src/moderatorView.jsx';

const MainRouter = () => {
    return ( <div>
        <HeaderNav />
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/live-feed" element={<LiveFeed />} />
            <Route path="/create-report" element={<CreateReport />} />
            <Route path="/edit-report" element={<EditReport />} />
            <Route path="/moderator-view" element={<ModeratorView />} />
        </Routes>
    </div>
    );
};

export default MainRouter;