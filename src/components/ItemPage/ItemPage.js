import Carousel from 'react-bootstrap/Carousel';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import './ItemPage.css'
import { useEffect, useState } from 'react';
import { addtowishlist, deleteFromWishlist, getSpecificItem } from '../../DAL/api';
import { useParams } from 'react-router-dom'
import AddProductToCart from '../AddToCart/AddToCart';
import { Table } from 'react-bootstrap';
import { Reviews } from './ReviewsPage';
import { useSelector } from 'react-redux';

export default function ItemPage(props) {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [show, setShow] = useState(true);
    const [reviews, setReviews] = useState(null)
    const { user } = useSelector((state) => state.user);

    useEffect(() => async function set() {
        setItem(await getSpecificItem(id | props.id))
    }, [])

    useEffect(() => {
        function setReviewsSection() {
            let reviewsarray = []
            for (const id in item.reviews.slice(0, 3)) {
                reviewsarray.push(
                    <tr className="text-center"
                        key={id}>
                        <td>
                            {item.reviews[id].user.name}
                            <p>size: {item.reviews[id].kinds.size} / color: {item.reviews[id].kinds.color}</p>
                            <hr/>
                            {item.reviews[id].reviewInput}
                        </td>
                    </tr>)
            }
            setReviews(reviewsarray)
            return
        }
        item && setReviewsSection()
    }, [item])

    const handleClose = () => setShow(true);
    const handleShow = () => setShow(false);

    function addOrRemove(e) {
        if (user) {
            if (e.target.classList.contains('red')) {
                deleteFromWishlist(item.id, user)
                e.target.classList.remove('red')
            }
            else {
                addtowishlist(item.id, user)
                e.target.classList.add('red')
            }
        }
        else {
            alert('please connect first')
        }
    }

    return (
        item ?
        <div className='w-100 card'>
            {show? <div>
                <div className='d-lg-flex'>
                    <div className='bg-purple w-75 p-2 not-lg-w-100'>
                        <Carousel variant="dark" interval={null}>
                            <Carousel.Item>
                                <img
                                    className='card-img-top'
                                    src={item.mainImg}
                                    alt={`${item.productName} main image`}
                                />
                            </Carousel.Item>
                            {item.imgs.map((pic, index) => <Carousel.Item key={index}>
                                <img
                                    className='card-img-top'
                                    src={pic.link}
                                    alt={pic.description}
                                />
                            </Carousel.Item>)}
                        </Carousel>
                        <button
                            className={`absolute-top wishlist ${item.wish ? 'red' : ''}`}
                            onClick={(e) => addOrRemove(e)}>♥</button>
                    </div>
                    {item && <div className='col-lg-8 bg-purple'>
                        <AddProductToCart item={item} cancelBG={true}></AddProductToCart></div>}
                </div>
                <p></p>
                <Tabs
                    defaultActiveKey="Description"
                    id="uncontrolled-tab-example"
                    className='bg-purple'
                >
                    <Tab eventKey="Description" title="Description">
                        {item.description}
                    </Tab>
                    <Tab eventKey="Reviews" title="Reviews">
                        {reviews?.length ?
                            <>
                                <Table striped bordered hover>
                                    <tbody>
                                        {reviews}
                                    </tbody>
                                </Table>
                                <p className="allreviews" onClick={handleShow}>view more...</p>
                            </> :
                            <p className='text-center'>No reviews yet..</p>
                        }
                    </Tab>
                </Tabs>
            </div> :
            <Reviews reviews={item.reviews}
            handleClose={handleClose} colors={item.colors} sizes={item.sizes}></Reviews> }
        </div> 
        :
        <div>please wait..</div>
    )
}