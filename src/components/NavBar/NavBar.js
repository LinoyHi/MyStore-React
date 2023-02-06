import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom'
import './Nav.css'
import { useSelector } from 'react-redux';
import { getCatagories } from '../../DAL/api';

function HeadNavbar(props) {
    const [show, setShow] = useState(false);
    const { user } = useSelector(state => state.user)
    const [catagories, setCategories] = useState(null)

    useEffect(() => {
        async function SetTheCatagories() {
            const catagoriesData = await getCatagories()
            let cats = {}
            for (const i of catagoriesData) {
                cats[i.categoryName] = i.child.map((a) => a.categoryName)
            }
            setCategories(cats)
        }
        SetTheCatagories()
    }, [])

    const navigate = useNavigate()
    function login() {
        handleClose()
        navigate('/')
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const buildNavDownItems = () => {
        const drops = []
        for (const cat in catagories) {
            drops.push(
                <NavDropdown.Item key={drops.length} className="border-bottom bg-primary bg-opacity-25" as={Link} to={`/home/${cat}`}>{cat}</NavDropdown.Item>)
            for (const secondCat of catagories[cat]) {
                drops.push(
                    <NavDropdown.Item key={drops.length} as={Link} className="ms-2 w-75" to={`/home/${secondCat}`}>{secondCat}</NavDropdown.Item>
                )
            }
        }
        return (drops)
    }

    const changePlace = (e, url) => {
        const oldPlace = document.getElementsByClassName('placement')
        oldPlace[0]?.classList?.remove('placement')
        e.target.classList.add('placement')
        navigate(url)
    }

    return (
        <Navbar className='App-header fs-3 bg-purple w-100 justify-content-between' expand="lg">
            <Container>
                <button onClick={(e) => changePlace(e, '/home')} className='logo'>Linღ <br></br> home</button>
                <Form className="d-none d-lg-block w-50">
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="shadow-none"
                        aria-label="Search"
                        onChange={(e) => props.searchfunc(e)}
                    />
                </Form>
                <Nav.Link onClick={(e) => {
                    if(e.target.tagName !== 'A'){
                        e= {target: e.target.parentElement}
                    };
                    user ? changePlace(e, '/personalPage') : changePlace(e, '/') }}
                    className='Nav-bi-icon text-center'>
                    <i className={`bi bi-${user ? 'person-circle' : 'file-lock2'}`}></i>
                    <p className='pt-1'>{user ? 'Me' : 'Log In'}</p>
                </Nav.Link>
                <Nav.Link className='wish Nav-pointer fs-1 mb-3' onClick={user ? (e) => changePlace(e, '/wishList') : handleShow}>♥</Nav.Link>
                <img onClick={user ? (e) => changePlace(e, '/cart') : handleShow} className="Nav-pointer cart" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrCx3AWXDLIVCbAxLtSplwmlYIH-2FgkYfpcfYc2FICkR8qgAc2QFa&usqp=CAE&s' alt='cart button' />
                <div className='d-flex col-12 col-lg-2'>
                    <NavDropdown className='col-3 col-md-2'
                        title={<span>
                            <span className='d-none d-lg-inline'>Catagories</span>
                            <span className='d-inline d-lg-none'>
                                <i className='bi bi-filter-left'></i>
                                <i className='bi bi-search'></i>
                            </span>
                        </span>} id="basic-nav-dropdown">
                        {catagories && buildNavDownItems()}
                    </NavDropdown>
                    <Form className="d-block d-lg-none col-9 col-md-10">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2 shadow-none"
                            aria-label="Search"
                            onChange={(e) => props.searchfunc(e)}
                        />
                    </Form>
                </div>
                <Modal className='itemsCenter text-dark' show={show} onHide={handleClose}>
                    <Modal.Body>
                        please log in and try again
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={login}>
                            Log in
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Navbar>
    );
}

export default HeadNavbar;