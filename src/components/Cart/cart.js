import { useEffect, useState } from "react"
import { Button, Modal, Table } from "react-bootstrap"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { addToCart, getCart, removeProductFromCart } from "../../DAL/api"
import FormGroupType from "../forms/formGroupType"
import ItemCard from "../ItemCard/ItemCard"
import './cart.css'

export default function Cart() {
    const [cart, setcart] = useState([])
    const [show, setShow] = useState(false)
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        async function set() {
            const ServerCart = await getCart(user.name)
            let price = 0
            let quantity = 0
            if (ServerCart.items[0]) {
                ServerCart.wishlist = ServerCart.wishlist.map(a=>a.product.id)
                for (const item of ServerCart.items) {
                    if(item.product.prodDet.find(a=>a.id===item.productid).quantity){
                        if(ServerCart.wishlist.includes(item.product.id)){
                            item.wish = true
                        }
                        price += item.price
                        quantity += item.quantity
                    }
                    else{
                        if(item.quantity){
                            addToCart(item.productid, -item.quantity, user)
                            item.quantity = 0
                            item.price = 0
                        }
                    }
                }
                ServerCart.totals = { price, quantity }
            }
            setcart(ServerCart)
        }
        set()
    }, [])

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    async function saveChanges() {
        const ArrayPlace = cart.editItem[0].ArrayPlace
        const item = cart.items[ArrayPlace]
        const newCart = { ...cart }
        let amountAction = cart.editItem[0].quantity
        const OneItemPrice = item.product.price
        const newId = cart.editItem[0].id
        let exsisting = false
        if (newId === item.productid) {
            amountAction = cart.editItem[0].quantity - item.quantity
        }
        const productQuantity = item.product.prodDet.find(a => a.id === newId).quantity
        let MaxAmountToAdd = productQuantity
        const ItemAreadyInCart = cart.items.find(a => a.productid === newId)
        if (ItemAreadyInCart) {
            MaxAmountToAdd -= ItemAreadyInCart.quantity
            if (MaxAmountToAdd > amountAction) {
                ItemAreadyInCart.quantity += amountAction
            }
            exsisting = true
        }
        if (MaxAmountToAdd >= amountAction) {
            const add = await addToCart(newId, amountAction, user)
            if (add.errors === false) {
                if (newId !== item.productid) {
                    await removeItem(item.productid, ArrayPlace)
                    let items = !ArrayPlace ? [...newCart.items.slice(ArrayPlace + 1)] : [...newCart.items.slice(0, ArrayPlace), ...newCart.items.slice(ArrayPlace+1)]
                    if (!exsisting) {
                        const details = cart.editItem[0].details
                        newCart.items[ArrayPlace] = { ...item, id: cart.editItem[0].id, color: details.color, size: details.size, price: OneItemPrice * amountAction }
                    }
                    else{
                        newCart.items = items
                    }
                }
                newCart.totals.quantity += amountAction
                newCart.totals.price += OneItemPrice * amountAction
                newCart.editItem =[]
                setcart(newCart)
                handleClose()
            }
        }
        else {
            alert(MaxAmountToAdd ?
                `you already added ${ItemAreadyInCart.quantity} of 
                ${item.product.productName} 
                in this size and color you can add only 
                ${MaxAmountToAdd} please change the amount and 
                try again if you'd like` :
                productQuantity ?
                    `${item.product.productName} in this size and color 
                is already in your cart at the MAX amount`:
                    'item is out of stock')
        }
    }

    async function removeItem(id, ArrayPlace) {
        const remove = await removeProductFromCart(id)
        if (remove.ok) {
            const item = cart.items[ArrayPlace]
            let items = !ArrayPlace ? [...cart.items.slice(ArrayPlace + 1)] : [...cart.items.slice(0, ArrayPlace), ...cart.items.slice(ArrayPlace + 1)]
            const newCart = { ...cart }
            newCart.totals.price -= item.price
            newCart.totals.quantity -= item.quantity
            newCart.items = items
            setcart(newCart)
        }
    }

    const editItem = (e) => {
        if (cart.editItem[0].details[e.target.name] !== e.target.value) {
            cart.editItem[0].details[e.target.name] = e.target.value
            for (const details of cart.items[cart.editItem[0].ArrayPlace].product.prodDet) {
                const editDetailsString = JSON.stringify(cart.editItem[0].details)
                if (JSON.stringify(details).includes(editDetailsString.substr(1, editDetailsString.length - 2))) {
                    cart.editItem[0].id = details.id
                }
            }
            setcart({ ...cart })
        }
    }

    return (
        <div className="text-center w-75 not-lg-w-100">
            <h1 style={{ marginLeft: '10px' }}>your cart</h1>
            <div>
                {
                    cart?.items ?
                        cart?.items?.length == 0 ? 'your cart is empty..' :
                            <div className="w-100">
                                {cart.items.map(({ product, color, size, quantity, productid }, index) => <div key={index} className="d-flex">
                                    <div className="col-6 col-lg-4">
                                        <ItemCard item={{ ...product, productid }} ArrayPlace={index}
                                            removeItem={removeItem} cart={true}></ItemCard>
                                    </div>
                                    <div className="col-6 col-lg-8 fs-6" style={{ backgroundColor: 'rgba(165, 110, 201, 0.3)' }}>
                                        <div className="w-100 text-end fs-3">
                                            <i onClick={() => { setcart({ ...cart, editItem: [{ ArrayPlace: index, id: productid, details: { color, size }, quantity }] }); handleShow() }} className="bi bi-pencil bg-white border"></i>
                                        </div>
                                        <p>color: {color}
                                            <br />size: {size}
                                            <br />price: {product.price}
                                            <br />amount: {quantity}
                                            <br />
                                        </p>
                                    </div>
                                </div>)}
                                <Modal show={show} onHide={handleClose} style={{ zIndex: '20000000000' }}>
                                    {cart.editItem?.map(a =>
                                        <Modal.Body key={500}>
                                            {a && <>
                                                <img style={{ width: '100px', aspectRatio: '1/1' }}
                                                    src={cart.items[a.ArrayPlace]?.product.mainImg}
                                                    alt={`main image of ${cart.items[a.ArrayPlace]?.product.productName}`}></img>
                                                <span className="fs-2 ps-3">
                                                    amount:
                                                    <span onClick={() => {
                                                        if (a.quantity - 1 > 0) {
                                                            setcart({ ...cart, editItem: [{ ...cart.editItem[0], quantity: a.quantity - 1 }] })
                                                        }
                                                        else {
                                                            alert('if you wish to remove the item please close the edit tab and press on the red trash icon above the photo on th left side')
                                                        }
                                                    }} className="quantityButton">-</span>
                                                    <span className="p-1">{a.quantity}</span>
                                                    <span onClick={() => { setcart({ ...cart, editItem: [{ ...cart.editItem[0], quantity: a.quantity + 1 }] }) }}
                                                        className="quantityButton">+</span>
                                                </span>
                                                <FormGroupType type='option' value={a.details.size} optionFunc={editItem} label='size' name='size'
                                                    options={cart.items[a.ArrayPlace]?.product.sizes}></FormGroupType>
                                                <br />
                                                <FormGroupType type='option' value={a.details.color} optionFunc={editItem} label='color' name='color'
                                                    options={cart.items[a.ArrayPlace]?.product.colors}></FormGroupType>
                                                <br />
                                            </>}
                                        </Modal.Body>
                                    )}
                                    <Modal.Footer>
                                        <Button variant="danger" onClick={handleClose}>close</Button>
                                        <Button variant="success" onClick={saveChanges}>save changes</Button>
                                    </Modal.Footer>
                                </Modal>
                                <section className="w-100 bg-white pb-3" style={{ position: 'fixed', bottom: '0', left: '0', zIndex: '167890765645' }}>
                                    <Table bordered>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    total products: {cart.totals.quantity}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>total price: {cart.totals.price} </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Link to={cart.totals.price ? '/confirmForm' : ''} className={cart.totals.price ? 'buyButton' : 'disabeled buyButton'}>Buy now</Link>
                                </section>
                            </div>
                        : 'please hold on.. loading your cart..'}
            </div>
        </div>
    )
}