import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../Layout/layout.jsx";
import Login from "../Components/Login.jsx";
import UserRegister from "../Components/User/UserRegister.jsx";
import CharityRegister from "../Components/Charity/CharityRegister.jsx";
import CharityProfile from "../Components/Charity/CharityProfile.jsx";
import UserProfile from "../Components/User/UserProfile.jsx";
import LandingFood from "../BasicPage/LandingFood.jsx";
import About from "../BasicPage/About.jsx";
import CharityList from "../Components/Charity/charityList.jsx";
import UnAuthorizedCharityIntro from "../Components/Charity/UnAuthorizedCharityIntro.jsx";
import DonationForm from "../Components/Donation/DonationForm.jsx";
import DonationList from "../Components/Donation/DonationList.jsx";
import DonationView from "../Components/Donation/DonationView.jsx";
import DonationHistory from "../Components/DonationHistory.jsx";



export const router = createBrowserRouter(
    createRoutesFromElements(

        <Route path="/" element={<Layout/>}>
        <Route index element={<LandingFood/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login/>} />


        {/* User */}
        <Route path="/user/register" element={<UserRegister/>} />
        <Route path="/user/profile" element={<UserProfile/>} />

        <Route path="/user/profile" element={<UserProfile/>} />


        {/* Charity */}
        <Route path="/charity/register" element={<CharityRegister/>} />
        <Route path="/charity/profile" element={<CharityProfile/>} />



        { localStorage.getItem('role') === 'charity' || localStorage.getItem('role') === 'user'?
            <Route path="/charity" element={<CharityList/>} />:<Route path="/charity" element={<UnAuthorizedCharityIntro/>}/>
        }

        <Route path="/donation/create" element={<DonationForm/>} />

        {localStorage.getItem('role')==='charity'? <Route path="/get-donation" element={<DonationList/>}/>:localStorage.getItem('role')==='user'? <Route path="/donation/create" element={<DonationForm/>}/>:''}
        
        <Route path="/donation/:id" element={<DonationView/>} />
        <Route path="/donation/history" element={<DonationHistory/>} />
        </Route>
        
    )
)