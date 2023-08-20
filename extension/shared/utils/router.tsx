import Auth from '@shared/components/auth/auth'
import ChatLayout from '@shared/components/layout/chat/chatLayout'
import DetailsLayout from '@shared/components/layout/details/detailsLayout'
import Pendo from '@shared/components/layout/pendo'
import PreLoginLayout from '@shared/components/layout/preLogin/preLoginLayout'
import Chat from '@shared/pages/chat'
import Login from '@shared/pages/login'
import NotFound from '@shared/pages/notFound'
import SignUp from '@shared/pages/signUp'
import UserDetails from '@shared/pages/userDetails'
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
