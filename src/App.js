import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import LogIn from "./components/forms/logIn";
import SignUp from "./components/forms/SignUp";
import { Route, Routes } from 'react-router-dom';
import { Home } from "./components/Home/home";
import ChangePassword from "./components/forms/changePassword";
import PageNotFound from "./components/pageNotFound/PageNotFound";
import VerifyToChange from "./components/forms/enterPassword";
import { useState } from "react";
import HeadNavbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/footer";
import ItemPage from "./components/ItemPage/ItemPage";

function App() {
  const [search, setsearch] = useState('')

  function changesearch(e) {
    setsearch(e.target.value)
  }

  return (
    <section>
      <header>
        <HeadNavbar searchfunc={changesearch}></HeadNavbar>
      </header>
      <main className="itemscenter">
        <Routes>
          <Route path='/' element={<LogIn></LogIn>} />
          <Route path='/signup' element={<SignUp></SignUp>} />
          <Route path='/home' element={<Home searched={search}></Home>}>
            <Route path=":category" element={<Home searched={search}></Home>}></Route>
          </Route>
          <Route path='/item/:id' element={<ItemPage></ItemPage>} />
          <Route path='/authorize' element={<VerifyToChange></VerifyToChange>}></Route>
          <Route path='/changepassword' element={<ChangePassword></ChangePassword>} />
          <Route path="/:catchAll" element={<PageNotFound></PageNotFound>} />
        </Routes>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </section>
  );
}

export default App;