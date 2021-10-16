import withSession from '../../lib/session'

export default withSession(async (req, res) => {
    // Allow POST only
    if (req.method === 'POST') {
        // Destroy session
        req.session.destroy()
        res.json({ isLoggedIn: false })
    }
    else {
        res.status(404).end()
    }
})