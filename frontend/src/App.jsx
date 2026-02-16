import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Feed from './pages/Feed'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SocialFeedPage from './pages/SocialFeedPage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="feed" element={<Feed />} />
                <Route path="social" element={<SocialFeedPage />} />
                <Route path="profile/:username" element={<Profile />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
        </Routes>
    )
}

export default App
