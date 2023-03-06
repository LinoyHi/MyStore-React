import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { addtowishlist, deleteFromWishlist } from '../../DAL/api';
import { useSelector } from 'react-redux';
import './ItemCard.css'
import AddProductToCart from '../AddToCart/AddToCart';

export default function ItemCard({ item, cart, removeItem, ArrayPlace, cancelWishButton, useCartIcon, onlyPrice }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { user } = useSelector((state) => state.user);

    const navigate = useNavigate()

    function login() {
        handleClose()
        navigate('/')
    }

    function addOrRemove(e) {
        if (user) {
            if (e.target.classList.contains('red')) {
                deleteFromWishlist(item.id, user)
                item.update ? item.update() :
                    e.target.classList.remove('red')
            }
            else {
                addtowishlist(item.id, user)
                e.target.classList.add('red')
            }
        }
        else {
            handleShow()
        }
    }

    return (
        <div className='card bg-purple p-1' id={item.id}>
            <Link to={`/item/${item.id}`}>
                <img
                    className='card-img-top'
                    style={!item.inventory ? { opacity: '0.6' } : {}}
                    src={item.mainImg}
                    alt={`${item.name} main img`}
                />
            </Link>
            <div>
                <div className='absolute-top'>
                    {item.inventory ?
                        (cart ?
                            <i className="bi bi-trash3-fill red fs-1 textBorder-White" alt='remove from cart' onClick={handleShow}></i>
                            :
                            useCartIcon ? <i className='bi bi-bag-plus fs-2 textBorder-White' style={{cursor:'pointer'}} onClick={handleShow}>
                             </i>
                            :
                            <button className='addToCart' onClick={handleShow}>
                                add to cart
                            </button>)
                        : (cart ?
                            <>
                                <i className="bi bi-trash3-fill red fs-1 textBorder-White"  onClick={handleShow}></i>
                                <p className='absolute-top outofstock'>out of stock</p>
                            </> :
                            <p className='absolute-top outofstock pe-1'>out of stock</p>)
                        }
                </div>
                {!cancelWishButton && <button className={`absolute-top wishlist ${item.wish ? 'red' : ''}`} style={{ right: '0' }} onClick={(e) => addOrRemove(e)}>♥</button>}
            </div>
            {!cart && onlyPrice? <h5>{item.price}$</h5>:<div className='card-body'>
                <h5>{item.productName}</h5>
                <span>price: {item.price}$</span><br />
                <span>{item.quantity ? `amount: ${item.quantity}` : `in stock: ${item.inventory}`}</span>
            </div>}
            <Modal className='itemsCenter' style={{ color: 'black' }} show={show} onHide={handleClose}>
                {cart ?
                    <Modal.Body>
                        <img style={{ width: '4vw', height: '4vw' }} src={item.mainImg} alt={`${item.name} main image`}></img>
                        are you sure you want to remove {item.name}?
                    </Modal.Body>
                    : user ?
                        <Modal.Body>
                            <AddProductToCart id={item.id}></AddProductToCart>
                        </Modal.Body>
                        :
                        <Modal.Body>
                            please log in and try again
                        </Modal.Body>}
                <Modal.Footer>
                    <Button variant="primary" onClick={cart ? () => { removeItem(item.productid, ArrayPlace); handleClose() } : user ? handleClose : login}>
                        {cart ? 'yes' : user ? 'close' : 'Log in'}
                    </Button>
                    {user ? '' : <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>}
                </Modal.Footer>
            </Modal>
        </div>
    )
}