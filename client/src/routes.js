import React from "react"
import {Route, Routes, Navigate} from 'react-router-dom'
import {RoomsList} from './messenger/components/pages/RoomsList'
import {Room} from './messenger/components/pages/Room'
import Register from "./auth/Register"
import Login from "./auth/Login"
import Users from "./auth/Users"
import User from "./auth/User"
import Main from "./Main"
import EditProfile from "./auth/EditProfile"
import UserArticle from "./auth/UserArticle"
import Fotography from "./auth/parts/Fotography"
import UserVideoPage from "./auth/UserVideoPage"
import HomePage from "./homepage/HomePage"
import FileStorage from "./file_storage/components/pages/FileStorage"
import File from "./file_storage/components/pages/File"
import CreatePost from "./auth/CreatePost"
import Notifications from "./auth/parts/Mobile/Notifications"
import CreateFoto from "./auth/parts/Mobile/CreateFoto"
import LandingPage from "./landing_page/LandingPage"
import SupportPage from "./landing_page/SupportPage"
import Admin from "./admin/Admin"
import Services from "./homepage/Services"
import PublicsPage from './publics/components/pages/PublicsPage'
import CreatePage from "./publics/components/pages/CreatePage"
import EditPage from "./publics/components/pages/EditPage"
import PublicPage from './publics/components/pages/PublicPage'
import CreatePostPage from './publics/components/pages/CreatePostPage'
import Popular from "./photographer/components/pages/Popular"
import New from "./photographer/components/pages/New"
import Photo from "./photographer/components/pages/Photo"
import Create from "./inner_ad/components/pages/Create"
import InnerAd from "./inner_ad/components/pages/InnerAd"
import Cabinet from "./inner_ad/components/pages/Cabinet"
import CreateAd from "./ads/pages/CreateAd"
import AdMain from "./ads/pages/AdMain"
import AdNew from "./ads/pages/AdNew"
import Ad from "./ads/pages/Ad"
import Search from "./ads/pages/Search"
import VideohostMain from "./videohost/components/pages/VideohostMain"
import Channel from "./videohost/components/pages/Channel"
import Video from './videohost/components/pages/Video'
import NewVideos from "./videohost/components/pages/lists/NewVideos"
import PopularVideos from "./videohost/components/pages/lists/PopularVideos"
import RecommendedVideos from "./videohost/components/pages/lists/RecommendedVideos"
import RecommendedChannels from "./videohost/components/pages/lists/RecommendedChannels"
import CreateChannel from './videohost/components/pages/CreateChannel'
import EditChannel from './videohost/components/pages/EditChannel'
import CreateVideo from './videohost/components/pages/CreateVideo'
import EditVideo from './videohost/components/pages/EditVideo'
import Same from "./videohost/components/pages/lists/Same"
import SearchVideos from "./videohost/components/pages/lists/SearchVideos"
import InterestingVideos from "./videohost/components/pages/lists/InterestingVideos"
import CategoryVideos from "./videohost/components/pages/lists/CategoryVideos"
import SubscribeChannels from "./videohost/components/pages/lists/SubscribeChannels"
import PublicNotifications from "./publics/components/pages/PublicNotifications"
import CreateChat from './messenger/components/pages/CreateChat'
import ChatRoom from "./messenger/components/pages/ChatRoom"
import Games from "./games/components/pages/Games"
import Game from "./games/components/pages/Game"
import CreateGame from "./games/components/pages/CreateGame"
import ChannelSearch from './videohost/components/pages/lists/ChannelSearch'
import Store from './store/components/pages/Store'
import Basket from './store/components/pages/Basket'
import AdminPanel from './store/components/pages/AdminPanel'
import CreateProduct from './store/components/pages/CreateProduct'
import UpdateProduct from './store/components/pages/UpdateProduct'
import Product from './store/components/pages/Product'
import { ESRoom } from "./messenger/components/pages/ESRoom"
import LandingPageV2 from "./landing_page/LandingPageV2"
import App from "./art_shop/App"
import Contacts from "./art_shop/components/pages/Contacts"
import About from "./art_shop/components/pages/About"
import UpdateGame from "./games/components/pages/UpdateGame"
import NotActivated from "./homepage/NotActivated"
import DeleteProfile from "./common_components/pages/DeleteProfile"
import Settings from "./Settings"

export const useRoutes = (isVerified) => {
    //Кастомный хук для маршрутизации
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route exact path="/" element={<Main isVerified={isVerified} />} />
            <Route exact path="/services" element={<Services />} />
            <Route exact path="/admin/:id" element={<Admin />} />
            <Route exact path="/cloud" element={<FileStorage />} />
            <Route exact path="/cloud/file/:id" element={<File />} />
            <Route exact path="/home" element={<HomePage/>} />
            <Route exact path="/my/:id" element={<User />} />
            <Route exact path="/editprofile" element={<EditProfile />} />
            <Route exact path="/createpost" element={<CreatePost />} />
            <Route exact path="/createfoto" element={<CreateFoto />} />
            <Route exact path="/notifications" element={<Notifications />} />
            <Route exact path="/fotography/:id" element={<Fotography/>} />
            <Route exact path="/video/:id" element={<UserVideoPage/>} />
            <Route exact path="/messages" element={<RoomsList />} />
            <Route exact path="/cloud" element={<FileStorage />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/user/:id" element={<User />} />
            <Route exact path="/messages/:id" element={<ESRoom />} />
            <Route exact path="/messages/:id/:link" element={<Room />} />
            <Route exact path="/chat/:id" element={<ChatRoom />} />
            <Route exact path="/chat/:id/:link" element={<ChatRoom />} />
            <Route exact path="/createchat" element={<CreateChat />} />
            <Route exact path="/article/:id" element={<UserArticle />} />
            <Route path="/greeting" element={<LandingPageV2 />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route exact path="/publics" element={<PublicsPage />} />
            <Route exact path="/public/:id" element={<PublicPage />} />
            <Route exact path="/createpublic" element={<CreatePage />} />
            <Route exact path="/editpublic/:id" element={<EditPage />} />
            <Route exact path="/createpublicpost/:id" element={<CreatePostPage />} />
            <Route exact path="/publicnotifications/:id" element={<PublicNotifications />} />
            <Route exact path="/photos/popular" element={<Popular />} />
            <Route exact path="/photos/new" element={<New />} />
            <Route exact path="/photo/:id" element={<Photo />} />
            <Route exact path="/photo/create" element={<Create />} />
            <Route exact path="/innerad/create" element={<Create />} />
            <Route exact path="/innerad/cabinet" element={<Cabinet />} />
            <Route exact path="/innerad/:id" element={<InnerAd />} />
            <Route exact path="/ad/main" element={<AdMain />} />
            <Route exact path="/ad/create" element={<CreateAd />} />
            <Route exact path="/ad/new" element={<AdNew />} />
            <Route exact path="/ad/search" element={<Search />} />
            <Route exact path="/ad/:id" element={<Ad />} />
            <Route exaxt path="/videohost" element={<VideohostMain />} />
            <Route exaxt path="/videohost/channel/:id" element={<Channel />} />
            <Route exaxt path="/videohost/video/:id" element={<Video />} />
            <Route exaxt path="/videohost/new" element={<NewVideos />} />
            <Route exaxt path="/videohost/popular" element={<PopularVideos />} />
            <Route exaxt path="/videohost/recommended/videos" element={<RecommendedVideos />} />
            <Route exaxt path="/videohost/recommended/channels" element={<RecommendedChannels />} />
            <Route exaxt path="/videohost/same/:category" element={<Same />} />
            <Route exaxt path="/videohost/create/channel" element={<CreateChannel />} />
            <Route exaxt path="/videohost/edit/channel/:id" element={<EditChannel />} />
            <Route exaxt path="/videohost/create/video" element={<CreateVideo />} />
            <Route exaxt path="/videohost/edit/video/:id" element={<EditVideo />} />
            <Route exaxt path="/videohost/search/:search" element={<SearchVideos />} />
            <Route exaxt path="/videohost/channelsearch/:search" element={<ChannelSearch />} />
            <Route exaxt path="/videohost/interesting" element={<InterestingVideos />} />
            <Route exaxt path="/videohost/subscribes" element={<SubscribeChannels />} />
            <Route exaxt path="/videohost/category/:category" element={<CategoryVideos />} />

            <Route exact path="/creategame" element={<CreateGame />} />
            <Route exact path="/updategame/:id" element={<UpdateGame />} />
            <Route exact path="/games" element={<Games />} />
            <Route exact path="/game/:id" element={<Game />} />

            <Route exact path="/v2" element={<LandingPageV2 />} />
            <Route exact path="/art" element={<App />} />
            <Route exact path="/contacts" element={<Contacts />} />
            <Route exact path="/about" element={<About />} />

            {/*<Route exact path="/store" element={<Store />} />
            <Route exact path="/store/create" element={<CreateProduct />} />
            <Route exact path="/store/admin" element={<AdminPanel />} />
            <Route exact path="/store/update/:id" element={<UpdateProduct />} />
            <Route exact path="/store/product/:id" element={<Product />} />
            <Route exact path="/store/basket" element={<Basket />} />*/}
            <Route exact path="/notactivated" element={<NotActivated />} />
            <Route exact path="/deleteprofile" element={<DeleteProfile />} />
            <Route exact path="/settings" element={<Settings />} />
        </Routes>
    )
}
