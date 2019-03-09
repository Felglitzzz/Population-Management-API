class HomeController {
  static welcomeMessage(req, res) {
    return res.status(200).send({
      message: 'Welcome to Population Management API',
    });
  }
}

export default HomeController;
