import withSession from '../../lib/session'
import { auth } from '../../lib/firebase-client'

const login = async (req, res) => {
    const { email, password } = req.body

    const _auth = auth.getAuth()
    auth.signInWithEmailAndPassword(_auth, email, password)
        .then(async userCredential => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            
            const account = {
                isLoggedIn: true
            }

            // Set & save session
            req.session.set('account', account)
            await req.session.save()
            res.status(200).json(account)
        })
        .catch(err => {
            res.status(400).end()
        });
}

export default withSession(async (req, res) => {
    // Allow POST only
    if (req.method === 'POST') {
        await login(req, res)
    } else {
        res.status(404).end()
    }
})