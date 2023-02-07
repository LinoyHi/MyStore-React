export default function Footer() {
    return (
        <footer className="text-center text-lg-start bg-light text-muted">
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <a href="https://www.facebook.com/linoy.hib/" target="_blank" className="me-4 text-reset">
                        <i className="bi bi-facebook"></i>
                    </a>
                    <a href="" target="_blank" className="me-4 text-reset">
                        <i className="bi bi-twitter"></i>
                    </a>
                    <a href="" target="_blank" className="me-4 text-reset">
                        <i className="bi bi-google"></i>
                    </a>
                    <a href="https://www.instagram.com/linoy_hib/" target="_blank" className="me-4 text-reset">
                        <i className="bi bi-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/linoy-hib-b1b175251/" target="_blank" className="me-4 text-reset">
                        <i className="bi bi-linkedin"></i>
                    </a>
                    <a href="https://github.com/LinoyHi" target="_blank" className="me-4 text-reset">
                        <i className="bi bi-github"></i>
                    </a>
                </div>
            </section>

            <section>
                <div className="container text-center text-md-start mt-5">

                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="bi bi-gem me-3"></i>Linღ
                            </h6>
                            <p>
                                Hey, this website is a fake website built for showing my abilities as a full stack developoer; for more information you can go check my git or my linkdin thank you for viewing my website <i className="bi bi-emoji-smile"></i>
                            </p>
                        </div>

                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Useful links
                            </h6>
                            <p>
                                <a href="#!" className="text-reset">About Us</a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">Our Policy</a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">Orders</a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">Help</a>
                            </p>
                        </div>
                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                            <p><i className="bi bi-house-door me-3"></i> Bat Yam</p>
                            <p>
                                <i className="bi bi-envelope me-3"></i>
                                Linoyhib14@walla.co.il
                            </p>
                            <p><i className="bi bi-phone me-3"></i> +972 053 334 9009</p>
                            <p><i className="bi bi-printer me-3"></i> currently none</p>
                        </div>
                    </div>

                </div>
            </section>
            <div className="text-center p-4" style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                © 2022 Copyright: <a className="text-reset fw-bold" href="https://github.com/LinoyHi">Linoy</a>
            </div>
        </footer>
    )
}