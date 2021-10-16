import withSession from '../../lib/session'

export default withSession(async (req, res) => {
    const account = req.session.get('account')

    if (account) {
        res.json({
            isLoggedIn: true,
            ...account,
        })
    } else {
        res.json({
            isLoggedIn: false,
        })
    }
})