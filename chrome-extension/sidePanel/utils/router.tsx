import Auth from '@components/auth/auth'
import ChatLayout from '@components/layout/chat/chatLayout'
import DetailsLayout from '@components/layout/details/detailsLayout'
import Pendo from '@components/layout/pendo'
import PreLoginLayout from '@components/layout/preLogin/preLoginLayout'
import Chat from '@pages/chat'
import Login from '@pages/login'
import NotFound from '@pages/notFound'
import SignUp from '@pages/signUp'
import UserDetails from '@pages/userDetails'
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<Auth />}>
                <Route element={<PreLoginLayout />}>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<Pendo />}>
                    <Route element={<ChatLayout />}>
                        <Route path="/" element={<Chat />} />
                    </Route>

                    <Route element={<DetailsLayout />}>
                        <Route path="/profile" element={<UserDetails />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>
        </>
    )
)
